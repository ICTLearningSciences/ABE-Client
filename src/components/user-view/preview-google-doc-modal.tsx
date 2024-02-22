/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from 'react';
import { Box, Button, Modal, Theme } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import useOutsideClick from '../../hooks/use-with-outside-click';
import { useRef } from 'react';
import { ColumnCenterDiv } from '../../styled-components';

const useStyles = makeStyles({ name: { PreviewGoogleDocModal } })(
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

export function PreviewGoogleDocModal(props: {
  googleDocId: string;
  close: () => void;
}): JSX.Element {
  const { classes } = useStyles();
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '70%',
    height: '90%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };
  const modalUseRef = useRef<HTMLDivElement>(null);
  const { googleDocId, close } = props;
  const googleDocUrl = `https://docs.google.com/document/d/${googleDocId}/view`;
  useOutsideClick({ onOutsideClick: close, ref: modalUseRef });

  return (
    <div ref={modalUseRef}>
      <Modal open={Boolean(googleDocId)} className={classes.modal}>
        <Box sx={style}>
          <ColumnCenterDiv
            style={{
              height: '100%',
            }}
          >
            <iframe width={'98%'} height={'98%'} src={googleDocUrl} />
            <Button>Close</Button>
          </ColumnCenterDiv>
        </Box>
      </Modal>
    </div>
  );
}
