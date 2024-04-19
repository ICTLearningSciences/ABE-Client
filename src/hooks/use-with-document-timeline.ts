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
    try {
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

  function addStartPointToTimeline(timeline: GQLDocumentTimeline) {
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
        versionTime: startPointDate,
        type: TimelinePointType.INTRO,
      },
      ...timeline.timelinePoints,
    ];
    return timelineCopy;
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

  /**
   * The function `subtractOneSecondFromDate` takes a date string, converts it to a Date object,
   * subtracts one second from it, and returns the updated date in ISO 8601 format.
   * @param {string} dateString - The `dateString` parameter in the `subtractOneSecondFromDate`
   * function should be a string representing a date and time in a format that can be parsed by the
   * `Date` constructor in JavaScript. This can include formats like "YYYY-MM-DDTHH:MM:SS" or "YYYY-MM
   * @returns The function `subtractOneSecondFromDate` takes a date string as input, parses it into a
   * Date object, subtracts one second from the date, and then formats the result back into the ISO
   * 8601 format. The function returns the updated date in ISO 8601 format.
   */
  function subtractOneSecondFromDate(dateString: string) {
    // Parse the input date string into a Date object
    const date = new Date(dateString);

    // Subtract one second from the date
    date.setSeconds(date.getSeconds() - 1);

    // Format the result back into the desired format (ISO 8601)
    return date.toISOString();
  }

  function selectTimelinePoint(timepoint: GQLTimelinePoint) {
    dispatch({
      type: TimelineActionType.SELECT_TIMEPOINT,
      selectTimepointPayload: timepoint,
    });
  }

  /* The `const startPoint` object is defining a starting point for a timeline activity. It contains
  various properties related to the activity being described. Here's a breakdown of what each
  property represents: */
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
    userInputSummary: '',
    reverseOutline: 'No outline available',
    relatedFeedback: '',
  };

  return {
    documentTimeline: state.data
      ? addStartPointToTimeline(state.data)
      : undefined,
    curTimelinePoint: state.selectedTimepoint,
    loadInProgress: state.status === LoadingStatusType.LOADING,
    errorMessage:
      state.status === LoadingStatusType.ERROR ? state.error : undefined,
    fetchDocumentTimeline: asyncFetchDocTimeline,
    selectTimelinePoint,
    saveTimelinePoint,
  };
}
