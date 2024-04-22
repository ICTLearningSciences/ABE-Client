import React from 'react';
import { ChatItem } from '../../../types';
import { useWithDocGoalsActivities } from '../../../store/slices/doc-goals-activities/use-with-doc-goals-activites';
import ChatIcon from '@mui/icons-material/Chat';
import { IconButton, Popover, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface ActivityTranscriptProps {
  chatLog: ChatItem[];
  activityId: string;
}
interface ChatMessageProps {
  message: string;
  sender: string;
}

const ChatMessage = (props: ChatMessageProps) => {
  const { message, sender } = props;
  const isSystemMessage = sender === 'SYSTEM';
  return (
    <div
      className={`message ${
        isSystemMessage ? 'system-message' : 'user-message'
      }`}
    >
      <Typography className={isSystemMessage ? 'text-3' : 'text-3-user-chat'}>
        {message}
        <span
          className={isSystemMessage ? 'sender-tag-system' : 'sender-tag-user'}
        >
          {sender}
        </span>
      </Typography>
    </div>
  );
};

function ActivityTranscript(props: ActivityTranscriptProps): JSX.Element {
  const { chatLog, activityId } = props;
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const { getActivitById } = useWithDocGoalsActivities();
  const activity = getActivitById(activityId);
  const activityTitle = activity?.title || '';
  return (
    <div className="text-3">
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Typography className="text-3-clickable" onClick={handleClick}>
          {activityTitle ? `${activityTitle}` : ''}
        </Typography>
        <IconButton aria-label="chat" onClick={handleClick}>
          <ChatIcon style={{ fontSize: 18 }} />
        </IconButton>
      </div>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        className="chat-container"
      >
        <CloseIcon
          className="close-activity-transcript-icon"
          onClick={handleClose}
        />
        {chatLog.map((chatItem, index) => (
          <ChatMessage
            key={index}
            message={chatItem.message}
            sender={chatItem.sender}
          />
        ))}
      </Popover>
    </div>
  );
}

export default ActivityTranscript;
