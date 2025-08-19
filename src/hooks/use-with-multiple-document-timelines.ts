/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { CancelToken } from 'axios';
import {
  useWithDocumentTimeline,
  DocumentTimelineHookReturn,
} from './use-with-document-timeline';

export function useWithMultipleDocumentTimelines(docIds: string[]) {
  const timelines = docIds.reduce(
    (acc, docId) => {
      acc[docId] = useWithDocumentTimeline();
      return acc;
    },
    {} as Record<string, DocumentTimelineHookReturn>
  );

  const fetchAllTimelines = async (
    userId: string,
    cancelToken?: CancelToken
  ) => {
    const promises = docIds.map((docId) =>
      timelines[docId].fetchDocumentTimeline(userId, docId, cancelToken)
    );
    await Promise.all(promises);
  };

  const isAnyLoading = Object.values(timelines).some(
    (timeline) => timeline.loadInProgress
  );

  const errors = Object.entries(timelines)
    .filter(([, timeline]) => timeline.errorMessage)
    .reduce(
      (acc, [docId, timeline]) => {
        acc[docId] = timeline.errorMessage;
        return acc;
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {} as Record<string, any>
    );

  return {
    timelines,
    fetchAllTimelines,
    isAnyLoading,
    errors,
    hasErrors: Object.keys(errors).length > 0,
  };
}
