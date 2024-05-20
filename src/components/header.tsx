/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import {
  Button,
  FormControlLabel,
  IconButton,
  Switch,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import React from 'react';
import { UseWithLogin } from '../store/slices/login/use-with-login';
import { useAppSelector } from '../store/hooks';
import { LoginStatus, UserRole } from '../store/slices/login';
import { DEFAULT_COLOR_THEME } from '../constants';
import { Home } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useWithState } from '../store/slices/state/use-with-state';
import { HeaderTitle } from './header-title';

export default function Header(props: { useLogin: UseWithLogin }): JSX.Element {
  const { useLogin } = props;
  const { logout } = useLogin;
  const { updateViewingUserRole, state, updateViewingAdvancedOptions } =
    useWithState();
  const loginStatus = useAppSelector((state) => state.login.loginStatus);
  const userRole = useAppSelector((state) => state.login.userRole);
  const viewingRole = useAppSelector((state) => state.state.viewingRole);
  const loggedIn = loginStatus === LoginStatus.AUTHENTICATED;
  const isAdmin = userRole === UserRole.ADMIN;
  const navigate = useNavigate();
  const config = useAppSelector((state) => state.config);
  const colorTheme = config.config?.colorTheme || DEFAULT_COLOR_THEME;
  const theme = createTheme({
    palette: {
      primary: {
        // gold
        main: colorTheme.headerButtonsColor,
      },
    },
  });

  const roleSwitchChecked = viewingRole === UserRole.ADMIN;
  const switchTheme = (checked: boolean) =>
    createTheme({
      components: {
        MuiSwitch: {
          styleOverrides: {
            switchBase: {
              color: checked ? colorTheme.headerButtonsColor : 'white',
              '&.Mui-checked': {
                color: checked ? colorTheme.headerButtonsColor : 'white',
              },
              '&.Mui-checked + .MuiSwitch-track': {
                backgroundColor: checked
                  ? colorTheme.headerButtonsColor
                  : 'white',
              },
            },
            track: {
              backgroundColor: checked
                ? colorTheme.headerButtonsColor
                : 'lightgrey',
            },
          },
        },
      },
    });

  return (
    <ThemeProvider theme={theme}>
      <header
        data-cy="header"
        style={{
          width: '100%',
          height: '6%',
          backgroundColor: colorTheme.headerColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
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
            {isAdmin ? (
              <>
                <ThemeProvider theme={() => switchTheme(roleSwitchChecked)}>
                  <FormControlLabel
                    data-cy="role-switch"
                    labelPlacement="end"
                    control={
                      <Switch
                        size="small"
                        checked={roleSwitchChecked}
                        onChange={() => {
                          updateViewingUserRole(
                            viewingRole === UserRole.ADMIN
                              ? UserRole.USER
                              : UserRole.ADMIN
                          );
                        }}
                      />
                    }
                    label={viewingRole === UserRole.ADMIN ? 'Admin' : 'User'}
                  />
                </ThemeProvider>
                <ThemeProvider
                  theme={() => switchTheme(state.viewingAdvancedOptions)}
                >
                  <FormControlLabel
                    labelPlacement="end"
                    control={
                      <Switch
                        size="small"
                        color="primary"
                        checked={state.viewingAdvancedOptions}
                        onChange={(value) => {
                          updateViewingAdvancedOptions(value.target.checked);
                        }}
                      />
                    }
                    label="Advanced"
                  />
                </ThemeProvider>
              </>
            ) : undefined}
            <Button
              style={{ height: 'fit-content', color: 'white' }}
              variant="outlined"
              onClick={async () => {
                await logout();
                navigate('/');
              }}
            >
              Logout
            </Button>
          </div>
        )}
      </header>
    </ThemeProvider>
  );
}
