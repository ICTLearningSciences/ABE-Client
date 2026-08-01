/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/

export type LoadingStatus = 0 | 1 | 2 | 3 | 4;
export type LoadingActionType =
  | "LOADING_STARTED"
  | "LOADING_SUCCEEDED"
  | "LOADING_FAILED"
  | "SAVING_STARTED"
  | "SAVING_SUCCEEDED"
  | "SAVING_FAILED";
export type LoadingStatusType =
  "NONE" | "SAVING" | "LOADING" | "SUCCESS" | "ERROR";

export interface LoadingError {
  message: string;
  error: string;
}

export interface LoadingState {
  status: LoadingStatusType;
  error?: LoadingError;
}

export interface LoadingAction {
  type: LoadingActionType;
  payload?: LoadingError;
}

export function LoadingReducer(
  _state: LoadingState,
  action: LoadingAction,
): LoadingState {
  const { type, payload } = action;
  switch (type) {
    case "LOADING_STARTED":
      return { status: "LOADING" };
    case "SAVING_STARTED":
      return { status: "SAVING" };
    case "LOADING_SUCCEEDED":
    case "SAVING_SUCCEEDED":
      return { status: "SUCCESS" };
    case "LOADING_FAILED":
    case "SAVING_FAILED":
      return { status: "ERROR", error: payload };
    default:
      return { status: "NONE" };
  }
}
