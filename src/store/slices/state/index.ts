/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  AiServiceModel,
  DocService,
  DocData,
  UserDoc,
  Intention,
  StoreUserDoc,
} from '../../../types';
import { UserRole } from '../login';
import { v4 as uuidv4 } from 'uuid';
import {
  archiveDoc,
  deleteUserDoc as _deleteUserDoc,
  fetchDocs,
  updateDocStorage,
} from '../../../hooks/api';

export enum UserDocsLoadStatus {
  NONE,
  LOADING,
  SUCCEEDED,
  FAILED,
}

export interface State {
  googleDocId: string;
  docService: DocService;
  mostRecentDocVersion?: DocData;
  userDocs: UserDoc[];
  userDocsLoadStatus: UserDocsLoadStatus;
  sessionId: string;
  sessionIntention?: Intention;
  overrideAiServiceModel?: AiServiceModel;
  viewingRole: UserRole;
  viewingAdvancedOptions: boolean;
  warnExpiredAccessToken: boolean;
}

const initialState: State = {
  googleDocId: '',
  docService: DocService.GOOGLE_DOCS,
  userDocsLoadStatus: UserDocsLoadStatus.NONE,
  userDocs: [],
  sessionId: uuidv4(),
  overrideAiServiceModel: undefined,
  viewingRole: UserRole.USER,
  viewingAdvancedOptions: false,
  warnExpiredAccessToken: false,
};

export const loadUserDocs = createAsyncThunk(
  'state/loadUserDocs',
  async (args: { userId: string }) => {
    return await fetchDocs(args.userId);
  }
);

export interface DeleteUserDocArgs {
  googleDocId: string;
  userId: string;
}

export const deleteUserDoc = createAsyncThunk(
  'state/deleteUserDoc',
  async (args: DeleteUserDocArgs) => {
    return await _deleteUserDoc(args.googleDocId, args.userId);
  }
);

export const updateUserDoc = createAsyncThunk(
  'state/updateUserDoc',
  async (args: { userDoc: StoreUserDoc }) => {
    return await updateDocStorage(args.userDoc);
  }
);

export const setArchiveUserDoc = createAsyncThunk(
  'state/setArchiveUserDoc',
  async (args: { googleDocId: string; userId: string; archive: boolean }) => {
    return await archiveDoc(args.googleDocId, args.userId, args.archive);
  }
);

interface UpdateDocTitle {
  googleDocId: string;
  title: string;
}

/** Reducer */
export const stateSlice = createSlice({
  name: 'state',
  initialState,
  reducers: {
    updateDocService: (state: State, action: PayloadAction<DocService>) => {
      state.docService = action.payload;
    },
    setWarnExpiredAccessToken: (
      state: State,
      action: PayloadAction<boolean>
    ) => {
      state.warnExpiredAccessToken = action.payload;
    },
    updateDocId: (state: State, action: PayloadAction<string>) => {
      if (!action.payload) {
        state.mostRecentDocVersion = undefined;
      }
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
    overrideAiModel: (
      state: State,
      action: PayloadAction<AiServiceModel | undefined>
    ) => {
      state.overrideAiServiceModel = action.payload;
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
    updateDocTitleLocally: (
      state: State,
      action: PayloadAction<UpdateDocTitle>
    ) => {
      state.userDocs = state.userDocs.map((doc) => {
        if (doc.googleDocId === action.payload.googleDocId) {
          doc.title = action.payload.title;
        }
        return doc;
      });
    },
    storeMostRecentDocVersion: (
      state: State,
      action: PayloadAction<DocData>
    ) => {
      state.mostRecentDocVersion = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadUserDocs.fulfilled, (state, action) => {
      state.userDocsLoadStatus = UserDocsLoadStatus.SUCCEEDED;
      state.userDocs = action.payload;
    }),
      builder.addCase(loadUserDocs.rejected, (state) => {
        state.userDocsLoadStatus = UserDocsLoadStatus.FAILED;
        state.userDocs = [];
      }),
      builder.addCase(loadUserDocs.pending, (state) => {
        state.userDocsLoadStatus = UserDocsLoadStatus.LOADING;
        state.userDocs = [];
      });

    builder.addCase(updateUserDoc.fulfilled, (state, action) => {
      state.userDocs = state.userDocs.map((doc) => {
        if (doc.googleDocId === action.payload.googleDocId) {
          return action.payload;
        }
        return doc;
      });
    });
    builder.addCase(deleteUserDoc.fulfilled, (state, action) => {
      state.userDocs = state.userDocs.filter(
        (doc) => doc.googleDocId !== action.payload.googleDocId
      );
    });

    builder.addCase(setArchiveUserDoc.fulfilled, (state, action) => {
      state.userDocs = state.userDocs.map((doc) => {
        if (
          doc.googleDocId === action.payload.googleDocId &&
          doc.user === action.payload.user
        ) {
          return { ...doc, archived: action.payload.archived };
        }
        return doc;
      });
    });
  },
});

export const {
  updateDocId,
  overrideAiModel,
  updateViewingUserRole,
  updateViewingAdvancedOptions,
  newSession,
  setSessionIntention,
  updateDocTitleLocally,
  updateDocService,
  storeMostRecentDocVersion,
  setWarnExpiredAccessToken,
} = stateSlice.actions;

export default stateSlice.reducer;
