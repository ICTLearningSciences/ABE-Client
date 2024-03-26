/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { useEffect, useState } from 'react';
import { useAppSelector } from '../store/hooks';
import { useWithChat } from '../store/slices/chat/use-with-chat';
import axios, { CancelTokenSource } from 'axios';
import {
  Activity,
  ActivityGQL,
  ActivityStepTypes,
  DocGoal,
  GQLPrompt,
  MultistepPromptRes,
  OpenAiPromptStep,
  PromptConfiguration,
  PromptRoles,
} from '../types';
import {
  ChatMessageTypes,
  MessageDisplayType,
  Sender,
  UserInputType,
} from '../store/slices/chat';
import useWithStrongerHookActivity from './use-with-stronger-hook-activity';
import { DisplayIcons } from '../helpers/display-icon-helper';
import { useWithPromptActivity } from './use-with-prompt-activity';
import { getLastUserMessage } from '../helpers';
import { UseWithPrompts } from './use-with-prompts';
import { asyncPromptExecute } from './use-with-synchronous-polling';
import { v4 as uuidv4 } from 'uuid';
import { GptModels } from '../constants';

export const MCQ_RETRY_FAILED_REQUEST = 'Retry';

export const emptyActivity: Activity = {
  _id: '',
  title: '',
  introduction: '',
  responsePendingMessage: '',
  responseReadyMessage: '',
  disabled: false,
  steps: [],
  description: '',
  displayIcon: DisplayIcons.DEFAULT,
  getStep: () => {
    return {
      text: '',
      stepType: ActivityStepTypes.FREE_RESPONSE_QUESTION,
      handleResponse: () => {
        return;
      },
    };
  },
  stepName: '',
  resetActivity: () => {
    return;
  },
  isReady: true,
};

interface PromptRetryData {
  callback?: (
    response: MultistepPromptRes,
    newMessage: ChatMessageTypes
  ) => void;
  prompts: OpenAiPromptStep[];
  numRetries: number;
  streamText: boolean;
}

export function useWithActivityHandler(
  useWithPrompts: UseWithPrompts,
  editDocGoal: () => void,
  resetActivityCounter: number,
  selectedGoal?: DocGoal,
  selectedActivity?: ActivityGQL
) {
  const {
    state,
    sendMessage,
    sendMessages,
    chatLogToString,
    clearChatLog,
    coachResponsePending,
    updateMessage,
  } = useWithChat();
  const [retryData, setRetryData] = useState<PromptRetryData>();
  const googleDocId: string = useAppSelector(
    (state) => state.state.googleDocId
  );
  const systemPrompt: string = useAppSelector(
    (state) => state.chat.systemPrompt
  );
  const messages = state.chatLogs[googleDocId] || [];
  const userId: string | undefined = useAppSelector(
    (state) => state.login.user?._id
  );
  const [waitingForUserAnswer, setWaitingForUserAnswer] =
    useState<boolean>(false);
  const [abortController, setAbortController] = useState<{
    controller: AbortController;
    source: CancelTokenSource;
  }>();
  const { prompts, isLoading: promptsLoading } = useWithPrompts;
  const overrideGptModel: GptModels = useAppSelector(
    (state) => state.state.overideGptModel
  );

  const strongerHookActivity = useWithStrongerHookActivity(
    selectedActivity || emptyActivity,
    setWaitingForUserAnswer,
    promptsLoading,
    prompts,
    selectedGoal
  );
  const promptActivity = useWithPromptActivity(
    selectedActivity || emptyActivity,
    setWaitingForUserAnswer
  );

  const activity =
    selectedActivity?.title === 'Stronger Hook'
      ? strongerHookActivity
      : selectedActivity?.prompt
      ? promptActivity
      : undefined;

  function resetActivity() {
    // cancel any pending requests
    if (abortController) {
      try {
        abortController.controller.abort();
        abortController.source.cancel();
      } catch (e) {
        console.log(e);
      }
    }
    coachResponsePending(false);
    setWaitingForUserAnswer(false);
    if (activity) {
      activity.resetActivity();
    }
  }

  function sendIntroMessages() {
    const activityIntroduction = activity?.introduction;
    const goalIntroduction = selectedGoal?.introduction;
    const messagesToSend: ChatMessageTypes[] = [];
    if (activityIntroduction) {
      messagesToSend.push({
        id: uuidv4(),
        message: activityIntroduction,
        sender: Sender.SYSTEM,
        displayType: MessageDisplayType.TEXT,
      });
    }
    if (goalIntroduction) {
      messagesToSend.push({
        id: uuidv4(),
        message: goalIntroduction,
        sender: Sender.SYSTEM,
        displayType: MessageDisplayType.TEXT,
      });
    }
    sendMessages(messagesToSend, true, googleDocId);
  }

  async function executePrompt(
    _prompt: (messages: ChatMessageTypes[]) => GQLPrompt,
    streamText: boolean,
    callback?: (
      response: MultistepPromptRes,
      newMessage: ChatMessageTypes
    ) => void
  ) {
    if (!activity) return;
    if (!userId) return;
    if (!messages.length) return;
    const lastUserMessage = getLastUserMessage(messages);
    const chatLogString = chatLogToString(googleDocId);
    const openAiPromptSteps: OpenAiPromptStep[] = [];
    const prompt = _prompt(messages);
    prompt.openAiPromptSteps.map((openAiPromptStep) => {
      const prompts: PromptConfiguration[] = [];

      if (openAiPromptStep.includeChatLogContext) {
        prompts.push({
          promptRole: PromptRoles.ASSISSANT,
          promptText: `Here is the chat between the user and the system: ${chatLogString}`,
          includeEssay: false,
        });
      }

      openAiPromptStep.prompts.map((prompt) => {
        prompts.push({
          ...prompt,
          promptText: `${prompt.promptText} ${
            prompt.includeUserInput
              ? `\n\nHere is the users input: ${lastUserMessage}`
              : ''
          }`,
        });
      });

      openAiPromptSteps.push({
        ...openAiPromptStep,
        prompts,
      });
    });
    coachResponsePending(true);

    const abortController = new AbortController();
    const source = axios.CancelToken.source();
    setAbortController({
      controller: abortController,
      source,
    });

    const newMessage = {
      id: uuidv4(),
      message: '',
      sender: Sender.SYSTEM,
      displayType: MessageDisplayType.PENDING_MESSAGE,
    };
    sendMessage(newMessage, false, googleDocId);

    asyncPromptExecute(
      googleDocId,
      openAiPromptSteps,
      userId,
      systemPrompt,
      overrideGptModel,
      streamText,
      !streamText
        ? undefined
        : (answer) => {
            updateMessage(
              {
                ...newMessage,
                message: answer,
                displayType: MessageDisplayType.MESSAGE_STREAMING,
              },
              googleDocId
            );
          },
      source.token
    )
      .then((response) => {
        handleOpenAiSuccess(activity, response, newMessage, callback);
      })
      .catch(() => {
        if (abortController.signal.aborted) return;
        setRetryData({
          callback,
          prompts: openAiPromptSteps,
          numRetries: 0,
          streamText,
        });
      });
  }

  function handleOpenAiSuccess(
    activity: Activity,
    response: MultistepPromptRes,
    newMessage: ChatMessageTypes,
    callback?: (
      response: MultistepPromptRes,
      newMessage: ChatMessageTypes
    ) => void
  ) {
    coachResponsePending(false);
    if (callback) {
      callback(response, newMessage);
    } else if (newMessage) {
      updateMessage(
        {
          ...newMessage,
          message: response.answer,
          openAiInfo: {
            openAiPrompt: response.openAiData[0].openAiPrompt,
            openAiResponse: response.openAiData[0].openAiResponse,
          },
          displayType: MessageDisplayType.TEXT,
        },
        googleDocId
      );
    }
  }

  useEffect(() => {
    if (resetActivityCounter === 0) return;
    clearChatLog(googleDocId);
    sendIntroMessages();
    resetActivity();
  }, [resetActivityCounter]);

  // handle retry data
  useEffect(() => {
    if (!retryData) return;
    if (!userId) return;
    if (!activity) return;
    if (retryData.numRetries > 2) {
      coachResponsePending(false);
      sendMessage(
        {
          id: uuidv4(),
          message: 'Request failed, please try again later.',
          sender: Sender.SYSTEM,
          displayType: MessageDisplayType.TEXT,
          mcqChoices: [MCQ_RETRY_FAILED_REQUEST],
        },
        false,
        googleDocId
      );
      return;
    }
    coachResponsePending(true);
    setTimeout(() => {
      const { callback, prompts, numRetries, streamText } = retryData;
      const abortController = new AbortController();
      const source = axios.CancelToken.source();
      setAbortController({
        controller: abortController,
        source,
      });
      const newMessage: ChatMessageTypes = {
        id: uuidv4(),
        message: '',
        sender: Sender.SYSTEM,
        displayType: MessageDisplayType.PENDING_MESSAGE,
      };
      sendMessage(newMessage, false, googleDocId);

      asyncPromptExecute(
        googleDocId,
        retryData.prompts,
        userId,
        systemPrompt,
        overrideGptModel,
        streamText,
        !streamText
          ? undefined
          : (answer) => {
              updateMessage(
                {
                  ...newMessage,
                  message: answer,
                  displayType: MessageDisplayType.MESSAGE_STREAMING,
                },
                googleDocId
              );
            },
        source.token
      )
        .then((response) => {
          handleOpenAiSuccess(activity, response, newMessage, callback);
        })
        .catch(() => {
          if (abortController.signal.aborted) return;
          setRetryData({
            callback,
            prompts: prompts,
            numRetries: numRetries + 1,
            streamText,
          });
        });
    }, 1000);
  }, [retryData, userId]);

  // Handles initial load
  useEffect(() => {
    if (!googleDocId) {
      return;
    }
    clearChatLog(googleDocId);
    resetActivity();
    sendIntroMessages();
  }, [selectedActivity, selectedGoal]);

  // Handles new step
  useEffect(() => {
    if (!activity) return;
    const currentStep = activity.getStep({
      executePrompt,
      openSelectActivityModal: editDocGoal,
    });
    sendMessage(
      {
        id: uuidv4(),
        message: currentStep.text,
        sender: Sender.SYSTEM,
        displayType: MessageDisplayType.TEXT,
        mcqChoices: currentStep.mcqChoices,
        activityStep: currentStep,
        selectedActivity: activity,
        selectedGoal: selectedGoal,
      },
      false,
      googleDocId
    );
    setWaitingForUserAnswer(true);
  }, [activity?.stepName]);

  useEffect(() => {
    if (!messages.length) return;
    const mostRecentMessage = messages[messages.length - 1];
    const userMessage = mostRecentMessage.sender === Sender.USER;
    if (userMessage && mostRecentMessage.message === MCQ_RETRY_FAILED_REQUEST) {
      setRetryData((prevData) => {
        if (prevData) {
          return {
            ...prevData,
            numRetries: 0,
          };
        }
      });
    }
  }, [messages]);

  // Handles user response to activity step via messages
  useEffect(() => {
    if (!activity) return;
    const currentStep = activity.getStep({
      executePrompt,
      openSelectActivityModal: editDocGoal,
    });
    if (!currentStep) return;
    if (!messages.length) return;
    if (!waitingForUserAnswer) return;
    const mostRecentMessage = messages[messages.length - 1];
    const userMessage = mostRecentMessage.sender === Sender.USER;
    const userInputType: UserInputType =
      currentStep.stepType === ActivityStepTypes.FREE_RESPONSE_QUESTION
        ? UserInputType.FREE_INPUT
        : UserInputType.MCQ;
    if (userMessage) {
      const userAnswer = mostRecentMessage;
      if (currentStep.handleResponse) {
        currentStep.handleResponse(userAnswer.message, userInputType);
      }
      setWaitingForUserAnswer(false);
    }
  }, [waitingForUserAnswer, messages, activity?.stepName]);

  return {
    activityReady: activity?.isReady || !selectedActivity,
  };
}
