/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved.
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/

import { useMemo } from 'react';
import { ChatMessageTypes, Sender } from '../store/slices/chat';

/**
 * AI Elements Message format interface
 * This represents the shape expected by AI Elements components
 */
export interface AIElementsMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  // Preserve original message data for custom rendering
  originalMessage: ChatMessageTypes;
}

/**
 * Hook to adapt Redux chat state to AI Elements format
 * Transforms Redux ChatMessageTypes to AI Elements expected format
 *
 * @param messages - Array of Redux ChatMessageTypes
 * @returns Array of messages in AI Elements format
 */
export function useChatAdapter(messages: ChatMessageTypes[]): AIElementsMessage[] {
  return useMemo(() => {
    return messages.map((msg) => ({
      id: msg.id,
      role: msg.sender === Sender.USER ? 'user' : 'assistant',
      content: msg.message || '',
      originalMessage: msg, // Keep original for custom features (MCQ, debug info)
    }));
  }, [messages]);
}
