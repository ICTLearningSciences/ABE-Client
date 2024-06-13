/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/

import { useEffect, useState } from 'react';
import { BuiltActivityHandler } from '../classes/activity-builder-activity/built-activity-handler';
import { ChatMessageTypes } from '../store/slices/chat';
import { useWithChat } from '../store/slices/chat/use-with-chat';
import { useWithState } from '../store/slices/state/use-with-state';
import { useWithChatLogSubscribers } from './use-with-chat-log-subscribers';
import { useWithExecutePrompt } from './use-with-execute-prompts';
import { ActivityBuilder } from '../components/activity-builder/types';

export function useWithBuiltActivityHandler(
  selectedActivityBuilder?: ActivityBuilder
) {
  const { sendMessage } = useWithChat();
  const { state, updateSessionIntention } = useWithState();
  const googleDocId = state.googleDocId;
  const { executePromptSteps } = useWithExecutePrompt();

  const { addNewSubscriber, removeAllSubscribers } =
    useWithChatLogSubscribers();

  const [builtActivityHandler, setBuiltActivityHandler] =
    useState<BuiltActivityHandler>();

  useEffect(() => {
    if (!googleDocId || !selectedActivityBuilder) {
      //hack to ensure that sendMessageHelper is fully loaded with googleDocId
      return;
    }
    const newActivityHandler = new BuiltActivityHandler(
      sendMessageHelper,
      (waiting: boolean) => {
        console.log(waiting);
      },
      updateSessionIntentionHelper,
      executePromptSteps,
      selectedActivityBuilder
    );

    addNewSubscriber(newActivityHandler);
    setBuiltActivityHandler(newActivityHandler);

    return () => {
      removeAllSubscribers();
    };
  }, [googleDocId, selectedActivityBuilder]);

  function sendMessageHelper(msg: ChatMessageTypes, clearChat?: boolean) {
    sendMessage(msg, clearChat || false, googleDocId);
  }

  function updateSessionIntentionHelper(intention: string) {
    updateSessionIntention({
      description: intention,
    });
  }

  return {
    activityReady: Boolean(builtActivityHandler),
    startActivityHandler: builtActivityHandler?.initializeActivity,
  };
}
