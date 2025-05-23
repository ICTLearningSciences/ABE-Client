/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React, { useEffect } from 'react';
import { UseWithLogin } from '../../store/slices/login/use-with-login';
import { LoginStatus } from '../../store/slices/login';
import { useGoogleLogin } from '@react-oauth/google';
import { useAppSelector } from '../../store/hooks';
import { LoginUI } from './login-ui';
import { useNavigateWithParams } from '../../hooks/use-navigate-with-params';
import { useAuth } from 'react-oidc-context';
export default function Login(props: { useLogin: UseWithLogin }): JSX.Element {
  const { useLogin } = props;
  const { loginWithGoogle, state: loginState } = useLogin;
  const navigate = useNavigateWithParams();
  const config = useAppSelector((state) => state.config);
  const { loginWithAmazonCognito } = useLogin;
  const orgName = config.config?.orgName || 'ABE';
  const loginGoogle = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      loginWithGoogle(tokenResponse.access_token);
      navigate('/docs');
    },
  });
  const awsCognitoAuth = useAuth();

  useEffect(() => {
    if (awsCognitoAuth.isAuthenticated && awsCognitoAuth.user?.id_token) {
      loginWithAmazonCognito(awsCognitoAuth.user?.id_token);
    }
  }, [awsCognitoAuth.isAuthenticated, awsCognitoAuth.user?.id_token]);

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
      <LoginUI
        loginState={loginState}
        login={loginGoogle}
        loginText="Sign in with Google"
        orgName={orgName}
      />
    </div>
  );
}
