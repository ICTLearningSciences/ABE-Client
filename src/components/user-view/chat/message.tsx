import React from 'react';
import { Button } from '@mui/material';
import { DEFAULT_COLOR_THEME } from '../../../constants';
import {
  ChatMessageTypes,
  MessageDisplayType,
  Sender,
} from '../../../store/slices/chat';
import { useAppSelector } from '../../../store/hooks';
import { UserRole } from '../../../store/slices/login';
import { useEffect, useState, useRef } from 'react';
import { AiServiceStepDataTypes } from '../../../ai-services/ai-service-types';
import { StyledFadingText } from './message-styles';
import ReactMarkdown from 'react-markdown';
import './message.css';
import remarkBreaks from 'remark-breaks';
import rehypeRaw from 'rehype-raw';

const baseMessageStyle: React.CSSProperties = {
  borderRadius: '1rem',
  padding: '1rem',
  margin: 5,
  maxWidth: '70%',
  maxInlineSize: '70%',
  whiteSpace: 'pre-wrap',
  overflowWrap: 'break-word',
};

function DisplayOpenAiInfoButton(props: {
  chatMessage: ChatMessageTypes;
  setAiInfoToDisplay: (aiInfo?: AiServiceStepDataTypes[]) => void;
}): JSX.Element {
  const { chatMessage, setAiInfoToDisplay } = props;
  const userRole = useAppSelector((state) => state.login.userRole);
  const showAdvancedOptions = useAppSelector(
    (state) => state.state.viewingAdvancedOptions
  );
  const isAdmin = userRole === UserRole.ADMIN;
  if (!chatMessage.aiServiceStepData || !isAdmin || !showAdvancedOptions) {
    return <></>;
  }
  return (
    <Button
      onClick={() => {
        setAiInfoToDisplay(chatMessage.aiServiceStepData);
      }}
    >
      AI Request Info
    </Button>
  );
}

const FadingText: React.FC<{ strings: string[] }> = ({ strings }) => {
  const [currentStringIndex, setCurrentStringIndex] = useState(0);
  const [fadeState, setFadeState] = useState<'fading-out' | 'fading-in'>(
    'fading-in'
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentStringIndex !== strings.length - 1) {
        setFadeState('fading-out');
      }
    }, 3000); // Change the duration as needed

    return () => clearTimeout(timeoutId);
  }, [currentStringIndex]);

  useEffect(() => {
    if (
      fadeState === 'fading-out' &&
      currentStringIndex !== strings.length - 1
    ) {
      const timeoutId = setTimeout(() => {
        setCurrentStringIndex((prevIndex) => (prevIndex + 1) % strings.length);
        setFadeState('fading-in');
      }, 1000); // Adjust the delay before fading in the next string

      return () => clearTimeout(timeoutId);
    }
  }, [fadeState, strings.length]);

  return (
    <StyledFadingText
      isFadingIn={fadeState === 'fading-in'}
      isFadingOut={fadeState === 'fading-out'}
    >
      {strings[currentStringIndex]}
    </StyledFadingText>
  );
};

export default function Message(props: {
  message: ChatMessageTypes;
  setAiInfoToDisplay: (aiInfo?: AiServiceStepDataTypes[]) => void;
  messageIndex: number;
  displayMarkdown: boolean;
  onStreamingStateChange?: (isStreaming: boolean, messageId: string) => void;
}): JSX.Element {
  const config = useAppSelector((state) => state.config);
  const colorTheme = config.config?.colorTheme || DEFAULT_COLOR_THEME;
  const {
    message,
    setAiInfoToDisplay,
    messageIndex,
    displayMarkdown,
    onStreamingStateChange,
  } = props;

  // Typewriter effect state
  const [displayedText, setDisplayedText] = useState('');
  const [isCurrentlyStreaming, setIsCurrentlyStreaming] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const displayedTextRef = useRef(''); // Track actual displayed text length synchronously
  const hasStartedStreamingRef = useRef(false); // Track if streaming has started

  // Auto-skip when full message is available
  useEffect(() => {
    if (message.aiServiceStepData && isCurrentlyStreaming) {
      // Full message is available - skip animation and show immediately
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      intervalRef.current = null;

      // Immediately show full message
      const fullMessage = message.message || '';
      setDisplayedText(fullMessage);
      displayedTextRef.current = fullMessage;
      setIsCurrentlyStreaming(false);

      // Notify parent that streaming has stopped
      if (onStreamingStateChange) {
        onStreamingStateChange(false, message.id);
      }
    }
  }, [
    message.aiServiceStepData,
    isCurrentlyStreaming,
    message.message,
    message.id,
    onStreamingStateChange,
  ]);

  const backgroundColor =
    message.sender === Sender.USER
      ? colorTheme.chatUserBubbleColor
      : colorTheme.chatSystemBubbleColor;
  const alignSelf = message.sender === Sender.USER ? 'flex-end' : 'flex-start';
  const textColor =
    message.sender === Sender.USER
      ? colorTheme.chatUserTextColor
      : colorTheme.chatSystemTextColor;

  // Typewriter effect logic
  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // If message is from a user or is empty, show it instantly
    if (message.sender === Sender.USER || !message.message) {
      const text = message.message || '';
      setDisplayedText(text);
      displayedTextRef.current = text;
      return;
    }

    // If message has aiServiceStepData and hasn't started streaming, show instantly (from history)
    if (message.aiServiceStepData && !hasStartedStreamingRef.current) {
      const text = message.message || '';
      setDisplayedText(text);
      displayedTextRef.current = text;
      return;
    }

    // Mark as streaming if we're here
    if (!hasStartedStreamingRef.current) {
      hasStartedStreamingRef.current = true;
      // Reset displayedText when streaming starts
      setDisplayedText('');
      displayedTextRef.current = '';
    }

    // Start typewriter animation
    const targetText = message.message || '';
    const currentDisplayed = displayedTextRef.current;
    const currentLength = currentDisplayed.length; // Use ref for accurate current length

    // Check if current displayed text is actually a prefix of the target text
    // If not, the message content has changed completely (not just appended), so reset
    if (currentLength > 0 && !targetText.startsWith(currentDisplayed)) {
      setDisplayedText('');
      displayedTextRef.current = '';
      // Don't return here - continue to start animating the new content
    }

    // If target text is shorter or equal to current, just set it (shouldn't happen but safety check)
    if (targetText.length <= displayedTextRef.current.length) {
      setDisplayedText(targetText);
      displayedTextRef.current = targetText;
      return;
    }

    // Get the new portion that needs to be revealed
    const newPortion = targetText.slice(displayedTextRef.current.length);
    const words = newPortion.split(/(\s+)/).filter((word) => word.length > 0); // Split by whitespace, keeping the spaces, filter empty strings
    let wordIndex = 0;

    // Notify parent that streaming has started
    setIsCurrentlyStreaming(true);
    if (onStreamingStateChange) {
      onStreamingStateChange(true, message.id);
    }

    intervalRef.current = setInterval(() => {
      if (wordIndex < words.length) {
        const wordToAdd = words[wordIndex];
        setDisplayedText((prev) => {
          const newText = prev + wordToAdd;
          displayedTextRef.current = newText; // Update ref synchronously
          return newText;
        });
        wordIndex++;
      } else {
        // Animation complete
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        setIsCurrentlyStreaming(false);
        // Notify parent that streaming has stopped
        if (onStreamingStateChange) {
          onStreamingStateChange(false, message.id);
        }
      }
    }, 25);

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setIsCurrentlyStreaming(false);
        // Notify parent that streaming has stopped on cleanup
        if (onStreamingStateChange) {
          onStreamingStateChange(false, message.id);
        }
      }
    };
  }, [
    message.message,
    message.sender,
    message.aiServiceStepData,
    onStreamingStateChange,
    message.id,
  ]);

  if (message.message === '') {
    return <></>;
  }

  function formatMessage(message: string) {
    // Preserve multiple blank lines by converting extra newlines to <br /> tags
    // \n\n = paragraph break (standard markdown, 1 blank line)
    // \n\n\n = paragraph break + 1 <br /> (2 blank lines)
    // \n\n\n\n = paragraph break + 2 <br /> (3 blank lines), etc.
    return message.replace(/\n{3,}/g, (match) => {
      const extraNewlines = match.length - 2;
      return '\n\n' + '<br />'.repeat(extraNewlines);
    });
  }

  return (
    <div
      id={message.id}
      data-cy={`message-${messageIndex}`}
      style={{
        ...baseMessageStyle,
        alignSelf: alignSelf,
        backgroundColor: backgroundColor,
        color: textColor,
      }}
      className="markdown"
    >
      {displayMarkdown && (
        <ReactMarkdown
          remarkPlugins={[remarkBreaks]}
          rehypePlugins={[rehypeRaw]}
          components={{
            h1: ({ children }) => (
              <h1
                style={{ marginTop: '0', marginBottom: '0', lineHeight: '1' }}
              >
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 style={{ marginTop: '0', marginBottom: '0' }}>{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 style={{ marginTop: '0', marginBottom: '0' }}>{children}</h3>
            ),
            h4: ({ children }) => (
              <h4 style={{ marginTop: '0', marginBottom: '0' }}>{children}</h4>
            ),
            h5: ({ children }) => (
              <h5 style={{ marginTop: '0', marginBottom: '0' }}>{children}</h5>
            ),
            h6: ({ children }) => (
              <h6 style={{ marginTop: '0', marginBottom: '0' }}>{children}</h6>
            ),
            p: ({ children }) => (
              <p style={{ marginTop: '0', marginBottom: '0', lineHeight: '1' }}>
                {children}
              </p>
            ),
            li: ({ children }) => (
              <li
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  marginTop: '0',
                  marginBottom: '0',
                }}
              >
                {children}
              </li>
            ),
            ul: ({ children }) => (
              <ul
                style={{
                  marginTop: '0',
                  marginBottom: '0',
                  lineHeight: '1',
                  paddingLeft: '10px',
                }}
              >
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol
                style={{
                  marginTop: '0',
                  marginBottom: '0',
                  lineHeight: '1',
                  paddingLeft: '10px',
                }}
              >
                {children}
              </ol>
            ),
          }}
        >
          {message.displayType === MessageDisplayType.TEXT
            ? formatMessage(displayedText).trim()
            : ''}
        </ReactMarkdown>
      )}
      {!displayMarkdown && (
        <span>
          {message.displayType === MessageDisplayType.TEXT ? displayedText : ''}
        </span>
      )}
      {message.displayType === MessageDisplayType.PENDING_MESSAGE && (
        <FadingText
          strings={['Reading...', 'Analyzing...', 'Getting opinionated...']}
        />
      )}
      <DisplayOpenAiInfoButton
        chatMessage={message}
        setAiInfoToDisplay={setAiInfoToDisplay}
      />
    </div>
  );
}
