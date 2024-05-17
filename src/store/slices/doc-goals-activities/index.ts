/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ActivityGQL, DocGoalGQl } from '../../../types';
import {
  fetchDocGoals as _fetchDocGoals,
  fetchActivities as _fetchActivities,
  addOrUpdateActivity as _addOrUpdateActivity,
} from '../../../hooks/api';

export enum LoadStatus {
  NONE,
  LOADING,
  SUCCEEDED,
  FAILED,
}

export interface State {
  docGoals: DocGoalGQl[];
  docGoalsLoadStatus: LoadStatus;
  activities: ActivityGQL[];
  activitiesLoadStatus: LoadStatus;
}

const initialState: State = {
  docGoals: [],
  docGoalsLoadStatus: LoadStatus.NONE,
  activities: [],
  activitiesLoadStatus: LoadStatus.NONE,
};

export const fetchDocGoals = createAsyncThunk(
  'state/fetchDocGoals',
  async () => {
    return await _fetchDocGoals();
  }
);

export const fetchActivities = createAsyncThunk(
  'state/fetchActivities',
  async () => {
    return await _fetchActivities();
  }
);

export const addOrUpdateActivity = createAsyncThunk(
  'state/addOrUpdateActivity',
  async (activity: ActivityGQL) => {
    return await _addOrUpdateActivity(activity);
  }
);

/** Reducer */
export const stateSlice = createSlice({
  name: 'state',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDocGoals.pending, (state) => {
        state.docGoalsLoadStatus = LoadStatus.LOADING;
      })
      .addCase(fetchDocGoals.fulfilled, (state, action) => {
        state.docGoals = action.payload;
        state.docGoalsLoadStatus = LoadStatus.SUCCEEDED;
      })
      .addCase(fetchDocGoals.rejected, (state) => {
        state.docGoalsLoadStatus = LoadStatus.FAILED;
      })

      .addCase(fetchActivities.pending, (state) => {
        state.activitiesLoadStatus = LoadStatus.LOADING;
      })
      .addCase(fetchActivities.fulfilled, (state, action) => {
        state.activities = action.payload;
        state.activitiesLoadStatus = LoadStatus.SUCCEEDED;
      })
      .addCase(fetchActivities.rejected, (state) => {
        state.activitiesLoadStatus = LoadStatus.FAILED;
      })

      .addCase(addOrUpdateActivity.fulfilled, (state, action) => {
        state.activities = state.activities.map((a) => {
          if (a._id === action.payload._id) {
            return action.payload;
          }
          return a;
        });
      });
  },
});

export default stateSlice.reducer;
