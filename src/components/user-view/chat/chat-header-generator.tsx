/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/

import React from "react";
import { Button, Divider } from "@mui/material";
import {
  Construction,
  Replay,
  Download,
  Visibility,
  VisibilityOff,
  Description,
} from "@mui/icons-material";

import { ChatHeader, ColumnDiv, RowDiv } from "../../../styled-components";
import type { DocGoal, ActivityTypes } from "../../../types";
import { useAppSelector } from "../../../store/hooks";
import { useWithChat } from "../../../store/slices/chat/use-with-chat";
import { useWithWindowSize } from "../../../hooks/use-with-window-size";

export function ChatHeaderGenerator(props: {
  incrementActivityCounter: () => void;
  editDocGoal: () => void;
  selectedGoal?: DocGoal;
  selectedActivity?: ActivityTypes;
  disableActivitySelector?: boolean;
  displayMarkdown: boolean;
  setDisplayMarkdown: (displayMarkdown: boolean) => void;
  setToDocView: () => void;
}): React.ReactNode {
  const {
    incrementActivityCounter,
    editDocGoal,
    selectedGoal,
    selectedActivity,
    disableActivitySelector,
    displayMarkdown,
    setDisplayMarkdown,
    setToDocView,
  } = props;
  const viewingAdvancedOptions = useAppSelector(
    (state) => state.state.viewingAdvancedOptions,
  );
  const { downloadChatLog } = useWithChat();
  const { isMobile, width: screenWidth } = useWithWindowSize();
  let title = selectedGoal?.title || "";
  title += selectedGoal && selectedActivity ? " - " : "";
  title += selectedActivity?.title || "";
  if (!title) title = "Coach";
  return (
    <ChatHeader
      style={{
        width: "100%",
      }}
    >
      <ColumnDiv
        style={{
          width: "100%",
        }}
      >
        <RowDiv
          style={{
            width: "100%",
            justifyContent: "space-around",
            marginBottom: "10px",
          }}
        >
          <Button
            onClick={setToDocView}
            style={{
              flex: 0.2,
              display: isMobile ? "flex" : "none",
              fontSize: screenWidth < 500 ? "10px" : "12px",
            }}
            variant="contained"
          >
            {" "}
            <Description
              sx={{ fontSize: screenWidth < 500 ? "16px" : "20px" }}
            />{" "}
            Document{" "}
          </Button>
          <span
            style={{ textAlign: "center", marginBottom: "10px", flex: 1 }}
            data-cy="chat-header"
          >
            {title}
          </span>
          <div style={{ flex: 0.2 }}></div>
        </RowDiv>

        <Divider />
        <RowDiv
          style={{
            width: "100%",
            justifyContent: "space-around",
          }}
        >
          {!disableActivitySelector && (
            <Button
              data-cy="edit-goal-button"
              onClick={editDocGoal}
              style={{
                padding: 3,
                marginBottom: 5,
                marginLeft: 5,
                gap: "5px",
                flex: 1,
                fontSize: "12px",
                width: "fit-content",
              }}
            >
              <Construction
                sx={{
                  fontSize: "20px",
                }}
              />{" "}
              Edit Goal/Activity
            </Button>
          )}
          <Divider orientation="vertical" flexItem />
          <Button
            data-cy="reset-activity-button"
            onClick={incrementActivityCounter}
            style={{
              padding: 3,
              marginBottom: 5,
              marginLeft: 5,
              gap: "5px",
              flex: 1,
              fontSize: "12px",
            }}
          >
            <Replay
              sx={{
                fontSize: "20px",
              }}
            />{" "}
            Reset Activity
          </Button>
          <Divider orientation="vertical" flexItem />
          <Button
            onClick={() => setDisplayMarkdown(!displayMarkdown)}
            data-cy="display-markdown-button"
            style={{
              fontSize: "12px",
              gap: "5px",
              opacity: displayMarkdown ? 1 : 0.3,
              padding: 0,
              flex: 1,
            }}
          >
            {displayMarkdown ? (
              <Visibility
                sx={{
                  fontSize: "20px",
                }}
              />
            ) : (
              <VisibilityOff
                sx={{
                  fontSize: "20px",
                }}
              />
            )}
            {displayMarkdown ? "Hide Markdown" : "Show Markdown"}
          </Button>

          {viewingAdvancedOptions && (
            <>
              {" "}
              <Divider orientation="vertical" flexItem />
              <Button
                data-cy="download-chat-log-button"
                onClick={() => downloadChatLog("")}
                style={{
                  padding: 3,
                  marginBottom: 5,
                  marginLeft: 5,
                  gap: "5px",
                  flex: 1,
                  fontSize: "12px",
                }}
              >
                <Download
                  sx={{
                    fontSize: "20px",
                  }}
                />
              </Button>
            </>
          )}
        </RowDiv>
      </ColumnDiv>
      <Divider />
    </ChatHeader>
  );
}
