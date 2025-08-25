/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/

import {
  DehydratedGQLDocumentTimeline,
  GQLTimelinePoint,
  IGDocVersion,
} from '../types';
import { LoadingError, LoadingStatusType } from './generic-loading-reducer';

export interface DocumentState {
  status: LoadingStatusType;
  timeline?: DehydratedGQLDocumentTimeline;
  selectedTimepointVersionTime?: string;
  error?: LoadingError;
  docVersions?: IGDocVersion[];
}

export interface TimelineState {
  selectedDocId?: string;
  documentStates: Record<string, DocumentState>;
}

export interface TimelineAction {
  type: TimelineActionType;
  docId?: string;
  dataPayload?: DehydratedGQLDocumentTimeline;
  docVersionsPayload?: IGDocVersion[];
  selectTimepointPayload?: GQLTimelinePoint;
  errorPayload?: LoadingError;
  savedTimelinePoint?: GQLTimelinePoint;
}

export enum TimelineActionType {
  LOADING_STARTED = 'LOADING_STARTED',
  LOADING_SUCCEEDED = 'LOADING_SUCCEEDED',
  LOADING_FAILED = 'LOADING_FAILED',
  PARTIAL_DATA_LOADED = 'PARTIAL_DATA_LOADED',
  SAVE_TIMELINE_POINT = 'SAVE_TIMELINE_POINT',
  SELECT_TIMEPOINT = 'SELECT_TIMEPOINT',
  SELECT_DOC = 'SELECT_DOC',
}

export function TimelineReducer(
  state: TimelineState,
  action: TimelineAction
): TimelineState {
  const {
    type,
    docId,
    dataPayload,
    docVersionsPayload,
    errorPayload,
    selectTimepointPayload,
  } = action;

  switch (type) {
    case TimelineActionType.LOADING_STARTED:
      if (!docId) return state;
      return {
        ...state,
        documentStates: {
          ...state.documentStates,
          [docId]: {
            ...state.documentStates[docId],
            status: LoadingStatusType.LOADING,
            error: undefined,
          },
        },
      };
    case TimelineActionType.PARTIAL_DATA_LOADED: {
      if (!docId || !dataPayload) return state;
      const currentDocState = state.documentStates[docId];
      return {
        ...state,
        documentStates: {
          ...state.documentStates,
          [docId]: {
            ...currentDocState,
            status: LoadingStatusType.LOADING,
            timeline: dataPayload,
            docVersions: docVersionsPayload
              ? [...(currentDocState.docVersions || []), ...docVersionsPayload]
              : currentDocState.docVersions,
            selectedTimepointVersionTime:
              dataPayload.timelinePoints.length > 0 &&
              (!currentDocState.selectedTimepointVersionTime ||
                state.selectedDocId !== docId)
                ? dataPayload.timelinePoints[
                    dataPayload.timelinePoints.length - 1
                  ].versionTime
                : currentDocState.selectedTimepointVersionTime,
            error: undefined,
          },
        },
      };
    }
    case TimelineActionType.LOADING_SUCCEEDED: {
      if (!docId || !dataPayload) return state;
      const docState = state.documentStates[docId] || {};
      return {
        ...state,
        documentStates: {
          ...state.documentStates,
          [docId]: {
            ...docState,
            status: LoadingStatusType.SUCCESS,
            timeline: dataPayload,
            docVersions: docVersionsPayload
              ? [...(docState.docVersions || []), ...docVersionsPayload]
              : docState.docVersions,
            selectedTimepointVersionTime:
              dataPayload.timelinePoints.length > 0 &&
              (!docState.selectedTimepointVersionTime ||
                state.selectedDocId !== docId)
                ? dataPayload.timelinePoints[
                    dataPayload.timelinePoints.length - 1
                  ].versionTime
                : docState.selectedTimepointVersionTime,
            error: undefined,
          },
        },
      };
    }
    case TimelineActionType.LOADING_FAILED: {
      if (!docId) return state;
      return {
        ...state,
        documentStates: {
          ...state.documentStates,
          [docId]: {
            ...state.documentStates[docId],
            status: LoadingStatusType.ERROR,
            error: errorPayload,
          },
        },
      };
    }
    case TimelineActionType.SELECT_TIMEPOINT: {
      const targetDocId = docId || state.selectedDocId;
      if (!targetDocId) return state;
      return {
        ...state,
        documentStates: {
          ...state.documentStates,
          [targetDocId]: {
            ...state.documentStates[targetDocId],
            selectedTimepointVersionTime: selectTimepointPayload?.versionTime,
          },
        },
      };
    }
    case TimelineActionType.SAVE_TIMELINE_POINT: {
      if (!action.savedTimelinePoint || !docId) {
        return state;
      }
      const currentTimeline = state.documentStates[docId]?.timeline;
      if (!currentTimeline) return state;
      return {
        ...state,
        documentStates: {
          ...state.documentStates,
          [docId]: {
            ...state.documentStates[docId],
            timeline: {
              ...currentTimeline,
              timelinePoints: currentTimeline.timelinePoints.map((tp) =>
                tp.versionTime === action.savedTimelinePoint?.versionTime
                  ? action.savedTimelinePoint
                  : tp
              ),
            },
            selectedTimepointVersionTime: action.savedTimelinePoint.versionTime,
          },
        },
      };
    }
    case TimelineActionType.SELECT_DOC: {
      if (!docId) return state;
      return {
        ...state,
        selectedDocId: docId,
      };
    }
    default:
      return { documentStates: {} };
  }
}
