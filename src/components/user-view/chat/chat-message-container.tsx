import React from 'react';
import { Button } from '@mui/material';
import { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { useInView } from 'react-intersection-observer';
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
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
export function ChatMessagesContainer(props: {
  coachResponsePending: boolean;
  curDocId: string;
  setAiInfoToDisplay: (aiServiceStepData?: AiServiceStepDataTypes[]) => void;
  sendMessage: (message: ChatMessageTypes) => void;
  displayMarkdown: boolean;
  onStreamingStateChange?: (isStreaming: boolean) => void;
}): JSX.Element {
  const {
    coachResponsePending,
    curDocId,
    setAiInfoToDisplay,
    sendMessage,
    displayMarkdown,
    onStreamingStateChange: parentOnStreamingStateChange,
  } = props;
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(
    null
  );
  const [isPinned, setIsPinned] = useState<boolean>(true);
  const isPinnedRef = useRef<boolean>(true); // Keep ref in sync with state
  const isProgrammaticScrollRef = useRef<boolean>(false);
  const userInteractedRef = useRef<boolean>(false);

  // Keep ref in sync with state
  useEffect(() => {
    isPinnedRef.current = isPinned;
  }, [isPinned]);

  // IntersectionObserver to track if we're at the bottom
  const { ref: bottomAnchorRef, inView: isAtBottom } = useInView({
    threshold: 0,
    root: null, // Use viewport as root initially; will be managed by container
  });

  const { state } = useWithChat();
  const messages = state.chatLogs[curDocId] || [];
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

  // Callback for when streaming state changes
  const handleStreamingStateChange = (
    isStreaming: boolean,
    messageId: string
  ) => {
    if (isStreaming) {
      setStreamingMessageId(messageId);
      // Notify parent
      if (parentOnStreamingStateChange) {
        parentOnStreamingStateChange(true);
      }
    } else {
      setStreamingMessageId(null);
      // Notify parent
      if (parentOnStreamingStateChange) {
        parentOnStreamingStateChange(false);
      }
    }
  };

  // Filter messages: if streaming, only show messages up to and including the streaming message
  const chatMessages: ChatMessageTypes[] = streamingMessageId
    ? allMessages.slice(
        0,
        allMessages.findIndex((m) => m.id === streamingMessageId) + 1
      )
    : allMessages;
  const mostRecentChatId =
    chatMessages.length > 0 ? chatMessages[chatMessages.length - 1].id : '';

  // Track user interactions - only these should change isPinned state
  useEffect(() => {
    const container = messageContainerRef.current;
    if (!container) return;

    // Mark that user is interacting when they use scroll-related inputs
    const handleUserInteraction = () => {
      userInteractedRef.current = true;
    };

    // Listen for actual user input events that cause scrolling
    container.addEventListener('wheel', handleUserInteraction); // Mouse wheel
    container.addEventListener('touchstart', handleUserInteraction); // Touch scroll
    container.addEventListener('keydown', handleUserInteraction); // Arrow keys, Page Up/Down

    return () => {
      container.removeEventListener('wheel', handleUserInteraction);
      container.removeEventListener('touchstart', handleUserInteraction);
      container.removeEventListener('keydown', handleUserInteraction);
    };
  }, []);

  // Handle scrolling - but only change isPinned if user actually interacted
  useEffect(() => {
    const container = messageContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      // Ignore programmatic scrolls - we initiated those
      if (isProgrammaticScrollRef.current) {
        isProgrammaticScrollRef.current = false;
        return;
      }

      // Only change isPinned if this scroll came from a user interaction
      if (userInteractedRef.current) {
        setIsPinned(isAtBottom);
        userInteractedRef.current = false; // Reset the flag
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [isAtBottom]); // Re-create handler when isAtBottom changes

  function scrollToBottom(smooth = false) {
    if (messageContainerRef.current) {
      isProgrammaticScrollRef.current = true;
      if (smooth) {
        messageContainerRef.current.scrollTo({
          top: messageContainerRef.current.scrollHeight,
          behavior: 'smooth',
        });
      } else {
        messageContainerRef.current.scrollTop =
          messageContainerRef.current.scrollHeight;
      }
      // Reset the flag after a brief delay to allow the scroll event to process
      setTimeout(() => {
        isProgrammaticScrollRef.current = false;
      }, 100);
    }
  }

  // Scroll to bottom when new messages arrive (if pinned)
  // Using useLayoutEffect to ensure scroll happens after DOM updates but before paint
  useLayoutEffect(() => {
    if (isPinned && messageContainerRef.current) {
      scrollToBottom();
    }
  }, [chatMessages.length, mostRecentChatId, isPinned]);

  // Watch for DOM changes - when content is added/modified and we're pinned, scroll to bottom
  useEffect(() => {
    const container = messageContainerRef.current;
    if (!container) return;
    // Use MutationObserver to watch for any DOM changes in the container
    const mutationObserver = new MutationObserver(() => {
      // Content changed - if pinned, scroll to bottom
      if (isPinnedRef.current) {
        scrollToBottom();
      }
    });

    // Watch for changes to the container's children (added/removed/modified)
    mutationObserver.observe(container, {
      childList: true, // Watch for children being added/removed
      subtree: true, // Watch all descendants
      characterData: true, // Watch for text changes (streaming!)
    });

    return () => {
      mutationObserver.disconnect();
    };
  }, []); // Only set up once

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
        position: 'relative',
      }}
    >
      {chatMessages.map((message: ChatMessageTypes, index: number) => (
        <React.Fragment key={message.id}>
          <Message
            message={message}
            setAiInfoToDisplay={setAiInfoToDisplay}
            messageIndex={index}
            displayMarkdown={displayMarkdown}
            onStreamingStateChange={handleStreamingStateChange}
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
      {/* Invisible anchor element to detect if user is at bottom */}
      <div ref={bottomAnchorRef} style={{ height: 1, marginTop: -1 }} />
      {!isPinned && (
        <Button
          variant="contained"
          onClick={() => {
            setIsPinned(true);
            scrollToBottom(true);
          }}
          data-cy="scroll-to-bottom-button"
          endIcon={<ArrowDownwardIcon />}
          style={{
            position: 'sticky',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            marginTop: 'auto',
          }}
        >
          View Most Recent
        </Button>
      )}
    </div>
  );
}
