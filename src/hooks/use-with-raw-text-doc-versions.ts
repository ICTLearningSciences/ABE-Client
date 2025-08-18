/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { DocVersion, DocData } from '../types';
import { useAppSelector } from '../store/hooks';
import { submitDocVersion as submitDocVersionGQL } from './api';
import { useWithChat, useWithUsersDocs } from '../exported-files';
import { equals, hasHoursPassed } from '../helpers';
import useInterval from './use-interval';
import { useState } from 'react';
import { ChatMessageTypes } from '../store/slices/chat';
import { TrackedState } from './use-with-google-doc-versions';
import { useEducationalContext } from '../contexts/EducationalContext';

export function useWithRawTextDocVersions(
  currentActivityId: string,
  docData?: DocData
) {
  const { state: chatState } = useWithChat();
  const curDocId = useAppSelector((state) => state.state.curDocId);
  const sessionId = useAppSelector((state) => state.state.sessionId);
  const { updateDocTitleLocally } = useWithUsersDocs();
  const messages = chatState.chatLogs[curDocId] || [];
  const educationalContext = useEducationalContext();
  const selectedAssignmentId = educationalContext?.assignmentId || '';
  const [lastSavedVersion, setLastSavedVersion] = useState<TrackedState>({
    id: '',
    title: '',
    plainText: '',
    numMessages: messages.length,
    sessionId: sessionId,
    activityId: currentActivityId,
    courseAssignmentId: selectedAssignmentId,
  });
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
      courseAssignmentId: selectedAssignmentId,
    };
    await submitDocVersionGQL(newDocData);
  }

  function checkForNewVersion(
    title: string,
    docText: string,
    markdownText: string,
    currentActivityId: string
  ) {
    if (title !== lastSavedVersion.title) {
      updateDocTitleLocally(curDocId, title);
    }

    const newState: TrackedState = {
      id: '',
      title: title,
      plainText: docText,
      numMessages: messages.length,
      sessionId: sessionId,
      activityId: currentActivityId,
      courseAssignmentId: selectedAssignmentId,
    };
    const stateChanged = !equals(lastSavedVersion, newState);
    if (!stateChanged) return;
    setLastSavedVersion(newState);
    submitDocVersion(docText, markdownText, title, messages, sessionId);
  }

  useInterval(
    async () => {
      if (docData) {
        checkForNewVersion(
          docData.title,
          docData.plainText,
          docData.markdownText,
          currentActivityId
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
}
