/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { useState } from 'react';
import { useWithChat } from '../store/slices/chat/use-with-chat';
import { submitDocVersion } from './api';
import { useAppSelector } from '../store/hooks';
import useInterval from './use-interval';
import { DocData, DocVersion, Intention } from '../types';
import { hasHoursPassed } from '../helpers';
import { useWithGoogleDocs } from './use-with-google-docs';
import { useWithState } from '../store/slices/state/use-with-state';
import { isAxiosError } from 'axios';

/**
 * Interval to store doc versions
 * @param selectedActivityId
 */
export function useWithStoreDocVersions(
  selectedActivityId: string,
  getDocData: (docId: string) => Promise<DocData>
) {
  const { state } = useWithChat();
  const { updateMostRecentDocVersion, warnExpiredAccessToken } = useWithState();
  const googleDocId: string = useAppSelector(
    (state) => state.state.googleDocId
  );
  const sessionId: string = useAppSelector((state) => state.state.sessionId);
  const sessionIntention: Intention | undefined = useAppSelector(
    (state) => state.state.sessionIntention
  );
  const accessTokenExpired: boolean = useAppSelector(
    (state) => state.state.warnExpiredAccessToken
  );
  const curGoogleDoc = useAppSelector((state) =>
    state.state.userGoogleDocs.find((doc) => doc.googleDocId === googleDocId)
  );
  const { updateGoogleDocTitleLocally } = useWithGoogleDocs();
  const useDayIntention = curGoogleDoc?.currentDayIntention?.createdAt
    ? !hasHoursPassed(
        curGoogleDoc.currentDayIntention.createdAt,
        new Date().toISOString(),
        8
      )
    : false;
  const messages = state.chatLogs[googleDocId] || [];
  const [lastUpdatedId, setLastUpdatedId] = useState<string>('');
  const [lastUpdatedTitle, setLastUpdatedTitle] = useState<string>('');
  const [lastNumMessages, setLastNumMessages] = useState<number>(
    messages.length
  );
  const [lastUpdatedPlainText, setLastUpdatedPlainText] = useState<string>('');
  const [lastSavedSessionId, setLastSavedSessionId] =
    useState<string>(sessionId);

  useInterval(
    async () => {
      try {
        if (!messages.length || !sessionId) {
          return;
        }
        const docData = await getDocData(googleDocId).catch((e) => {
          if (isAxiosError(e) && e.response?.status === 403) {
            warnExpiredAccessToken(true);
          }
          throw e;
        });
        updateMostRecentDocVersion(docData);
        if (docData.title !== lastUpdatedTitle) {
          updateGoogleDocTitleLocally(googleDocId, docData.title);
        }
        if (
          docData.lastChangedId === lastUpdatedId &&
          docData.plainText === lastUpdatedPlainText &&
          docData.title === lastUpdatedTitle &&
          messages.length === lastNumMessages &&
          sessionId === lastSavedSessionId
        )
          return;
        setLastSavedSessionId(sessionId);
        setLastUpdatedId(docData.lastChangedId);
        setLastUpdatedTitle(docData.title);
        setLastUpdatedPlainText(docData.plainText);
        setLastNumMessages(messages.length);
        const newDocData: DocVersion = {
          docId: googleDocId,
          plainText: docData.plainText,
          lastChangedId: docData.lastChangedId,
          sessionIntention,
          dayIntention: useDayIntention
            ? curGoogleDoc?.currentDayIntention
            : undefined,
          documentIntention: curGoogleDoc?.documentIntention,
          sessionId: sessionId,
          chatLog: messages,
          activity: selectedActivityId,
          intent: '',
          title: docData.title,
          lastModifyingUser: docData.lastModifyingUser,
          modifiedTime: docData.modifiedTime,
        };
        await submitDocVersion(newDocData);
      } catch (e) {
        console.log(e);
      }
    },
    accessTokenExpired
      ? null
      : googleDocId
      ? process.env.NODE_ENV === 'development'
        ? 5000
        : 5000
      : null
  );
}
