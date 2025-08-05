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
} from '@mui/material';
import { Edit as EditIcon, Add as AddIcon } from '@mui/icons-material';
import { useWithEducationalManagement } from '../../../store/slices/education-management/use-with-educational-management';
import { Assignment } from '../../../store/slices/education-management/types';
import AssignmentModal from './assignment-modal';
import DeleteConfirmationModal from './delete-confirmation-modal';

interface AssignmentViewProps {
  assignmentId: string;
  courseId: string;
  sectionId?: string;
}

const AssignmentView: React.FC<AssignmentViewProps> = ({
  assignmentId,
  courseId,
  sectionId,
}) => {
  const educationManagement = useWithEducationalManagement();
  const [showEditModal, setShowEditModal] = useState(false);

  const assignment = educationManagement.assignments.find(
    (a) => a._id === assignmentId
  );
  const course = educationManagement.courses.find((c) => c._id === courseId);
  const section = sectionId
    ? educationManagement.sections.find((s) => s._id === sectionId)
    : null;

  // Get mandatory status if assignment is part of a section
  const sectionAssignment = section?.assignments.find(
    (sa) => sa.assignmentId === assignmentId
  );
  const isMandatory = sectionAssignment?.mandatory ?? false;

  const handleEditAssignment = async (assignmentData: Partial<Assignment>) => {
    try {
      await educationManagement.updateAssignment(courseId, assignmentData);
      setShowEditModal(false);
    } catch (error) {
      console.error('Failed to update assignment:', error);
    }
  };

  const handleAddActivity = async () => {
    try {
      // This would create a new activity and add it to the assignment
      // Implementation depends on activity management system
      console.log('Add activity functionality not yet implemented');
    } catch (error) {
      console.error('Failed to create activity:', error);
    }
  };

  const handleDeleteAssignment = async () => {
    try {
      await educationManagement.deleteAssignment(courseId, assignmentId);
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
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ mb: 1 }}
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

              <Stack direction="column" spacing={0.5}>
                {course && (
                  <Typography variant="body2" color="text.secondary">
                    Course: {course.title}
                  </Typography>
                )}
                {section && (
                  <Typography variant="body2" color="text.secondary">
                    Section: {section.title}
                  </Typography>
                )}
              </Stack>
            </Box>

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

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddActivity}
          disabled={educationManagement.isAssignmentModifying}
          fullWidth
          sx={{
            py: 2,
            mb: 3,
            backgroundColor: '#1B6A9C',
            '&:hover': {
              backgroundColor: '#145a87',
            },
          }}
        >
          Add Activity
        </Button>

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
            {assignment.activityIds.map((activityId) => (
              <Grid item xs={12} key={activityId}>
                <Card
                  variant="outlined"
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor: '#1B6A9C',
                      boxShadow: 2,
                    },
                  }}
                >
                  <CardContent>
                    <Stack direction="row" alignItems="center" sx={{ mb: 1.5 }}>
                      <Typography sx={{ fontSize: '20px', mr: 1.5 }}>
                        🎯
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{
                          color: '#1B6A9C',
                          fontWeight: 600,
                          fontSize: '1rem',
                        }}
                      >
                        Activity {activityId}
                      </Typography>
                    </Stack>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 1.5, lineHeight: 1.4 }}
                    >
                      Activity details will be loaded from the activity
                      management system
                    </Typography>

                    <Typography variant="caption" color="text.disabled">
                      Click to view activity details
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Edit Assignment Modal */}
      <AssignmentModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSubmit={handleEditAssignment}
        mode="edit"
        sectionId={sectionId}
        initialData={assignment}
        isLoading={educationManagement.isAssignmentModifying}
      />
    </Box>
  );
};

export default AssignmentView;
