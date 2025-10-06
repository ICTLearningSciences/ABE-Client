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
import React, { useState } from 'react';
import { IconButton, Divider, Drawer, Button } from '@mui/material';
import { Home } from '@mui/icons-material';
import SchoolIcon from '@mui/icons-material/School';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import MenuIcon from '@mui/icons-material/Menu';
import { RowDiv } from '../../styled-components';
import { useWithWindowSize } from '../../hooks/use-with-window-size';

interface HomeAndCourseDisplayProps {
  defaultPath: string;
  courseNavPath: string;
  freeDocEditingNavPath: string;
  curPath: string;
  navigate: (path: string) => void;
}

export function HomeAndCourseDisplay(
  props: HomeAndCourseDisplayProps
): JSX.Element {
  const {
    defaultPath,
    courseNavPath,
    freeDocEditingNavPath,
    curPath,
    navigate,
  } = props;
  const { isMobile } = useWithWindowSize();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleNavigate = (path: string) => {
    navigate(path);
    setDrawerOpen(false);
  };

  if (isMobile) {
    return (
      <>
        <IconButton
          data-cy="hamburger-menu-button"
          onClick={() => setDrawerOpen(true)}
          color="primary"
        >
          <MenuIcon />
        </IconButton>
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '20px',
              gap: '10px',
              minWidth: '250px',
            }}
            data-cy="navigation-drawer"
          >
            <Button
              data-cy="drawer-home-button"
              onClick={() => handleNavigate(defaultPath)}
              variant="contained"
              startIcon={<Home />}
              style={{
                justifyContent: 'flex-start',
                padding: '12px 16px',
              }}
            >
              Home
            </Button>
            <Button
              data-cy="drawer-courses-button"
              onClick={() => handleNavigate(courseNavPath)}
              variant="contained"
              startIcon={<SchoolIcon />}
              disabled={curPath === courseNavPath}
              style={{
                justifyContent: 'flex-start',
                padding: '12px 16px',
              }}
            >
              Courses
            </Button>
            <Button
              data-cy="drawer-documents-button"
              onClick={() => handleNavigate(freeDocEditingNavPath)}
              variant="contained"
              startIcon={<TextSnippetIcon />}
              disabled={curPath === freeDocEditingNavPath}
              style={{
                justifyContent: 'flex-start',
                padding: '12px 16px',
              }}
            >
              Documents
            </Button>
          </div>
        </Drawer>
      </>
    );
  }

  return (
    <RowDiv style={{ gap: 20 }}>
      <IconButton
        data-cy="default-home-button"
        onClick={() => {
          navigate(defaultPath);
        }}
        color="primary"
      >
        {' '}
        <Home />{' '}
      </IconButton>

      <Divider orientation="vertical" variant="middle" flexItem />

      <IconButton
        data-cy="educational-home-button"
        onClick={() => {
          navigate(courseNavPath);
        }}
        color="primary"
        disabled={curPath === courseNavPath}
      >
        <SchoolIcon />
      </IconButton>
      <IconButton
        data-cy="doc-home-button"
        onClick={() => {
          navigate(freeDocEditingNavPath);
        }}
        color="primary"
        disabled={curPath === freeDocEditingNavPath}
      >
        <TextSnippetIcon />
      </IconButton>
    </RowDiv>
  );
}
