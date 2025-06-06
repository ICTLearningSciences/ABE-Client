/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { useEffect, useState } from 'react';
import { useAppSelector } from '../store/hooks';
import { useWithChat } from '../store/slices/chat/use-with-chat';
import { ChatLog } from '../store/slices/chat';
import { DocData } from '../types';

export abstract class ChatLogSubscriber {
  abstract newChatLogReceived(chatLog: ChatLog): void;
  abstract newDocDataReceived(docData?: DocData): void;
}

export function useWithChatLogSubscribers() {
  const [subscribers, setSubscribers] = useState<ChatLogSubscriber[]>([]);

  const { state } = useWithChat();
  const mostRecentDocVersion = useAppSelector(
    (state) => state.state.mostRecentDocVersion
  );
  const curDocId: string = useAppSelector((state) => state.state.curDocId);
  const messages = state.chatLogs[curDocId] || [];

  useEffect(() => {
    for (let i = 0; i < subscribers.length; i++) {
      const newChatLogFunction = subscribers[i].newChatLogReceived.bind(
        subscribers[i]
      );
      newChatLogFunction(messages);
    }
  }, [messages]);

  useEffect(() => {
    for (let i = 0; i < subscribers.length; i++) {
      const newDocDataFunction = subscribers[i].newDocDataReceived.bind(
        subscribers[i]
      );
      newDocDataFunction(mostRecentDocVersion);
    }
  }, [mostRecentDocVersion]);

  function addNewSubscriber(subscriber: ChatLogSubscriber) {
    setSubscribers([...subscribers, subscriber]);
  }

  function removeAllSubscribers() {
    setSubscribers([]);
  }

  return {
    addNewSubscriber,
    removeAllSubscribers,
  };
}
