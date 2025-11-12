"use client";

import React, { memo } from "react";
import type { HTMLAttributes } from "react";
import type { UIMessage } from "ai";
import { Streamdown } from "streamdown";

export type MessageProps = HTMLAttributes<HTMLDivElement> & {
  from: UIMessage["role"];
};

export const Message = ({ style, from, ...props }: MessageProps) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignSelf: from === 'user' ? 'flex-end' : 'flex-start',
      maxWidth: '70%',
      ...style
    }}
    {...props}
  />
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const MessageContent = ({ style, children, ...props }: any) => (
  <div
    style={{
      padding: '1rem',
      borderRadius: '0.5rem',
      background: '#f5f5f5',
      ...style
    }}
    {...props}
  >
    {children}
  </div>
);

export const MessageResponse = memo(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ({ children, style, parseIncompleteMarkdown = false, ...props }: any) => {
    return (
      <div style={{ lineHeight: '1.5', ...style }} {...props}>
        <Streamdown parseIncompleteMarkdown={parseIncompleteMarkdown}>
          {children}
        </Streamdown>
      </div>
    );
  }
);

MessageResponse.displayName = "MessageResponse";
