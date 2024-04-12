/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React, { useEffect } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Input,
  Modal,
  Theme,
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { useState } from 'react';
import { ColumnDiv, RowDiv, RowDivSB } from '../../../styled-components';
import { ActivityGQL } from '../../../types';
import { useWithDocGoalsActivities } from '../../../store/slices/doc-goals-activities/use-with-doc-goals-activites';

const useStyles = makeStyles({ name: { EditActivityMessages } })(
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

export default function EditActivityMessages(props: {
  activityToEdit?: ActivityGQL;
  close: () => void;
}): JSX.Element {
  const { activityToEdit, close } = props;
  const { addOrUpdateActivity } = useWithDocGoalsActivities();
  const [editedActivity, setEditedActivity] = useState<ActivityGQL>();
  const [saveInProgress, setSaveInProgress] = useState<boolean>(false);

  const { classes } = useStyles();
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    height: 'fit-content',
    maxHeight: '80%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    overflowY: 'auto',
  };

  function onClose() {
    setEditedActivity(undefined);
    close();
  }

  async function onSave() {
    try {
      if (editedActivity) {
        setSaveInProgress(true);
        await addOrUpdateActivity(editedActivity);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaveInProgress(false);
      onClose();
    }
  }

  useEffect(() => {
    setEditedActivity(JSON.parse(JSON.stringify(activityToEdit)));
  }, [activityToEdit?._id]);

  return (
    <div>
      <Modal open={Boolean(activityToEdit)} className={classes.modal}>
        <Box sx={style}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              height: '100%',
            }}
          >
            <h3>{editedActivity?.title}</h3>
            <ColumnDiv
              style={{
                justifyContent: 'center',
                width: '100%',
                height: '80%',
                overflowY: 'auto',
              }}
            >
              {editedActivity?.steps?.map((step, index) => {
                return (
                  <>
                    {(step.messages || []).map((message, messageIndex) => {
                      return (
                        <RowDivSB key={messageIndex}>
                          <Input
                            multiline
                            value={message.text}
                            fullWidth
                            title={`Step ${index + 1} Message ${
                              messageIndex + 1
                            }`}
                            className={classes.inputField}
                            onChange={(e) => {
                              const newActivity = JSON.parse(
                                JSON.stringify(editedActivity)
                              );
                              newActivity.steps[index].messages[messageIndex] =
                                {
                                  ...message,
                                  text: e.target.value,
                                };
                              setEditedActivity(newActivity);
                            }}
                          />
                        </RowDivSB>
                      );
                    })}
                  </>
                );
              })}
            </ColumnDiv>
            <ColumnDiv
              style={{
                alignItems: 'center',
              }}
            >
              {saveInProgress && <CircularProgress />}
              <RowDiv>
                <Button
                  variant="outlined"
                  style={{
                    marginRight: '20px',
                  }}
                  disabled={saveInProgress}
                  onClick={onClose}
                >
                  Close
                </Button>
                <Button
                  disabled={saveInProgress}
                  onClick={onSave}
                  variant="outlined"
                >
                  Save
                </Button>
              </RowDiv>
            </ColumnDiv>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
