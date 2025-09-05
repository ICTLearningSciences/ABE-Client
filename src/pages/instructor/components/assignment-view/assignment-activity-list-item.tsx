/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from 'react';
import {
  Typography,
  Card,
  CardContent,
  Grid,
  Stack,
  IconButton,
} from '@mui/material';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import {
  CheckCircle,
  RadioButtonUnchecked,
  Settings as SettingsIcon,
  KeyboardArrowUp,
  KeyboardArrowDown,
} from '@mui/icons-material';
import { ActivityBuilder } from '../../../../components/activity-builder/types';
import { RowDiv } from '../../../../styled-components';
export function AssignmentActivityListItem(props: {
  activity: ActivityBuilder;
  onActivitySelect: (activityId: string) => void;
  onRemoveActivity: (activityId: string) => void;
  onOpenLLMModal: (activityId: string) => void;
  onActivityOrderChange?: (activityId: string, upOrDown: 'up' | 'down') => void;
  isComplete: boolean;
  isStudentView: boolean;
  isAssignmentModifying: boolean;
  isFirst?: boolean;
  isLast?: boolean;
}) {
  const {
    activity,
    onActivitySelect,
    onRemoveActivity,
    onOpenLLMModal,
    onActivityOrderChange,
    isComplete,
    isStudentView,
    isAssignmentModifying,
    isFirst,
    isLast,
  } = props;
  return (
    <Grid item xs={12} key={activity._id}>
      <Card variant="outlined">
        <CardContent>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography
              variant="h6"
              onClick={() => onActivitySelect(activity._id)}
              data-cy={`activity-item-${activity._id}`}
              sx={{
                color: '#1B6A9C',
                fontWeight: 600,
                fontSize: '1rem',
                cursor: 'pointer',
                '&:hover': {
                  textDecoration: 'underline',
                  color: '#145a87',
                },
              }}
            >
              {activity?.title || `Activity ${activity._id}`}
            </Typography>
            <RowDiv>
              {isComplete && isStudentView && (
                <CheckCircle sx={{ color: 'green' }} />
              )}
              {!isComplete && isStudentView && (
                <RadioButtonUnchecked sx={{ color: 'grey' }} />
              )}
              {!isStudentView && onActivityOrderChange && (
                <>
                  <IconButton
                    onClick={() => onActivityOrderChange(activity._id, 'up')}
                    disabled={isAssignmentModifying || isFirst}
                    size="small"
                    data-cy={`move-activity-up-${activity._id}`}
                  >
                    <KeyboardArrowUp />
                  </IconButton>
                  <IconButton
                    onClick={() => onActivityOrderChange(activity._id, 'down')}
                    disabled={isAssignmentModifying || isLast}
                    size="small"
                    data-cy={`move-activity-down-${activity._id}`}
                  >
                    <KeyboardArrowDown />
                  </IconButton>
                </>
              )}
              {!isStudentView && (
                <IconButton
                  onClick={() => onRemoveActivity(activity._id)}
                  disabled={isAssignmentModifying}
                  size="small"
                >
                  <RemoveCircleIcon />
                </IconButton>
              )}

              {isStudentView && (
                <IconButton
                  onClick={() => onOpenLLMModal(activity._id)}
                  sx={{
                    '&:hover': {
                      color: 'primary.main',
                    },
                  }}
                  size="small"
                  data-cy={`llm-settings-button-${activity._id}`}
                >
                  <SettingsIcon />
                </IconButton>
              )}
            </RowDiv>
          </Stack>
        </CardContent>
      </Card>
    </Grid>
  );
}
