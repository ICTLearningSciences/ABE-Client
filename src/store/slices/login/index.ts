/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/

import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import {
  loginGoogle,
  refreshAccessToken as _refreshAccessToken,
  updateUserInfo,
} from "../../../hooks/api";
import { loginAmazonCognito } from "../../../hooks/aws-cognito-api";
import { extractErrorMessageFromError } from "../../../helpers";
import type { UpdateUserInfo, User, UserAccessToken } from "../../../types";
import {
  ACCESS_TOKEN_KEY,
  localStorageClear,
  localStorageStore,
} from "../../local-storage";
import { loginMicrosoft } from "../../../hooks/microsoft-api";

export type LoginStatus = 0 | 1 | 2 | 3 | 4;
export type LoginRejectedReason =
  "NONE" | "DISABLED" | "FAILED" | "NO_ACCOUNT_FOUND";
export type UserRole = "NONE" | "ADMIN" | "CONTENT_MANAGER" | "USER";
export type LoginService = "GOOGLE" | "MICROSOFT" | "AMAZON_COGNITO";

export interface LoginState {
  accessToken?: string;
  loginStatus: LoginStatus;
  user?: User;
  userRole: UserRole;
  isDisabled?: boolean;
  rejectedReason?: LoginRejectedReason;
}

const initialState: LoginState = {
  loginStatus: 0,
  userRole: "NONE",
};

export const refreshAccessToken = createAsyncThunk(
  "login/refreshAccessToken",
  async () => {
    return await _refreshAccessToken();
  },
);

export const logout = createAsyncThunk("login/logout", async () => {
  return Promise.resolve();
});

export const login = createAsyncThunk(
  "login/login",
  async (
    args: {
      accessToken: string;
      service: LoginService;
    },
    thunkAPI,
  ) => {
    try {
      const login =
        args.service === "GOOGLE"
          ? await loginGoogle(args.accessToken)
          : args.service === "AMAZON_COGNITO"
            ? await loginAmazonCognito(args.accessToken)
            : await loginMicrosoft(args.accessToken);
      // Note: This was previously done to convert from 15 min access token to 90 day access token, wrong way to go
      // return await login(googleLogin.accessToken);
      return login;
    } catch (err: unknown) {
      if (
        err instanceof Error &&
        err.message.includes("Your account has been disabled")
      ) {
        thunkAPI.dispatch(loginSlice.actions.setIsDisabled(true));
      }
      console.error(err);
      throw new Error(extractErrorMessageFromError(err));
    }
  },
);

export const _updateUserInfo = createAsyncThunk(
  "login/updateUserInfo",
  async (userInfo: UpdateUserInfo) => {
    return await updateUserInfo(userInfo);
  },
);

/** Reducer */

export const loginSlice = createSlice({
  name: "login",
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
      state.loginStatus = 3;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logout.fulfilled, (state) => {
        localStorageClear(ACCESS_TOKEN_KEY);
        state.userRole = "NONE";
        state.accessToken = undefined;
        state.loginStatus = 1;
      })
      .addCase(login.pending, (state) => {
        state.loginStatus = 2;
      })
      .addCase(login.fulfilled, (state, action) => {
        localStorageStore(ACCESS_TOKEN_KEY, action.payload.accessToken);
        state.userRole = action.payload.user.userRole;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.loginStatus = 3;
      })
      .addCase(login.rejected, (state) => {
        state.loginStatus = 4;
        localStorageClear(ACCESS_TOKEN_KEY);
      })

      .addCase(refreshAccessToken.pending, (state) => {
        state.loginStatus = 2;
      })
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        localStorageStore(ACCESS_TOKEN_KEY, action.payload.accessToken);
        state.userRole = action.payload.user.userRole;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.loginStatus = 3;
      })
      .addCase(refreshAccessToken.rejected, (state) => {
        state.loginStatus = 4;
        localStorageClear(ACCESS_TOKEN_KEY);
      });

    builder.addCase(_updateUserInfo.fulfilled, (state, action) => {
      state.user = {
        ...state.user,
        ...action.payload,
      };
    });
  },
});

export const { setIsDisabled, setUser } = loginSlice.actions;

export default loginSlice.reducer;
