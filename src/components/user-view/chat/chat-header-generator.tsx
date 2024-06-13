import React from 'react';
import { IconButton } from '@mui/material';
import { ChatHeader } from '../../../styled-components';
import { DocGoal, ActivityGQL } from '../../../types';
import ChangeIcon from '@mui/icons-material/Construction';
import ReplayIcon from '@mui/icons-material/Replay';

export function ChatHeaderGenerator(props: {
  incrementActivityCounter: () => void;
  editDocGoal: () => void;
  selectedGoal?: DocGoal;
  selectedActivity?: ActivityGQL;
}): JSX.Element {
  const {
    incrementActivityCounter,
    editDocGoal,
    selectedGoal,
    selectedActivity,
  } = props;
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
    </ChatHeader>
  );
}
