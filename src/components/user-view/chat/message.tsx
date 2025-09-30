import React from 'react';
import { Button } from '@mui/material';
import { DEFAULT_COLOR_THEME } from '../../../constants';
import {
  ChatMessageTypes,
  MessageDisplayType,
  Sender,
} from '../../../store/slices/chat';
import { useAppSelector } from '../../../store/hooks';
import { UserRole } from '../../../store/slices/login';
import { useEffect, useState } from 'react';
import { AiServiceStepDataTypes } from '../../../ai-services/ai-service-types';
import { StyledFadingText } from './message-styles';
import ReactMarkdown from 'react-markdown';

const baseMessageStyle: React.CSSProperties = {
  borderRadius: '1rem',
  padding: '1rem',
  margin: 5,
  maxWidth: '70%',
  maxInlineSize: '70%',
  whiteSpace: 'pre-wrap',
  overflowWrap: 'break-word',
};

function DisplayOpenAiInfoButton(props: {
  chatMessage: ChatMessageTypes;
  setAiInfoToDisplay: (aiInfo?: AiServiceStepDataTypes[]) => void;
}): JSX.Element {
  const { chatMessage, setAiInfoToDisplay } = props;
  const userRole = useAppSelector((state) => state.login.userRole);
  const showAdvancedOptions = useAppSelector(
    (state) => state.state.viewingAdvancedOptions
  );
  const isAdmin = userRole === UserRole.ADMIN;
  if (!chatMessage.aiServiceStepData || !isAdmin || !showAdvancedOptions) {
    return <></>;
  }
  return (
    <Button
      onClick={() => {
        setAiInfoToDisplay(chatMessage.aiServiceStepData);
      }}
    >
      AI Request Info
    </Button>
  );
}

const FadingText: React.FC<{ strings: string[] }> = ({ strings }) => {
  const [currentStringIndex, setCurrentStringIndex] = useState(0);
  const [fadeState, setFadeState] = useState<'fading-out' | 'fading-in'>(
    'fading-in'
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentStringIndex !== strings.length - 1) {
        setFadeState('fading-out');
      }
    }, 3000); // Change the duration as needed

    return () => clearTimeout(timeoutId);
  }, [currentStringIndex]);

  useEffect(() => {
    if (
      fadeState === 'fading-out' &&
      currentStringIndex !== strings.length - 1
    ) {
      const timeoutId = setTimeout(() => {
        setCurrentStringIndex((prevIndex) => (prevIndex + 1) % strings.length);
        setFadeState('fading-in');
      }, 1000); // Adjust the delay before fading in the next string

      return () => clearTimeout(timeoutId);
    }
  }, [fadeState, strings.length]);

  return (
    <StyledFadingText
      isFadingIn={fadeState === 'fading-in'}
      isFadingOut={fadeState === 'fading-out'}
    >
      {strings[currentStringIndex]}
    </StyledFadingText>
  );
};

export default function Message(props: {
  message: ChatMessageTypes;
  setAiInfoToDisplay: (aiInfo?: AiServiceStepDataTypes[]) => void;
  messageIndex: number;
  displayMarkdown: boolean;
}): JSX.Element {
  const config = useAppSelector((state) => state.config);
  const colorTheme = config.config?.colorTheme || DEFAULT_COLOR_THEME;
  const { message, setAiInfoToDisplay, messageIndex, displayMarkdown } = props;
  const backgroundColor =
    message.sender === Sender.USER
      ? colorTheme.chatUserBubbleColor
      : colorTheme.chatSystemBubbleColor;
  const alignSelf = message.sender === Sender.USER ? 'flex-end' : 'flex-start';
  const textColor =
    message.sender === Sender.USER
      ? colorTheme.chatUserTextColor
      : colorTheme.chatSystemTextColor;

  if (message.message === '') {
    return <></>;
  }

  return (
    <div
      id={message.id}
      data-cy={`message-${messageIndex}`}
      style={{
        ...baseMessageStyle,
        alignSelf: alignSelf,
        backgroundColor: backgroundColor,
        color: textColor,
      }}
    >
      {displayMarkdown && (
        <ReactMarkdown components={{ p: 'span' }}>
          {message.displayType === MessageDisplayType.TEXT
            ? message.message
            : ''}
        </ReactMarkdown>
      )}
      {!displayMarkdown && (
        <span>
          {message.displayType === MessageDisplayType.TEXT
            ? message.message
            : ''}
        </span>
      )}
      {message.displayType === MessageDisplayType.PENDING_MESSAGE && (
        <FadingText
          strings={['Reading...', 'Analyzing...', 'Getting opinionated...']}
        />
      )}
      <DisplayOpenAiInfoButton
        chatMessage={message}
        setAiInfoToDisplay={setAiInfoToDisplay}
      />
    </div>
  );
}
