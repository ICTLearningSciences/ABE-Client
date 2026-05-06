import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import rehypeRaw from 'rehype-raw';
import { Avatar, Paper, Typography } from '@mui/material';
import {
  ChatMessageTypes,
  MessageDisplayType,
  Sender,
} from '../../../store/slices/chat';
import { AiServiceStepDataTypes } from '../../../ai-services/ai-service-types';
import { useWithPanels } from '../../../store/slices/panels/use-with-panels';
import { stringAvatar, stringToColor } from '../helpers';
import BaseMessage, {
  DisplayOpenAiInfoButton,
  FadingText,
} from '../../../components/user-view/chat/message';

export default function Message(props: {
  message: ChatMessageTypes;
  messageIndex: number;
  viewed?: boolean;
  setAiInfoToDisplay: (aiInfo?: AiServiceStepDataTypes[]) => void;
  onClicked?: (id: string) => void;
}): JSX.Element {
  const { activePanel, panelists } = useWithPanels();
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
        displayMarkdown={true}
      />
    );
  }
  if (!props.viewed) {
    return (
      <div
        id={message.id}
        style={{
          position: 'relative',
          margin: 10,
        }}
      >
        <Typography
          style={{ fontSize: 12, color: stringToColor(panelist.panelistName) }}
        >
          <FadingText
            strings={[
              `${panelist.panelistName} is thinking...`,
              `${panelist.panelistName} is typing...`,
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
          <ReactMarkdown
            remarkPlugins={[remarkBreaks]}
            rehypePlugins={[rehypeRaw]}
            components={{
              h1: ({ children }) => (
                <h1
                  style={{ marginTop: '0', marginBottom: '0', lineHeight: '1' }}
                >
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 style={{ marginTop: '0', marginBottom: '0' }}>
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 style={{ marginTop: '0', marginBottom: '0' }}>
                  {children}
                </h3>
              ),
              h4: ({ children }) => (
                <h4 style={{ marginTop: '0', marginBottom: '0' }}>
                  {children}
                </h4>
              ),
              h5: ({ children }) => (
                <h5 style={{ marginTop: '0', marginBottom: '0' }}>
                  {children}
                </h5>
              ),
              h6: ({ children }) => (
                <h6 style={{ marginTop: '0', marginBottom: '0' }}>
                  {children}
                </h6>
              ),
              p: ({ children }) => (
                <p
                  style={{ marginTop: '0', marginBottom: '0', lineHeight: '1' }}
                >
                  {children}
                </p>
              ),
              li: ({ children }) => (
                <li
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    marginTop: '0',
                    marginBottom: '0',
                  }}
                >
                  {children}
                </li>
              ),
              ul: ({ children }) => (
                <ul
                  style={{
                    marginTop: '0',
                    marginBottom: '0',
                    lineHeight: '1',
                    paddingLeft: '10px',
                  }}
                >
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol
                  style={{
                    marginTop: '0',
                    marginBottom: '0',
                    lineHeight: '1',
                    paddingLeft: '10px',
                  }}
                >
                  {children}
                </ol>
              ),
            }}
          >
            {message.displayType === MessageDisplayType.TEXT
              ? formatMessage(message.message).trim()
              : ''}
          </ReactMarkdown>
        </pre>
      </Paper>
      <DisplayOpenAiInfoButton
        chatMessage={message}
        setAiInfoToDisplay={setAiInfoToDisplay}
      />
    </div>
  );
}
