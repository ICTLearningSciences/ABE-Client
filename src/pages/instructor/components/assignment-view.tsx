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
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
} from '@mui/material';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { Edit as EditIcon, Add as AddIcon } from '@mui/icons-material';
import { useWithEducationalManagement } from '../../../store/slices/education-management/use-with-educational-management';
import { Assignment } from '../../../store/slices/education-management/types';
import AssignmentModal from './assignment-modal';
import DeleteConfirmationModal from './delete-confirmation-modal';
import { ActivityBuilder } from '../../../components/activity-builder/types';

interface AssignmentViewProps {
  assignmentId: string;
  courseId: string;
  builtActivities: ActivityBuilder[];
  sectionId?: string;
  onAssignmentDeleted?: (courseId: string, sectionId: string) => void;
  isStudentView?: boolean;
}

const AssignmentView: React.FC<AssignmentViewProps> = ({
  assignmentId,
  courseId,
  sectionId,
  builtActivities,
  onAssignmentDeleted,
  isStudentView = false,
}) => {
  const educationManagement = useWithEducationalManagement();
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedActivityId, setSelectedActivityId] = useState<string>('');

  const assignment = educationManagement.assignments.find(
    (a) => a._id === assignmentId
  );
  const section = sectionId
    ? educationManagement.sections.find((s) => s._id === sectionId)
    : null;

  // Get mandatory status if assignment is part of a section
  const sectionAssignment = section?.assignments.find(
    (sa) => sa.assignmentId === assignmentId
  );
  const isMandatory = sectionAssignment?.mandatory ?? false;

  // Filter out activities that are already in the assignment
  const availableActivities = builtActivities.filter(
    (activity) => !assignment?.activityIds.includes(activity._id)
  );

  const handleEditAssignment = async (assignmentData: Partial<Assignment>) => {
    try {
      await educationManagement.updateAssignment(courseId, assignmentData);
      setShowEditModal(false);
    } catch (error) {
      console.error('Failed to update assignment:', error);
    }
  };

  const handleAddActivity = async () => {
    if (!selectedActivityId || !assignment) return;

    try {
      const updatedActivityIds = [
        ...assignment.activityIds,
        selectedActivityId,
      ];
      await educationManagement.updateAssignment(courseId, {
        _id: assignmentId,
        activityIds: updatedActivityIds,
      });
      setSelectedActivityId(''); // Reset selection
    } catch (error) {
      console.error('Failed to add activity to assignment:', error);
    }
  };

  const handleRemoveActivity = async (activityIdToRemove: string) => {
    if (!assignment) return;

    try {
      const updatedActivityIds = assignment.activityIds.filter(
        (id) => id !== activityIdToRemove
      );
      await educationManagement.updateAssignment(courseId, {
        _id: assignmentId,
        activityIds: updatedActivityIds,
      });
    } catch (error) {
      console.error('Failed to remove activity from assignment:', error);
    }
  };

  const handleDeleteAssignment = async () => {
    try {
      await educationManagement.deleteAssignment(courseId, assignmentId);
      if (sectionId) {
        onAssignmentDeleted?.(courseId, sectionId);
      }
    } catch (error) {
      console.error('Failed to delete assignment:', error);
    }
  };

  if (!assignment) {
    return (
      <Box
        sx={{
          textAlign: 'center',
          maxWidth: 400,
          mx: 'auto',
          py: 8,
        }}
      >
        <Typography variant="h1" sx={{ fontSize: '48px', mb: 3 }}>
          ❌
        </Typography>
        <Typography variant="h4" sx={{ mb: 2, color: 'text.primary' }}>
          Assignment Not Found
        </Typography>
        <Typography variant="body1" color="text.secondary">
          The assignment you&apos;re looking for could not be found.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 800, px: 2.5 }}>
      {/* Assignment Header */}
      <Card sx={{ mb: 4, backgroundColor: 'grey.50' }}>
        <CardContent sx={{ p: 3 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
          >
            <Box sx={{ flex: 1 }}>
              <Stack direction="row" alignItems="center" sx={{ mb: 1.5 }}>
                <Typography sx={{ fontSize: '32px', mr: 2 }}>📝</Typography>
                <Typography
                  variant="h4"
                  sx={{
                    color: '#1B6A9C',
                    fontWeight: 600,
                    fontSize: '1.75rem',
                  }}
                >
                  {assignment.title}
                </Typography>
              </Stack>

              <Typography
                variant="body1"
                color="text.primary"
                sx={{ mb: 1.5, lineHeight: 1.5 }}
              >
                {assignment.description}
              </Typography>

              <Stack
                direction="column"
                spacing={1}
                alignItems="center"
                sx={{ mb: 1 }}
                width="fit-content"
              >
                {sectionId && (
                  <Chip
                    label={isMandatory ? 'Required' : 'Optional'}
                    size="small"
                    color={isMandatory ? 'primary' : 'secondary'}
                    sx={{ fontSize: '10px' }}
                  />
                )}
                <Typography variant="caption" color="text.disabled">
                  {assignment.activityIds.length} activit
                  {assignment.activityIds.length !== 1 ? 'ies' : 'y'}
                </Typography>
              </Stack>
            </Box>

            {!isStudentView && (
              <>
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={() => setShowEditModal(true)}
                  disabled={educationManagement.isAssignmentModifying}
                  sx={{
                    color: '#1B6A9C',
                    borderColor: '#1B6A9C',
                    '&:hover': {
                      backgroundColor: '#1B6A9C',
                      color: 'white',
                    },
                  }}
                >
                  Edit Assignment
                </Button>
                <DeleteConfirmationModal
                  onDelete={handleDeleteAssignment}
                  entityType="assignment"
                  entityName={assignment.title}
                />
              </>
            )}
          </Stack>
        </CardContent>
      </Card>

      {/* Activities */}
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
                    disabled={educationManagement.isAssignmentModifying}
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
                  disabled={
                    !selectedActivityId ||
                    educationManagement.isAssignmentModifying
                  }
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
              const activity = builtActivities.find(
                (a) => a._id === activityId
              );
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
                          sx={{
                            color: '#1B6A9C',
                            fontWeight: 600,
                            fontSize: '1rem',
                          }}
                        >
                          {activity?.title || `Activity ${activityId}`}
                        </Typography>
                        {!isStudentView && (
                          <IconButton
                            onClick={() => handleRemoveActivity(activityId)}
                            disabled={educationManagement.isAssignmentModifying}
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

      {/* Edit Assignment Modal */}
      {!isStudentView && (
        <AssignmentModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSubmit={handleEditAssignment}
          mode="edit"
          sectionId={sectionId}
          initialData={assignment}
          isLoading={educationManagement.isAssignmentModifying}
        />
      )}
    </Box>
  );
};

export default AssignmentView;
