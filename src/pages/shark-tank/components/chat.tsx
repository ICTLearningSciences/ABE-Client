/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/

import React from 'react';
import { useState, useEffect } from 'react';
import {
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import { createGlobalStyle } from 'styled-components';
import { AiServiceStepDataTypes } from '../../../ai-services/ai-service-types';
import ViewPreviousRunModal from '../../../components/admin-view/view-previous-run-modal';
import { ChatHeaderGenerator } from '../../../components/user-view/chat/chat-header-generator';
import { ChatInput } from '../../../components/user-view/chat/chat-input';
import { ChatMessagesContainer } from '../../../components/user-view/chat/chat-message-container';
import SystemPromptModal from '../../../components/user-view/chat/system-prompt-modal';
import {
  useWithChat,
  useWithConfig,
  isActivityBuilder,
  useWithState,
} from '../../../exported-files';
import {
  aiServiceModelToString,
  aiServiceModelStringParse,
} from '../../../helpers';
import { useWithBuiltActivityHandler } from '../../../hooks/use-with-built-activity-handler';
import useWithFreeInput from '../../../hooks/use-with-free-input';
import { useWithSystemPromptsConfig } from '../../../hooks/use-with-system-prompts-config';
import { useAppSelector } from '../../../store/hooks';
import { ChatMessageTypes } from '../../../store/slices/chat';
import { UserRole } from '../../../store/slices/login';
import { ChatHeader, RowDiv, SmallGreyText } from '../../../styled-components';
import {
  DocGoal,
  ActivityTypes,
  ActivityGQL,
  AiServiceModel,
} from '../../../types';

export const GlobalChatStyles = createGlobalStyle`
  .MuiOutlinedInput-notchedOutline {
    border-color: rgb(0, 0, 0) !important;
    border-width: 1px !important;
  }
`;

export function Chat(props: {
  selectedGoal?: DocGoal;
  selectedActivity?: ActivityTypes;
  editDocGoal: () => void;
  setSelectedActivity: (activity: ActivityGQL) => void;
  disableActivitySelector?: boolean;
  setToDocView: () => void;
}) {
  const {
    selectedGoal,
    selectedActivity,
    editDocGoal,
    disableActivitySelector,
    setToDocView,
  } = props;
  const { sendMessage, state: chatState, setSystemRole } = useWithChat();
  const {
    editedData: systemPromptData,
    editOrAddSystemPrompt,
    save,
    isEdited,
    deleteSystemPrompt,
    isSaving,
  } = useWithSystemPromptsConfig();
  const { availableAiServiceModels } = useWithConfig();
  const { overrideAiModel, state } = useWithState();
  const { curDocId } = state;
  const coachResponsePending = useAppSelector(
    (state) => state.chat.coachResponsePending
  );
  const userRole = useAppSelector((state) => state.login.userRole);
  const userIsAdmin = userRole === UserRole.ADMIN;
  const [resetActivityCounter, setResetActivityCounter] = useState<number>(0);
  useWithFreeInput(!selectedActivity ? selectedGoal : undefined);
  const { activityReady: builtActivityReady } = useWithBuiltActivityHandler(
    resetActivityCounter,
    editDocGoal,
    selectedActivity && isActivityBuilder(selectedActivity)
      ? selectedActivity
      : undefined
  );
  const messages = curDocId ? chatState.chatLogs[curDocId] : [];
  const goalHasActivities =
    selectedGoal?.builtActivities && selectedGoal.builtActivities.length > 0;
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
  const [displayMarkdown, setDisplayMarkdown] = useState(false);

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
      {builtActivityReady || !goalHasActivities ? (
        <>
          <div
            data-cy="chat-box"
            style={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              width: '90%',
              justifyContent: 'space-around',
              alignItems: 'center',
              margin: '1rem',
              borderRadius: '1rem',
            }}
          >
            <ChatHeader
              style={{
                position: 'relative',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <ChatHeaderGenerator
                incrementActivityCounter={() => {
                  setResetActivityCounter(resetActivityCounter + 1);
                }}
                editDocGoal={editDocGoal}
                selectedGoal={selectedGoal}
                selectedActivity={selectedActivity}
                disableActivitySelector={disableActivitySelector}
                displayMarkdown={displayMarkdown}
                setDisplayMarkdown={setDisplayMarkdown}
                setToDocView={setToDocView}
              />
            </ChatHeader>
            <ChatMessagesContainer
              sendMessage={sendNewMessage}
              coachResponsePending={coachResponsePending}
              curDocId={curDocId}
              setAiInfoToDisplay={setAiInfoToDisplay}
              displayMarkdown={displayMarkdown}
            />
            <ChatInput
              sendMessage={sendNewMessage}
              disableInput={disableInput}
            />
            {userIsAdmin && state.viewingAdvancedOptions && (
              <RowDiv>
                <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                  <InputLabel size="small" id="override-ai-service-model">
                    Override Model
                  </InputLabel>
                  <Select
                    labelId="override-ai-service-model"
                    id="ai-service-override"
                    value={
                      state.overrideAiServiceModel
                        ? aiServiceModelToString(state.overrideAiServiceModel)
                        : ''
                    }
                    onChange={(e) => {
                      const targetAiServiceModel: AiServiceModel | undefined =
                        e.target.value == 'CLEAR'
                          ? undefined
                          : aiServiceModelStringParse(e.target.value);
                      overrideAiModel(targetAiServiceModel);
                    }}
                    label="Output Data Type"
                  >
                    <MenuItem value={'CLEAR'}>CLEAR</MenuItem>
                    {availableAiServiceModels?.map((serviceAndModels) => {
                      return serviceAndModels.models.map((model, j) => {
                        return (
                          <MenuItem
                            key={j}
                            value={aiServiceModelToString({
                              serviceName: serviceAndModels.serviceName,
                              model: model,
                            })}
                          >
                            {aiServiceModelToString({
                              serviceName: serviceAndModels.serviceName,
                              model: model,
                            })}
                          </MenuItem>
                        );
                      });
                    })}
                  </Select>
                </FormControl>
                <RowDiv
                  style={{
                    justifyContent: 'center',
                    width: 'fit-content',
                  }}
                >
                  <h5>{'System Prompt: '}</h5>
                  <SmallGreyText>{systemRole}</SmallGreyText>
                  <Button
                    onClick={() => {
                      setViewSystemPrompts(true);
                    }}
                  >
                    Change
                  </Button>
                </RowDiv>
              </RowDiv>
            )}
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
