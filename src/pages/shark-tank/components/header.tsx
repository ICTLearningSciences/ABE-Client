/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/

import React from 'react';
import {
  Button,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import {
  AccountCircleOutlined,
  Home,
  KeyboardArrowRight,
} from '@mui/icons-material';
import { useNavigateWithParams } from '../../../hooks/use-navigate-with-params';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { logout } from '../../../store/slices/login';

import sharkIcon from '../icon.png';

export function Header(props: { title?: string }) {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.login);
  const navigate = useNavigateWithParams();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const onMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const onMenuClose = () => {
    setAnchorEl(null);
  };
  const onLogout = () => {
    dispatch(logout());
    onMenuClose();
  };

  return (
    <header
      className="row center-div header"
      style={{ position: 'fixed', top: 0, justifyContent: 'space-between' }}
    >
      <div className="row center-div" style={{ marginLeft: 10 }}>
        <IconButton color="inherit" onClick={() => navigate('/')}>
          <Home />
        </IconButton>
        <Divider orientation="vertical" variant="middle" flexItem />
        <Button
          style={{ color: 'white', fontWeight: 'bold' }}
          startIcon={<img src={sharkIcon} width={28} height={28} />}
          onClick={() => navigate('/shark-tank')}
        >
          Shark Tank
        </Button>
        <KeyboardArrowRight fontSize="small" />
        <Typography
          variant="subtitle1"
          color="secondary"
          style={{ fontSize: 12, marginLeft: 5 }}
        >
          {props.title}
        </Typography>
      </div>

      {/* Empty div for spacing */}
      <div className="row center-div" style={{ flexGrow: 1 }}></div>

      <div className="row center-div spacing" style={{ marginRight: 20 }}>
        {user && (
          <Button
            color="inherit"
            startIcon={<AccountCircleOutlined />}
            onClick={onMenuClick}
          >
            {user.name}
          </Button>
        )}
        <Menu anchorEl={anchorEl} open={open} onClose={onMenuClose}>
          <MenuItem onClick={onLogout}>Logout</MenuItem>
        </Menu>
      </div>
    </header>
  );
}
