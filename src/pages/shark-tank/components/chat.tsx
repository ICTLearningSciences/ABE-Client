import React, { useState, useEffect } from 'react';
import { CircularProgress } from '@mui/material';
import { createGlobalStyle } from 'styled-components';
import { AiServiceStepDataTypes } from '../../../ai-services/ai-service-types';
import ViewPreviousRunModal from '../../../components/admin-view/view-previous-run-modal';
import SystemPromptModal from '../../../components/user-view/chat/system-prompt-modal';
import {
  useWithChat,
  useWithState,
  isActivityBuilder,
} from '../../../exported-files';
import { useWithBuiltActivityHandler } from '../../../hooks/use-with-built-activity-handler';
import { useWithSystemPromptsConfig } from '../../../hooks/use-with-system-prompts-config';
import { useAppSelector } from '../../../store/hooks';
import { ChatMessageTypes } from '../../../store/slices/chat';
import { ActivityTypes } from '../../../types';
import { ChatHeader } from './chat-header';
import { ChatInput } from './chat-input';
import { ChatThread } from './chat-thread';

export const GlobalChatStyles = createGlobalStyle`
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
  const { sendMessage, state: chatState, setSystemRole } = useWithChat();
  const {
    editedData: systemPromptData,
    editOrAddSystemPrompt,
    save,
    isEdited,
    deleteSystemPrompt,
    isSaving,
  } = useWithSystemPromptsConfig();
  const { state } = useWithState();
  const { curDocId } = state;
  const coachResponsePending = useAppSelector(
    (state) => state.chat.coachResponsePending
  );
  const [resetActivityCounter, setResetActivityCounter] = useState<number>(0);
  const { activityReady: builtActivityReady } = useWithBuiltActivityHandler(
    resetActivityCounter,
    () => {
      /**/
    },
    selectedActivity && isActivityBuilder(selectedActivity)
      ? selectedActivity
      : undefined
  );
  const messages = curDocId ? chatState.chatLogs[curDocId] : [];
  const disableInput =
    coachResponsePending ||
    Boolean(
      messages?.length > 0 && messages[messages.length - 1].disableUserInput
    );
  const [openAiInfoToDisplay, setAiInfoToDisplay] =
    useState<AiServiceStepDataTypes[]>();
  const [viewSystemPrompts, setViewSystemPrompts] = useState<boolean>(false);
  const [targetSystemPrompt, setTargetSystemPrompt] = useState<number>(0);
  const systemRole = systemPromptData
    ? systemPromptData[targetSystemPrompt]
    : '';

  useEffect(() => {
    setSystemRole(systemRole);
  }, [systemRole]);

  async function sendNewMessage(message: ChatMessageTypes) {
    sendMessage(message, false, curDocId);
  }

  return (
    <div
      data-cy="chat-container-parent"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        alignItems: 'center',
      }}
    >
      <GlobalChatStyles />
      {curDocId && builtActivityReady ? (
        <>
          <div
            data-cy="chat-box"
            className="column center-div"
            style={{
              height: '100%',
              width: '100%',
              justifyContent: 'space-around',
            }}
          >
            <ChatHeader
              selectedActivity={selectedActivity}
              onSelectActivity={props.setSelectedActivity}
              onReset={() => {
                setResetActivityCounter(resetActivityCounter + 1);
              }}
            />
            <ChatThread
              sendMessage={sendNewMessage}
              coachResponsePending={coachResponsePending}
              curDocId={curDocId}
              chatLog={messages}
              setAiInfoToDisplay={setAiInfoToDisplay}
            />
            <ChatInput
              sendMessage={sendNewMessage}
              disableInput={disableInput}
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
      ) : (
        <CircularProgress />
      )}
    </div>
  );
}
