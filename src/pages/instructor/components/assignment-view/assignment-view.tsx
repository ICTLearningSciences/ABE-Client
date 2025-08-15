/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React, { useMemo, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Stack,
  Chip,
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { useWithEducationalManagement } from '../../../../store/slices/education-management/use-with-educational-management';
import {
  Assignment,
  isStudentData,
} from '../../../../store/slices/education-management/types';
import AssignmentModal, { AssignmentModalMode } from '../assignment-modal';
import DeleteConfirmationModal from '../delete-confirmation-modal';
import AssignmentActivitiesDisplay from '../assignment-activities-display';
import { ActivityBuilder } from '../../../../components/activity-builder/types';
import { AssignmentCompleteStatus } from './assignment-complete-status';

interface AssignmentViewProps {
  assignmentId: string;
  courseId: string;
  builtActivities: ActivityBuilder[];
  sectionId?: string;
  onAssignmentDeleted?: (courseId: string, sectionId: string) => void;
  isStudentView?: boolean;
  onActivitySelect: (activityId: string) => void;
}

const AssignmentView: React.FC<AssignmentViewProps> = ({
  assignmentId,
  courseId,
  sectionId,
  builtActivities,
  onAssignmentDeleted,
  isStudentView = false,
  onActivitySelect,
}) => {
  const educationManagement = useWithEducationalManagement();
  const [showEditModal, setShowEditModal] = useState(false);
  const assignment = educationManagement.assignments.find(
    (a) => a._id === assignmentId
  );
  const section = sectionId
    ? educationManagement.sections.find((s) => s._id === sectionId)
    : null;

  const sectionAssignment = section?.assignments.find(
    (sa) => sa.assignmentId === assignmentId
  );
  const isMandatory = sectionAssignment?.mandatory ?? false;

  const availableActivities = builtActivities.filter(
    (activity) => !assignment?.activityIds.includes(activity._id)
  );

  const activityIdToCompletionStatus = useMemo(() => {
    if (
      !assignment ||
      !educationManagement.myData ||
      !isStudentData(educationManagement.myData)
    )
      return {};
    const assignmentProgress =
      educationManagement.myData.assignmentProgress.find(
        (progress) => progress.assignmentId === assignmentId
      );
    if (!assignmentProgress) return {};
    return assignmentProgress.activityCompletions.reduce(
      (acc, completion) => {
        acc[completion.activityId] = completion.complete;
        return acc;
      },
      {} as Record<string, boolean>
    );
  }, [assignment, educationManagement.myData]);

  const isAssignmentComplete = useMemo(() => {
    if (!activityIdToCompletionStatus) return false;
    return Object.values(activityIdToCompletionStatus).every(
      (complete) => complete
    );
  }, [activityIdToCompletionStatus]);

  const handleEditAssignment = async (assignmentData: Partial<Assignment>) => {
    try {
      await educationManagement.updateAssignment(courseId, assignmentData);
      setShowEditModal(false);
    } catch (error) {
      console.error('Failed to update assignment:', error);
    }
  };

  const handleAddActivity = async (activityId: string) => {
    if (!assignment) return;

    try {
      const updatedActivityIds = [...assignment.activityIds, activityId];
      await educationManagement.updateAssignment(courseId, {
        _id: assignmentId,
        activityIds: updatedActivityIds,
      });
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
                {isStudentView && (
                  <AssignmentCompleteStatus
                    isAssignmentComplete={isAssignmentComplete}
                  />
                )}
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
                  data-cy="edit-assignment-button"
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

      <AssignmentActivitiesDisplay
        assignment={assignment}
        builtActivities={builtActivities}
        availableActivities={availableActivities}
        isStudentView={isStudentView}
        isAssignmentModifying={educationManagement.isAssignmentModifying}
        onAddActivity={handleAddActivity}
        onRemoveActivity={handleRemoveActivity}
        onActivitySelect={onActivitySelect}
        activityIdToCompletionStatus={activityIdToCompletionStatus}
      />

      {!isStudentView && (
        <AssignmentModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSubmit={handleEditAssignment}
          mode={AssignmentModalMode.EDIT}
          sectionId={sectionId}
          initialData={assignment}
          isLoading={educationManagement.isAssignmentModifying}
        />
      )}
    </Box>
  );
};

export default AssignmentView;
