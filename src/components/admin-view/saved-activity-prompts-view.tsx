/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from 'react';
import {
  Card,
  CardActions,
  CardHeader,
  CircularProgress,
  Collapse,
  Grid,
  IconButton,
  Paper,
} from '@mui/material';
import { ActivityGQL, ActivityPrompt, GQLPrompt } from '../../types';
import './saved-prompts-view.css';
import { ArrowDropDown } from '@mui/icons-material';
import { RowDivSB } from '../../styled-components';
import SavePromptListItem from './saved-prompt-list-item';
import { useState } from 'react';
import './saved-activity-prompts-view.css';

export interface ActivityPrompts {
  activity: ActivityGQL;
  savedPrompts: ActivityPrompt[];
}

export function SavedActivityPromptsView(props: {
  activitiesWithPrompts: ActivityPrompts[];
  promptsLoading: boolean;
  onImport: (prompt: GQLPrompt) => void;
  activities: ActivityGQL[];
  goToActivity: (activityId: ActivityGQL) => void;
  getActivity: (prompt: GQLPrompt) => ActivityGQL | undefined;
}) {
  const {
    activitiesWithPrompts,
    onImport,
    promptsLoading,
    goToActivity,
    getActivity,
  } = props;
  const [expand, setExpand] = useState(false);
  if (promptsLoading) {
    return <CircularProgress />;
  }

  return (
    <>
      {activitiesWithPrompts.map((activityPrompts, index) => {
        return (
          <Paper key={index}>
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
                {activityPrompts.savedPrompts.map((activityPrompt, i) => (
                  <SavePromptListItem
                    key={i}
                    onImport={onImport}
                    goToActivity={goToActivity}
                    getActivity={getActivity}
                    prompt={activityPrompt.prompt}
                    promptsLoading={promptsLoading}
                    canDelete={false}
                  />
                ))}
              </Collapse>
            </Card>
          </Paper>
        );
      })}
    </>
  );
}
