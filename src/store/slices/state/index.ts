/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  GoogleDoc,
  Intention,
  StoreGoogleDoc,
  UserActivityState,
} from '../../../types';
import { UserRole } from '../login';
import { GptModels } from '../../../constants';
import { v4 as uuidv4 } from 'uuid';
import {
  deleteGoogleDoc,
  fetchGoogleDocs,
  updateGoogleDocStorage,
} from '../../../hooks/api';

export enum GoogleDocsLoadStatus {
  NONE,
  LOADING,
  SUCCEEDED,
  FAILED,
}

export interface State {
  googleDocId: string;
  userGoogleDocs: GoogleDoc[];
  userGoogleDocsLoadStatus: GoogleDocsLoadStatus;
  sessionId: string;
  sessionIntention?: Intention;
  userActivityStates: UserActivityState[];
  overideGptModel: GptModels;
  viewingRole: UserRole;
  viewingAdvancedOptions: boolean;
}

const initialState: State = {
  googleDocId: '',
  userGoogleDocsLoadStatus: GoogleDocsLoadStatus.NONE,
  userGoogleDocs: [],
  sessionId: uuidv4(),
  userActivityStates: [],
  overideGptModel: GptModels.NONE,
  viewingRole: UserRole.USER,
  viewingAdvancedOptions: false,
};

export const loadUserGoogleDocs = createAsyncThunk(
  'state/loadUserGoogleDocs',
  async (args: { userId: string }) => {
    return await fetchGoogleDocs(args.userId);
  }
);

export interface DeleteUserGoogleDocArgs {
  googleDocId: string;
  userId: string;
}

export const deleteUserGoogleDoc = createAsyncThunk(
  'state/deleteUserGoogleDoc',
  async (args: DeleteUserGoogleDocArgs) => {
    return await deleteGoogleDoc(args.googleDocId, args.userId);
  }
);

export const updateGoogleDoc = createAsyncThunk(
  'state/updateGoogleDoc',
  async (args: { googleDoc: StoreGoogleDoc }) => {
    return await updateGoogleDocStorage(args.googleDoc);
  }
);

/** Reducer */
export const stateSlice = createSlice({
  name: 'state',
  initialState,
  reducers: {
    updateDocId: (state: State, action: PayloadAction<string>) => {
      state.googleDocId = action.payload;
    },
    newSession: (state: State) => {
      state.sessionId = uuidv4();
      state.sessionIntention = undefined;
    },
    setSessionIntention: (
      state: State,
      action: PayloadAction<Intention | undefined>
    ) => {
      state.sessionIntention = action.payload;
    },
    updateUserActivityStates: (
      state: State,
      action: PayloadAction<UserActivityState[]>
    ) => {
      state.userActivityStates = action.payload;
    },
    overrideOpenAiModel: (state: State, action: PayloadAction<GptModels>) => {
      state.overideGptModel = action.payload;
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
  extraReducers: (builder) => {
    builder.addCase(loadUserGoogleDocs.fulfilled, (state, action) => {
      state.userGoogleDocsLoadStatus = GoogleDocsLoadStatus.SUCCEEDED;
      state.userGoogleDocs = action.payload;
    }),
      builder.addCase(loadUserGoogleDocs.rejected, (state) => {
        state.userGoogleDocsLoadStatus = GoogleDocsLoadStatus.FAILED;
        state.userGoogleDocs = [];
      }),
      builder.addCase(loadUserGoogleDocs.pending, (state) => {
        state.userGoogleDocsLoadStatus = GoogleDocsLoadStatus.LOADING;
        state.userGoogleDocs = [];
      });

    builder.addCase(updateGoogleDoc.fulfilled, (state, action) => {
      state.userGoogleDocs = state.userGoogleDocs.map((doc) => {
        if (doc.googleDocId === action.payload.googleDocId) {
          return action.payload;
        }
        return doc;
      });
    });

    builder.addCase(deleteUserGoogleDoc.fulfilled, (state, action) => {
      state.userGoogleDocs = state.userGoogleDocs.filter(
        (doc) => doc.googleDocId !== action.payload.googleDocId
      );
    });
  },
});

export const {
  updateDocId,
  updateUserActivityStates,
  overrideOpenAiModel,
  updateViewingUserRole,
  updateViewingAdvancedOptions,
  newSession,
  setSessionIntention,
} = stateSlice.actions;

export default stateSlice.reducer;
