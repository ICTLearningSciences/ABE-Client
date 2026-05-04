/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React, { useState, useEffect } from 'react';
import {
  ListItem,
  Grid,
  Avatar,
  Typography,
  Paper,
  keyframes,
} from '@mui/material';
import { stringAvatar } from './chat-thread';
import {
  ChatMessageTypes,
  MessageDisplayType,
  Sender,
} from '../../../store/slices/chat';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

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
      style={{
        opacity: 0,
        transition: 'opacity 1s ease-in-out',
        animation:
          fadeState === 'fading-in'
            ? `${fadeIn} 1s ease-in-out forwards`
            : fadeState === 'fading-out'
            ? `${fadeOut} 1s ease-in-out forwards`
            : '',
      }}
    >
      {strings[currentStringIndex]}
    </div>
  );
};

export default function Message(props: {
  message: ChatMessageTypes;
}): JSX.Element {
  const { message } = props;
  const otherMessage = message.sender !== Sender.USER;

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

  return (
    <ListItem key={message.id} style={{ position: 'relative' }}>
      <Grid container style={{ width: '100%' }}>
        {otherMessage && (
          <Grid xs="auto">
            <Avatar
              {...stringAvatar(message.systemCustomName || '')}
              style={{ marginRight: 10 }}
            />
          </Grid>
        )}
        {otherMessage && (
          <Grid>
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <Typography style={{ fontWeight: 'bold' }}>
                {message.systemCustomName}
              </Typography>
              {/* <Typography color="secondary" style={{ fontWeight: "bold" }}>
                {message.senderTitle?.toUpperCase()}
              </Typography>
              <Typography>{message.sentAt?.toLocaleTimeString()}</Typography> */}
            </div>
            {/* <Typography color="primary" style={{ fontSize: 14 }}>
              {c.messageType}
            </Typography> */}
          </Grid>
        )}
        <Grid xs={12}>
          <Paper
            square
            elevation={0}
            sx={{
              p: 3,
              whiteSpace: 'normal',
              wordWrap: 'break-word',
              backgroundColor: otherMessage
                ? 'rgb(180, 180, 180)'
                : 'rgb(18, 57, 86)',
              paddingLeft: otherMessage ? '10%' : '5%',
              paddingRight: otherMessage ? '5%' : '10%',
              clipPath: otherMessage
                ? 'polygon(0% 0%, 100% 0%, 100% 100%, calc(0% + 1em) 100%, calc(0% + 1em) calc(0% + 1em), 0% 0%)'
                : 'polygon(0% 0%, 100% 0%, calc(100% - 1em) calc(0% + 1em), calc(100% - 1em) 100%, 0% 100%, 0% 0%)',
              borderBottomLeftRadius: otherMessage ? 0 : '1em',
              borderTopLeftRadius: otherMessage ? 0 : '1em',
              borderBottomRightRadius: otherMessage ? '1em' : 0,
              borderTopRightRadius: otherMessage ? '1em' : 0,
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
                color: otherMessage ? 'black' : 'white',
              }}
            >
              {message.displayType === MessageDisplayType.TEXT
                ? formatMessage(message.message).trim()
                : ''}
              {message.displayType === MessageDisplayType.PENDING_MESSAGE && (
                <FadingText
                  strings={[
                    'Reading...',
                    'Analyzing...',
                    'Getting opinionated...',
                  ]}
                />
              )}
            </pre>
          </Paper>
        </Grid>
      </Grid>
    </ListItem>
  );
}
