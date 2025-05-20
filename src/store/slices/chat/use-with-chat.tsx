/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { useAppSelector, useAppDispatch } from '../../hooks';
import {
  ChatState,
  addMessage,
  addMessages,
  setCoachResponsePending,
  clearChat,
  ChatMessageTypes,
  updateSystemPrompt,
} from '.';

interface UseWithChat {
  state: ChatState;
  sendMessage: (
    msg: ChatMessageTypes,
    clearChat: boolean,
    docId: string
  ) => void;
  sendMessages: (
    msgs: ChatMessageTypes[],
    clearChat: boolean,
    docId: string
  ) => void;
  coachResponsePending: (waiting: boolean) => void;
  clearChatLog: (docId: string) => void;
  chatLogToString: (docId: string) => string;
  setSystemRole: (prompt: string) => void;
  downloadChatLog: (docId: string) => void;
}

export function useWithChat(): UseWithChat {
  const dispatch = useAppDispatch();
  const chatState: ChatState = useAppSelector((state) => state.chat);
  const currentDoc = useAppSelector((state) => state.state.curDocId);

  function sendMessage(
    msg: ChatMessageTypes,
    clearChat = false,
    docId: string
  ) {
    dispatch(addMessage({ message: msg, clearChat, docId }));
  }

  function sendMessages(
    msgs: ChatMessageTypes[],
    clearChat = false,
    docId: string
  ) {
    dispatch(addMessages({ messages: msgs, clearChat, docId }));
  }

  function coachResponsePending(pending: boolean) {
    dispatch(setCoachResponsePending(pending));
  }

  function clearChatLog(docId: string) {
    dispatch(clearChat(docId));
  }

  function setSystemRole(prompt: string) {
    dispatch(updateSystemPrompt(prompt));
  }

  function chatLogToString(docId: string) {
    const chatLog = chatState.chatLogs[docId];
    let chatLogString = '';
    for (let i = 0; i < chatLog.length; i++) {
      const tokenUsage =
        chatLog[i].aiServiceStepData?.[0].tokenUsage.totalUsage;
      chatLogString += `${chatLog[i].sender}${
        tokenUsage ? ` (Token Usage: ${tokenUsage})` : ''
      }: ${chatLog[i].message}\n`;
    }
    return chatLogString;
  }

  function downloadChatLog(docId?: string) {
    let chatLog = chatLogToString(docId || currentDoc);
    const totalTokenUsage = chatState.chatLogs[docId || currentDoc].reduce(
      (acc, chatLogItem) => {
        return (
          acc + (chatLogItem.aiServiceStepData?.[0].tokenUsage.totalUsage || 0)
        );
      },
      0
    );
    chatLog += `\nTotal Token Usage: ${totalTokenUsage}`;
    const element = document.createElement('a');
    const file = new Blob([chatLog], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'chat-log.txt';
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  }

  return {
    state: chatState,
    sendMessage,
    sendMessages,
    coachResponsePending,
    clearChatLog,
    chatLogToString,
    setSystemRole,
    downloadChatLog,
  };
}
