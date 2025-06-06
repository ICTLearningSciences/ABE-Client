/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React, { useState } from 'react';
import {
  Button,
  Drawer,
  IconButton,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import { UseWithLogin } from '../../store/slices/login/use-with-login';
import { useAppSelector } from '../../store/hooks';
import { LoginStatus } from '../../store/slices/login';
import { DEFAULT_COLOR_THEME } from '../../constants';
import { Home } from '@mui/icons-material';
import { HeaderTitle } from '../header-title';
import { useNavigateWithParams } from '../../hooks/use-navigate-with-params';
import PersonIcon from '@mui/icons-material/Person';
import { UserInfoSettings } from '../settings/user-info-settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { CuiHeader } from './cui-header';
export default function Header(props: { useLogin: UseWithLogin }): JSX.Element {
  const { useLogin } = props;
  const { logout } = useLogin;
  const loginStatus = useAppSelector((state) => state.login.loginStatus);
  const loggedIn = loginStatus === LoginStatus.AUTHENTICATED;
  const navigate = useNavigateWithParams();
  const config = useAppSelector((state) => state.config);
  const colorTheme = config.config?.colorTheme || DEFAULT_COLOR_THEME;
  const theme = createTheme({
    palette: {
      primary: {
        main: colorTheme.headerButtonsColor,
      },
    },
  });
  const [profileOpen, setProfileOpen] = useState(false);
  return (
    <ThemeProvider theme={theme}>
      <CuiHeader />
      <Drawer
        anchor="right"
        open={profileOpen && loggedIn}
        onClose={() => {
          setProfileOpen(false);
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-around',
            height: '100%',
            padding: 20,
          }}
          data-cy="profile-drawer"
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-around',
            }}
          >
            <UserInfoSettings />
          </div>
          <Button
            style={{ color: 'blue' }}
            variant="contained"
            onClick={async () => {
              await logout();
              navigate('/');
            }}
          >
            Logout <LogoutIcon style={{ marginLeft: 10 }} />
          </Button>
        </div>
      </Drawer>
      <header
        data-cy="header"
        style={{
          width: '100%',
          height: '6vh',
          backgroundColor: colorTheme.headerColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          overflow: 'hidden',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 40,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {loggedIn && (
            <IconButton
              data-cy="home-button"
              onClick={() => {
                navigate('/docs');
              }}
              color="primary"
            >
              <Home />
            </IconButton>
          )}
        </div>
        <HeaderTitle />
        {loggedIn && (
          <div
            style={{
              position: 'absolute',
              right: 20,
              display: 'flex',
              height: 'fit-content',
              alignItems: 'center',
            }}
          >
            <IconButton
              onClick={() => {
                setProfileOpen(true);
              }}
              style={{
                color: 'white',
              }}
              data-cy="profile-button"
            >
              <PersonIcon />
            </IconButton>
          </div>
        )}
      </header>
    </ThemeProvider>
  );
}
