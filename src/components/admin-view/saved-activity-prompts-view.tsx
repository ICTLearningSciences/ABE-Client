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
  Typography,
} from '@mui/material';
import { ActivityGQL, ActivityPrompt, GQLPrompt } from '../../types';
import './saved-prompts-view.css';
import { ArrowDropDown, Delete } from '@mui/icons-material';
import { BoldSpan, RowDiv, RowDivSB } from '../../styled-components';
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
    activities,
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
          <Paper>
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
