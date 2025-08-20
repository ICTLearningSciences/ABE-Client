/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { useMemo, useReducer, useRef } from 'react';
import {
  DocumentTimelineJobStatus,
  GQLDocumentTimeline,
  GQLTimelinePoint,
  JobStatus,
  AiGenerationStatus,
  TimelinePointType,
  DehydratedGQLDocumentTimeline,
  getDocServiceFromLoginService,
} from '../types';
import {
  asyncRequestDocTimeline,
  asyncRequestDocTimelineStatus,
  fetchDocVersions,
  storeDocTimeline,
} from './api';
import {
  TimelineActionType,
  TimelineReducer,
  TimelineState,
} from './document-timeline-reducer';
import { LoadingError, LoadingStatusType } from './generic-loading-reducer';
import { CancelToken } from 'axios';
import { pollUntilTrue } from './use-with-synchronous-polling';
import { useWithConfig } from '../store/slices/config/use-with-config';
import { useAppSelector } from '../store/hooks';

const initialState: TimelineState = {
  documentStates: {},
};

const startPoint: GQLTimelinePoint = {
  type: TimelinePointType.NEW_ACTIVITY,
  versionTime: '',
  versionId: '',
  version: {
    _id: '',
    sessionIntention: {
      description: '',
      createdAt: '',
    },
    docId: '',
    plainText: '',
    markdownText: '',
    lastChangedId: '',
    sessionId: '',
    chatLog: [],
    activity: '',
    intent: '',
    title: '',
    courseAssignmentId: '',
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

export type DocumentTimelineHookReturn = {
  documentTimeline: GQLDocumentTimeline | undefined;
  curTimelinePoint: GQLTimelinePoint | undefined;
  documentStates: Record<
    string,
    {
      timeline?: DehydratedGQLDocumentTimeline;
      status: LoadingStatusType;
      error?: LoadingError;
    }
  >;
  selectedDocId: string | undefined;
  loadInProgress: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errorMessage: any | undefined;
  fetchDocumentTimeline: (
    userId: string,
    docId: string,
    cancelToken?: CancelToken
  ) => Promise<void>;
  selectTimelinePoint: (timepoint: GQLTimelinePoint) => void;
  selectDocument: (docId: string) => void;
  saveTimelinePoint: (updatedTimelinePoint: GQLTimelinePoint) => Promise<void>;
};

export function useWithDocumentTimeline(): DocumentTimelineHookReturn {
  const user = useAppSelector((state) => state.login.user);
  const [state, dispatch] = useReducer(TimelineReducer, initialState);
  const { state: config } = useWithConfig();
  const requestedVersionIds = useRef<Set<string>>(new Set());
  const docService = getDocServiceFromLoginService(user?.loginService);
  const hydratedGqlTimeline: GQLDocumentTimeline | undefined = useMemo(() => {
    if (
      !state.selectedDocId ||
      !state.documentStates[state.selectedDocId]?.timeline
    ) {
      return undefined;
    }
    const selectedDocState = state.documentStates[state.selectedDocId];
    const selectedTimeline = selectedDocState.timeline!;
    return {
      ...selectedTimeline,
      timelinePoints: selectedTimeline.timelinePoints.reduce((acc, point) => {
        const version = selectedDocState.docVersions?.find(
          (v) => v._id === point.versionId
        );
        if (version) {
          acc.push({
            ...point,
            version: version,
          });
        }
        return acc;
      }, [] as GQLTimelinePoint[]),
    };
  }, [state.selectedDocId, state.documentStates]);

  async function fetchDocVersionsForPartialData(
    docId: string,
    timeline?: DehydratedGQLDocumentTimeline
  ) {
    if (!timeline) {
      return;
    }
    const newVersionIds = timeline.timelinePoints
      .map((point) => point.versionId)
      .filter((id) => !requestedVersionIds.current.has(id));

    if (newVersionIds.length > 0) {
      const versions = await fetchDocVersions(newVersionIds);
      requestedVersionIds.current = new Set([
        ...Array.from(requestedVersionIds.current),
        ...newVersionIds,
      ]);
      dispatch({
        type: TimelineActionType.PARTIAL_DATA_LOADED,
        docId,
        dataPayload: timeline,
        docVersionsPayload: versions,
      });
    } else {
      dispatch({
        type: TimelineActionType.PARTIAL_DATA_LOADED,
        docId,
        dataPayload: timeline,
      });
    }
  }

  async function asyncFetchDocTimeline(
    userId: string,
    docId: string,
    cancelToken?: CancelToken
  ): Promise<void> {
    // Check if timeline is already cached
    const docState = state.documentStates[docId];
    if (
      docState?.timeline &&
      ![
        LoadingStatusType.LOADING,
        LoadingStatusType.SUCCESS,
        LoadingStatusType.SAVING,
      ].includes(docState.status)
    ) {
      dispatch({
        type: TimelineActionType.LOADING_SUCCEEDED,
        docId,
        dataPayload: docState.timeline,
      });
      return;
    }

    if (
      docState?.status === LoadingStatusType.LOADING ||
      !config.config?.defaultAiModel
    ) {
      return;
    }
    try {
      dispatch({ type: TimelineActionType.LOADING_STARTED, docId });
      dispatch({ type: TimelineActionType.SELECT_DOC, docId });
      const docTimelineJobId = await asyncRequestDocTimeline(
        userId,
        docId,
        config.config.defaultAiModel,
        docService,
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
            Boolean(res.documentTimeline) &&
            res.documentTimeline
          ) {
            fetchDocVersionsForPartialData(docId, res.documentTimeline);
          }
          return res.jobStatus === JobStatus.COMPLETE;
        },
        2 * 1000,
        300 * 1000
      );
      const timeline = res.documentTimeline;
      await fetchDocVersionsForPartialData(docId, timeline);
      dispatch({
        type: TimelineActionType.LOADING_SUCCEEDED,
        docId,
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
    if (!hydratedGqlTimeline || !state.selectedDocId) {
      return;
    }
    try {
      await storeDocTimeline({
        ...hydratedGqlTimeline,
        timelinePoints: hydratedGqlTimeline.timelinePoints.map((point) => {
          if (point.versionTime === updatedTimelinePoint.versionTime) {
            return updatedTimelinePoint;
          }
          return point;
        }),
      });
      dispatch({
        type: TimelineActionType.SAVE_TIMELINE_POINT,
        docId: state.selectedDocId,
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
      docId: state.selectedDocId,
      selectTimepointPayload: timepoint,
    });
  }

  function selectDocument(docId: string) {
    dispatch({
      type: TimelineActionType.SELECT_TIMEPOINT,
      docId,
      selectTimepointPayload: undefined,
    });
  }

  const selectedDocState = state.selectedDocId
    ? state.documentStates[state.selectedDocId]
    : undefined;

  return {
    documentTimeline: hydratedGqlTimeline,
    curTimelinePoint: hydratedGqlTimeline?.timelinePoints.find(
      (tp) => tp.versionTime === selectedDocState?.selectedTimepointVersionTime
    ),
    documentStates: Object.fromEntries(
      Object.entries(state.documentStates).map(([docId, docState]) => [
        docId,
        {
          timeline: docState.timeline,
          status: docState.status,
          error: docState.error,
        },
      ])
    ),
    selectedDocId: state.selectedDocId,
    loadInProgress:
      selectedDocState?.status === LoadingStatusType.LOADING || false,
    errorMessage:
      selectedDocState?.status === LoadingStatusType.ERROR
        ? selectedDocState.error
        : undefined,
    fetchDocumentTimeline: asyncFetchDocTimeline,
    selectTimelinePoint,
    selectDocument,
    saveTimelinePoint,
  };
}
