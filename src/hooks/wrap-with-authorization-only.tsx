/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React, { useEffect } from 'react';
import { CircularProgress } from '@mui/material';
import { LoginStatus } from '../store/slices/login';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const withAuthorizationOnly = (Component: any) => (props: any) => {
  const loginState = useAppSelector((state) => state.login);
  const navigate = useNavigate();

  useEffect(()=>{
    if (
      (loginState.loginStatus === LoginStatus.NOT_LOGGED_IN ||
        loginState.loginStatus === LoginStatus.FAILED) &&
      !loginState.accessToken
    ) {
      if (typeof window !== 'undefined') {
        navigate('/');
      }
      navigate('/');
    }
  }, [loginState])

  if (
    loginState.loginStatus === LoginStatus.NONE ||
    loginState.loginStatus === LoginStatus.IN_PROGRESS
  ) {
    return (
      <div>
        <CircularProgress />
      </div>
    );
  }


  return loginState.loginStatus === LoginStatus.AUTHENTICATED ? (
    <Component
      {...props}
      accessToken={loginState.accessToken}
      user={loginState.user}
    />
  ) : (
    <div>
      <CircularProgress />
    </div>
  );
};

export default withAuthorizationOnly;
