import React from 'react';
import ChatIcon from '@mui/icons-material/Chat';
import { IconButton } from '@mui/material';
import { ChatItem } from '../../../types';
import { useWithDocGoalsActivities } from '../../../store/slices/doc-goals-activities/use-with-doc-goals-activites';
import {
  ContentBg,
  ContentRevisionTextColor3,
  MessageContainer,
  SenderTag,
  StyledCloseIcon,
  StyledPopover,
  Text3,
  Text3NoIndent,
} from '../../../styles/content-revision-styles';

interface ActivityTranscriptProps {
  chatLog: ChatItem[];
  activityId: string;
}
interface ChatMessageProps {
  message: string;
  sender: string;
}

/**
 * The ChatMessage component renders a message with different styles based on the sender,
 * distinguishing between system and user messages.
 * @param {ChatMessageProps} props - The `ChatMessage` component takes in a `props` object with the
 * following properties:
 * @returns The ChatMessage component is being returned, which renders a message with different styles
 * based on whether the sender is a system message or a user message. The message content and sender
 * are displayed within a Typography component inside a div with appropriate styling based on the
 * sender type.
 */
const ChatMessage = (props: ChatMessageProps) => {
  const { message, sender } = props;
  const isSystemMessage = sender === 'SYSTEM';
  return (
    <MessageContainer
      style={{
        backgroundColor: isSystemMessage ? '#f0f0f0' : '#1b6a9c',
        color: isSystemMessage ? undefined : ContentBg,
        alignSelf: isSystemMessage ? 'flex-start' : 'flex-end',
      }}
    >
      <Text3
        style={{
          color: isSystemMessage ? ContentRevisionTextColor3 : ContentBg,
          marginLeft: isSystemMessage ? '10px' : '0px',
        }}
      >
        {message}
        <SenderTag
          style={{
            borderRadius: isSystemMessage ? '10px' : '5px',
          }}
        >
          {sender}
        </SenderTag>
      </Text3>
    </MessageContainer>
  );
};

/* This `ActivityTranscript` function is a React component that displays a chat transcript for a
specific activity. Here's a breakdown of what it does: */
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

  const { getActivityById } = useWithDocGoalsActivities();
  const activity = getActivityById(activityId);
  const activityTitle = activity?.title || '';
  return (
    <Text3>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Text3NoIndent
          style={{
            cursor: 'pointer',
          }}
          onClick={handleClick}
        >
          {activityTitle ? `${activityTitle}` : ''}
        </Text3NoIndent>
        <IconButton aria-label="chat" onClick={handleClick}>
          <ChatIcon style={{ fontSize: 18 }} />
        </IconButton>
      </div>

      <StyledPopover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        <StyledCloseIcon onClick={handleClose} />
        {chatLog.map((chatItem, index) => (
          <ChatMessage
            key={index}
            message={chatItem.message}
            sender={chatItem.sender}
          />
        ))}
      </StyledPopover>
    </Text3>
  );
}

export default ActivityTranscript;
