/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
} from '@mui/material';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import {
  Add as AddIcon,
  CheckCircle,
  RadioButtonUnchecked,
} from '@mui/icons-material';
import { ActivityBuilder } from '../../../components/activity-builder/types';
import { Assignment } from '../../../store/slices/education-management/types';

interface AssignmentActivitiesDisplayProps {
  assignment: Assignment;
  builtActivities: ActivityBuilder[];
  availableActivities: ActivityBuilder[];
  isStudentView?: boolean;
  isAssignmentModifying?: boolean;
  onAddActivity: (activityId: string) => Promise<void>;
  onRemoveActivity: (activityId: string) => Promise<void>;
  onActivitySelect: (activityId: string) => void;
  activityIdToCompletionStatus: Record<string, boolean>;
}

const AssignmentActivitiesDisplay: React.FC<
  AssignmentActivitiesDisplayProps
> = ({
  assignment,
  builtActivities,
  availableActivities,
  isStudentView = false,
  isAssignmentModifying = false,
  onAddActivity,
  onRemoveActivity,
  onActivitySelect,
  activityIdToCompletionStatus,
}) => {
  const [selectedActivityId, setSelectedActivityId] = useState<string>('');

  const handleAddActivity = async () => {
    if (!selectedActivityId) return;

    try {
      await onAddActivity(selectedActivityId);
      setSelectedActivityId(''); // Reset selection
    } catch (error) {
      console.error('Failed to add activity to assignment:', error);
    }
  };

  const handleRemoveActivity = async (activityIdToRemove: string) => {
    try {
      await onRemoveActivity(activityIdToRemove);
    } catch (error) {
      console.error('Failed to remove activity from assignment:', error);
    }
  };

  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2.5 }}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: 600, color: 'text.primary' }}
        >
          Activities
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {assignment.activityIds.length} activit
          {assignment.activityIds.length !== 1 ? 'ies' : 'y'}
        </Typography>
      </Stack>

      {/* Add Activity Section */}
      {!isStudentView && (
        <Card variant="outlined" sx={{ mb: 3, p: 2.5 }}>
          <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
            Add Activity
          </Typography>

          {availableActivities.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No more activities available to add to this assignment.
            </Typography>
          ) : (
            <Stack direction="row" spacing={2} alignItems="center">
              <FormControl fullWidth>
                <InputLabel id="activity-select-label">
                  Select Activity
                </InputLabel>
                <Select
                  labelId="activity-select-label"
                  value={selectedActivityId}
                  label="Select Activity"
                  onChange={(e) => setSelectedActivityId(e.target.value)}
                  disabled={isAssignmentModifying}
                  data-cy="activity-select-dropdown"
                >
                  {availableActivities.map((activity) => (
                    <MenuItem key={activity._id} value={activity._id}>
                      {activity.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddActivity}
                disabled={!selectedActivityId || isAssignmentModifying}
                data-cy="add-activity-to-assignment-button"
                sx={{
                  backgroundColor: '#1B6A9C',
                  '&:hover': {
                    backgroundColor: '#145a87',
                  },
                  '&:disabled': {
                    backgroundColor: 'grey.300',
                  },
                }}
              >
                Add
              </Button>
            </Stack>
          )}
        </Card>
      )}

      {assignment.activityIds.length === 0 ? (
        <Card
          variant="outlined"
          sx={{
            border: '2px dashed',
            borderColor: 'grey.300',
            textAlign: 'center',
            py: 5,
            px: 2.5,
          }}
        >
          <Typography sx={{ fontSize: '48px', color: 'grey.300', mb: 2 }}>
            🎯
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            No activities yet
          </Typography>
          <Typography variant="body2" color="text.disabled">
            Add your first activity to create engaging learning experiences
          </Typography>
        </Card>
      ) : (
        <Grid container spacing={2}>
          {assignment.activityIds.map((activityId) => {
            const activity = builtActivities.find((a) => a._id === activityId);
            if (!activity) {
              return null;
            }
            const isComplete = activityIdToCompletionStatus[activityId];
            return (
              <Grid item xs={12} key={activityId}>
                <Card variant="outlined">
                  <CardContent>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Typography
                        variant="h6"
                        onClick={() => onActivitySelect(activityId)}
                        data-cy={`activity-item-${activityId}`}
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
                        {activity?.title || `Activity ${activityId}`}
                      </Typography>
                      {isComplete && <CheckCircle sx={{ color: 'green' }} />}
                      {!isComplete && (
                        <RadioButtonUnchecked sx={{ color: 'grey' }} />
                      )}
                      {!isStudentView && (
                        <IconButton
                          onClick={() => handleRemoveActivity(activityId)}
                          disabled={isAssignmentModifying}
                          sx={{
                            color: '#d32f2f',
                            '&:hover': {
                              backgroundColor: '#ffebee',
                            },
                            '&:disabled': {
                              color: 'grey.400',
                            },
                          }}
                          size="small"
                        >
                          <RemoveCircleIcon />
                        </IconButton>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
};

export default AssignmentActivitiesDisplay;
