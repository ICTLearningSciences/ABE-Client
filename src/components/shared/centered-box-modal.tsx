/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from 'react';
import { Box, Modal, SxProps, Theme } from '@mui/material';

const style: SxProps<Theme> = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  WebkitTransform: 'translate(-50%, -50%)',
  transform: 'translate(-50%, -50%)',
  width: 'fit-content',
  height: 'fit-content',
  p: 4,
  display: 'flex',
  boxSizing: 'border-box',
  flexDirection: 'column',
  justifyContent: 'space-between',
  backgroundColor: 'white',
  borderRadius: '20px',
  border: '5px solid black',
};

export function CenteredBoxModal(props: {
  open: boolean;
  children: React.ReactNode;
}): JSX.Element {
  return (
    <div>
      <Modal open={Boolean(props.open)}>
        <Box sx={style} data-cy="centered-box-modal">
          {props.children}
        </Box>
      </Modal>
    </div>
  );
}
