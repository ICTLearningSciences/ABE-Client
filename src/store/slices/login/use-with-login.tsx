/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { useAppSelector, useAppDispatch } from '../../hooks';
import * as loginActions from '.';
import { useEffect } from 'react';
import {
  ACCESS_TOKEN_KEY,
  CLASSROOM_CODE_KEY,
  localStorageClear,
  localStorageGet,
} from '../../local-storage';
import { UpdateUserInfo, User, UserAccessToken } from '../../../types';
import { removeQueryParamFromUrl } from '../../../helpers';
import { useAuth } from 'react-oidc-context';

export interface UseWithLogin {
  state: loginActions.LoginState;
  logout: () => Promise<void>;
  loginWithGoogle: (googleAccessToken: string) => Promise<void>;
  loginWithMicrosoft: (microsoftAccessToken: string) => Promise<void>;
  loginWithAmazonCognito: (cognitoIdToken: string) => Promise<void>;
  refreshAccessToken: () => void;
  setUser: (user: UserAccessToken) => void;
  updateUserInfo: (userInfo: UpdateUserInfo) => Promise<User>;
}

// Gives you a way to interface with the redux store (which has the user information)
export function useWithLogin(): UseWithLogin {
  const dispatch = useAppDispatch();
  const state: loginActions.LoginState = useAppSelector((state) => state.login);
  const awsCognitoAuth = useAuth();

  useEffect(() => {
    checkForClassroomCode(state.loginStatus);
    if (
      state.loginStatus === loginActions.LoginStatus.AUTHENTICATED ||
      state.loginStatus === loginActions.LoginStatus.IN_PROGRESS
    ) {
      return;
    }
    const token = localStorageGet(ACCESS_TOKEN_KEY);
    if (token) {
      refreshAccessToken();
    } else {
      dispatch(loginActions.logout());
    }
  }, [state.loginStatus]);

  async function checkForClassroomCode(loginStatus: loginActions.LoginStatus) {
    if (loginStatus !== loginActions.LoginStatus.AUTHENTICATED) {
      return;
    }
    const urlParams = new URLSearchParams(window.location.search);
    const classroomCodeUrlParam = urlParams.get('classroomCode');
    const classroomCodeLocalStorage = localStorageGet(CLASSROOM_CODE_KEY);
    if (classroomCodeUrlParam) {
      await updateUserInfo({ classroomCode: classroomCodeUrlParam });
    } else if (classroomCodeLocalStorage) {
      await updateUserInfo({ classroomCode: classroomCodeLocalStorage });
    }
    removeQueryParamFromUrl('classroomCode');
    localStorageClear(CLASSROOM_CODE_KEY);
  }

  async function loginWithGoogle(googleAccessToken: string) {
    if (
      state.loginStatus === loginActions.LoginStatus.NONE ||
      state.loginStatus === loginActions.LoginStatus.NOT_LOGGED_IN ||
      state.loginStatus === loginActions.LoginStatus.FAILED
    ) {
      await dispatch(
        loginActions.login({
          accessToken: googleAccessToken,
          service: loginActions.LoginService.GOOGLE,
        })
      );
    }
  }

  async function loginWithMicrosoft(microsoftAccessToken: string) {
    if (
      state.loginStatus === loginActions.LoginStatus.NONE ||
      state.loginStatus === loginActions.LoginStatus.NOT_LOGGED_IN ||
      state.loginStatus === loginActions.LoginStatus.FAILED
    ) {
      await dispatch(
        loginActions.login({
          accessToken: microsoftAccessToken,
          service: loginActions.LoginService.MICROSOFT,
        })
      );
    }
  }

  async function loginWithAmazonCognito(cognitoIdToken: string) {
    if (
      state.loginStatus === loginActions.LoginStatus.NONE ||
      state.loginStatus === loginActions.LoginStatus.NOT_LOGGED_IN ||
      state.loginStatus === loginActions.LoginStatus.FAILED
    ) {
      await dispatch(
        loginActions.login({
          accessToken: cognitoIdToken,
          service: loginActions.LoginService.AMAZON_COGNITO,
        })
      );
    }
  }

  function refreshAccessToken() {
    if (
      state.loginStatus === loginActions.LoginStatus.NONE ||
      state.loginStatus === loginActions.LoginStatus.NOT_LOGGED_IN ||
      state.loginStatus === loginActions.LoginStatus.FAILED
    ) {
      dispatch(loginActions.refreshAccessToken());
    }
  }

  async function logout() {
    if (awsCognitoAuth.isAuthenticated) {
      try {
        await awsCognitoAuth.signoutSilent();
      } catch (error) {
        console.error(error);
      }
    }
    await dispatch(loginActions.logout());
  }

  async function setUser(user: UserAccessToken) {
    dispatch(loginActions.setUser(user));
  }

  async function updateUserInfo(userInfo: UpdateUserInfo): Promise<User> {
    const user = await dispatch(loginActions._updateUserInfo(userInfo));
    return user.payload as User;
  }

  return {
    state,
    logout,
    loginWithGoogle,
    loginWithMicrosoft,
    loginWithAmazonCognito,
    refreshAccessToken,
    setUser,
    updateUserInfo,
  };
}
