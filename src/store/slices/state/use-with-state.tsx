/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { useAppSelector, useAppDispatch } from '../../hooks';
import {
  State,
  updateDocId,
  updateUserActivityStates,
  overrideAiModel as _overrideOpenAiModel,
  updateViewingUserRole,
  updateViewingAdvancedOptions,
  newSession as _newSession,
  setSessionIntention,
} from '.';
import {
  fetchUserActivityStates,
  updateUserActivityState as _updateUserActivityState,
} from '../../../hooks/api';
import { AiServiceModel, Intention, UserActivityState } from '../../../types';
import { UserRole } from '../login';

interface UseWithState {
  state: State;
  updateCurrentDocId: (docId: string) => void;
  loadUserActivityStates: (userId: string) => Promise<void>;
  updateUserActivityState: (
    userId: string,
    googleDocId: string,
    activityId: string,
    metadata: string
  ) => Promise<void>;
  overrideAiModel: (aiServiceModel?: AiServiceModel) => void;
  updateViewingUserRole: (role: UserRole) => void;
  updateViewingAdvancedOptions: (advancedOptions: boolean) => void;
  newSession: () => void;
  updateSessionIntention: (intention?: Intention) => void;
}

// Gives you a way to interface with the redux store (which has the user information)
export function useWithState(): UseWithState {
  const dispatch = useAppDispatch();
  const state: State = useAppSelector((state) => state.state);

  function overrideAiModel(model?: AiServiceModel) {
    dispatch(_overrideOpenAiModel(model));
  }

  function updateCurrentDocId(id: string) {
    dispatch(updateDocId(id));
  }

  async function loadUserActivityStates(userId: string): Promise<void> {
    const userActivityStates = await fetchUserActivityStates(userId);
    dispatch(updateUserActivityStates(userActivityStates));
  }

  async function updateUserActivityState(
    userId: string,
    googleDocId: string,
    activityId: string,
    metadata: string
  ): Promise<void> {
    const userActivityStatesHold: UserActivityState[] = JSON.parse(
      JSON.stringify(state.userActivityStates)
    );
    const updatedUserActivityState = await _updateUserActivityState(
      userId,
      activityId,
      googleDocId,
      metadata
    );
    const index = userActivityStatesHold.findIndex(
      (userActivityState) =>
        userActivityState.activityId === activityId &&
        userActivityState.googleDocId === googleDocId
    );
    if (index !== -1) {
      userActivityStatesHold[index] = updatedUserActivityState;
    } else {
      userActivityStatesHold.push(updatedUserActivityState);
    }
    dispatch(updateUserActivityStates(userActivityStatesHold));
    return;
  }

  function _updateViewingUserRole(role: UserRole) {
    dispatch(updateViewingUserRole(role));
  }

  function _updateViewingAdvancedOptions(advancedOptions: boolean) {
    dispatch(updateViewingAdvancedOptions(advancedOptions));
  }

  function newSession() {
    dispatch(_newSession());
  }

  function updateSessionIntention(intention?: Intention) {
    dispatch(setSessionIntention(intention));
  }
  return {
    state,
    updateCurrentDocId,
    loadUserActivityStates,
    updateUserActivityState,
    overrideAiModel,
    updateViewingUserRole: _updateViewingUserRole,
    updateViewingAdvancedOptions: _updateViewingAdvancedOptions,
    newSession,
    updateSessionIntention,
  };
}
