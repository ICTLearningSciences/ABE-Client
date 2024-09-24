/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { useAppSelector, useAppDispatch } from '../../hooks';
import * as loginActions from '.';
import { useEffect } from 'react';
import { ACCESS_TOKEN_KEY, localStorageGet } from '../../local-storage';
import { UserAccessToken } from '../../../types';

export interface UseWithLogin {
  state: loginActions.LoginState;
  logout: () => Promise<void>;
  loginWithGoogle: (googleAccessToken: string) => Promise<void>;
  refreshAccessToken: () => void;
  setUser: (user: UserAccessToken) => void;
}

// Gives you a way to interface with the redux store (which has the user information)
export function useWithLogin(): UseWithLogin {
  const dispatch = useAppDispatch();
  const state: loginActions.LoginState = useAppSelector((state) => state.login);

  useEffect(() => {
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

  async function loginWithGoogle(googleAccessToken: string) {
    if (
      state.loginStatus === loginActions.LoginStatus.NONE ||
      state.loginStatus === loginActions.LoginStatus.NOT_LOGGED_IN ||
      state.loginStatus === loginActions.LoginStatus.FAILED
    ) {
      await dispatch(
        loginActions.googleLogin({
          accessToken: googleAccessToken,
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
    await dispatch(loginActions.logout());
  }

  async function setUser(user: UserAccessToken) {
    dispatch(loginActions.setUser(user));
  }

  return {
    state,
    logout,
    loginWithGoogle,
    refreshAccessToken,
    setUser,
  };
}
