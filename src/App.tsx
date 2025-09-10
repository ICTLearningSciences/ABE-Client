/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from 'react';
import './App.css';
import AdminView from './pages/admin/admin-view';
import Login from './pages/login/login';
import { Provider } from 'react-redux';
import { store } from './store/store';
import Header from './components/header/header';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import DocView from './components/doc-view';
import { useWithLogin } from './store/slices/login/use-with-login';
import { useReduxHydration } from './use-redux-hydration';
import { useConfigLoader } from './components/config-loading/use-config-loader';
import DocHistoryContainer from './components/user-view/document-timeline/doc-history-container';
import { useWithFavicon } from './hooks/use-with-favicon';
import {
  AuthProviderProps,
  AuthProvider as CognitoAuthProvider,
} from 'react-oidc-context';
import CourseManagement from './pages/instructor/course-management';
import {
  courseManagementUrl,
  studentCoursesUrl,
} from './pages/instructor/course-management';
import { EducationalRole } from './types';
import { useWithRouteChangeRerender } from './hooks/use-with-route-change-rerender';

function MainApp() {
  const MAIN_APP_HEIGHT = '94vh';
  const useLogin = useWithLogin();
  const { stateCounter } = useWithRouteChangeRerender();

  const courseNavPath =
    useLogin.state.user?.educationalRole === EducationalRole.INSTRUCTOR
      ? courseManagementUrl
      : useLogin.state.user?.educationalRole === EducationalRole.STUDENT
      ? studentCoursesUrl
      : '';

  const freeDocEditingNavPath = '/docs';

  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <>
          <Header
            useLogin={useLogin}
            courseNavPath={courseNavPath}
            freeDocEditingNavPath={freeDocEditingNavPath}
          />
          <div
            style={{
              width: '100%',
              height: MAIN_APP_HEIGHT,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Login useLogin={useLogin} />
          </div>
        </>
      ),
    },
    {
      path: '/docs',
      element: (
        <>
          <Header
            useLogin={useLogin}
            courseNavPath={courseNavPath}
            freeDocEditingNavPath={freeDocEditingNavPath}
          />
          <div
            style={{
              width: '100%',
              height: MAIN_APP_HEIGHT,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AdminView />
          </div>
        </>
      ),
    },
    {
      path: '/docs/:docId',
      element: (
        <>
          <Header
            useLogin={useLogin}
            courseNavPath={courseManagementUrl}
            freeDocEditingNavPath={freeDocEditingNavPath}
          />
          <div
            style={{
              width: '100%',
              height: MAIN_APP_HEIGHT,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <DocView />
          </div>
        </>
      ),
    },
    {
      path: '/docs/history/:docId',
      element: <DocHistoryContainer useLogin={useLogin} />,
    },
    {
      path: courseManagementUrl,
      element: (
        <>
          <Header
            useLogin={useLogin}
            courseNavPath={courseNavPath}
            freeDocEditingNavPath={freeDocEditingNavPath}
          />
          <div
            style={{
              width: '100%',
              height: MAIN_APP_HEIGHT,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CourseManagement userRole={EducationalRole.INSTRUCTOR} />
          </div>
        </>
      ),
    },
    {
      path: studentCoursesUrl,
      element: (
        <>
          <Header
            useLogin={useLogin}
            courseNavPath={courseNavPath}
            freeDocEditingNavPath={freeDocEditingNavPath}
          />
          <div
            style={{
              width: '100%',
              height: MAIN_APP_HEIGHT,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CourseManagement userRole={EducationalRole.STUDENT} />
          </div>
        </>
      ),
    },
  ]);
  const { ConfigLoader, configLoaded } = useConfigLoader();
  useReduxHydration();
  useWithFavicon();
  if (!configLoaded) {
    return <ConfigLoader />;
  }
  return <RouterProvider key={stateCounter} router={router} />;
}

function App() {
  const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || '123';
  const cognitoAuthConfig: AuthProviderProps = {
    authority: process.env.REACT_APP_COGNITO_AUTHORITY || '',
    client_id: process.env.REACT_APP_COGNITO_CLIENT_ID || '',
    redirect_uri: window.location.origin,
    response_type: 'code',
    scope: 'email openid phone',
  };
  return (
    <Provider store={store}>
      <div style={{ height: '100vh' }}>
        <CognitoAuthProvider {...cognitoAuthConfig}>
          <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <MainApp />
          </GoogleOAuthProvider>
        </CognitoAuthProvider>
      </div>
    </Provider>
  );
}

export default App;
