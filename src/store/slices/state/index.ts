/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserActivityState } from '../../../types';
import { UserRole } from '../login';

export interface State {
  googleDocId: string;
  userActivityStates: UserActivityState[];
  useGpt4: boolean;
  viewingRole: UserRole;
  viewingAdvancedOptions: boolean;
}

const initialState: State = {
  googleDocId: '',
  userActivityStates: [],
  useGpt4: false,
  viewingRole: UserRole.USER,
  viewingAdvancedOptions: false,
};

/** Reducer */
export const stateSlice = createSlice({
  name: 'state',
  initialState,
  reducers: {
    updateDocId: (state: State, action: PayloadAction<string>) => {
      state.googleDocId = action.payload;
    },
    updateUserActivityStates: (
      state: State,
      action: PayloadAction<UserActivityState[]>
    ) => {
      state.userActivityStates = action.payload;
    },
    toggleOpenAiModel: (state: State, action: PayloadAction<boolean>) => {
      state.useGpt4 = action.payload;
    },
    updateViewingUserRole: (state: State, action: PayloadAction<UserRole>) => {
      state.viewingRole = action.payload;
    },
    updateViewingAdvancedOptions: (
      state: State,
      action: PayloadAction<boolean>
    ) => {
      state.viewingAdvancedOptions = action.payload;
    },
  },
});

export const {
  updateDocId,
  updateUserActivityStates,
  toggleOpenAiModel,
  updateViewingUserRole,
  updateViewingAdvancedOptions,
} = stateSlice.actions;

export default stateSlice.reducer;
