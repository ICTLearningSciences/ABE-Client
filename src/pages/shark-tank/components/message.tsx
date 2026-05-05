import React, { useEffect, useState } from 'react';
import { Avatar, Button, Paper, Typography } from '@mui/material';
import {
  ChatMessageTypes,
  MessageDisplayType,
  Sender,
} from '../../../store/slices/chat';
import { useAppSelector } from '../../../store/hooks';
import { UserRole } from '../../../store/slices/login';
import { AiServiceStepDataTypes } from '../../../ai-services/ai-service-types';
import { StyledFadingText } from '../../../components/user-view/chat/message-styles';
import { useWithPanels } from '../../../store/slices/panels/use-with-panels';
import { stringAvatar, stringToColor } from '../helpers';
import BaseMessage from '../../../components/user-view/chat/message';

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

const FadingText: React.FC<{ strings: string[]; time?: number }> = ({
  strings,
  time,
}) => {
  const [currentStringIndex, setCurrentStringIndex] = useState(0);
  const [fadeState, setFadeState] = useState<'fading-out' | 'fading-in'>(
    'fading-in'
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentStringIndex !== strings.length - 1) {
        setFadeState('fading-out');
      }
    }, time || 3000); // Change the duration as needed

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
  messageIndex: number;
  latestMessageIndex: number;
  setAiInfoToDisplay: (aiInfo?: AiServiceStepDataTypes[]) => void;
}): JSX.Element {
  const { activePanel, activePanelist, panelists } = useWithPanels();
  const { message, messageIndex, setAiInfoToDisplay } = props;

  const panelist = panelists.find(
    (p) =>
      activePanel?.panelists?.includes(p.clientId) &&
      p.panelistName === message.systemCustomName
  );
  const userMessage = message.sender === Sender.USER;

  function formatMessage(message: string) {
    // Preserve multiple blank lines by converting extra newlines to <br /> tags
    // \n\n = paragraph break (standard markdown, 1 blank line)
    // \n\n\n = paragraph break + 1 <br /> (2 blank lines)
    // \n\n\n\n = paragraph break + 2 <br /> (3 blank lines), etc.
    return message.replace(/\n{3,}/g, (match) => {
      const extraNewlines = match.length - 2;
      return '\n\n' + '<br />'.repeat(extraNewlines);
    });
  }

  if (message.message === '') {
    return <></>;
  }

  if (!panelist) {
    return (
      <BaseMessage
        message={message}
        setAiInfoToDisplay={setAiInfoToDisplay}
        messageIndex={messageIndex}
        displayMarkdown={false}
      />
    );
  }
  if (messageIndex > props.latestMessageIndex) {
    return (
      <div
        id={message.id}
        style={{
          display:
            activePanelist && activePanelist.clientId !== panelist.clientId
              ? 'none'
              : '',
          position: 'relative',
          margin: 10,
        }}
      >
        <Typography
          style={{ fontSize: 12, color: stringToColor(panelist.panelistName) }}
        >
          <FadingText
            strings={[
              `${panelist.panelistName} is responding.`,
              `${panelist.panelistName} is responding..`,
              `${panelist.panelistName} is responding...`,
            ]}
            time={1000}
          />
        </Typography>
      </div>
    );
  }
  return (
    <div
      id={message.id}
      style={{
        display:
          activePanelist && activePanelist.clientId !== panelist.clientId
            ? 'none'
            : '',
        position: 'relative',
        margin: 10,
      }}
    >
      {!userMessage && panelist && (
        <div className="row center-div">
          <Avatar
            {...stringAvatar(panelist.panelistName)}
            style={{ marginRight: 10 }}
          />
          <Typography style={{ flexGrow: 1, fontWeight: 'bold' }}>
            {panelist?.panelistName}
          </Typography>
          <Typography
            style={{
              fontWeight: 'bold',
              color: stringToColor(panelist.panelistName),
            }}
          >
            {panelist?.panelistDescription}
          </Typography>
        </div>
      )}
      <Paper
        square
        elevation={0}
        sx={{
          p: 3,
          whiteSpace: 'normal',
          wordWrap: 'break-word',
          backgroundColor: 'rgb(180, 180, 180)',
          paddingLeft: '10%',
          paddingRight: '5%',
          clipPath:
            'polygon(0% 0%, 100% 0%, 100% 100%, calc(0% + 1em) 100%, calc(0% + 1em) calc(0% + 1em), 0% 0%)',
          borderBottomRightRadius: '1em',
          borderTopRightRadius: '1em',
          borderRight: `solid 8px ${stringToColor(panelist.panelistName)}`,
        }}
        style={{ marginTop: 10, marginLeft: 10 }}
      >
        <pre
          style={{
            margin: 0,
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
            fontFamily: 'inherit',
            color: 'black',
          }}
        >
          {message.displayType === MessageDisplayType.TEXT
            ? formatMessage(message.message).trim()
            : ''}
          {message.displayType === MessageDisplayType.PENDING_MESSAGE && (
            <FadingText
              strings={['Reading...', 'Analyzing...', 'Getting opinionated...']}
            />
          )}
        </pre>
      </Paper>
      <DisplayOpenAiInfoButton
        chatMessage={message}
        setAiInfoToDisplay={setAiInfoToDisplay}
      />
    </div>
  );
}
