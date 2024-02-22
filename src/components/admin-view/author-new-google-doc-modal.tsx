/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from 'react';
import { Box, Button, Input, Modal, Theme } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { RowDiv, RowDivSB } from '../../styled-components';
import { useState } from 'react';

const useStyles = makeStyles({ name: { CreateNewAdminGoogleDoc } })(
  (theme: Theme) => ({
    inputField: {
      width: '100%',
      margin: 10,
    },
    modal: {},
    paper: {
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      maxWidth: '50%',
    },
  })
);

export default function CreateNewAdminGoogleDoc(props: {
  onCreateDoc: (title: string) => void;
  open: boolean;
  close: () => void;
}): JSX.Element {
  const { open, close, onCreateDoc } = props;
  const { classes } = useStyles();
  const [title, setTitle] = useState('');
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '30%',
    height: 'fit-content',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  return (
    <div>
      <Modal open={Boolean(open)} className={classes.modal}>
        <Box sx={style}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              height: '100%',
            }}
          >
            <h3>New Example Document</h3>
            <RowDivSB
              style={{
                justifyContent: 'center',
              }}
            >
              <h4>Title</h4>
              <Input
                value={title}
                title="Document Title"
                className={classes.inputField}
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
              />
            </RowDivSB>
            <RowDiv>
              <Button
                variant="outlined"
                style={{
                  marginRight: '20px',
                }}
                onClick={() => {
                  onCreateDoc(title);
                  close();
                }}
              >
                CREATE
              </Button>
              <Button
                onClick={() => {
                  setTitle('');
                  close();
                }}
                variant="outlined"
              >
                Close
              </Button>
            </RowDiv>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
