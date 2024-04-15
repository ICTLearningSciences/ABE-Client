/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from 'react';
import {
  Button,
  Card,
  CardActions,
  CardHeader,
  CircularProgress,
  Collapse,
  Grid,
  IconButton,
  Paper,
} from '@mui/material';
import { ActivityGQL, ActivityPrompt, GQLPrompt } from '../../../types';
import './saved-prompts-view.css';
import { ArrowDropDown } from '@mui/icons-material';
import { RowDivSB } from '../../../styled-components';
import SavePromptListItem from '../saved-prompt-list-item';
import { useState } from 'react';
import './saved-activity-prompts-view.css';
import EditActivityMessages from './edit-activity-messages';

export interface ActivityPrompts {
  activity: ActivityGQL;
  savedPrompts: ActivityPrompt[];
}

function SavedActivityPromptDisplay(props: {
  activityPrompts: ActivityPrompts;
  startEditPrompt: (prompt: GQLPrompt) => void;
  promptsLoading: boolean;
  goToActivity: (activityId: ActivityGQL) => void;
  getActivity: (prompt: GQLPrompt) => ActivityGQL | undefined;
  setActivityToEdit: (activity: ActivityGQL) => void;
}) {
  const {
    activityPrompts,
    startEditPrompt,
    promptsLoading,
    goToActivity,
    getActivity,
    setActivityToEdit,
  } = props;
  const [expand, setExpand] = useState(false);
  return (
    <Paper
      style={{
        marginBottom: '10px',
      }}
    >
      <Card
        onClick={() => {
          setExpand(!expand);
        }}
        className="activity-card"
        style={{
          textAlign: 'left',
          cursor: 'pointer',
        }}
      >
        <RowDivSB>
          <CardHeader title={`${activityPrompts.activity.title}`} />
          <CardActions>
            <Grid container justifyContent={'center'}>
              <IconButton onClick={() => setExpand(!expand)}>
                <ArrowDropDown />
              </IconButton>
            </Grid>
          </CardActions>
        </RowDivSB>
        <Collapse in={expand}>
          <Button
            style={{
              marginLeft: 10,
            }}
            variant="contained"
            disabled={activityPrompts.activity.steps?.length === 0}
            onClick={() => {
              setActivityToEdit(activityPrompts.activity);
            }}
          >
            Edit Messages
          </Button>
          {activityPrompts.savedPrompts.map((activityPrompt, i) => (
            <>
              <SavePromptListItem
                key={i}
                startEditPrompt={startEditPrompt}
                goToActivity={goToActivity}
                getActivity={getActivity}
                prompt={activityPrompt.prompt}
                promptsLoading={promptsLoading}
                canDelete={false}
              />
            </>
          ))}
        </Collapse>
      </Card>
    </Paper>
  );
}

export function SavedActivityPromptsView(props: {
  activitiesWithPrompts: ActivityPrompts[];
  promptsLoading: boolean;
  startEditPrompt: (prompt: GQLPrompt) => void;
  activities: ActivityGQL[];
  goToActivity: (activityId: ActivityGQL) => void;
  getActivity: (prompt: GQLPrompt) => ActivityGQL | undefined;
}) {
  const {
    activitiesWithPrompts,
    startEditPrompt,
    promptsLoading,
    goToActivity,
    getActivity,
  } = props;
  const [activityToEdit, setActivityToEdit] = useState<ActivityGQL>();
  if (promptsLoading) {
    return <CircularProgress />;
  }

  return (
    <>
      {activitiesWithPrompts.map((activityPrompts, index) => {
        return (
          <SavedActivityPromptDisplay
            key={index}
            activityPrompts={activityPrompts}
            startEditPrompt={startEditPrompt}
            promptsLoading={promptsLoading}
            goToActivity={goToActivity}
            getActivity={getActivity}
            setActivityToEdit={setActivityToEdit}
          />
        );
      })}
      {activityToEdit && (
        <EditActivityMessages
          activityToEdit={activityToEdit}
          close={() => {
            setActivityToEdit(undefined);
          }}
        />
      )}
    </>
  );
}
