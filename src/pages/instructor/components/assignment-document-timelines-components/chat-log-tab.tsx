/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { ChatItem } from '../../../../types';
import { Sender } from '../../../../store/slices/chat';

interface ChatLogTabProps {
  chatLog: ChatItem[];
}

export const ChatLogTab: React.FC<ChatLogTabProps> = ({ chatLog }) => {
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
      <Typography variant="body2" sx={{ mb: 2, fontWeight: 500 }}>
        {chatLog.length} messages
      </Typography>

      {chatLog.map((item, index) => (
        <Box
          key={index}
          sx={{
            alignSelf: item.sender === Sender.USER ? 'flex-end' : 'flex-start',
            maxWidth: '80%',
          }}
        >
          <Paper
            sx={{
              p: 1.5,
              backgroundColor:
                item.sender === Sender.USER ? 'primary.main' : 'grey.100',
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
      ))}
    </Box>
  );
};
