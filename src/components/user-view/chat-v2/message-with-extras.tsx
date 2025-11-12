/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved.
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/

import React from 'react';
import { Button } from '@mui/material';
import { Message, MessageContent, MessageResponse } from '../../ai-elements/message';
import { AIElementsMessage } from '../../../hooks/use-chat-adapter';
import {
  ChatMessageTypes,
  Sender,
  MessageDisplayType,
  UserInputType,
} from '../../../store/slices/chat';
import { AiServiceStepDataTypes } from '../../../ai-services/ai-service-types';
import { useAppSelector } from '../../../store/hooks';
import { UserRole } from '../../../store/slices/login';
import { v4 as uuidv4 } from 'uuid';
import { FadingText } from './fading-text';
import { DEFAULT_COLOR_THEME } from '../../../constants';

/**
 * Component that wraps AI Elements Message with additional features:
 * - MCQ (Multiple Choice Question) buttons
 * - Admin AI debug info button
 * - Pending message animation
 */
export function MessageWithExtras(props: {
  message: AIElementsMessage;
  messageIndex: number;
  displayMarkdown: boolean;
  setAiInfoToDisplay: (aiServiceStepData?: AiServiceStepDataTypes[]) => void;
  sendMessage: (message: ChatMessageTypes) => void;
  isLastMessage: boolean;
}): JSX.Element {
  const {
    message,
    messageIndex,
    displayMarkdown,
    setAiInfoToDisplay,
    sendMessage,
    isLastMessage,
  } = props;
  const config = useAppSelector((state) => state.config);
  const colorTheme = config.config?.colorTheme || DEFAULT_COLOR_THEME;
  const backgroundColor =
  message.role === 'user'
    ? colorTheme.chatUserBubbleColor
    : colorTheme.chatSystemBubbleColor;
const textColor =
  message.role === 'user'
    ? colorTheme.chatUserTextColor
    : colorTheme.chatSystemTextColor;

  const userRole = useAppSelector((state) => state.login.userRole);
  const showAdvancedOptions = useAppSelector(
    (state) => state.state.viewingAdvancedOptions
  );
  const isAdmin = userRole === UserRole.ADMIN;

  const originalMessage = message.originalMessage;

  // Don't render empty messages
  if (!message.content) {
    return <></>;
  }

  // Handle pending message display
  if (originalMessage.displayType === MessageDisplayType.PENDING_MESSAGE) {
    return (
      <Message from={message.role} data-cy={`message-${messageIndex}`}>
        <MessageContent>
          <FadingText
            strings={['Reading...', 'Analyzing...', 'Getting opinionated...']}
          />
        </MessageContent>
      </Message>
    );
  }

  return (
    <>
      <Message
        from={message.role}
        data-cy={`message-${messageIndex}`}
        data-message-id={message.id}
      >
        <MessageContent style={{ backgroundColor, color: textColor }}>
          {displayMarkdown ? (
            <MessageResponse parseIncompleteMarkdown={true}>
              {message.content}
            </MessageResponse>
          ) : (
            <span>{message.content}</span>
          )}

          {/* Admin Debug Info Button */}
          {originalMessage.aiServiceStepData && isAdmin && showAdvancedOptions && (
            <Button
              onClick={() => {
                setAiInfoToDisplay(originalMessage.aiServiceStepData);
              }}
              size="small"
            >
              AI Request Info
            </Button>
          )}
        </MessageContent>
      </Message>

      {/* MCQ Choices - render only after last message */}
      {originalMessage.mcqChoices && isLastMessage && (
        <div
          data-cy="mcq-choices-container"
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
            gap: '5px',
          }}
        >
          {originalMessage.mcqChoices.map((choice: string, i: number) => (
            <Button
              key={i}
              variant="outlined"
              data-cy={`mcq-choice-${choice.replaceAll(' ', '-')}`}
              onClick={() => {
                sendMessage({
                  id: uuidv4(),
                  message: choice,
                  sender: Sender.USER,
                  displayType: MessageDisplayType.TEXT,
                  userInputType: UserInputType.MCQ,
                });
                if (originalMessage.retryFunction) {
                  originalMessage.retryFunction();
                }
              }}
            >
              {choice}
            </Button>
          ))}
        </div>
      )}
    </>
  );
}
