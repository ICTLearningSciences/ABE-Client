/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { SmartToy, Person } from '@mui/icons-material';
import { ChatItem } from '../../../../types';
import { Sender } from '../../../../store/slices/chat';

interface ChatLogTabProps {
  chatLog: ChatItem[];
  studentName: string;
}

const getSenderInfo = (sender: Sender, studentName: string) => {
  switch (sender) {
    case Sender.SYSTEM:
      return { icon: SmartToy, label: 'AI' };
    case Sender.USER:
      return { icon: Person, label: studentName };
    default:
      return { icon: Person, label: studentName };
  }
};

export const ChatLogTab: React.FC<ChatLogTabProps> = ({
  chatLog,
  studentName,
}) => {
  if (!chatLog?.length) {
    return (
      <Typography color="text.secondary" sx={{ fontStyle: 'italic' }}>
        No chat messages available
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        overflow: 'auto',
        height: '100%',
      }}
      data-cy="chat-log-tab"
    >
      {chatLog.map((item, index) => {
        const { icon: SenderIcon, label } = getSenderInfo(
          item.sender,
          studentName
        );

        return (
          <Box
            key={index}
            sx={{
              alignSelf:
                item.sender === Sender.USER ? 'flex-end' : 'flex-start',
              maxWidth: '80%',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                mb: 0.5,
                justifyContent:
                  item.sender === Sender.USER ? 'flex-end' : 'flex-start',
              }}
            >
              <SenderIcon
                sx={{
                  fontSize: 16,
                  color:
                    item.sender === Sender.USER
                      ? 'primary.main'
                      : 'text.secondary',
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  color:
                    item.sender === Sender.USER
                      ? 'primary.main'
                      : 'text.secondary',
                  fontWeight: 500,
                }}
              >
                {label}
              </Typography>
            </Box>
            <Paper
              sx={{
                p: 1.5,
                backgroundColor:
                  item.sender === Sender.USER ? 'primary.light' : 'grey.100',
                color: item.sender === Sender.USER ? 'white' : 'text.primary',
                borderRadius: 2,
                overflow: 'auto',
              }}
            >
              <Typography
                variant="body2"
                sx={{ whiteSpace: 'pre-wrap', overflow: 'auto' }}
              >
                {item.message}
              </Typography>
            </Paper>
          </Box>
        );
      })}
    </Box>
  );
};
