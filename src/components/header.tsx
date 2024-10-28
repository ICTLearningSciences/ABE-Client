/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from 'react';
import {
  Button,
  FormControlLabel,
  IconButton,
  Switch,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import { UseWithLogin } from '../store/slices/login/use-with-login';
import { useAppSelector } from '../store/hooks';
import { LoginStatus, UserRole } from '../store/slices/login';
import { DEFAULT_COLOR_THEME } from '../constants';
import { Home } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useWithState } from '../store/slices/state/use-with-state';
import { HeaderTitle } from './header-title';
import { ColumnDiv } from '../styled-components';

export default function Header(props: { useLogin: UseWithLogin }): JSX.Element {
  const { useLogin } = props;
  const { logout } = useLogin;
  const { updateViewingUserRole, state, updateViewingAdvancedOptions } =
    useWithState();
  const loginStatus = useAppSelector((state) => state.login.loginStatus);
  const userRole = useAppSelector((state) => state.login.userRole);
  const viewingRole = useAppSelector((state) => state.state.viewingRole);
  const loggedIn = loginStatus === LoginStatus.AUTHENTICATED;
  const isAdminOrContentManager =
    userRole === UserRole.ADMIN || userRole === UserRole.CONTENT_MANAGER;
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

  function roleDisplayText(userRole: UserRole) {
    switch(userRole) {
      case UserRole.ADMIN:
        return 'Admin';
      case UserRole.CONTENT_MANAGER:
        return 'Content Manager';
      default:
        return 'User';
    }
  }

  const roleSwitchChecked = viewingRole !== UserRole.USER;
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
            {isAdminOrContentManager ? (
              <ColumnDiv style={{
                marginRight: 20,
              }}>
                <ThemeProvider theme={() => switchTheme(roleSwitchChecked)}>
                  <FormControlLabel
                    data-cy="role-switch"
                    labelPlacement="start"
                    control={
                      <Switch
                        size="small"
                        checked={roleSwitchChecked}
                        onChange={() => {
                          updateViewingUserRole(
                            viewingRole !== UserRole.USER
                              ? UserRole.USER
                              : userRole
                          );
                        }}
                      />
                    }
                    label={roleDisplayText(viewingRole)}
                  />
                </ThemeProvider>
                <ThemeProvider
                  theme={() => switchTheme(state.viewingAdvancedOptions)}
                >
                  <FormControlLabel
                    labelPlacement="start"
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
              </ColumnDiv>
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
