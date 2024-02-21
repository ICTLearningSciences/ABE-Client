import { useState } from 'react';
import { useWithChat } from '../store/slices/chat/use-with-chat';
import { getDocData, submitDocRevision } from './api';
import { useAppSelector } from '../store/hooks';
import useInterval from './use-interval';
import { DocRevision } from '../types';

export default function useWithStoreDocVersions() {
  const { state } = useWithChat();
  const googleDocId: string = useAppSelector(
    (state) => state.state.googleDocId
  );
  const messages = state.chatLogs[googleDocId] || [];
  const [lastUpdatedId, setLastUpdatedId] = useState<string>('');
  const [lastUpdatedTitle, setLastUpdatedTitle] = useState<string>('');

  useInterval(
    async () => {
      try {
        const docData = await getDocData(googleDocId);
        if (
          docData.lastChangedId === lastUpdatedId &&
          docData.title === lastUpdatedTitle
        )
          return;
        setLastUpdatedId(docData.lastChangedId);
        setLastUpdatedTitle(docData.title);
        const newDocData: DocRevision = {
          docId: googleDocId,
          plainText: docData.plainText,
          lastChangedId: docData.lastChangedId,
          chatLog: messages,
          title: docData.title,
          lastModifyingUser: docData.lastModifyingUser,
          modifiedTime: docData.modifiedTime,
        };
        await submitDocRevision(newDocData);
      } catch (e) {
        console.log(e);
      }
    },
    googleDocId ? (process.env.NODE_ENV === 'development' ? 60000 : 5000) : null
  );

  return {};
}
