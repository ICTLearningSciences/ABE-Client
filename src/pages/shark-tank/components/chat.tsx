/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/

import { useState } from "react";
import { createGlobalStyle } from "styled-components";
import { Typography } from "@mui/material";
import type { AiServiceStepDataTypes } from "../../../ai-services/ai-service-types";
import ViewPreviousRunModal from "../../../components/admin-view/view-previous-run-modal";
import SystemPromptModal from "../../../components/user-view/chat/system-prompt-modal";
import {
  useWithState,
  isActivityBuilder,
  useWithChat,
} from "../../../exported-files";
import { useWithBuiltActivityHandler } from "../../../hooks/use-with-built-activity-handler";
import { useWithSystemPromptsConfig } from "../../../hooks/use-with-system-prompts-config";
import { useAppSelector } from "../../../store/hooks";
import type { ChatMessageTypes } from "../../../store/slices/chat";
import type { ActivityTypes } from "../../../types";
import { ChatHeader } from "./chat-header";
import { ChatInput } from "./chat-input";
import { ChatThread } from "./chat-thread";
import React from "react";

const GlobalChatStyles = createGlobalStyle`
  .MuiOutlinedInput-notchedOutline {
    border-color: rgb(0, 0, 0) !important;
    border-width: 1px !important;
  }
`;

export function Chat(props: {
  selectedActivity?: ActivityTypes;
  setSelectedActivity: (activity: ActivityTypes) => void;
}) {
  const { selectedActivity } = props;
  const { state: chatState, sendMessage, setSystemRole } = useWithChat();

  const {
    editedData: systemPromptData,
    editOrAddSystemPrompt,
    save,
    isEdited,
    deleteSystemPrompt,
    isSaving,
  } = useWithSystemPromptsConfig();
  const { state, newSession } = useWithState();
  const { curDocId } = state;
  const coachResponsePending = useAppSelector(
    (state) => state.chat.coachResponsePending,
  );
  const [resetActivityCounter, setResetActivityCounter] = useState<number>(0);

  const { activityReady: builtActivityReady } = useWithBuiltActivityHandler(
    resetActivityCounter,
    () => {
      /**/
    },
    selectedActivity && isActivityBuilder(selectedActivity)
      ? selectedActivity
      : undefined,
  );
  const messages = curDocId ? chatState.chatLogs[curDocId] : [];
  const disableInput =
    coachResponsePending ||
    Boolean(
      messages?.length > 0 && messages[messages.length - 1].disableUserInput,
    );
  const [openAiInfoToDisplay, setAiInfoToDisplay] =
    useState<AiServiceStepDataTypes[]>();
  const [viewSystemPrompts, setViewSystemPrompts] = useState<boolean>(false);
  const [targetSystemPrompt, setTargetSystemPrompt] = useState<number>(0);

  const systemRole = systemPromptData
    ? systemPromptData[targetSystemPrompt]
    : "";

  async function sendNewMessage(message: ChatMessageTypes) {
    sendMessage(message, false, curDocId);
  }

  React.useEffect(() => {
    setSystemRole(systemRole);
  }, [systemRole]);

  return (
    <div
      data-cy="chat-container-parent"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        alignItems: "center",
      }}
    >
      <GlobalChatStyles />
      <>
        <div
          data-cy="chat-box"
          className="column center-div"
          style={{
            height: "100%",
            width: "100%",
            justifyContent: "space-around",
          }}
        >
          <ChatHeader
            selectedActivity={selectedActivity}
            onSelectActivity={props.setSelectedActivity}
            onReset={() => {
              newSession();
              setResetActivityCounter(resetActivityCounter + 1);
            }}
          />
          {curDocId && builtActivityReady ? (
            <ChatThread
              sendMessage={sendNewMessage}
              coachResponsePending={coachResponsePending}
              curDocId={curDocId}
              chatLog={messages}
              setAiInfoToDisplay={setAiInfoToDisplay}
            />
          ) : (
            <Typography
              className="column center-div"
              style={{ height: "100%" }}
            >
              Please select a document to get started
            </Typography>
          )}
          <ChatInput
            sendMessage={sendNewMessage}
            disableInput={!curDocId || !builtActivityReady || disableInput}
          />
        </div>
        {systemPromptData && (
          <SystemPromptModal
            targetSystemPrompt={targetSystemPrompt}
            setTargetSystemPrompt={setTargetSystemPrompt}
            deleteSystemPrompt={deleteSystemPrompt}
            isSaving={isSaving}
            isEdited={isEdited}
            editSystemPrompts={editOrAddSystemPrompt}
            saveSystemPrompts={save}
            systemPrompts={systemPromptData}
            open={viewSystemPrompts}
            close={() => {
              setViewSystemPrompts(false);
            }}
          />
        )}
        <ViewPreviousRunModal
          previousRunStepData={openAiInfoToDisplay}
          open={Boolean(openAiInfoToDisplay)}
          close={() => {
            setAiInfoToDisplay(undefined);
          }}
        />
      </>
    </div>
  );
}
