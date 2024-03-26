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
  DocGoal,
  OpenAiPromptStep,
  PromptOutputTypes,
  PromptRoles,
} from '../types';
import {
  ChatMessageTypes,
  MessageDisplayType,
  Sender,
} from '../store/slices/chat';
import { asyncPromptExecute } from './use-with-synchronous-polling';
import { v4 as uuidv4 } from 'uuid';
import { DEFAULT_GPT_MODEL, GptModels } from '../constants';

export default function useWithFreeInput(selectedGoal?: DocGoal) {
  const {
    state,
    sendMessage,
    chatLogToString,
    coachResponsePending,
    updateMessage,
  } = useWithChat();
  const [abortController, setAbortController] = useState<{
    controller: AbortController;
    source: CancelTokenSource;
  }>();
  const googleDocId: string = useAppSelector(
    (state) => state.state.googleDocId
  );
  const overrideGptModel: GptModels = useAppSelector(
    (state) => state.state.overideGptModel
  );
  const systemPrompt: string = useAppSelector(
    (state) => state.chat.systemPrompt
  );
  const userId: string | undefined = useAppSelector(
    (state) => state.login.user?._id
  );
  const messages = state.chatLogs[googleDocId] || [];
  const isFreeInput = selectedGoal?._id === '65823a8799045156193339b2';

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
      const prompts: OpenAiPromptStep[] = [
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
          targetGptModel: DEFAULT_GPT_MODEL,
          outputDataType: PromptOutputTypes.TEXT,
        },
      ];
      coachResponsePending(true);

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
        prompts,
        userId,
        systemPrompt,
        overrideGptModel,
        true,
        (answer) => {
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
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          coachResponsePending(false);
        });
    }
  }, [messages.length, userId]);
}
