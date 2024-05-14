/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import axios, { CancelTokenSource } from 'axios';
import { AiServicesResponseTypes } from '../ai-services/ai-service-types';
import { getLastUserMessage } from '../helpers';
import {
  ChatMessageTypes,
  MessageDisplayType,
  Sender,
} from '../store/slices/chat';
import {
  GQLPrompt,
  AiPromptStep,
  PromptConfiguration,
  PromptRoles,
} from '../types';
import { asyncPromptExecute } from './use-with-synchronous-polling';
import { useEffect, useState } from 'react';
import { MCQ_RETRY_FAILED_REQUEST } from './use-with-activity-handler';
import { DEFAULT_TARGET_AI_SERVICE_MODEL } from '../constants';
import { useAppSelector } from '../store/hooks';
import { useWithConfig } from '../store/slices/config/use-with-config';
import { useWithState } from '../store/slices/state/use-with-state';
import { useWithChat } from '../store/slices/chat/use-with-chat';
import { v4 as uuidv4 } from 'uuid';

interface PromptRetryData {
  callback?: (response: AiServicesResponseTypes) => void;
  prompt: GQLPrompt;
  numRetries: number;
}

export function useWithExecutePrompt(sendMessages: boolean) {
  const { state: config } = useWithConfig();
  const userId: string | undefined = useAppSelector(
    (state) => state.login.user?._id
  );
  const [abortController, setAbortController] = useState<{
    controller: AbortController;
    source: CancelTokenSource;
  }>();
  const systemRole: string = useAppSelector((state) => state.chat.systemRole);
  const { state, sendMessage, chatLogToString, coachResponsePending } =
    useWithChat();
  const googleDocId: string = useAppSelector(
    (state) => state.state.googleDocId
  );
  const messages = state.chatLogs[googleDocId] || [];
  const { updateSessionIntention } = useWithState();
  const [retryData, setRetryData] = useState<PromptRetryData>();

  const overrideAiServiceModel = useAppSelector(
    (state) => state.state.overrideAiServiceModel
  );

  /**
   * Checks if user message is a retry request
   */
  useEffect(() => {
    if (!messages.length) return;
    const mostRecentMessage = messages[messages.length - 1];
    const userMessage = mostRecentMessage.sender === Sender.USER;
    if (
      retryData &&
      userMessage &&
      mostRecentMessage.message === MCQ_RETRY_FAILED_REQUEST
    ) {
      if (retryData) {
        executePrompt(() => retryData.prompt, retryData?.callback);
      }
    }
  }, [messages]);

  async function executePrompt(
    _prompt: (messages: ChatMessageTypes[]) => GQLPrompt,
    callback?: (response: AiServicesResponseTypes) => void
  ) {
    if (!userId) return;
    if (!messages.length) return;
    const lastUserMessage = getLastUserMessage(messages);
    const chatLogString = chatLogToString(googleDocId);
    const prompt = _prompt(messages);
    const aiPromptSteps: AiPromptStep[] = preparePromptSteps(
      prompt,
      chatLogString,
      lastUserMessage,
      systemRole
    );
    if (prompt.userInputIsIntention && lastUserMessage) {
      updateSessionIntention({ description: lastUserMessage });
    }
    coachResponsePending(true);

    const abortController = new AbortController();
    const source = axios.CancelToken.source();
    setAbortController({
      controller: abortController,
      source,
    });
    let res: AiServicesResponseTypes;
    try {
      res = await asyncPromptExecute(
        googleDocId,
        aiPromptSteps,
        userId,
        source.token
      );
      handleOpenAiSuccess(res, callback);
      return res;
    } catch {
      if (abortController.signal.aborted) return;
      for (let i = 0; i < 3; i++) {
        try {
          const res = await asyncPromptExecute(
            googleDocId,
            aiPromptSteps,
            userId,
            source.token
          );
          handleOpenAiSuccess(res, callback);
          return res;
        } catch {
          if (abortController.signal.aborted) return undefined;
        }
      }
      if (sendMessages) {
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
        setRetryData({
          callback,
          prompt: prompt,
          numRetries: 0,
        });
      }
      return undefined;
    }
  }

  // handle retry data
  //   useEffect(() => {
  //     if (!retryData) return;
  //     if (!userId) return;
  //     if (retryData.numRetries > 2) {
  //       coachResponsePending(false);
  //       if (sendMessages) {
  //         sendMessage(
  //           {
  //             id: uuidv4(),
  //             message: 'Request failed, please try again later.',
  //             sender: Sender.SYSTEM,
  //             displayType: MessageDisplayType.TEXT,
  //             mcqChoices: [MCQ_RETRY_FAILED_REQUEST],
  //           },
  //           false,
  //           googleDocId
  //         );
  //       }
  //       return;
  //     }
  //     coachResponsePending(true);
  //     setTimeout(() => {
  //       const { callback, prompts, numRetries } = retryData;
  //       const abortController = new AbortController();
  //       const source = axios.CancelToken.source();
  //       setAbortController({
  //         controller: abortController,
  //         source,
  //       });
  //       asyncPromptExecute(googleDocId, retryData.prompts, userId, source.token)
  //         .then((response) => {
  //           handleOpenAiSuccess(response, callback);
  //         })
  //         .catch(() => {
  //           if (abortController.signal.aborted) return;
  //           setRetryData({
  //             callback,
  //             prompts: prompts,
  //             numRetries: numRetries + 1,
  //           });
  //         });
  //     }, 1000);
  //   }, [retryData, userId]);

  function handleOpenAiSuccess(
    response: AiServicesResponseTypes,
    callback?: (response: AiServicesResponseTypes) => void
  ) {
    coachResponsePending(false);
    if (callback) {
      callback(response);
    } else {
      if (sendMessages) {
        sendMessage(
          {
            id: uuidv4(),
            message: response.answer,
            sender: Sender.SYSTEM,
            displayType: MessageDisplayType.TEXT,
            openAiInfo: {
              aiServiceRequestParams:
                response.aiAllStepsData[0].aiServiceRequestParams,
              aiServiceResponse: response.aiAllStepsData[0].aiServiceResponse,
            },
          },
          false,
          googleDocId
        );
      }
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
        targetAiServiceModel:
          overrideAiServiceModel ||
          openAiPromptStep.targetAiServiceModel ||
          config.config?.defaultAiModel ||
          DEFAULT_TARGET_AI_SERVICE_MODEL,
        prompts,
      });
    });
    return aiPromptSteps;
  }

  return {
    abortController,
    executePrompt,
  };
}
