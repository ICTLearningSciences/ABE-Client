/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { useState } from 'react';
import { useWithChat } from '../store/slices/chat/use-with-chat';
import { getDocData, submitDocRevision } from './api';
import { useAppSelector } from '../store/hooks';
import useInterval from './use-interval';
import { DocRevision } from '../types';

export function useWithStoreDocVersions(selectedActivityId: string) {
  const { state } = useWithChat();
  const googleDocId: string = useAppSelector(
    (state) => state.state.googleDocId
  );
  const messages = state.chatLogs[googleDocId] || [];
  const [lastUpdatedId, setLastUpdatedId] = useState<string>('');
  const [lastUpdatedTitle, setLastUpdatedTitle] = useState<string>('');
  const [lastNumMessages, setLastNumMessages] = useState<number>(
    messages.length
  );

  useInterval(
    async () => {
      try {
        if (!messages.length) {
          return;
        }
        const docData = await getDocData(googleDocId);
        if (
          docData.lastChangedId === lastUpdatedId &&
          docData.title === lastUpdatedTitle &&
          messages.length === lastNumMessages
        )
          return;
        setLastUpdatedId(docData.lastChangedId);
        setLastUpdatedTitle(docData.title);
        setLastNumMessages(messages.length);
        const newDocData: DocRevision = {
          docId: googleDocId,
          plainText: docData.plainText,
          lastChangedId: docData.lastChangedId,
          chatLog: messages,
          activity: selectedActivityId,
          intent: '',
          title: docData.title,
          lastModifyingUser: docData.lastModifyingUser,
          modifiedTime: docData.modifiedTime,
        };
        await submitDocRevision(newDocData);
      } catch (e) {
        console.log(e);
      }
    },
    googleDocId ? (process.env.NODE_ENV === 'development' ? 5000 : 5000) : null
  );
}
