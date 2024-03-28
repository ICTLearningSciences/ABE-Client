/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from 'react';
import './App.css';
import { LoginStatus } from './store/slices/login';
import AdminView from './pages/admin/admin-view';
import Login from './pages/login';
import { Provider } from 'react-redux';
import { store } from './store/store';
import Header from './components/header';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import DocView from './components/doc-view';
import { useWithLogin } from './store/slices/login/use-with-login';
import DocumentTimelinePage from './components/user-view/document-timeline';

function MainApp() {
  const useLogin = useWithLogin();
  const loginStatus = useLogin.state.loginStatus;
  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <>
          <Header useLogin={useLogin} />
          <div
            style={{
              width: '100%',
              height: '94%', //header takes 6%
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {loginStatus === LoginStatus.AUTHENTICATED ? (
              <AdminView />
            ) : (
              <Login useLogin={useLogin} />
            )}
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
              height: '94%', //header takes 6%
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
      element: (
        <>
          <Header useLogin={useLogin} />
          <div
            style={{
              width: '100%',
              height: '94%', //header takes 6%
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <DocumentTimelinePage />
          </div>
        </>
      ),
    },
  ]);

  return <RouterProvider router={router} />;
}

function App() {
  const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || '123';
  return (
    <Provider store={store}>
      <div style={{ height: '100vh' }}>
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <MainApp />
        </GoogleOAuthProvider>
      </div>
    </Provider>
  );
}

export default App;
