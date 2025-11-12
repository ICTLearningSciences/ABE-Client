import { TextField, Button } from '@mui/material';
import React, { useState } from 'react';
import {
  ChatMessageTypes,
  Sender,
  MessageDisplayType,
  UserInputType,
} from '../../../store/slices/chat';
import { v4 as uuidv4 } from 'uuid';

export function ChatInput(props: {
  sendMessage: (message: ChatMessageTypes) => void;
  disableInput: boolean;
}): JSX.Element {
  const { sendMessage } = props;
  const [message, setMessage] = useState<string>('');
  function handleSendUserMessage(message: string) {
    sendMessage({
      id: uuidv4(),
      message: message,
      sender: Sender.USER,
      displayType: MessageDisplayType.TEXT,
      userInputType: UserInputType.FREE_INPUT,
    });
    setMessage('');
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        width: '95%',
        justifyContent: 'space-around',
        alignItems: 'center',
        margin: '10px',
      }}
    >
      <TextField
        data-cy="chat-input"
        disabled={props.disableInput}
        fullWidth
        multiline
        placeholder={props.disableInput ? '' : 'Enter your response here...'}
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: 'fit-content',
          minHeight: '20px',
          width: '100%',
          justifyContent: 'space-around',
          alignItems: 'center',
          borderRadius: '2rem',
          marginRight: '10px',
          opacity: props.disableInput ? 0.3 : 1,
        }}
        value={message}
        maxRows={5}
        onChange={(e) => {
          setMessage(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            if (message) {
              handleSendUserMessage(message);
            }
          }
        }}
      />
      <Button
        variant="outlined"
        data-cy="send-input-button"
        disabled={props.disableInput}
        onClick={() => {
          handleSendUserMessage(message);
        }}
      >
        Send
      </Button>
    </div>
  );
}
