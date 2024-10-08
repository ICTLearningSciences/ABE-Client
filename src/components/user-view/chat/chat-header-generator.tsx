import React from 'react';
import { IconButton } from '@mui/material';
import { ChatHeader } from '../../../styled-components';
import { DocGoal, ActivityTypes } from '../../../types';
import ChangeIcon from '@mui/icons-material/Construction';
import ReplayIcon from '@mui/icons-material/Replay';
import { useAppSelector } from '../../../store/hooks';
import { useWithChat } from '../../../store/slices/chat/use-with-chat';
import DownloadIcon from '@mui/icons-material/Download';
export function ChatHeaderGenerator(props: {
  incrementActivityCounter: () => void;
  editDocGoal: () => void;
  selectedGoal?: DocGoal;
  selectedActivity?: ActivityTypes;
}): JSX.Element {
  const {
    incrementActivityCounter,
    editDocGoal,
    selectedGoal,
    selectedActivity,
  } = props;
  const viewingAdvancedOptions = useAppSelector(
    (state) => state.state.viewingAdvancedOptions
  );
  const { downloadChatLog } = useWithChat();
  let title = selectedGoal?.title || '';
  title += selectedGoal && selectedActivity ? ' - ' : '';
  title += selectedActivity?.title || '';
  if (!title) title = 'Coach';
  return (
    <ChatHeader>
      <span data-cy="chat-header">{title}</span>
      <IconButton
        data-cy="edit-goal-button"
        onClick={editDocGoal}
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
        onClick={incrementActivityCounter}
        style={{
          padding: 3,
          marginBottom: 5,
          marginLeft: 5,
        }}
      >
        <ReplayIcon />
      </IconButton>
      {viewingAdvancedOptions && (
        <IconButton
          data-cy="download-chat-log-button"
          onClick={() => downloadChatLog('')}
          style={{
            padding: 3,
            marginBottom: 5,
            marginLeft: 5,
          }}
        >
          <DownloadIcon />
        </IconButton>
      )}
    </ChatHeader>
  );
}
