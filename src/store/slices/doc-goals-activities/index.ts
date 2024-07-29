/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ActivityGQL, DocGoalGQl } from '../../../types';
import {
  fetchDocGoals as _fetchDocGoals,
  fetchActivities as _fetchActivities,
  addOrUpdateActivity as _addOrUpdateActivity,
} from '../../../hooks/api';
import {
  fetchBuiltActivities as _fetchBuiltActivities,
  addOrUpdateBuiltActivity as _addOrUpdateBuiltActivity,
  storeActivityVersion,
  fetchActivityVersions as _fetchActivityVersions,
} from '../../../hooks/built-activity-api';
import {
  ActivityBuilder,
  BuiltActivityVersion,
} from '../../../components/activity-builder/types';

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
  builtActivities: ActivityBuilder[];
  builtActivitiesLoadStatus: LoadStatus;
  builtActivityVersions: Record<string, BuiltActivityVersion[]>;
  builtActivityVersionsLoadStatus: LoadStatus;
}

const initialState: State = {
  docGoals: [],
  docGoalsLoadStatus: LoadStatus.NONE,
  activities: [],
  activitiesLoadStatus: LoadStatus.NONE,
  builtActivities: [],
  builtActivitiesLoadStatus: LoadStatus.NONE,
  builtActivityVersions: {},
  builtActivityVersionsLoadStatus: LoadStatus.NONE,
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

export const fetchBuiltActivities = createAsyncThunk(
  'state/fetchBuiltActivities',
  async () => {
    return await _fetchBuiltActivities();
  }
);

export const addOrUpdateBuiltActivity = createAsyncThunk(
  'state/addOrUpdateBuiltActivity',
  async (activity: ActivityBuilder) => {
    return await _addOrUpdateBuiltActivity(activity);
  }
);

export const storeActivityVersionForActivity = createAsyncThunk(
  'state/storeActivityVersionForActivity',
  async (activity: ActivityBuilder) => {
    return await storeActivityVersion(activity);
  }
);

export const fetchActivityVersions = createAsyncThunk(
  'state/fetchActivityVersions',
  async (activityClientId: string) => {
    const versions = await _fetchActivityVersions(activityClientId);
    return {
      activityClientId,
      versions,
    };
  }
);

/** Reducer */
export const stateSlice = createSlice({
  name: 'state',
  initialState,
  reducers: {
    addNewLocalBuiltActivity: (
      state,
      action: PayloadAction<ActivityBuilder>
    ) => {
      state.builtActivities.push(action.payload);
    },
  },
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

      .addCase(fetchBuiltActivities.pending, (state) => {
        state.builtActivitiesLoadStatus = LoadStatus.LOADING;
      })
      .addCase(fetchBuiltActivities.fulfilled, (state, action) => {
        state.builtActivities = action.payload;
        state.builtActivitiesLoadStatus = LoadStatus.SUCCEEDED;
      })
      .addCase(fetchBuiltActivities.rejected, (state) => {
        state.builtActivitiesLoadStatus = LoadStatus.FAILED;
      })

      .addCase(addOrUpdateActivity.fulfilled, (state, action) => {
        state.activities = state.activities.map((a) => {
          if (a._id === action.payload._id) {
            return action.payload;
          }
          return a;
        });
      })

      .addCase(addOrUpdateBuiltActivity.fulfilled, (state, action) => {
        const activityIndex = state.builtActivities.findIndex(
          (a) => a.clientId === action.payload.clientId
        );
        if (activityIndex >= 0) {
          state.builtActivities[activityIndex] = action.payload;
        } else {
          state.builtActivities.push(action.payload);
        }
      })

      .addCase(fetchActivityVersions.pending, (state) => {
        state.builtActivityVersionsLoadStatus = LoadStatus.LOADING;
      })

      .addCase(fetchActivityVersions.fulfilled, (state, action) => {
        state.builtActivityVersionsLoadStatus = LoadStatus.SUCCEEDED;
        state.builtActivityVersions[action.payload.activityClientId] =
          action.payload.versions.sort((a, b) => {
            return (
              new Date(b.versionTime).getTime() -
              new Date(a.versionTime).getTime()
            );
          });
      })

      .addCase(fetchActivityVersions.rejected, (state) => {
        state.builtActivityVersionsLoadStatus = LoadStatus.FAILED;
      })

      .addCase(storeActivityVersionForActivity.fulfilled, (state, action) => {
        const activityClientId = action.payload.activity.clientId;
        const versions = [
          ...(state.builtActivityVersions[activityClientId] || []),
          action.payload,
        ];
        const sortedVersions = versions.sort((a, b) => {
          return (
            new Date(b.versionTime).getTime() -
            new Date(a.versionTime).getTime()
          );
        });
        state.builtActivityVersions[activityClientId] = sortedVersions;
      });
  },
});

export const { addNewLocalBuiltActivity } = stateSlice.actions;

export default stateSlice.reducer;
