import React from 'react';
import { Button } from '@mui/material';
import { useRef, useState, useEffect } from 'react';
import { AiServiceStepDataTypes } from '../../../ai-services/ai-service-types';
import {
  ChatMessageTypes,
  Sender,
  MessageDisplayType,
  UserInputType,
} from '../../../store/slices/chat';
import { useWithChat } from '../../../store/slices/chat/use-with-chat';
import Message from './message';
import { v4 as uuidv4 } from 'uuid';

export function ChatMessagesContainer(props: {
  coachResponsePending: boolean;
  googleDocId: string;
  setAiInfoToDisplay: (aiServiceStepData?: AiServiceStepDataTypes[]) => void;
  sendMessage: (message: ChatMessageTypes) => void;
}): JSX.Element {
  const { coachResponsePending, googleDocId, setAiInfoToDisplay, sendMessage } =
    props;
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const [messageElements, setMessageElements] = useState<JSX.Element[]>([]);
  const { state } = useWithChat();
  const messages = state.chatLogs[googleDocId] || [];
  const chatMessages: ChatMessageTypes[] = [
    ...messages,
    ...(coachResponsePending
      ? [
          {
            id: 'pending-message',
            message: '...',
            sender: Sender.SYSTEM,
            displayType: MessageDisplayType.PENDING_MESSAGE,
          },
        ]
      : []),
  ];
  const mostRecentChatId =
    chatMessages.length > 0 ? chatMessages[chatMessages.length - 1].id : '';

  function scrollToElementById(id: string) {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function scrollToMostRecentAiResponse() {
    const mostRecentAiResponse = getMostRecentAiResponse(chatMessages);
    if (mostRecentAiResponse) {
      scrollToElementById(mostRecentAiResponse.id);
    }
  }

  function getMostRecentAiResponse(
    messages: ChatMessageTypes[]
  ): ChatMessageTypes | undefined {
    // first, find the most recent user message, then find the most recent system message after that
    if (!messages || messages.length <= 1) return undefined;
    let mostRecentUserMessageIndex = -1;
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].sender === Sender.USER) {
        mostRecentUserMessageIndex = i;
        break;
      }
    }
    if (mostRecentUserMessageIndex === -1) return undefined;
    for (let i = mostRecentUserMessageIndex; i < messages.length; i++) {
      if (messages[i].sender === Sender.SYSTEM) {
        return messages[i];
      }
    }
    return undefined;
  }

  useEffect(() => {
    if (messageContainerRef.current) {
      scrollToMostRecentAiResponse();
    }
  }, [messageElements]);

  useEffect(() => {
    const _newMessageElements = chatMessages.map(
      (message: ChatMessageTypes, index: number) => {
        return (
          <>
            <Message
              key={index}
              message={message}
              setAiInfoToDisplay={setAiInfoToDisplay}
              messageIndex={index}
            />
            {message.mcqChoices && index === chatMessages.length - 1 && (
              <div
                key={`mcq-choices-${index}`}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: '98%',
                  justifyContent: 'flex-end',
                  alignItems: 'flex-end',
                  margin: '10px',
                }}
              >
                {message.mcqChoices.map((choice: string, i: number) => {
                  return (
                    <Button
                      key={i}
                      variant="outlined"
                      style={{
                        marginBottom: '5px',
                      }}
                      data-cy={`mcq-choice-${choice.replaceAll(' ', '-')}`}
                      onClick={() => {
                        sendMessage({
                          id: uuidv4(),
                          message: choice,
                          sender: Sender.USER,
                          displayType: MessageDisplayType.TEXT,
                          userInputType: UserInputType.MCQ,
                        });
                        if (message.retryFunction) {
                          message.retryFunction();
                        }
                      }}
                    >
                      {choice}
                    </Button>
                  );
                })}
              </div>
            )}
          </>
        );
      }
    );
    setMessageElements(_newMessageElements);
  }, [chatMessages.length, mostRecentChatId]);

  return (
    <div
      ref={messageContainerRef}
      data-cy="messages-container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        maxWidth: '100%',
        justifyContent: 'flex-start',
        margin: '1rem',
        borderRadius: '1rem',
        overflowX: 'hidden',
        overflowY: 'auto',
        border: '1px solid black',
      }}
    >
      {messageElements}
    </div>
  );
}
