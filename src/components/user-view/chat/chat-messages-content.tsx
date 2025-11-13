import React, { useEffect, useCallback, useRef } from 'react';
import { Button } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { useStickToBottomContext } from 'use-stick-to-bottom';
import {
  ChatMessageTypes,
  Sender,
  MessageDisplayType,
  UserInputType,
} from '../../../store/slices/chat';
import { AiServiceStepDataTypes } from '../../../ai-services/ai-service-types';
import Message from './message';

export function ChatMessagesContent(props: {
  messages: ChatMessageTypes[];
  coachResponsePending: boolean;
  streamingMessageId?: string;
  setAiInfoToDisplay: (aiServiceStepData?: AiServiceStepDataTypes[]) => void;
  sendMessage: (message: ChatMessageTypes) => void;
  displayMarkdown: boolean;
  onStreamingStateChange: (isStreaming: boolean, message: ChatMessageTypes) => void;
}): JSX.Element {
  const {
    messages,
    coachResponsePending,
    streamingMessageId,
    setAiInfoToDisplay,
    sendMessage,
    displayMarkdown,
    onStreamingStateChange,
  } = props;

  const { scrollToBottom, stopScroll } = useStickToBottomContext();
  const previousMessagesLengthRef = useRef(messages.length);

  // Detect new user messages and scroll to bottom
  useEffect(() => {
    if (messages.length > previousMessagesLengthRef.current) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage && lastMessage.sender === Sender.USER) {
        scrollToBottom();
      }
    }
    previousMessagesLengthRef.current = messages.length;
  }, [messages.length, messages, scrollToBottom]);

  // Handle streaming state changes with stopScroll
  const handleStreamingStateChangeWithPinning = useCallback(
    (isStreaming: boolean, message: ChatMessageTypes) => {
      onStreamingStateChange(isStreaming, message);
    },
    [onStreamingStateChange, stopScroll]
  );

  // Build messages list including pending message
  const allMessages: ChatMessageTypes[] = [
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

  // Filter messages: if streaming, only show messages up to and including the streaming message
  const chatMessages: ChatMessageTypes[] = streamingMessageId
    ? allMessages.slice(
        0,
        allMessages.findIndex((m) => m.id === streamingMessageId) + 1
      )
    : allMessages;

  return (
    <>
      {chatMessages.map((message: ChatMessageTypes, index: number) => (
        <React.Fragment key={message.id}>
          <Message
            message={message}
            setAiInfoToDisplay={setAiInfoToDisplay}
            messageIndex={index}
            displayMarkdown={displayMarkdown}
            onStreamingStateChange={handleStreamingStateChangeWithPinning}
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
              {message.mcqChoices.map((choice: string, i: number) => (
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
              ))}
            </div>
          )}
        </React.Fragment>
      ))}
    </>
  );
}
