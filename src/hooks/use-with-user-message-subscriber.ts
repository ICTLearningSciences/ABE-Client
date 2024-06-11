/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { useEffect, useState } from 'react';
import { BuiltActivityHandler } from '../classes/activity-builder-activity/built-activity-handler';
import { useAppSelector } from '../store/hooks';
import { useWithChat } from '../store/slices/chat/use-with-chat';
import { Sender } from '../store/slices/chat';

export function useWithUserMessageSubscribers() {
  const [subscriberFunctions, setSubscriberFunctions] = useState<
    ((userMessage: string) => void)[]
  >([]);

  const { state } = useWithChat();
  const googleDocId: string = useAppSelector(
    (state) => state.state.googleDocId
  );
  const messages = state.chatLogs[googleDocId] || [];

  useEffect(() => {
    if (!messages.length) return;
    const mostRecentMessage = messages[messages.length - 1];
    const userMessage = mostRecentMessage.sender === Sender.USER;
    if (userMessage) {
      subscriberFunctions.forEach((subscriber) => {
        subscriber(mostRecentMessage.message);
      });
    }
  }, [messages]);

  function addNewSubscriber(subscriber: (userMessage: string) => void) {
    setSubscriberFunctions((prev) => [...prev, subscriber]);
  }

  return {
    addNewSubscriber,
  };
}
