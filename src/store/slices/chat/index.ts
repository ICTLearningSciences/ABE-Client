/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Activity, DocGoal } from "../../../types";
import type {
  AiServiceStepDataTypes,
  Source,
} from "../../../ai-services/ai-service-types";

export type Sender = "USER" | "SYSTEM";
export type MessageDisplayType = "TEXT" | "PENDING_MESSAGE";
export type UserInputType = "FREE_INPUT" | "MCQ" | "NONE";

export interface ChatMessage {
  id: string;
  sender: Sender;
  displayType: MessageDisplayType;
  systemCustomName?: string;
  aiServiceStepData?: AiServiceStepDataTypes[];
  mcqChoices?: string[];
  selectActivities?: Activity[];
  disableUserInput?: boolean;
  selectedGoal?: DocGoal;
  userInputType?: UserInputType;
  retryFunction?: () => void;
}

export type ChatMessageTypes =
  TextMessage | BulletPointMessage | PendingMessage;

export interface PendingMessage extends ChatMessage {
  message: string;
}

export interface TextMessage extends ChatMessage {
  message: string;
  sources?: Source[];
}

export interface BulletPointMessage extends ChatMessage {
  message: string;
  bulletPoints: string[];
}

export type ChatLog = ChatMessageTypes[];
export type GoogleDocId = string;

export interface ChatHistory {
  docId: GoogleDocId;
  sessionId: string;
  chatLog: ChatLog;
  startDate: string;
}

export interface ChatState {
  chatLogs: Record<GoogleDocId, ChatLog>;
  chatHistory: ChatHistory[];
  coachResponsePending: boolean;
  systemRole: string;
}

const initialState: ChatState = {
  chatLogs: {},
  chatHistory: [],
  coachResponsePending: false,
  systemRole: "",
};

/** Reducer */

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    updateSystemPrompt: (state: ChatState, action: PayloadAction<string>) => {
      state.systemRole = action.payload;
    },
    addMessage: (
      state: ChatState,
      action: PayloadAction<{
        message: ChatMessageTypes;
        clearChat: boolean;
        docId: string;
        sessionId: string;
      }>,
    ) => {
      const { message, clearChat, docId, sessionId } = action.payload;
      const historyIdx = state.chatHistory.findIndex(
        (c) => c.sessionId === sessionId && c.docId === docId,
      );
      if (historyIdx === -1) {
        state.chatHistory.push({
          docId: docId,
          sessionId: sessionId,
          chatLog: [message],
          startDate: new Date().toLocaleString(),
        });
      } else {
        state.chatHistory[historyIdx].chatLog.push(message);
      }
      if (clearChat) {
        state.chatLogs = {
          ...state.chatLogs,
          [docId]: [],
        };
      }
      if (message.sender === "SYSTEM") {
        state.coachResponsePending = false;
      }
      if (!message) return;
      const messages = state.chatLogs[docId] || [];
      const mostRecentMessage = state.chatLogs[docId]?.slice(-1)[0];
      // TODO FIX: This is a hack to prevent duplicate messages from being added to the chat log
      if (
        messages.length <= 3 &&
        message.sender === "SYSTEM" &&
        mostRecentMessage?.message === message.message
      ) {
        return;
      }
      state.chatLogs = {
        ...state.chatLogs,
        [docId]: [...(state.chatLogs[docId] || []), message],
      };
    },
    addMessages: (
      state: ChatState,
      action: PayloadAction<{
        messages: ChatMessageTypes[];
        clearChat: boolean;
        docId: string;
        sessionId: string;
      }>,
    ) => {
      const { messages, clearChat, docId, sessionId } = action.payload;
      const historyIdx = state.chatHistory.findIndex(
        (c) => c.sessionId === sessionId,
      );
      if (historyIdx === -1) {
        state.chatHistory.push({
          docId: docId,
          sessionId: sessionId,
          chatLog: messages,
          startDate: new Date().toLocaleString(),
        });
      } else {
        state.chatHistory[historyIdx].chatLog.push(...messages);
      }
      if (clearChat) {
        state.chatLogs = {
          ...state.chatLogs,
          [docId]: [],
        };
      }
      state.chatLogs = {
        ...state.chatLogs,
        [docId]: [...(state.chatLogs[docId] || []), ...messages],
      };
    },
    clearChat: (state: ChatState, action: PayloadAction<string>) => {
      const docId = action.payload;
      state.chatLogs = {
        ...state.chatLogs,
        [docId]: [],
      };
    },
    clearHistory: (state: ChatState) => {
      state.chatHistory = [];
    },
    setCoachResponsePending: (
      state: ChatState,
      action: PayloadAction<boolean>,
    ) => {
      state.coachResponsePending = action.payload;
    },
  },
});

export const {
  addMessage,
  addMessages,
  setCoachResponsePending,
  clearChat,
  clearHistory,
  updateSystemPrompt,
} = chatSlice.actions;

export default chatSlice.reducer;
