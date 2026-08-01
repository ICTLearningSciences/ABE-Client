/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/

import React, { useRef, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@mui/material";
import type { AiServiceStepDataTypes } from "../../../ai-services/ai-service-types";
import type { ChatMessageTypes, ChatLog } from "../../../store/slices/chat";
import Message from "./message";
import { useWithPanels } from "../../../store/slices/panels/use-with-panels";

export function ChatThread(props: {
  coachResponsePending: boolean;
  chatLog: ChatLog;
  curDocId: string;
  setAiInfoToDisplay: (aiServiceStepData?: AiServiceStepDataTypes[]) => void;
  sendMessage: (message: ChatMessageTypes) => void;
}): React.ReactNode {
  const { coachResponsePending, setAiInfoToDisplay, sendMessage } = props;
  const { activePanel, activePanelist, panelists } = useWithPanels();
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const [messageElements, setMessageElements] = useState<React.ReactNode[]>([]);
  const [viewedMessages, setViewedMessages] = useState<string[]>([]);
  const [pingRef, setPingRef] = useState<NodeJS.Timeout>();

  const chatMessages: ChatMessageTypes[] = [...(props.chatLog || [])].filter(
    (m) => {
      const panelist = panelists.find(
        (p) =>
          activePanel?.panelists?.includes(p.clientId) &&
          p.panelistName === m.systemCustomName,
      );
      if (panelist) {
        return !activePanelist || activePanelist.clientId === panelist.clientId;
      }
      return true;
    },
  );

  function scrollToElementById(id: string) {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  async function addMessagesWithDelay() {
    if (pingRef) return;
    const unviewedMessage = chatMessages.find(
      (m) => !viewedMessages.includes(m.id),
    );
    if (!unviewedMessage) return;
    const timeoutId = setTimeout(
      () => {
        setPingRef(undefined);
      },
      unviewedMessage.message.split(" ").length * 100,
    );
    setPingRef(timeoutId);
    setViewedMessages([...viewedMessages, unviewedMessage.id]);
  }

  function onClickMessage(id: string) {
    if (!viewedMessages.includes(id)) {
      setViewedMessages([...viewedMessages, id]);
    }
  }

  useEffect(() => {
    return () => {
      if (pingRef) {
        clearTimeout(pingRef);
      }
    };
  }, []);

  useEffect(() => {
    addMessagesWithDelay();
  }, [chatMessages.length, pingRef]);

  useEffect(() => {
    if (messageContainerRef.current) {
      const msg = chatMessages.find(
        (m) => m.id === viewedMessages[viewedMessages.length - 1],
      );
      scrollToElementById(msg?.id || "message-end-ref");
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
              viewed={viewedMessages.includes(message.id)}
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
                      color="secondary"
                      style={{
                        borderWidth: "2px",
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
  }, [chatMessages.length, viewedMessages]);

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
      {coachResponsePending && (
        <Message
          key={chatMessages.length}
          message={{
            id: "pending-message",
            message: "...",
            sender: "SYSTEM",
            displayType: "PENDING_MESSAGE",
          }}
          setAiInfoToDisplay={setAiInfoToDisplay}
          messageIndex={chatMessages.length}
          onClicked={onClickMessage}
        />
      )}
      <div id="message-end-ref" />
    </div>
  );
}
