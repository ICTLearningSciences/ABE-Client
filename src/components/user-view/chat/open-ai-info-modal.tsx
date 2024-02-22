import React from 'react';
import { Box, Button, Modal, Theme } from '@mui/material';
import { OpenAiReqRes } from '../../../types';
import { makeStyles } from 'tss-react/mui';
import { JsonDisplay } from '../../../styled-components';

const useStyles = makeStyles({ name: { OpenAiInfoModal } })((theme: Theme) => ({
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
}));

export default function OpenAiInfoModal(props: {
  openAiInfo?: OpenAiReqRes;
  close: () => void;
}): JSX.Element {
  const { openAiInfo, close } = props;
  const { classes } = useStyles();

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '70%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    height: '70%',
  };

  return (
    <div>
      <Modal open={Boolean(openAiInfo)} className={classes.modal}>
        <Box sx={style}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '100%',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                height: '45%',
              }}
            >
              <h4 style={{ alignSelf: 'center' }}>Prompt</h4>
              <div
                style={{
                  maxHeight: 'fit-content',
                  border: '1px solid black',
                  overflow: 'auto',
                }}
              >
                <JsonDisplay>
                  {JSON.stringify(openAiInfo?.openAiPrompt, null, 2)}
                </JsonDisplay>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                height: '45%',
              }}
            >
              <h4 style={{ alignSelf: 'center' }}>Response</h4>
              <div
                style={{
                  maxHeight: 'fit-content',
                  border: '1px solid black',
                  overflow: 'auto',
                }}
              >
                <JsonDisplay>
                  {JSON.stringify(openAiInfo?.openAiResponse, null, 2)}
                </JsonDisplay>
              </div>
            </div>
            <Button onClick={close}>Close</Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
