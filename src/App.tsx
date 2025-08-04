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
import InstructorDashboard, {
  instructorDashboardUrl,
} from './pages/instructor/dashboard';
import CourseEdit from './pages/instructor/course-edit';
import CourseView, {
  courseEditPath,
  courseViewPath,
} from './pages/instructor/course-view';
import SectionView, { sectionViewPath } from './pages/instructor/section-view';
import SectionEdit, { sectionEditPath } from './pages/instructor/section-edit';

function MainApp() {
  const mainAppHeight = '88vh';
  const useLogin = useWithLogin();

  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <>
          <Header useLogin={useLogin} />
          <div
            style={{
              width: '100%',
              height: mainAppHeight,
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
          <Header useLogin={useLogin} />
          <div
            style={{
              width: '100%',
              height: mainAppHeight,
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
          <Header useLogin={useLogin} />
          <div
            style={{
              width: '100%',
              height: mainAppHeight,
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
      path: instructorDashboardUrl,
      element: (
        <>
          <Header useLogin={useLogin} />
          <div
            style={{
              width: '100%',
              height: mainAppHeight,
              overflow: 'auto',
            }}
          >
            <InstructorDashboard />
          </div>
        </>
      ),
    },
    {
      path: courseEditPath,
      element: (
        <>
          <Header useLogin={useLogin} />
          <div
            style={{
              width: '100%',
              height: mainAppHeight,
              overflow: 'auto',
            }}
          >
            <CourseEdit />
          </div>
        </>
      ),
    },
    {
      path: courseViewPath,
      element: (
        <>
          <Header useLogin={useLogin} />
          <div
            style={{
              width: '100%',
              height: mainAppHeight,
              overflow: 'auto',
            }}
          >
            <CourseView />
          </div>
        </>
      ),
    },
    {
      path: sectionViewPath,
      element: (
        <>
          <Header useLogin={useLogin} />
          <div
            style={{
              width: '100%',
              height: mainAppHeight,
              overflow: 'auto',
            }}
          >
            <SectionView />
          </div>
        </>
      ),
    },
    {
      path: sectionEditPath,
      element: (
        <>
          <Header useLogin={useLogin} />
          <div
            style={{
              width: '100%',
              height: mainAppHeight,
              overflow: 'auto',
            }}
          >
            <SectionEdit />
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
  return <RouterProvider router={router} />;
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
