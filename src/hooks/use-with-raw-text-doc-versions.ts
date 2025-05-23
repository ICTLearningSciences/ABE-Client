/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { DocVersion, DocData } from '../types';
import { useAppSelector } from '../store/hooks';
import { submitDocVersion as submitDocVersionGQL } from './api';
import { useWithChat, useWithUsersDocs } from '../exported-files';
import { hasHoursPassed } from '../helpers';
import useInterval from './use-interval';
import { useState } from 'react';
import { ChatMessageTypes } from '../store/slices/chat';
export function useWithRawTextDocVersions(
  currentActivityId: string,
  docData?: DocData
) {
  const { state: chatState } = useWithChat();
  const curDocId = useAppSelector((state) => state.state.curDocId);
  const sessionId = useAppSelector((state) => state.state.sessionId);
  const { updateDocTitleLocally } = useWithUsersDocs();
  const messages = chatState.chatLogs[curDocId] || [];
  const [lastNumMessages, setLastNumMessages] = useState<number>(
    messages.length
  );
  const [lastUpdatedTitle, setLastUpdatedTitle] = useState<string>('');
  const [lastUpdatedPlainText, setLastUpdatedPlainText] = useState<string>('');
  const [lastSavedSessionId, setLastSavedSessionId] =
    useState<string>(sessionId);
  const sessionIntention = useAppSelector(
    (state) => state.state.sessionIntention
  );
  const curGoogleDoc = useAppSelector((state) =>
    state.state.userDocs.find((doc) => doc.googleDocId === curDocId)
  );
  const accessTokenExpired = useAppSelector(
    (state) => state.state.warnExpiredAccessToken
  );
  const useDayIntention = curGoogleDoc?.currentDayIntention?.createdAt
    ? !hasHoursPassed(
        curGoogleDoc.currentDayIntention.createdAt,
        new Date().toISOString(),
        8
      )
    : false;
  const user = useAppSelector((state) => state.login.user);

  async function submitDocVersion(
    docText: string,
    markdownText: string,
    title: string,
    messages: ChatMessageTypes[],
    sessionId: string
  ) {
    setLastUpdatedTitle(title);
    setLastUpdatedPlainText(docText);
    setLastNumMessages(messages.length);
    setLastSavedSessionId(sessionId);
    const newDocData: DocVersion = {
      docId: curDocId,
      plainText: docText,
      markdownText: markdownText,
      lastChangedId: '', // does not apply to raw text.
      sessionIntention,
      dayIntention: useDayIntention
        ? curGoogleDoc?.currentDayIntention
        : undefined,
      documentIntention: curGoogleDoc?.documentIntention,
      sessionId,
      chatLog: messages,
      activity: currentActivityId,
      intent: '',
      title: title,
      lastModifyingUser: user?.email || '',
      modifiedTime: new Date().toISOString(),
    };
    await submitDocVersionGQL(newDocData);
  }

  function checkForNewVersion(
    title: string,
    docText: string,
    markdownText: string
  ) {
    if (title !== lastUpdatedTitle) {
      updateDocTitleLocally(curDocId, title);
    }
    if (
      title === lastUpdatedTitle &&
      docText === lastUpdatedPlainText &&
      messages.length === lastNumMessages &&
      sessionId === lastSavedSessionId
    ) {
      return;
    }
    submitDocVersion(docText, markdownText, title, messages, sessionId);
  }

  useInterval(
    async () => {
      if (docData) {
        checkForNewVersion(
          docData.title,
          docData.plainText,
          docData.markdownText
        );
      }
    },
    accessTokenExpired
      ? null
      : curDocId
      ? process.env.NODE_ENV === 'development'
        ? 5000
        : 5000
      : null
  );

  return {
    submitDocVersion,
    checkForNewVersion,
  };
}
