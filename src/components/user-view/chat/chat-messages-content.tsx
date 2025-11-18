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
import { useChildTopIntersection } from './use-with-child-top-intersection';

export function ChatMessagesContent(props: {
  messages: ChatMessageTypes[];
  coachResponsePending: boolean;
  streamingMessageId?: string;
  setAiInfoToDisplay: (aiServiceStepData?: AiServiceStepDataTypes[]) => void;
  sendMessage: (message: ChatMessageTypes) => void;
  displayMarkdown: boolean;
  onStreamingStateChange: (
    isStreaming: boolean,
    message: ChatMessageTypes
  ) => void;
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

  const { scrollToBottom, stopScroll, isAtBottom } = useStickToBottomContext();
  const previousMessagesLengthRef = useRef(messages.length);
  const scrollContainerRef = useRef<HTMLElement | null>(null);
  const streamingMessageRef = useRef<HTMLElement | null>(null);

  // Set up refs for intersection detection
  useEffect(() => {
    // Get the scroll container (parent of chat-messages-content)
    const contentElement = document.querySelector('[data-cy="chat-messages-content"]');
    if (contentElement?.parentElement) {
      scrollContainerRef.current = contentElement.parentElement as HTMLElement;
    }else{
      scrollContainerRef.current = null;
    }

    // Get the streaming message element
    if (streamingMessageId) {
      const streamingMessageElement = document.querySelector(
        `[data-message-id="${streamingMessageId}"]`
      ) as HTMLElement;
      if (streamingMessageElement) {
        streamingMessageRef.current = streamingMessageElement;
      }
    }else{
      streamingMessageRef.current = null;
    }
  }, [streamingMessageId]);

  // Use the custom intersection hook
  const { hitTop } = useChildTopIntersection(
    scrollContainerRef,
    streamingMessageRef,
    10, // threshold in pixels
    () => {
      console.log("user scrolled up");
      streamingMessageRef.current = null;
    }
  );

  // Stop scroll when streaming message hits the top
  useEffect(() => {
    if (hitTop && isAtBottom && streamingMessageId) {
      console.log("🚀 Stopping scroll - message reached top");
      stopScroll();
    }
  }, [hitTop, isAtBottom, streamingMessageId, stopScroll]);

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
