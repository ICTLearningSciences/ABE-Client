/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from 'react';
import { CircularProgress } from '@mui/material';
import { Header } from './components/header';
import { LoginStatus } from '../../store/slices/login';
import { useWithLogin } from '../../store/slices/login/use-with-login';
import Login from '../login/login';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const withAuthorizationOnly = (Component: any) => (props: any) => {
  const useLogin = useWithLogin();
  const loginState = useLogin.state;

  if (
    loginState.loginStatus === LoginStatus.NONE ||
    loginState.loginStatus === LoginStatus.IN_PROGRESS
  ) {
    return (
      <main className="root">
        <div
          className="page row center-div"
          style={{ height: '100%', width: '100%' }}
        >
          <CircularProgress />
        </div>
      </main>
    );
  }

  return loginState.loginStatus === LoginStatus.AUTHENTICATED ? (
    <Component
      {...props}
      accessToken={loginState.accessToken}
      user={loginState.user}
    />
  ) : (
    <main className="root">
      <Header title="Login" />
      <div
        className="page row center-div"
        style={{ height: '100%', width: '100%' }}
      >
        <Login useLogin={useLogin} loginTo="/shark-tank" />
      </div>
    </main>
  );
};

export default withAuthorizationOnly;
