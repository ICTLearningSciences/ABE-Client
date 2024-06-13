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
import { useWithChat } from '../../../store/slices/chat/use-with-chat';
import { ChatHeader, RowDiv, SmallGreyText } from '../../../styled-components';
import { useWithStoreDocVersions } from '../../../hooks/use-with-store-doc-versions';
import { useAppSelector } from '../../../store/hooks';
import { ActivityGQL, AiServiceModel, DocGoal } from '../../../types';
import SystemPromptModal from './system-prompt-modal';
import { useWithSystemPromptsConfig } from '../../../hooks/use-with-system-prompts-config';
import { UserRole } from '../../../store/slices/login';
import useWithFreeInput from '../../../hooks/use-with-free-input';
import { useWithActivityHandler } from '../../../hooks/use-with-activity-handler';
import { useWithState } from '../../../store/slices/state/use-with-state';
import './chat.css';
import { UseWithPrompts } from '../../../hooks/use-with-prompts';
import { AiServiceStepDataTypes } from '../../../ai-services/ai-service-types';
import {
  aiServiceModelStringParse,
  aiServiceModelToString,
} from '../../../helpers';
import ViewPreviousRunModal from '../../admin-view/view-previous-run-modal';
import { ChatMessagesContainer } from './chat-message-container';
import { ChatInput } from './chat-input';
import { ChatHeaderGenerator } from './chat-header-generator';
// import { useWithBuiltActivityHandler } from '../../../hooks/use-with-built-activity-handler';

export default function Chat(props: {
  selectedGoal?: DocGoal;
  selectedActivity?: ActivityGQL;
  editDocGoal: () => void;
  setSelectedActivity: (activity: ActivityGQL) => void;
  useWithPrompts: UseWithPrompts;
}) {
  const { selectedGoal, selectedActivity, editDocGoal, useWithPrompts } = props;
  const { sendMessage, state: chatState, setSystemRole } = useWithChat();
  const {
    editedData: systemPromptData,
    editOrAddSystemPrompt,
    save,
    isEdited,
    deleteSystemPrompt,
    isSaving,
  } = useWithSystemPromptsConfig();
  const availableAiServiceModels = useAppSelector(
    (state) => state.config.config?.availableAiServiceModels
  );
  const { overrideAiModel, state } = useWithState();
  const { googleDocId } = state;
  const coachResponsePending = useAppSelector(
    (state) => state.chat.coachResponsePending
  );
  const userRole = useAppSelector((state) => state.login.userRole);
  const userIsAdmin = userRole === UserRole.ADMIN;
  const [resetActivityCounter, setResetActivityCounter] = useState<number>(0);
  useWithFreeInput(selectedGoal);
  useWithStoreDocVersions(selectedActivity?._id || '');
  const { activityReady } = useWithActivityHandler(
    useWithPrompts,
    editDocGoal,
    resetActivityCounter,
    selectedGoal,
    selectedActivity
  );
  // const { activityReady: builtActivityReady, startActivityHandler } =
  //   useWithBuiltActivityHandler();
  const messages = googleDocId ? chatState.chatLogs[googleDocId] : [];
  const goalHasActivities = Boolean(
    selectedGoal?.activities && selectedGoal.activities.length > 0
  );
  const disableInput =
    coachResponsePending ||
    (goalHasActivities &&
      Boolean(
        messages?.length > 0 && messages[messages.length - 1].disableUserInput
      ));
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

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        alignItems: 'center',
      }}
    >
      {activityReady ? (
        <>
          <div
            data-cy="chat-box"
            style={{
              display: 'flex',
              flexDirection: 'column',
              height: '92%',
              width: '90%',
              justifyContent: 'space-around',
              alignItems: 'center',
              margin: '1rem',
              borderRadius: '1rem',
              padding: '1rem',
            }}
          >
            <ChatHeader>
              <ChatHeaderGenerator
                incrementActivityCounter={() => {
                  setResetActivityCounter(resetActivityCounter + 1);
                }}
                editDocGoal={editDocGoal}
                selectedGoal={selectedGoal}
                selectedActivity={selectedActivity}
              />
            </ChatHeader>
            <ChatMessagesContainer
              sendMessage={(message) => {
                sendMessage(message, false, googleDocId);
              }}
              coachResponsePending={coachResponsePending}
              googleDocId={googleDocId}
              setAiInfoToDisplay={setAiInfoToDisplay}
            />
            <ChatInput
              sendMessage={(message) => {
                sendMessage(message, false, googleDocId);
              }}
              googleDocId={googleDocId}
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
