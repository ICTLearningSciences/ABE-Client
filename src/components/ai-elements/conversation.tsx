"use client";

import React, { useCallback } from "react";
import { StickToBottom, useStickToBottomContext } from "use-stick-to-bottom";

export const Conversation = ({ style, children, ...props }: any) => {
  return (
    // @ts-expect-error - use-stick-to-bottom types are incompatible with React 18
    <StickToBottom
      style={{
        position: 'relative',
        flex: 1,
        overflowY: 'auto',
        ...style
      }}
      initial="smooth"
      resize="smooth"
      role="log"
      {...props}
    >
      {children}
    </StickToBottom>
  );
};

export const ConversationContent = ({ style, children, ...props }: any) => {
  return (
    // @ts-expect-error - use-stick-to-bottom types are incompatible with React 18
    <StickToBottom.Content
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        padding: '1rem',
        ...style
      }}
      {...props}
    >
      {children}
    </StickToBottom.Content>
  );
};

export const ConversationScrollButton = ({ style, ...props }: any) => {
  const { isAtBottom, scrollToBottom } = useStickToBottomContext();

  const handleScrollToBottom = useCallback(() => {
    scrollToBottom();
  }, [scrollToBottom]);

  if (isAtBottom) return null;

  return (
    <button
      onClick={handleScrollToBottom}
      type="button"
      style={{
        position: 'absolute',
        bottom: '1rem',
        left: '50%',
        transform: 'translateX(-50%)',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        border: '1px solid #ccc',
        background: 'white',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        zIndex: 10,
        ...style
      }}
      {...props}
    >
      ↓
    </button>
  );
};
