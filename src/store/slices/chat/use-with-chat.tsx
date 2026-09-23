/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/

import { useAppSelector, useAppDispatch } from "../../hooks";
import {
  type ChatState,
  type ChatMessageTypes,
  addMessage,
  addMessages,
  setCoachResponsePending,
  clearChat,
  updateSystemPrompt,
  clearHistory,
} from ".";
import { useWithState } from "../../../exported-files";

export interface UseWithChat {
  state: ChatState;
  sendMessage: (
    msg: ChatMessageTypes,
    clearChat: boolean,
    docId: string,
  ) => void;
  sendMessages: (
    msgs: ChatMessageTypes[],
    clearChat: boolean,
    docId: string,
  ) => void;
  coachResponsePending: (waiting: boolean) => void;
  clearChatLog: (docId: string) => void;
  clearChatHistory: () => void;
  chatLogToString: (docId: string) => string;
  setSystemRole: (prompt: string) => void;
  downloadChatLog: (docId: string) => void;
}

export function useWithChat(): UseWithChat {
  const dispatch = useAppDispatch();
  const chatState: ChatState = useAppSelector((state) => state.chat);
  const { userDocs, sessionId, curDocId } = useAppSelector(
    (state) => state.state,
  );
  const { activity, activePanel, panels } = useAppSelector(
    (state) => state.panels,
  );
  const { builtActivities } = useAppSelector(
    (state) => state.docGoalsActivities,
  );
  const { newSession } = useWithState();

  function sendMessage(
    msg: ChatMessageTypes,
    clearChat = false,
    docId: string,
  ) {
    dispatch(
      addMessage({
        message: msg,
        clearChat,
        docId,
        docTitle: userDocs.find(
          (d) => d.googleDocId === curDocId || d.wordDocId === curDocId,
        )?.title,
        sessionId,
        activityId: activity,
        activityTitle: builtActivities.find((a) => a._id === activity)?.title,
        panelId: activePanel,
        panelTitle: panels.find((p) => p.clientId === activePanel)?.panelName,
      }),
    );
  }

  function sendMessages(
    msgs: ChatMessageTypes[],
    clearChat = false,
    docId: string,
  ) {
    dispatch(addMessages({ messages: msgs, clearChat, docId, sessionId }));
  }

  function coachResponsePending(pending: boolean) {
    dispatch(setCoachResponsePending(pending));
  }

  function clearChatLog(docId: string) {
    newSession();
    dispatch(clearChat(docId));
  }

  function clearChatHistory() {
    dispatch(clearHistory());
  }

  function setSystemRole(prompt: string) {
    dispatch(updateSystemPrompt(prompt));
  }

  function chatLogToString(docId: string) {
    const chatLog = chatState.chatLogs[docId];
    let chatLogString = "";
    for (let i = 0; i < chatLog.length; i++) {
      const tokenUsage =
        chatLog[i].aiServiceStepData?.[0].tokenUsage.totalUsage;
      chatLogString += `${chatLog[i].sender}${
        tokenUsage ? ` (Token Usage: ${tokenUsage})` : ""
      }: ${chatLog[i].message}\n`;
    }
    return chatLogString;
  }

  function downloadChatLog(docId?: string) {
    let chatLog = chatLogToString(docId || curDocId);
    const totalTokenUsage = chatState.chatLogs[docId || curDocId].reduce(
      (acc, chatLogItem) => {
        return (
          acc + (chatLogItem.aiServiceStepData?.[0].tokenUsage.totalUsage || 0)
        );
      },
      0,
    );
    chatLog += `\nTotal Token Usage: ${totalTokenUsage}`;
    const element = document.createElement("a");
    const file = new Blob([chatLog], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "chat-log.txt";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  }

  return {
    state: chatState,
    sendMessage,
    sendMessages,
    coachResponsePending,
    clearChatLog,
    clearChatHistory,
    chatLogToString,
    setSystemRole,
    downloadChatLog,
  };
}
