/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved.
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/

import React from 'react';
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '../../ai-elements/conversation';
import { useChatAdapter, AIElementsMessage } from '../../../hooks/use-chat-adapter';
import { ChatMessageTypes, MessageDisplayType, Sender } from '../../../store/slices/chat';
import { MessageWithExtras } from './message-with-extras';
import { ChatInput } from '../chat/chat-input';
import { AiServiceStepDataTypes } from '../../../ai-services/ai-service-types';

export function ChatV2(props: {
  messages: ChatMessageTypes[];
  coachResponsePending: boolean;
  sendMessage: (message: ChatMessageTypes) => void;
  disableInput: boolean;
  displayMarkdown: boolean;
  setAiInfoToDisplay: (aiServiceStepData?: AiServiceStepDataTypes[]) => void;
}): JSX.Element {
  const {
    messages,
    coachResponsePending,
    sendMessage,
    disableInput,
    displayMarkdown,
    setAiInfoToDisplay,
  } = props;

  // Add pending message if coach is responding
  const allMessages: ChatMessageTypes[] = [
    ...messages,
    ...(coachResponsePending
      ? [
          {
            id: 'pending-message',
            message: '...',
            sender: Sender.SYSTEM,
            displayType: MessageDisplayType.PENDING_MESSAGE,
          } as ChatMessageTypes,
        ]
      : []),
  ];

  // Transform Redux messages to AI Elements format
  const adaptedMessages: AIElementsMessage[] = useChatAdapter(allMessages);

  return (
    <div
      data-cy="chat-v2-container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        maxWidth: '100%',
        justifyContent: 'flex-start',
        overflowY: 'auto',
        overflowX: 'visible',
        position: 'relative',
      }}
    >
      {/* AI Elements Conversation Container with Auto-scroll */}
      <Conversation
        data-cy="messages-container"
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          width: '99%',
          position: 'relative',
          border: '1px solid black',
          borderRadius: '1rem',
        }}
      >
        <ConversationContent>
          {adaptedMessages.map((msg, index) => (
            <MessageWithExtras
              key={msg.id}
              message={msg}
              messageIndex={index}
              displayMarkdown={displayMarkdown}
              setAiInfoToDisplay={setAiInfoToDisplay}
              sendMessage={sendMessage}
              isLastMessage={index === adaptedMessages.length - 1}
            />
          ))}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      {/* Chat Input */}
      <ChatInput sendMessage={sendMessage} disableInput={disableInput} />
    </div>
  );
}
