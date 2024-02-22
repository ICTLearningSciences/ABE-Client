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
import { MessageDisplayType, Sender } from '../store/slices/chat';
import { asyncPromptExecute } from './use-with-synchronous-polling';
import { v4 as uuidv4 } from 'uuid';

export default function useWithFreeInput(selectedGoal?: DocGoal) {
  const { state, sendMessage, chatLogToString, coachResponsePending } =
    useWithChat();
  const [abortController, setAbortController] = useState<{
    controller: AbortController;
    source: CancelTokenSource;
  }>();
  const googleDocId: string = useAppSelector(
    (state) => state.state.googleDocId
  );
  const useGpt4: boolean = useAppSelector((state) => state.state.useGpt4);
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
      asyncPromptExecute(
        googleDocId,
        prompts,
        userId,
        systemPrompt,
        useGpt4,
        source.token
      )
        .then((response) => {
          sendMessage(
            {
              id: uuidv4(),
              message: response.answer,
              sender: Sender.SYSTEM,
              displayType: MessageDisplayType.TEXT,
              openAiInfo: {
                openAiPrompt: response.openAiData[0].openAiPrompt,
                openAiResponse: response.openAiData[0].openAiResponse,
              },
            },
            false,
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
