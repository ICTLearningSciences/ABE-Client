/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved.
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { useMemo } from 'react';
import { useAppSelector } from '../store/hooks';
import { LoginService, LoginStatus } from '../store/slices/login';
import { useWithPath } from './use-with-path';

export type BrowserType =
  | 'chrome'
  | 'firefox'
  | 'safari'
  | 'edge'
  | 'opera'
  | 'unknown';

export function useWithBrowserDetection() {
  const loginService = useAppSelector(
    (state) => state.login.user?.loginService
  );
  const loginStatus = useAppSelector((state) => state.login.loginStatus);
  const googleLogin = loginService === LoginService.GOOGLE;
  const path = useWithPath();
  const loggedIn =
    !path.isOnLoginPage && loginStatus === LoginStatus.AUTHENTICATED;
  const browser = useMemo(() => {
    if (typeof window === 'undefined' || !navigator?.userAgent) {
      return 'unknown';
    }

    const userAgent = navigator.userAgent.toLowerCase();

    if (userAgent.includes('edg/')) {
      return 'edge';
    }
    if (userAgent.includes('opr/') || userAgent.includes('opera')) {
      return 'opera';
    }
    if (userAgent.includes('chrome')) {
      return 'chrome';
    }
    if (userAgent.includes('safari')) {
      return 'safari';
    }
    if (userAgent.includes('firefox')) {
      return 'firefox';
    }

    return 'unknown';
  }, []);
  const warnFirefoxWithGoogleLogin =
    browser === 'firefox' && loggedIn && googleLogin;

  return { browser, warnFirefoxWithGoogleLogin };
}
