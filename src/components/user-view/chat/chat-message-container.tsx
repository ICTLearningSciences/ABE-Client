/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/

import React, { useRef, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@mui/material";
import type { AiServiceStepDataTypes } from "../../../ai-services/ai-service-types";
import type {
  ChatMessageTypes,
  MessageDisplayType,
  Sender,
} from "../../../store/slices/chat";
import { useWithChat } from "../../../store/slices/chat/use-with-chat";
import Message from "./message";

export function ChatMessagesContainer(props: {
  coachResponsePending: boolean;
  curDocId: string;
  setAiInfoToDisplay: (aiServiceStepData?: AiServiceStepDataTypes[]) => void;
  sendMessage: (message: ChatMessageTypes) => void;
  displayMarkdown: boolean;
}): React.ReactNode {
  const {
    coachResponsePending,
    curDocId,
    setAiInfoToDisplay,
    sendMessage,
    displayMarkdown,
  } = props;
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const [messageElements, setMessageElements] = useState<React.ReactNode[]>([]);
  const { state } = useWithChat();
  const messages = state.chatLogs[curDocId] || [];
  const chatMessages: ChatMessageTypes[] = [
    ...messages,
    ...(coachResponsePending
      ? [
          {
            id: "pending-message",
            message: "...",
            sender: "SYSTEM" as Sender,
            displayType: "PENDING_MESSAGE" as MessageDisplayType,
          },
        ]
      : []),
  ];
  const mostRecentChatId =
    chatMessages.length > 0 ? chatMessages[chatMessages.length - 1].id : "";

  function scrollToElementById(id: string) {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function scrollToMostRecentAiResponse() {
    const mostRecentAiResponse = getMostRecentAiResponse(chatMessages);
    if (mostRecentAiResponse) {
      scrollToElementById(mostRecentAiResponse.id);
    }
  }

  function getMostRecentAiResponse(
    messages: ChatMessageTypes[],
  ): ChatMessageTypes | undefined {
    // first, find the most recent user message, then find the most recent system message after that
    if (!messages || messages.length <= 1) return undefined;
    let mostRecentUserMessageIndex = -1;
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].sender === "USER") {
        mostRecentUserMessageIndex = i;
        break;
      }
    }
    if (mostRecentUserMessageIndex === -1) return undefined;
    for (let i = mostRecentUserMessageIndex; i < messages.length; i++) {
      if (messages[i].sender === "SYSTEM") {
        return messages[i];
      }
    }
    return undefined;
  }

  useEffect(() => {
    if (messageContainerRef.current) {
      scrollToMostRecentAiResponse();
    }
  }, [messageElements]);

  useEffect(() => {
    const _newMessageElements = chatMessages.map(
      (message: ChatMessageTypes, index: number) => {
        return (
          <>
            <Message
              key={index}
              message={message}
              setAiInfoToDisplay={setAiInfoToDisplay}
              messageIndex={index}
              displayMarkdown={displayMarkdown}
            />
            {message.mcqChoices && index === chatMessages.length - 1 && (
              <div
                key={`mcq-choices-${index}`}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "98%",
                  justifyContent: "flex-end",
                  alignItems: "flex-end",
                  margin: "10px",
                }}
              >
                {message.mcqChoices.map((choice: string, i: number) => {
                  return (
                    <Button
                      key={i}
                      variant="outlined"
                      style={{
                        marginBottom: "5px",
                      }}
                      data-cy={`mcq-choice-${choice.replaceAll(" ", "-")}`}
                      onClick={() => {
                        sendMessage({
                          id: uuidv4(),
                          message: choice,
                          sender: "USER",
                          displayType: "TEXT",
                          userInputType: "MCQ",
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
      },
    );
    setMessageElements(_newMessageElements);
  }, [chatMessages.length, mostRecentChatId, displayMarkdown]);

  return (
    <div
      ref={messageContainerRef}
      data-cy="messages-container"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        maxWidth: "100%",
        justifyContent: "flex-start",
        margin: "1rem",
        borderRadius: "1rem",
        overflowX: "hidden",
        overflowY: "auto",
        border: "1px solid black",
        position: "relative",
      }}
    >
      {messageElements}
    </div>
  );
}
