/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { useReducer } from 'react';
import {
  DocumentTimelineJobStatus,
  GQLTimelinePoint,
  JobStatus,
} from '../types';
import { asyncRequestDocTimeline, asyncRequestDocTimelineStatus } from './api';
import {
  TimelineActionType,
  TimelineReducer,
  TimelineState,
} from './document-timeline-reducer';
import { LoadingStatusType } from './generic-loading-reducer';
import { CancelToken } from 'axios';
import { pollUntilTrue } from './use-with-synchronous-polling';

const initialState: TimelineState = {
  status: LoadingStatusType.NONE,
  data: undefined,
  error: undefined,
};

export function useWithDocumentTimeline() {
  const [state, dispatch] = useReducer(TimelineReducer, initialState);

  async function asyncFetchDocTimeline(
    userId: string,
    docId: string,
    cancelToken?: CancelToken
  ): Promise<void> {
    if (state.status === LoadingStatusType.LOADING) {
      return;
    }
    dispatch({ type: TimelineActionType.LOADING_STARTED });
    const docTimelineJobId = await asyncRequestDocTimeline(
      userId,
      docId,
      cancelToken
    );
    const pollFunction = () => {
      return asyncRequestDocTimelineStatus(docTimelineJobId, cancelToken);
    };
    const res = await pollUntilTrue<DocumentTimelineJobStatus>(
      pollFunction,
      (res: DocumentTimelineJobStatus) => {
        return res.jobStatus === JobStatus.COMPLETE;
      },
      1000,
      60000
    );
    dispatch({
      type: TimelineActionType.LOADING_SUCCEEDED,
      dataPayload: res.documentTimeline,
    });
  }

  function selectTimelinePoint(timepoint: GQLTimelinePoint) {
    dispatch({
      type: TimelineActionType.SELECT_TIMEPOINT,
      selectTimepointPayload: timepoint,
    });
  }

  return {
    documentTimeline: state.data,
    curTimelinePoint: state.selectedTimepoint,
    loadInProgress: state.status === LoadingStatusType.LOADING,
    errorMessage:
      state.status === LoadingStatusType.ERROR ? state.error : undefined,
    fetchDocumentTimeline: asyncFetchDocTimeline,
    selectTimelinePoint,
  };
}
