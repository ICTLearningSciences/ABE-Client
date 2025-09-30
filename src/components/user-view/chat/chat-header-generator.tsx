import React from 'react';
import { Button, Divider } from '@mui/material';
import { ChatHeader, ColumnDiv, RowDiv } from '../../../styled-components';
import { DocGoal, ActivityTypes } from '../../../types';
import ChangeIcon from '@mui/icons-material/Construction';
import ReplayIcon from '@mui/icons-material/Replay';
import { useAppSelector } from '../../../store/hooks';
import { useWithChat } from '../../../store/slices/chat/use-with-chat';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

export function ChatHeaderGenerator(props: {
  incrementActivityCounter: () => void;
  editDocGoal: () => void;
  selectedGoal?: DocGoal;
  selectedActivity?: ActivityTypes;
  disableActivitySelector?: boolean;
  displayMarkdown: boolean;
  setDisplayMarkdown: (displayMarkdown: boolean) => void;
}): JSX.Element {
  const {
    incrementActivityCounter,
    editDocGoal,
    selectedGoal,
    selectedActivity,
    disableActivitySelector,
    displayMarkdown,
    setDisplayMarkdown,
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
    <ChatHeader
      style={{
        width: '100%',
      }}
    >
      <ColumnDiv
        style={{
          width: '100%',
        }}
      >
        <span
          style={{ textAlign: 'center', marginBottom: '10px' }}
          data-cy="chat-header"
        >
          {title}
        </span>
        <Divider />
        <RowDiv
          style={{
            width: '100%',
            justifyContent: 'space-around',
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
                gap: '5px',
                flex: 1,
                fontSize: '12px',
                width: 'fit-content',
              }}
            >
              <ChangeIcon
                sx={{
                  fontSize: '20px',
                }}
              />{' '}
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
              gap: '5px',
              flex: 1,
              fontSize: '12px',
            }}
          >
            <ReplayIcon
              sx={{
                fontSize: '20px',
              }}
            />{' '}
            Reset Activity
          </Button>
          <Divider orientation="vertical" flexItem />
          <Button
            onClick={() => setDisplayMarkdown(!displayMarkdown)}
            data-cy="display-markdown-button"
            style={{
              fontSize: '12px',
              gap: '5px',
              opacity: displayMarkdown ? 1 : 0.3,
              padding: 0,
              flex: 1,
            }}
          >
            {displayMarkdown ? (
              <VisibilityIcon
                sx={{
                  fontSize: '20px',
                }}
              />
            ) : (
              <VisibilityOffIcon
                sx={{
                  fontSize: '20px',
                }}
              />
            )}
            {displayMarkdown ? 'Hide Markdown' : 'Show Markdown'}
          </Button>

          {viewingAdvancedOptions && (
            <>
              {' '}
              <Divider orientation="vertical" flexItem />
              <Button
                data-cy="download-chat-log-button"
                onClick={() => downloadChatLog('')}
                style={{
                  padding: 3,
                  marginBottom: 5,
                  marginLeft: 5,
                  gap: '5px',
                  flex: 1,
                  fontSize: '12px',
                }}
              >
                <DownloadIcon
                  sx={{
                    fontSize: '20px',
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
