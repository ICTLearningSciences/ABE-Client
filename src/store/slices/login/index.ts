/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  loginGoogle,
  refreshAccessToken as _refreshAccessToken,
} from '../../../hooks/api';
import { extractErrorMessageFromError } from '../../../helpers';
import { User, UserAccessToken } from '../../../types';
import {
  ACCESS_TOKEN_KEY,
  localStorageClear,
  localStorageStore,
} from '../../local-storage';

export enum LoginStatus {
  NONE = 0,
  NOT_LOGGED_IN = 1,
  IN_PROGRESS = 2,
  AUTHENTICATED = 3,
  FAILED = 4,
}

export enum LoginRejectedReason {
  NONE = 'NONE',
  DISABLED = 'DISABLED',
  FAILED = 'FAILED',
  NO_ACCOUNT_FOUND = 'NO_ACCOUNT_FOUND',
}

export enum UserRole {
  NONE = 'NONE',
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export interface LoginState {
  accessToken?: string;
  loginStatus: LoginStatus;
  user?: User;
  userRole: UserRole;
  isDisabled?: boolean;
  rejectedReason?: LoginRejectedReason;
}

const initialState: LoginState = {
  loginStatus: LoginStatus.NONE,
  userRole: UserRole.NONE,
};

export const refreshAccessToken = createAsyncThunk(
  'login/refreshAccessToken',
  async () => {
    return await _refreshAccessToken();
  }
);

export const logout = createAsyncThunk('login/logout', async () => {
  return Promise.resolve();
});

export const googleLogin = createAsyncThunk(
  'login/googleLogin',
  async (
    args: {
      accessToken: string;
    },
    thunkAPI
  ) => {
    try {
      const googleLogin = await loginGoogle(args.accessToken);
      // Note: This was previously done to convert from 15 min access token to 90 day access token, wrong way to go
      // return await login(googleLogin.accessToken);
      return googleLogin;
    } catch (err: unknown) {
      if (
        err instanceof Error &&
        err.message.includes('Your account has been disabled')
      ) {
        thunkAPI.dispatch(loginSlice.actions.setIsDisabled(true));
      }
      console.error(err);
      throw new Error(extractErrorMessageFromError(err));
    }
  }
);

/** Reducer */

export const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    setIsDisabled: (state: LoginState, action: PayloadAction<boolean>) => {
      state.isDisabled = action.payload;
    },
    setUser: (state: LoginState, action: PayloadAction<UserAccessToken>) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      localStorageStore(ACCESS_TOKEN_KEY, action.payload.accessToken);
      state.userRole = action.payload.user.userRole;
      state.loginStatus = LoginStatus.AUTHENTICATED;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logout.fulfilled, (state) => {
        localStorageClear(ACCESS_TOKEN_KEY);
        state.userRole = UserRole.NONE;
        state.accessToken = undefined;
        state.loginStatus = LoginStatus.NOT_LOGGED_IN;
      })
      .addCase(googleLogin.pending, (state) => {
        state.loginStatus = LoginStatus.IN_PROGRESS;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        localStorageStore(ACCESS_TOKEN_KEY, action.payload.accessToken);
        state.userRole = action.payload.user.userRole;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.loginStatus = LoginStatus.AUTHENTICATED;
      })
      .addCase(googleLogin.rejected, (state) => {
        state.loginStatus = LoginStatus.FAILED;
        localStorageClear(ACCESS_TOKEN_KEY);
      })

      .addCase(refreshAccessToken.pending, (state) => {
        state.loginStatus = LoginStatus.IN_PROGRESS;
      })
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        localStorageStore(ACCESS_TOKEN_KEY, action.payload.accessToken);
        state.userRole = action.payload.user.userRole;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.loginStatus = LoginStatus.AUTHENTICATED;
      })
      .addCase(refreshAccessToken.rejected, (state) => {
        state.loginStatus = LoginStatus.FAILED;
        localStorageClear(ACCESS_TOKEN_KEY);
      });
  },
});

export const { setIsDisabled, setUser } = loginSlice.actions;

export default loginSlice.reducer;
