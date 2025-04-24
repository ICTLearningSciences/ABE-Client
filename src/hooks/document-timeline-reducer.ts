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

export interface TimelineState {
  status: LoadingStatusType;
  data?: DehydratedGQLDocumentTimeline;
  docVersions?: IGDocVersion[];
  selectedTimepointVersionTime?: string;
  error?: LoadingError;
}

export interface TimelineAction {
  type: TimelineActionType;
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
}

export function TimelineReducer(
  state: TimelineState,
  action: TimelineAction
): TimelineState {
  const {
    type,
    dataPayload,
    docVersionsPayload,
    errorPayload,
    selectTimepointPayload,
  } = action;
  switch (type) {
    case TimelineActionType.LOADING_STARTED:
      return {
        status: LoadingStatusType.LOADING,
        data: undefined,
        docVersions: undefined,
        selectedTimepointVersionTime: undefined,
        error: undefined,
      };
    case TimelineActionType.PARTIAL_DATA_LOADED:
      return {
        status: LoadingStatusType.LOADING,
        data: dataPayload,
        docVersions: docVersionsPayload
          ? [...(state.docVersions || []), ...docVersionsPayload]
          : state.docVersions,
        selectedTimepointVersionTime:
          dataPayload &&
          dataPayload.timelinePoints.length > 0 &&
          !state.selectedTimepointVersionTime
            ? dataPayload.timelinePoints[dataPayload.timelinePoints.length - 1]
                .versionTime
            : state.selectedTimepointVersionTime,
        error: undefined,
      };
    case TimelineActionType.LOADING_SUCCEEDED:
      return {
        status: LoadingStatusType.SUCCESS,
        data: dataPayload,
        docVersions: docVersionsPayload
          ? [...(state.docVersions || []), ...docVersionsPayload]
          : state.docVersions,
        selectedTimepointVersionTime:
          dataPayload &&
          dataPayload.timelinePoints.length > 0 &&
          !state.selectedTimepointVersionTime
            ? dataPayload.timelinePoints[dataPayload.timelinePoints.length - 1]
                .versionTime
            : state.selectedTimepointVersionTime,
        error: undefined,
      };
    case TimelineActionType.LOADING_FAILED:
      return {
        status: LoadingStatusType.ERROR,
        error: errorPayload,
        data: undefined,
      };
    case TimelineActionType.SELECT_TIMEPOINT:
      return {
        ...state,
        selectedTimepointVersionTime: selectTimepointPayload?.versionTime,
      };
    case TimelineActionType.SAVE_TIMELINE_POINT:
      if (!action.savedTimelinePoint) {
        return state;
      }
      return {
        ...state,
        data: state.data
          ? {
              ...state.data,
              timelinePoints: state.data?.timelinePoints.map((tp) =>
                tp.versionTime === action.savedTimelinePoint?.versionTime
                  ? action.savedTimelinePoint
                  : tp
              ),
            }
          : undefined,
        selectedTimepointVersionTime: action.savedTimelinePoint.versionTime,
      };
    default:
      return { status: LoadingStatusType.NONE };
  }
}
