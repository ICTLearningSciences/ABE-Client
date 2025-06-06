/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { useEffect, useState } from 'react';
import { useAppSelector } from '../store/hooks';
import { useWithChat } from '../store/slices/chat/use-with-chat';
import {
  Activity,
  ActivityGQL,
  ActivityStepTypes,
  AiPromptStep,
  DocGoal,
  GQLPrompt,
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
import { UseWithPrompts } from './use-with-prompts';
import { v4 as uuidv4 } from 'uuid';
import {
  LIMITS_TO_YOUR_ARGUMENT_ID,
  STRONGER_CONCLUSION_ID,
  STRONGER_HOOK_ID,
  THESIS_SUPPORT_ID,
} from '../constants';
import { useWithState } from '../store/slices/state/use-with-state';
import { useWithStrongerConclusionActivity } from './stronger-conclusion-activity/use-with-stronger-conclusion-activity';
import { useWithLimitsToArgumentActivity } from './limits-to-argument-activity/use-with-limits-to-argument-activity';
import { useWithThesisSupportActivity } from './increasing-thesis-support-activity/use-with-thesis-support-activity';
import { useWithExecutePrompt } from './use-with-execute-prompts';
import { AiServicesResponseTypes } from '../ai-services/ai-service-types';
import { getLastUserMessage } from '../helpers';
import axios from 'axios';

export const MCQ_RETRY_FAILED_REQUEST = 'Retry';

export const emptyActivity: Activity = {
  _id: '',
  title: '',
  introduction: '',
  activityType: 'gql',
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
    clearChatLog,
    coachResponsePending,
    chatLogToString,
  } = useWithChat();
  const { executePromptSteps: executePrompt, abortController } =
    useWithExecutePrompt();
  const { newSession, updateSessionIntention } = useWithState();
  const curDocId: string = useAppSelector((state) => state.state.curDocId);
  const systemRole: string = useAppSelector((state) => state.chat.systemRole);
  const messages = state.chatLogs[curDocId] || [];
  const [waitingForUserAnswer, setWaitingForUserAnswer] =
    useState<boolean>(false);
  const { prompts, isLoading: promptsLoading } = useWithPrompts;

  const strongerHookActivity = useWithStrongerHookActivity(
    selectedActivity || emptyActivity,
    sendMessage,
    setWaitingForUserAnswer,
    promptsLoading,
    prompts,
    selectedGoal
  );
  const strongerConclusionActivity = useWithStrongerConclusionActivity(
    selectedActivity || emptyActivity,
    sendMessage,
    setWaitingForUserAnswer,
    promptsLoading,
    prompts,
    selectedGoal
  );
  const thesisSupportActivity = useWithThesisSupportActivity(
    selectedActivity || emptyActivity,
    sendMessage,
    setWaitingForUserAnswer,
    promptsLoading,
    prompts,
    selectedGoal
  );
  const limitsToArgumentActivity = useWithLimitsToArgumentActivity(
    selectedActivity || emptyActivity,
    sendMessage,
    setWaitingForUserAnswer,
    promptsLoading,
    prompts,
    selectedGoal
  );
  const promptActivity = useWithPromptActivity(
    selectedActivity || emptyActivity,
    sendMessage,
    setWaitingForUserAnswer
  );
  const activity =
    selectedActivity?._id === STRONGER_HOOK_ID
      ? strongerHookActivity
      : selectedActivity?._id === STRONGER_CONCLUSION_ID
      ? strongerConclusionActivity
      : selectedActivity?._id === LIMITS_TO_YOUR_ARGUMENT_ID
      ? limitsToArgumentActivity
      : selectedActivity?._id === THESIS_SUPPORT_ID
      ? thesisSupportActivity
      : selectedActivity?.prompt
      ? promptActivity
      : undefined;

  async function executePromptWithMessage(
    _prompt: (messages: ChatMessageTypes[]) => GQLPrompt,
    callback?: (response: AiServicesResponseTypes) => void,
    customSystemRoleMessage?: string
  ) {
    if (!messages.length) return;
    const lastUserMessage = getLastUserMessage(messages);
    const chatLogString = chatLogToString(curDocId);
    const prompt = _prompt(messages);
    const aiPromptSteps: AiPromptStep[] = preparePromptSteps(
      prompt,
      chatLogString,
      lastUserMessage,
      customSystemRoleMessage || systemRole
    );
    if (prompt.userInputIsIntention && lastUserMessage) {
      updateSessionIntention({ description: lastUserMessage });
    }
    coachResponsePending(true);
    try {
      const res = await executePrompt(aiPromptSteps);
      handleOpenAiSuccess(res, callback);
    } catch (e) {
      if (!axios.isCancel(e)) {
        sendMessage(
          {
            id: uuidv4(),
            message: 'Request failed, please try again later.',
            sender: Sender.SYSTEM,
            displayType: MessageDisplayType.TEXT,
            mcqChoices: [MCQ_RETRY_FAILED_REQUEST],
            retryFunction: () => {
              executePromptWithMessage(
                _prompt,
                callback,
                customSystemRoleMessage
              );
            },
          },
          false,
          curDocId
        );
      }
      coachResponsePending(false);
    }
  }

  function preparePromptSteps(
    prompt: GQLPrompt,
    chatLogString: string,
    lastUserMessage: string,
    globalSystemRole: string
  ): AiPromptStep[] {
    const aiPromptSteps: AiPromptStep[] = [];
    prompt.aiPromptSteps.forEach((openAiPromptStep) => {
      const prompts: PromptConfiguration[] = [];

      if (openAiPromptStep.includeChatLogContext) {
        prompts.push({
          promptRole: PromptRoles.SYSTEM,
          promptText: `Here is the chat between the user and the system: ${chatLogString}`,
          includeEssay: false,
        });
      }

      openAiPromptStep.prompts.forEach((prompt) => {
        prompts.push({
          ...prompt,
          promptText: `${prompt.promptText} ${
            prompt.includeUserInput
              ? `\n\nHere is the users input: ${lastUserMessage}`
              : ''
          }`,
        });
      });
      aiPromptSteps.push({
        ...openAiPromptStep,
        systemRole: openAiPromptStep.systemRole || globalSystemRole,
        prompts,
      });
    });
    return aiPromptSteps;
  }

  function handleOpenAiSuccess(
    response: AiServicesResponseTypes,
    callback?: (response: AiServicesResponseTypes) => void
  ) {
    coachResponsePending(false);
    if (callback) {
      callback(response);
    } else {
      sendMessage(
        {
          id: uuidv4(),
          message: response.answer,
          sender: Sender.SYSTEM,
          displayType: MessageDisplayType.TEXT,
          aiServiceStepData: response.aiAllStepsData,
        },
        false,
        curDocId
      );
    }
  }

  function abortCalls() {
    if (abortController) {
      try {
        abortController.controller.abort();
        abortController.source.cancel();
      } catch (e) {
        console.log(e);
      }
    }
  }

  function resetActivity() {
    // cancel any pending requests
    abortCalls();
    newSession();
    coachResponsePending(false);
    setWaitingForUserAnswer(false);
    if (activity) {
      activity.resetActivity();
    }
  }

  function sendMessageHelper(message: ChatMessageTypes) {
    sendMessage(message, false, curDocId);
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
    if (messagesToSend.length) {
      sendMessages(messagesToSend, true, curDocId);
    }
  }

  useEffect(() => {
    abortCalls();
    if (resetActivityCounter === 0) return;
    if (!selectedActivity) return;
    clearChatLog(curDocId);
    sendIntroMessages();
    resetActivity();
  }, [resetActivityCounter, Boolean(selectedActivity)]);

  // Handles initial load
  useEffect(() => {
    if (!curDocId || !selectedActivity) {
      return;
    }
    clearChatLog(curDocId);
    resetActivity();
    sendIntroMessages();
  }, [Boolean(selectedActivity), selectedGoal]);

  // Handles new step
  useEffect(() => {
    if (!activity || !selectedActivity) return;
    const currentStep = activity.getStep({
      executePrompt: executePromptWithMessage,
      openSelectActivityModal: editDocGoal,
      sendMessage: sendMessageHelper,
      setWaitingForUserAnswer,
      updateSessionIntention,
    });
    sendMessage(
      {
        id: uuidv4(),
        message: currentStep.text,
        sender: Sender.SYSTEM,
        displayType: MessageDisplayType.TEXT,
        mcqChoices: currentStep.mcqChoices,
        disableUserInput:
          currentStep.stepType !== ActivityStepTypes.FREE_RESPONSE_QUESTION,
        selectedGoal: selectedGoal,
      },
      false,
      curDocId
    );
    setWaitingForUserAnswer(true);
  }, [activity?.stepName, Boolean(selectedActivity)]);

  // Handles user response to activity step via messages
  useEffect(() => {
    if (!selectedActivity) return;
    if (!activity) return;
    const currentStep = activity.getStep({
      executePrompt: executePromptWithMessage,
      openSelectActivityModal: editDocGoal,
      sendMessage: sendMessageHelper,
      setWaitingForUserAnswer,
      updateSessionIntention,
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
  }, [
    waitingForUserAnswer,
    messages,
    activity?.stepName,
    Boolean(selectedActivity),
  ]);

  return {
    activityReady: Boolean(activity?.isReady) && Boolean(selectedActivity),
  };
}
