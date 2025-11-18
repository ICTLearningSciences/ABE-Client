import React, { useState } from 'react';
import { AiServiceStepDataTypes } from '../../../ai-services/ai-service-types';
import { ChatMessageTypes } from '../../../store/slices/chat';
import { useWithChat } from '../../../store/slices/chat/use-with-chat';
import { StickToBottom } from 'use-stick-to-bottom';
import { GoToMostRecent } from './go-to-most-recent';
import { ChatMessagesContent } from './chat-messages-content';

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
  const { state } = useWithChat();
  const messages = state.chatLogs[curDocId] || [];
  const [streamingMessageId, setStreamingMessageId] = useState<
    string | undefined
  >(undefined);
  console.log('streamingMessageId', streamingMessageId);
  // Callback for when streaming state changes
  const handleStreamingStateChange = (
    isStreaming: boolean,
    message: ChatMessageTypes
  ) => {
    console.log("stream state changed", isStreaming, message)
    if (isStreaming) {
      setStreamingMessageId(message.id);
      if (parentOnStreamingStateChange) {
        parentOnStreamingStateChange(true);
      }
    } else {
      
      setStreamingMessageId(undefined);
      if (parentOnStreamingStateChange) {
        parentOnStreamingStateChange(false);
      }
    }
  };

  return (
    <React.Fragment>
      {/* @ts-expect-error - use-stick-to-bottom types are incompatible with React 18 */}
      <StickToBottom
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
        {/* @ts-expect-error - use-stick-to-bottom types are incompatible with React 18 */}
        <StickToBottom.Content
          data-cy="chat-messages-content"
          style={{
            display: 'flex',
            flexDirection: 'column',
            overflowX: 'hidden',
          }}
        >
          <ChatMessagesContent
            messages={messages}
            coachResponsePending={coachResponsePending}
            streamingMessageId={streamingMessageId}
            setAiInfoToDisplay={setAiInfoToDisplay}
            sendMessage={sendMessage}
            displayMarkdown={displayMarkdown}
            onStreamingStateChange={handleStreamingStateChange}
          />
        </StickToBottom.Content>
        <GoToMostRecent />
      </StickToBottom>
    </React.Fragment>
  );
}
