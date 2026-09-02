/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/

import React, { useRef, useState, useEffect } from "react";
import Draggable from "react-draggable";
import { ToastContainer, toast } from "react-toastify";
import copy from "copy-to-clipboard";
import { v4 as uuidv4 } from "uuid";
import {
  Button,
  CardActions,
  Collapse,
  IconButton,
  List,
  ListSubheader,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import {
  Close,
  ContentPaste,
  DragHandle,
  ExpandLess,
  ExpandMore,
  History,
} from "@mui/icons-material";

import type { AiServiceStepDataTypes } from "../../../ai-services/ai-service-types";
import type {
  ChatMessageTypes,
  ChatLog,
  ChatHistory,
} from "../../../store/slices/chat";
import Message from "./message";
import { useWithPanels } from "../../../store/slices/panels/use-with-panels";
import { useAppSelector } from "../../../store/hooks";
import { useWithChat } from "../../../exported-files";
import { CssCard } from ".";
import { useWithWindowSize } from "../../../hooks/use-with-window-size";

export function ChatThread(props: {
  coachResponsePending: boolean;
  chatLog: ChatLog;
  curDocId: string;
  setAiInfoToDisplay: (aiServiceStepData?: AiServiceStepDataTypes[]) => void;
  sendMessage: (message: ChatMessageTypes) => void;
}): React.ReactNode {
  const { coachResponsePending, setAiInfoToDisplay, sendMessage } = props;
  const { activePanel, panelists } = useWithPanels();
  const activePanelists = useAppSelector(
    (state) => state.panels.activePanelists,
  );
  const messageContainerRef = useRef<HTMLDivElement>(null);
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
        return !activePanelists || activePanelists.includes(panelist.clientId);
      }
      return true;
    },
  );
  const messageElements = chatMessages.map(
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

  function scrollToElementById(id: string) {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
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
  }, [pingRef]);

  useEffect(() => {
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
    addMessagesWithDelay();
  }, [chatMessages, viewedMessages, pingRef]);

  useEffect(() => {
    if (messageContainerRef.current) {
      const msg = chatMessages.find(
        (m) => m.id === viewedMessages[viewedMessages.length - 1],
      );
      scrollToElementById(msg?.id || "message-end-ref");
    }
  }, [chatMessages.length, viewedMessages.length, messageElements.length]);

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

export function ChatHistoryLog(props: { c: ChatHistory }): React.ReactNode {
  const { c } = props;
  const { userDocs } = useAppSelector((state) => state.state);
  const { activePanel, panelists } = useWithPanels();
  const [collapsed, setCollapsed] = useState<boolean>(false);

  const activePanelists = useAppSelector(
    (state) => state.panels.activePanelists,
  );
  const doc = userDocs.find((d) => d.googleDocId === c.docId);
  const chatMessages: ChatMessageTypes[] = [...(c.chatLog || [])].filter(
    (m) => {
      const panelist = panelists.find(
        (p) =>
          activePanel?.panelists?.includes(p.clientId) &&
          p.panelistName === m.systemCustomName,
      );
      if (panelist) {
        return !activePanelists || activePanelists.includes(panelist.clientId);
      }
      return true;
    },
  );

  return (
    <div id={`${c.sessionId}-${c.docId}`}>
      <ListSubheader
        className="row header center-div"
        style={{
          color: "white",
          padding: 5,
          paddingLeft: 10,
          paddingRight: 10,
          border: "2px solid rgb(87, 119, 82)",
        }}
      >
        <Typography>{doc?.title}</Typography>
        <div style={{ minWidth: 5, flexGrow: 1 }} />
        <Typography>{c.startDate}</Typography>
        <IconButton
          style={{ color: "white" }}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ExpandMore /> : <ExpandLess />}
        </IconButton>
      </ListSubheader>
      <Collapse in={!collapsed} style={{ backgroundColor: "rgb(80, 80, 80)" }}>
        {chatMessages.map((m, i) => {
          return (
            <div key={i} className="row">
              <Message
                viewed
                message={m}
                messageIndex={i}
                setAiInfoToDisplay={() => {}}
              />
              <IconButton
                onClick={() => {
                  copy(m.message);
                  toast("Copied to clipboard!");
                }}
              >
                <ContentPaste fontSize="small" sx={{ color: "gray" }} />
              </IconButton>
            </div>
          );
        })}
      </Collapse>
    </div>
  );
}

export function ChatHistory(props: {
  open: boolean;
  onClose: () => void;
}): React.ReactNode {
  const { chatHistory } = useAppSelector((state) => state.chat);
  const { userDocs } = useAppSelector((state) => state.state);
  const { height, width } = useWithWindowSize();
  const { clearChatHistory } = useWithChat();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  function scrollToElementById(id: string) {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  const nodeRef = useRef(null);
  if (!props.open) return <div />;
  return (
    <Draggable nodeRef={nodeRef}>
      <div
        ref={nodeRef}
        style={{
          position: "absolute",
          zIndex: 9998,
          top: 100,
          right: width - 500,
          width: 450,
          padding: 20,
          background:
            "radial-gradient(circle,rgba(255, 255, 255, 0.2) 50%, rgba(200, 200, 200, 0.05) 100%)",
          boxShadow: "-5px 5px 10px 0px rgba(0, 0, 0, 0.2)",
        }}
      >
        <CssCard
          title="Chat History"
          icon={<DragHandle style={{ cursor: "pointer" }} />}
          headerButton={
            <div className="row center-div">
              <IconButton
                onClick={(e) => setAnchorEl(e.currentTarget)}
                style={{ color: "white" }}
              >
                <History />
              </IconButton>
              <IconButton onClick={props.onClose} style={{ color: "white" }}>
                <Close />
              </IconButton>
            </div>
          }
        >
          <List
            className="column spacing"
            sx={{
              padding: 0,
              overflowX: "hidden",
              overflowY: "auto",
              maxHeight: height - 450,
            }}
          >
            {chatHistory.map((c, i) => (
              <ChatHistoryLog c={c} key={i} />
            ))}
          </List>
          <CardActions className="row center-div">
            <Button color="secondary" onClick={clearChatHistory}>
              Clear chat history
            </Button>
          </CardActions>
        </CssCard>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          style={{ zIndex: 9999 }}
        >
          {chatHistory.map((c, i) => {
            const doc = userDocs.find((d) => d.googleDocId === c.docId);
            return (
              <MenuItem
                key={i}
                className="row"
                style={{ justifyContent: "space-between", minWidth: 200 }}
                onClick={() => {
                  scrollToElementById(`${c.sessionId}-${c.docId}`);
                  setAnchorEl(null);
                }}
              >
                {doc?.title} - {c.startDate}
              </MenuItem>
            );
          })}
        </Menu>
        <ToastContainer />
      </div>
    </Draggable>
  );
}
