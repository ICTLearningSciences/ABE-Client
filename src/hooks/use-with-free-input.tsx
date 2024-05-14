/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { useEffect } from 'react';
import { useAppSelector } from '../store/hooks';
import { useWithChat } from '../store/slices/chat/use-with-chat';
import {
  DocGoal,
  AiPromptStep,
  PromptOutputTypes,
  PromptRoles,
  GQLPrompt,
} from '../types';
import { MessageDisplayType, Sender } from '../store/slices/chat';
import { v4 as uuidv4 } from 'uuid';
import {
  DEFAULT_TARGET_AI_SERVICE_MODEL,
  FREE_INPUT_GOAL_ID,
} from '../constants';
import { useWithExecutePrompt } from './use-with-execute-prompts';

export default function useWithFreeInput(selectedGoal?: DocGoal) {
  const { state, sendMessage, chatLogToString, coachResponsePending } =
    useWithChat();
  const googleDocId: string = useAppSelector(
    (state) => state.state.googleDocId
  );
  const overrideAiServiceModel = useAppSelector(
    (state) => state.state.overrideAiServiceModel
  );
  const defaultAiServiceModel = useAppSelector(
    (state) => state.config.config?.defaultAiModel
  );
  const userId: string | undefined = useAppSelector(
    (state) => state.login.user?._id
  );
  const messages = state.chatLogs[googleDocId] || [];
  const isFreeInput = selectedGoal?._id === FREE_INPUT_GOAL_ID;
  const { abortController, executePrompt } = useWithExecutePrompt(true);
  useEffect(() => {
    if (abortController) {
      try {
        abortController.controller.abort();
        abortController.source.cancel();
      } catch (e) {
        console.log(e);
      }
    }
  }, [selectedGoal?._id]);

  useEffect(() => {
    if (messages.length === 0 || !userId || !isFreeInput) {
      return;
    }
    const mostRecentMessage = messages[messages.length - 1];
    if (mostRecentMessage.sender === Sender.USER) {
      const prompts: AiPromptStep[] = [
        {
          prompts: [
            {
              promptText: 'Here is the users essay: ',
              includeEssay: true,
              promptRole: PromptRoles.ASSISSANT,
            },
            {
              promptText: `Here is the chat log with the user: ${chatLogToString(
                googleDocId
              )}`,
              includeEssay: false,
              promptRole: PromptRoles.ASSISSANT,
            },
            {
              promptText: `Please respond to the user's message: ${mostRecentMessage.message}`,
              includeEssay: false,
              promptRole: PromptRoles.ASSISSANT,
            },
          ],
          targetAiServiceModel:
            overrideAiServiceModel ||
            defaultAiServiceModel ||
            DEFAULT_TARGET_AI_SERVICE_MODEL,
          outputDataType: PromptOutputTypes.TEXT,
        },
      ];
      const prompt: GQLPrompt = {
        _id: uuidv4(),
        clientId: uuidv4(),
        aiPromptSteps: prompts,
        title: '',
      };
      coachResponsePending(true);
      executePrompt(
        () => prompt,
        (response) => {
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
      )
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          coachResponsePending(false);
        });
    }
  }, [messages.length, userId]);
}
