/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { useReducer } from 'react';
import {
  DocumentTimelineJobStatus,
  GQLDocumentTimeline,
  GQLTimelinePoint,
  JobStatus,
  AiGenerationStatus,
  TimelinePointType,
} from '../types';
import {
  asyncRequestDocTimeline,
  asyncRequestDocTimelineStatus,
  storeDocTimeline,
} from './api';
import {
  TimelineActionType,
  TimelineReducer,
  TimelineState,
} from './document-timeline-reducer';
import { LoadingStatusType } from './generic-loading-reducer';
import { CancelToken } from 'axios';
import { pollUntilTrue } from './use-with-synchronous-polling';
import { useWithConfig } from '../store/slices/config/use-with-config';
import { DEFAULT_TARGET_AI_SERVICE_MODEL } from '../constants';

const initialState: TimelineState = {
  status: LoadingStatusType.NONE,
  data: undefined,
  error: undefined,
};

const startPoint: GQLTimelinePoint = {
  type: TimelinePointType.NEW_ACTIVITY,
  versionTime: '',
  version: {
    sessionIntention: {
      description: '',
      createdAt: '',
    },
    docId: '',
    plainText: '',
    lastChangedId: '',
    sessionId: '',
    chatLog: [],
    activity: '',
    intent: '',
    title: '',
    lastModifyingUser: '',
    modifiedTime: '',
    createdAt: '',
    updatedAt: '',
  },
  intent: '',
  changeSummary: '',
  changeSummaryStatus: AiGenerationStatus.COMPLETED,
  userInputSummary: '',
  reverseOutline: 'No outline available',
  reverseOutlineStatus: AiGenerationStatus.COMPLETED,
  relatedFeedback: '',
};

function subtractOneSecondFromDate(dateString: string) {
  // Parse the input date string into a Date object
  const date = new Date(dateString);

  // Subtract one second from the date
  date.setSeconds(date.getSeconds() - 1);

  // Format the result back into the desired format (ISO 8601)
  return date.toISOString();
}

export function addStartPointToTimeline(timeline: GQLDocumentTimeline) {
  if (timeline.timelinePoints.length === 0) {
    return timeline;
  }
  const startPointDate = subtractOneSecondFromDate(
    timeline.timelinePoints[0].versionTime
  );
  const timelineCopy: GQLDocumentTimeline = JSON.parse(
    JSON.stringify(timeline)
  );
  timelineCopy.timelinePoints = [
    {
      ...startPoint,
      version: {
        ...timeline.timelinePoints[0].version,
      },
      versionTime: startPointDate,
      type: TimelinePointType.INTRO,
    },
    ...timeline.timelinePoints,
  ];
  return timelineCopy;
}

export function useWithDocumentTimeline() {
  const [state, dispatch] = useReducer(TimelineReducer, initialState);
  const { state: config } = useWithConfig();

  async function asyncFetchDocTimeline(
    userId: string,
    docId: string,
    cancelToken?: CancelToken
  ): Promise<void> {
    if (state.status === LoadingStatusType.LOADING) {
      return;
    }
    try {
      dispatch({ type: TimelineActionType.LOADING_STARTED });
      const docTimelineJobId = await asyncRequestDocTimeline(
        userId,
        docId,
        config.config?.defaultAiModel || DEFAULT_TARGET_AI_SERVICE_MODEL,
        cancelToken
      );
      const pollFunction = () => {
        return asyncRequestDocTimelineStatus(docTimelineJobId, cancelToken);
      };
      const res = await pollUntilTrue<DocumentTimelineJobStatus>(
        pollFunction,
        (res: DocumentTimelineJobStatus) => {
          if (res.jobStatus === JobStatus.FAILED) {
            throw new Error('Failed to load document timeline');
          }
          if (
            res.jobStatus === JobStatus.IN_PROGRESS &&
            Boolean(res.documentTimeline)
          ) {
            dispatch({
              type: TimelineActionType.PARTIAL_DATA_LOADED,
              dataPayload: res.documentTimeline,
            });
          }
          return res.jobStatus === JobStatus.COMPLETE;
        },
        2 * 1000,
        300 * 1000
      );
      const timeline = res.documentTimeline;
      dispatch({
        type: TimelineActionType.LOADING_SUCCEEDED,
        dataPayload: timeline,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      dispatch({
        type: TimelineActionType.LOADING_FAILED,

        errorPayload: {
          error: e,
          message: JSON.stringify(e.message),
        },
      });
    }
  }

  async function saveTimelinePoint(updatedTimelinePoint: GQLTimelinePoint) {
    if (!state.data) {
      return;
    }
    try {
      await storeDocTimeline({
        ...state.data,
        timelinePoints: state.data.timelinePoints.map((point) => {
          if (point.versionTime === updatedTimelinePoint.versionTime) {
            return updatedTimelinePoint;
          }
          return point;
        }),
      });
      dispatch({
        type: TimelineActionType.SAVE_TIMELINE_POINT,
        savedTimelinePoint: updatedTimelinePoint,
      });
      return;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  function selectTimelinePoint(timepoint: GQLTimelinePoint) {
    dispatch({
      type: TimelineActionType.SELECT_TIMEPOINT,
      selectTimepointPayload: timepoint,
    });
  }

  return {
    documentTimeline: state.data,
    // ? addStartPointToTimeline(state.data)
    // : undefined,
    curTimelinePoint: state.data?.timelinePoints.find(
      (tp) => tp.versionTime === state.selectedTimepointVersionTime
    ),
    loadInProgress: state.status === LoadingStatusType.LOADING,
    errorMessage:
      state.status === LoadingStatusType.ERROR ? state.error : undefined,
    fetchDocumentTimeline: asyncFetchDocTimeline,
    selectTimelinePoint,
    saveTimelinePoint,
  };
}
