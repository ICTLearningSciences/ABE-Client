/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { DocVersion } from '../types';
import { useAppSelector } from '../store/hooks';
import { submitDocVersion as submitDocVersionGQL } from './api';
export function useWithRawTextDocVersions() {
  const curDocId = useAppSelector((state) => state.state.curDocId);
  const sessionId = useAppSelector((state) => state.state.sessionId);
  const sessionIntention = useAppSelector(
    (state) => state.state.sessionIntention
  );
  const user = useAppSelector((state) => state.login.user);
  async function submitDocVersion(
    docText: string,
    title: string,
    activityId: string
  ) {
    const newDocData: DocVersion = {
      docId: curDocId,
      plainText: docText,
      lastChangedId: curDocId,
      sessionIntention,
      dayIntention: undefined,
      documentIntention: undefined,
      sessionId,
      chatLog: [],
      activity: activityId,
      intent: '',
      title: title,
      lastModifyingUser: user?.email || '',
      modifiedTime: new Date().toISOString(),
    };
    await submitDocVersionGQL(newDocData);
  }

  return {
    submitDocVersion,
  };
}
