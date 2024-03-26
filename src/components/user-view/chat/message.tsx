import React from 'react';
import { Button } from '@mui/material';
import { DARK_BLUE_HEX, LIGHT_BLUE_HEX } from '../../../constants';
import {
  ChatMessageTypes,
  MessageDisplayType,
  Sender,
} from '../../../store/slices/chat';
import { useAppSelector } from '../../../store/hooks';
import { UserRole } from '../../../store/slices/login';
import { OpenAiReqRes } from '../../../types';
import { useEffect, useState } from 'react';
import './message.css';
import useInterval from '../../../hooks/use-interval';

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
  setOpenAiInfoToDisplay: (openAiInfo?: OpenAiReqRes) => void;
}): JSX.Element {
  const { chatMessage, setOpenAiInfoToDisplay } = props;
  const userRole = useAppSelector((state) => state.login.userRole);
  const showAdvancedOptions = useAppSelector(
    (state) => state.state.viewingAdvancedOptions
  );
  const isAdmin = userRole === UserRole.ADMIN;
  if (!chatMessage.openAiInfo || !isAdmin || !showAdvancedOptions) {
    return <></>;
  }
  return (
    <Button
      onClick={() => {
        setOpenAiInfoToDisplay(chatMessage.openAiInfo);
      }}
    >
      OpenAI Info
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
    <div
      className={`fading-text ${
        fadeState === 'fading-out' ? 'fade-out' : 'fade-in'
      }`}
    >
      {strings[currentStringIndex]}
    </div>
  );
};

export default function Message(props: {
  message: ChatMessageTypes;
  setOpenAiInfoToDisplay: (openAiInfo?: OpenAiReqRes) => void;
  messageIndex: number;
}): JSX.Element {
  const { message, setOpenAiInfoToDisplay, messageIndex } = props;
  const [flash, setFlash] = useState(true);
  const backgroundColor =
    message.sender === Sender.USER ? LIGHT_BLUE_HEX : DARK_BLUE_HEX;
  const alignSelf = message.sender === Sender.USER ? 'flex-end' : 'flex-start';
  const textColor = message.sender === Sender.USER ? 'black' : 'white';

  useInterval(
    () => {
      setFlash((prev) => !prev);
    },
    message.displayType === MessageDisplayType.MESSAGE_STREAMING ? 1000 : null
  );

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
      {message.displayType === MessageDisplayType.TEXT && message.message}
      {message.displayType === MessageDisplayType.PENDING_MESSAGE && (
        <FadingText
          strings={['Reading...', 'Analyzing...', 'Getting opinionated...']}
        />
      )}
      {message.displayType === MessageDisplayType.MESSAGE_STREAMING && (
        <span className="streaming-text">{message.message}</span>
      )}
      <DisplayOpenAiInfoButton
        chatMessage={message}
        setOpenAiInfoToDisplay={setOpenAiInfoToDisplay}
      />
    </div>
  );
}
