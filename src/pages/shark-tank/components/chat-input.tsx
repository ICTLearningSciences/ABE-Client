import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@mui/material';
import {
  ChatMessageTypes,
  Sender,
  MessageDisplayType,
  UserInputType,
} from '../../../store/slices/chat';
import { CssTextField } from '.';
import { Send } from '@mui/icons-material';

export function ChatInput(props: {
  sendMessage: (message: ChatMessageTypes) => void;
  disableInput: boolean;
}): JSX.Element {
  const { sendMessage } = props;
  const [message, setMessage] = React.useState<string>('');
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
    <div className="row spacing" style={{ width: '100%', padding: 10 }}>
      <CssTextField
        fullWidth
        multiline
        maxRows={5}
        value={message}
        disabled={props.disableInput}
        placeholder={props.disableInput ? '' : 'Enter your response here...'}
        onChange={(e) => setMessage(e.target.value)}
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
        variant="contained"
        disabled={props.disableInput}
        style={{ width: 150 }}
        endIcon={<Send />}
        onClick={() => {
          handleSendUserMessage(message);
        }}
      >
        Send
      </Button>
    </div>
  );
}
