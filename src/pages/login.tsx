/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React, { useEffect } from 'react';
import { UseWithLogin } from '../store/slices/login/use-with-login';
import { LoginStatus } from '../store/slices/login';
import { Button, CircularProgress } from '@mui/material';
import { useGoogleLogin } from '@react-oauth/google';
import AbeTitle from '../static-images/abe-title.png';
import AweTitle from '../static-images/awe-title.png';
import { ColumnCenterDiv, ColumnDiv } from '../styled-components';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';

export default function Login(props: { useLogin: UseWithLogin }): JSX.Element {
  const { useLogin } = props;
  const { loginWithGoogle, state: loginState } = useLogin;
  const navigate = useNavigate();
  const config = useAppSelector((state) => state.config);
  const orgName = config.config?.orgName || 'ABE';
  const loginGoogle = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      loginWithGoogle(tokenResponse.access_token);
      navigate('/docs');
    },
  });

  useEffect(() => {
    if (loginState.loginStatus === LoginStatus.AUTHENTICATED) {
      navigate('/docs');
    }
  }, [loginState.loginStatus]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <ColumnCenterDiv
        style={{
          width: '400px',
          textAlign: 'center',
          border: '1px solid lightgrey',
          padding: '20px',
          boxShadow: '-5px 5px 10px 0px rgba(0,0,0,0.75)',
        }}
      >
        <ColumnDiv
          style={{
            marginBottom: '20px',
          }}
        >
          <img
            style={{
              width: '320px',
              height: 'auto',
              boxShadow:
                orgName !== 'ABE'
                  ? '0px 0px 10px 0px rgba(0,0,0,0.75)'
                  : undefined,
            }}
            src={orgName === 'AWE' ? AweTitle : AbeTitle}
            alt={orgName}
          />
          <span data-cy="login-title" style={{ fontSize: '22px' }}>
            {config.config?.loginScreenTitle ||
              'AI for Brainstorming and Editing'}
          </span>
        </ColumnDiv>
        <span style={{ fontSize: '28px', fontWeight: 'bold' }}>
          Presented by USC Center for Generative AI and Society
        </span>
        <div>
          {loginState.loginStatus === LoginStatus.IN_PROGRESS ? (
            <CircularProgress />
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={() => loginGoogle()}
              style={{
                fontSize: '16px',
                margin: '10px',
                width: 300,
              }}
              data-cy="login-btn"
            >
              Sign in with Google
            </Button>
          )}
        </div>
      </ColumnCenterDiv>
    </div>
  );
}
