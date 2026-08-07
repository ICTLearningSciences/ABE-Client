/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/

import type {
  LoadingActionType,
  LoadingError,
  LoadingStatusType,
} from "./loading-reducer";

export interface LoadingState<T> {
  status: LoadingStatusType;
  data?: T;
  error?: LoadingError;
}

export interface LoadingAction<T> {
  type: LoadingActionType;
  dataPayload?: T;
  errorPayload?: LoadingError;
}

export function LoadingReducer<T>(
  _state: LoadingState<T>,
  action: LoadingAction<T>,
): LoadingState<T> {
  const { type, dataPayload, errorPayload } = action;
  switch (type) {
    case "LOADING_STARTED":
      return { status: "LOADING" };
    case "SAVING_STARTED":
      return { status: "SAVING" };
    case "LOADING_SUCCEEDED":
    case "SAVING_SUCCEEDED":
      return { status: "SUCCESS", data: dataPayload };
    case "LOADING_FAILED":
    case "SAVING_FAILED":
      return {
        status: "ERROR",
        error: errorPayload,
        data: undefined,
      };
    default:
      return { status: "NONE" };
  }
}
