import { useState, useRef, useEffect } from 'react';
import {
  Button,
  CircularProgress,
  FormControlLabel,
  IconButton,
  Switch,
  TextField,
} from '@mui/material';
import { useWithChat } from '../../../store/slices/chat/use-with-chat';
import {
  ChatMessageTypes,
  MessageDisplayType,
  Sender,
  UserInputType,
} from '../../../store/slices/chat';
import { ChatHeader, RowDiv, SmallGreyText } from '../../../styled-components';
import useWithSelectGoalActivity from '../../../hooks/use-with-store-doc-versions';
import { useAppSelector } from '../../../store/hooks';
import {
  ActivityGQL,
  ActivityStepTypes,
  DocGoal,
  OpenAiReqRes,
} from '../../../types';
import OpenAiInfoModal from './open-ai-info-modal';
import SystemPromptModal from './system-prompt-modal';
import { useWithSystemPromptsConfig } from '../../../hooks/use-with-system-prompts-config';
import { UserRole } from '../../../store/slices/login';
import ChangeIcon from '@mui/icons-material/Construction';
import useWithFreeInput from '../../../hooks/use-with-free-input';
import { useWithActivityHandler } from '../../../hooks/use-with-activity-handler';
import ActivitySummaryModal from '../activity-summary-modal';
import { useWithState } from '../../../store/slices/state/use-with-state';
import './chat.css';
import Message from './message';
import ReplayIcon from '@mui/icons-material/Replay';
import { UseWithPrompts } from '../../../hooks/use-with-prompts';
import { v4 as uuidv4 } from 'uuid';

function ChatMessagesContainer(props: {
  coachResponsePending: boolean;
  googleDocId: string;
  setOpenAiInfoToDisplay: (openAiInfo?: OpenAiReqRes) => void;
  sendMessage: (message: ChatMessageTypes) => void;
}): JSX.Element {
  const {
    coachResponsePending,
    googleDocId,
    setOpenAiInfoToDisplay,
    sendMessage,
  } = props;
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const [messageElements, setMessageElements] = useState<JSX.Element[]>([]);
  const { state } = useWithChat();
  const messages = state.chatLogs[googleDocId] || [];
  const chatMessages: ChatMessageTypes[] = [
    ...messages,
    ...(coachResponsePending
      ? [
          {
            id: 'pending-message',
            message: '...',
            sender: Sender.SYSTEM,
            displayType: MessageDisplayType.PENDING_MESSAGE,
          },
        ]
      : []),
  ];
  const mostRecentChatId =
    chatMessages.length > 0 ? chatMessages[chatMessages.length - 1].id : '';

  function scrollToElementById(id: string) {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function scrollToMostRecentAiResponse() {
    const mostRecentAiResponse = getMostRecentAiResponse(chatMessages);
    if (mostRecentAiResponse) {
      scrollToElementById(mostRecentAiResponse.id);
    }
  }

  function getMostRecentAiResponse(
    messages: ChatMessageTypes[]
  ): ChatMessageTypes | undefined {
    // first, find the most recent user message, then find the most recent system message after that
    if (!messages || messages.length <= 1) return undefined;
    let mostRecentUserMessageIndex = -1;
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].sender === Sender.USER) {
        mostRecentUserMessageIndex = i;
        break;
      }
    }
    if (mostRecentUserMessageIndex === -1) return undefined;
    for (let i = mostRecentUserMessageIndex; i < messages.length; i++) {
      if (messages[i].sender === Sender.SYSTEM) {
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
    const mostRecentAiResponse = getMostRecentAiResponse(chatMessages);
    const _newMessageElements = chatMessages.map(
      (message: ChatMessageTypes, index: number) => {
        return (
          <>
            <Message
              isNextAiResponse={message.id === mostRecentAiResponse?.id}
              key={index}
              message={message}
              setOpenAiInfoToDisplay={setOpenAiInfoToDisplay}
              messageIndex={index}
            />
            {message.mcqChoices && index === chatMessages.length - 1 && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: '98%',
                  justifyContent: 'flex-end',
                  alignItems: 'flex-end',
                  margin: '10px',
                }}
              >
                {message.mcqChoices.map((choice: string) => {
                  return (
                    <Button
                      variant="outlined"
                      style={{
                        marginBottom: '5px',
                      }}
                      data-cy={`mcq-choice-${choice.replaceAll(' ', '-')}`}
                      onClick={() => {
                        sendMessage({
                          id: uuidv4(),
                          message: choice,
                          sender: Sender.USER,
                          displayType: MessageDisplayType.TEXT,
                          userInputType: UserInputType.MCQ,
                        });
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
      }
    );
    setMessageElements(_newMessageElements);
  }, [chatMessages.length, mostRecentChatId]);

  return (
    <div
      ref={messageContainerRef}
      data-cy="messages-container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        maxWidth: '100%',
        justifyContent: 'flex-start',
        margin: '1rem',
        borderRadius: '1rem',
        overflowX: 'hidden',
        overflowY: 'auto',
        border: '1px solid black',
      }}
    >
      {messageElements}
    </div>
  );
}

function ChatInput(props: {
  sendMessage: (message: ChatMessageTypes) => void;
  googleDocId: string;
  disableInput: boolean;
}): JSX.Element {
  const { sendMessage, googleDocId } = props;
  const [message, setMessage] = useState<string>('');
  function handleSendUserMessage(message: string) {
    sendMessage({
      id: uuidv4(),
      message: message,
      sender: Sender.USER,
      displayType: MessageDisplayType.TEXT,
      userInputType: UserInputType.FREE_INPUT,
    });
    setMessage('');
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        width: '90%',
        justifyContent: 'space-around',
        alignItems: 'center',
        margin: '10px',
      }}
    >
      <TextField
        data-cy="chat-input"
        disabled={props.disableInput}
        fullWidth
        multiline
        placeholder={props.disableInput ? '' : 'Enter your response here...'}
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: 'fit-content',
          minHeight: '20px',
          width: '100%',
          justifyContent: 'space-around',
          alignItems: 'center',
          borderRadius: '2rem',
          marginRight: '10px',
          opacity: props.disableInput ? 0.3 : 1,
        }}
        value={message}
        maxRows={5}
        onChange={(e) => {
          setMessage(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSendUserMessage(message);
          }
        }}
      />
      <Button
        variant="outlined"
        data-cy="send-input-button"
        disabled={props.disableInput}
        onClick={() => {
          handleSendUserMessage(message);
        }}
      >
        Send
      </Button>
    </div>
  );
}

export default function Chat(props: {
  selectedGoal?: DocGoal;
  selectedActivity?: ActivityGQL;
  editDocGoal: () => void;
  setSelectedActivity: (activity: ActivityGQL) => void;
  useWithPrompts: UseWithPrompts;
}) {
  const { selectedGoal, selectedActivity, editDocGoal, useWithPrompts } = props;
  const { sendMessage, state: chatState, setSystemPrompt } = useWithChat();
  const {
    editedData: systemPromptData,
    editOrAddSystemPrompt,
    save,
    isEdited,
    deleteSystemPrompt,
    isSaving,
  } = useWithSystemPromptsConfig();
  const { toggleGpt4, state } = useWithState();
  const { userActivityStates, googleDocId } = state;
  const coachResponsePending = useAppSelector(
    (state) => state.chat.coachResponsePending
  );
  const userRole = useAppSelector((state) => state.login.userRole);
  const userIsAdmin = userRole === UserRole.ADMIN;
  const [resetActivityCounter, setResetActivityCounter] = useState<number>(0);
  useWithFreeInput(selectedGoal);
  useWithSelectGoalActivity();
  const { activityReady } = useWithActivityHandler(
    useWithPrompts,
    editDocGoal,
    resetActivityCounter,
    selectedGoal,
    selectedActivity
  );
  const messages = googleDocId ? chatState.chatLogs[googleDocId] : [];
  const goalHasActivities = Boolean(
    selectedGoal?.activities && selectedGoal.activities.length > 0
  );
  const disableInput =
    coachResponsePending ||
    (goalHasActivities &&
      Boolean(
        messages?.length > 0 &&
          messages[messages.length - 1].activityStep?.stepType !==
            ActivityStepTypes.FREE_RESPONSE_QUESTION
      ));
  const [openAiInfoToDisplay, setOpenAiInfoToDisplay] =
    useState<OpenAiReqRes>();
  const [viewSystemPrompts, setViewSystemPrompts] = useState<boolean>(false);
  const [targetSystemPrompt, setTargetSystemPrompt] = useState<number>(0);
  const [viewActivitySummary, setViewActivitySummary] =
    useState<boolean>(false);
  const systemPrompt = systemPromptData
    ? systemPromptData[targetSystemPrompt]
    : '';
  const currentActivitySummary = userActivityStates.find(
    (userActivityState) =>
      userActivityState.activityId === selectedActivity?._id &&
      userActivityState.googleDocId === googleDocId
  )?.metadata;

  useEffect(() => {
    setSystemPrompt(systemPrompt);
  }, [systemPrompt]);

  function ChatHeaderGenerator(): JSX.Element {
    if (!selectedGoal && !selectedActivity)
      return <ChatHeader>Coach</ChatHeader>;
    let title = selectedGoal?.title || '';
    title += selectedGoal && selectedActivity ? ' - ' : '';
    title += selectedActivity?.title || '';
    if (!title) title = 'Coach';
    return (
      <ChatHeader>
        <Button
          onClick={() => {
            setViewActivitySummary(true);
          }}
          style={{ color: 'white' }}
        >
          X
        </Button>
        <span data-cy="chat-header">{title}</span>
        <IconButton
          data-cy="edit-goal-button"
          onClick={() => {
            editDocGoal();
          }}
          style={{
            padding: 3,
            marginBottom: 5,
            marginLeft: 5,
          }}
        >
          <ChangeIcon />
        </IconButton>
        <IconButton
          data-cy="reset-activity-button"
          onClick={() => {
            setResetActivityCounter(resetActivityCounter + 1);
          }}
          style={{
            padding: 3,
            marginBottom: 5,
            marginLeft: 5,
          }}
        >
          <ReplayIcon />
        </IconButton>
      </ChatHeader>
    );
  }

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
            <ChatHeader>{ChatHeaderGenerator()}</ChatHeader>
            <ChatMessagesContainer
              sendMessage={(message) => {
                sendMessage(message, false, googleDocId);
              }}
              coachResponsePending={coachResponsePending}
              googleDocId={googleDocId}
              setOpenAiInfoToDisplay={setOpenAiInfoToDisplay}
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
                <FormControlLabel
                  labelPlacement="top"
                  style={{
                    margin: 0,
                    marginRight: 10,
                  }}
                  control={
                    <Switch
                      size="medium"
                      checked={state.useGpt4}
                      onChange={(value) => {
                        toggleGpt4(value.target.checked);
                      }}
                    />
                  }
                  label="GPT-4"
                />
                <RowDiv
                  style={{
                    justifyContent: 'center',
                    width: 'fit-content',
                  }}
                >
                  <h5>{'System Prompt: '}</h5>
                  <SmallGreyText>{systemPrompt}</SmallGreyText>
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
          <OpenAiInfoModal
            openAiInfo={openAiInfoToDisplay}
            close={() => {
              setOpenAiInfoToDisplay(undefined);
            }}
          />
          <ActivitySummaryModal
            activitySummary={currentActivitySummary}
            open={viewActivitySummary}
            close={() => {
              setViewActivitySummary(false);
            }}
          />
        </>
      ) : (
        <CircularProgress />
      )}
    </div>
  );
}
