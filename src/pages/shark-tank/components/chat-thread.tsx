import React from 'react';
import { Button } from '@mui/material';
import { useRef, useState, useEffect } from 'react';
import { AiServiceStepDataTypes } from '../../../ai-services/ai-service-types';
import {
  ChatMessageTypes,
  Sender,
  MessageDisplayType,
  UserInputType,
  ChatLog,
} from '../../../store/slices/chat';
import Message from './message';
import { v4 as uuidv4 } from 'uuid';

export function ChatThread(props: {
  coachResponsePending: boolean;
  chatLog: ChatLog;
  curDocId: string;
  setAiInfoToDisplay: (aiServiceStepData?: AiServiceStepDataTypes[]) => void;
  sendMessage: (message: ChatMessageTypes) => void;
}): JSX.Element {
  const { coachResponsePending, setAiInfoToDisplay, sendMessage } = props;
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const [messageElements, setMessageElements] = useState<JSX.Element[]>([]);
  const [mostRecentChatIdx, setMostRecentChatIdx] = useState<number>(0);
  const [pingRef, setPingRef] = useState<number>();

  const chatMessages: ChatMessageTypes[] = [
    ...props.chatLog,
    ...(coachResponsePending
      ? [
          {
            id: 'pending-message',
            message: '...',
            sender: Sender.SYSTEM,
            displayType: MessageDisplayType.PENDING_MESSAGE,
          },
        ]
      : []),
  ];

  function scrollToElementById(id: string) {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  async function addMessagesWithDelay() {
    if (chatMessages.length < mostRecentChatIdx) {
      setMostRecentChatIdx(0);
      return;
    }
    if (pingRef || mostRecentChatIdx === chatMessages.length - 1) return;
    setPingRef(1);
    if (mostRecentChatIdx < chatMessages.length - 1) {
      const msg = chatMessages[mostRecentChatIdx + 1];
      setMostRecentChatIdx(mostRecentChatIdx + 1);
      setTimeout(
        () => setPingRef(undefined),
        msg.message.split(' ').length * 100
      );
    }
  }

  useEffect(() => {
    if (messageContainerRef.current) {
      scrollToElementById('message-end-ref');
    }
  }, [messageElements]);

  useEffect(() => {
    const _newMessageElements = [];
    for (let index = 0; index < chatMessages.length; index++) {
      const message = chatMessages[index];
      _newMessageElements.push(
        <>
          <Message
            key={index}
            message={message}
            setAiInfoToDisplay={setAiInfoToDisplay}
            messageIndex={index}
            latestMessageIndex={mostRecentChatIdx}
          />
          {message.mcqChoices && index === chatMessages.length - 1 && (
            <div
              key={`mcq-choices-${index}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                width: '98%',
                justifyContent: 'flex-end',
                alignItems: 'flex-end',
                margin: '10px',
              }}
            >
              {message.mcqChoices.map((choice: string, i: number) => {
                return (
                  <Button
                    key={i}
                    variant="outlined"
                    style={{
                      marginBottom: '5px',
                    }}
                    data-cy={`mcq-choice-${choice.replaceAll(' ', '-')}`}
                    onClick={() => {
                      sendMessage({
                        id: uuidv4(),
                        message: choice,
                        sender: Sender.USER,
                        displayType: MessageDisplayType.TEXT,
                        userInputType: UserInputType.MCQ,
                      });
                      if (message.retryFunction) {
                        message.retryFunction();
                      }
                    }}
                  >
                    {choice}
                  </Button>
                );
              })}
            </div>
          )}
        </>
      );
    }
    setMessageElements(_newMessageElements);
  }, [chatMessages.length, mostRecentChatIdx]);

  useEffect(() => {
    addMessagesWithDelay();
  }, [chatMessages.length, pingRef]);

  return (
    <div
      ref={messageContainerRef}
      data-cy="messages-container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        maxWidth: '100%',
        justifyContent: 'flex-start',
        margin: '1rem',
        borderRadius: '1rem',
        overflowX: 'hidden',
        overflowY: 'auto',
        border: '1px solid black',
        position: 'relative',
      }}
    >
      {messageElements}
      <div id="message-end-ref" />
    </div>
  );
}
