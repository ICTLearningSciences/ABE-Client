import React, { useEffect } from 'react';
import './App.css';
import { useAppSelector } from './store/hooks';
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
