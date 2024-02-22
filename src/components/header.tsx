/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { Button, FormControlLabel, IconButton, Switch } from '@mui/material';
import React from 'react';
import { UseWithLogin } from '../store/slices/login/use-with-login';
import { useAppSelector } from '../store/hooks';
import { LoginStatus, UserRole } from '../store/slices/login';
import { BLUE_HEX, MOBILE_CUTOFF_SIZE } from '../constants';
import HeaderLogo from '../static-images/gold_white_logo.png';
import { Home } from '@mui/icons-material';
import { useWithWindowSize } from '../hooks/use-with-window-size';
import { useNavigate } from 'react-router-dom';
import { useWithState } from '../store/slices/state/use-with-state';

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
  const { width: windowWidth } = useWithWindowSize();
  const navigate = useNavigate();
  const headerSize = windowWidth < MOBILE_CUTOFF_SIZE ? '400px' : '600px';

  return (
    <header
      style={{
        width: '100%',
        height: '6%',
        backgroundColor: BLUE_HEX,
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
            onClick={() => {
              navigate('/');
            }}
            style={{
              color: 'white',
            }}
          >
            <Home />
          </IconButton>
        )}
      </div>
      <img
        style={{ width: headerSize, height: 'auto' }}
        src={HeaderLogo}
        alt="USC Center for Generative AI and Society"
      />
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
              <FormControlLabel
                data-cy="role-switch"
                labelPlacement="end"
                control={
                  <Switch
                    size="small"
                    checked={viewingRole === UserRole.ADMIN}
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
              <FormControlLabel
                labelPlacement="end"
                control={
                  <Switch
                    size="small"
                    checked={state.viewingAdvancedOptions}
                    onChange={(value) => {
                      updateViewingAdvancedOptions(value.target.checked);
                    }}
                  />
                }
                label="Advanced"
              />
            </>
          ) : undefined}
          <Button
            style={{ height: 'fit-content', color: 'white' }}
            variant="outlined"
            onClick={() => {
              logout();
            }}
          >
            Logout
          </Button>
        </div>
      )}
    </header>
  );
}
