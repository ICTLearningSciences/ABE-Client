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

export enum PinModes{
  BOTTOM_OF_MESSAGES="BOTTOM_OF_MESSAGES",
  TOP_OF_STREAMING_MESSAGE="TOP_OF_STREAMING_MESSAGE",
  NONE="NONE",
}

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
  const [pinnedState, setPinnedState] = useState<{
    mode: PinModes;
    messageId: string | null;
  }>({
    mode: PinModes.BOTTOM_OF_MESSAGES,
    messageId: null,
  });
  const isProgrammaticScrollRef = useRef<boolean>(false);
  const userInteractedRef = useRef<boolean>(false);

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
    message: ChatMessageTypes
  ) => {
    console.log("handleStreamingStateChange", isStreaming, message);
    if (isStreaming) {
      setStreamingMessageId(message.id);
      setPinnedState({
        mode: PinModes.TOP_OF_STREAMING_MESSAGE,
        messageId: message.id,
      });
      // Notify parent
      if (parentOnStreamingStateChange) {
        parentOnStreamingStateChange(true);
      }
    } else {
      setStreamingMessageId(null);
      if (parentOnStreamingStateChange) {
        parentOnStreamingStateChange(false);
      }
    }
  };

  // Callback for when streaming message resizes
  const handleStreamingMessageResize = (messageId: string) => {
    if(userInteractedRef.current){
      return;
    }
    if(pinnedState.mode === PinModes.TOP_OF_STREAMING_MESSAGE && pinnedState.messageId === messageId){
      console.log("scrolling to streaming message from resize", messageId);
      scrollToStreamingMessage(messageId);
    }
    if(pinnedState.mode === PinModes.BOTTOM_OF_MESSAGES){
      console.log("scrolling to bottom from resize");
      scrollToBottom();
    }
  };

  // Filter messages: if streaming, only show messages up to and including the streaming message
  const chatMessages: ChatMessageTypes[] = streamingMessageId
    ? allMessages.slice(
        0,
        allMessages.findIndex((m) => m.id === streamingMessageId) + 1
      )
    : allMessages;

  useEffect(() => {
    const container = messageContainerRef.current;
    if (!container) return;

    // Mark that user is interacting when they use scroll-related inputs
    const handleUserInteraction = () => {
      console.log("userinteraction, setting userInteractedRef to true");
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

  // Handle scrolling - but only change pinnedState if user actually interacted
  useLayoutEffect(() => {
    const container = messageContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      // Ignore programmatic scrolls
      if (isProgrammaticScrollRef.current) {
        isProgrammaticScrollRef.current = false;
        return;
      }

      // Only change pinnedState if this scroll came from a user interaction
      if (userInteractedRef.current) {
        const newMode = isAtBottom ? PinModes.BOTTOM_OF_MESSAGES : PinModes.NONE;
        if(newMode === pinnedState.mode){
          return;
        }
        console.log("userinteracted,setting pinnedState to ", newMode);
        setPinnedState({
          mode: newMode,
          messageId: null,
        });
        userInteractedRef.current = false; // Reset the flag
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [isAtBottom]); // Re-create handler when isAtBottom changes

  function scrollToBottom() {
    if (messageContainerRef.current) {
      isProgrammaticScrollRef.current = true;
        messageContainerRef.current.scrollTop =
          messageContainerRef.current.scrollHeight;
      // Reset the flag after a brief delay to allow the scroll event to process
      setTimeout(() => {
        isProgrammaticScrollRef.current = false;
      }, 100);
    }
  }

  function scrollToStreamingMessage(messageId: string) {
    if(!messageContainerRef.current){
      return
    }
    const streamingMessageElement = messageContainerRef.current.querySelector(`[data-message-id="${messageId}"]`);
    if(streamingMessageElement){
      streamingMessageElement.scrollIntoView();
    }
  }

  useLayoutEffect(()=>{
    const container = messageContainerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(() => {
      console.log("resizeObserver", pinnedState.mode, pinnedState.messageId);
      if (pinnedState.mode === PinModes.BOTTOM_OF_MESSAGES) {
        scrollToBottom();
      }
      if (pinnedState.mode === PinModes.TOP_OF_STREAMING_MESSAGE && pinnedState.messageId) {
        scrollToStreamingMessage(pinnedState.messageId);
      }
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, [pinnedState.mode, pinnedState.messageId, messages.length]);

  // MutationObserver to track when new children are added
  useLayoutEffect(() => {
    const container = messageContainerRef.current;
    if (!container) return;

    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          console.log("new children added, scrolling to bottom or streaming message", pinnedState.mode, pinnedState.messageId);
          if(pinnedState.mode === PinModes.BOTTOM_OF_MESSAGES){
            scrollToBottom();
          }
          if(pinnedState.mode === PinModes.TOP_OF_STREAMING_MESSAGE && pinnedState.messageId){
            scrollToStreamingMessage(pinnedState.messageId);
          }
        }
      });
    });

    mutationObserver.observe(container, {
      childList: true,
      subtree: false, // Only watch direct children
    });

    return () => {
      mutationObserver.disconnect();
    };
  }, [pinnedState]);

  return (
    <React.Fragment>
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
            onResize={handleStreamingMessageResize}
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
    </div>
    {(pinnedState.mode !== PinModes.BOTTOM_OF_MESSAGES && !isAtBottom) && (
        <Button
          variant="contained"
          onClick={() => {
            setPinnedState({
              mode: PinModes.BOTTOM_OF_MESSAGES,
              messageId: null,
            });
            scrollToBottom();
          }}
          data-cy="scroll-to-bottom-button"
          endIcon={<ArrowDownwardIcon />}
          style={{
            position: 'absolute',
            bottom: 100,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10, // optional to stay above content
          }}
        >
          View Most Recent
        </Button>
      )}
    </React.Fragment>
  );
}
