/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React, { useState, useMemo } from 'react';
import { Box, Typography, Button, Card, Grid, Stack } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useWithEducationalManagement } from '../../../store/slices/education-management/use-with-educational-management';
import { Assignment } from '../../../store/slices/education-management/types';
import AssignmentModal, { AssignmentModalMode } from './assignment-modal';
import AssignmentCard from './assignment-card';
import OptionalRequirements from './optional-requirements';
import { getAssignmentsInSection } from '../helpers';
import { useAppSelector } from '../../../store/hooks';
import { EducationalRole } from '../../../types';

interface SectionContentProps {
  sectionId: string;
  courseId: string;
  onAssignmentSelect: (assignmentId: string) => void;
  isStudentView?: boolean;
}

const SectionContent: React.FC<SectionContentProps> = ({
  sectionId,
  courseId,
  onAssignmentSelect,
  isStudentView = false,
}) => {
  const educationManagement = useWithEducationalManagement();
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [optionalAssignmentsRequired, setOptionalAssignmentsRequired] =
    useState(0);
  const section = educationManagement.sections.find((s) => s._id === sectionId);
  const assignmentsInSection = useMemo(
    () => getAssignmentsInSection(educationManagement.assignments, section),
    [educationManagement.assignments, section]
  );
  const userData = useAppSelector((state) => state.login.user);
  const sectionStudentsProgress =
    educationManagement.allSectionsStudentsProgress[sectionId] || {};
  const mySectionProgress =
    userData && userData.educationalRole === EducationalRole.STUDENT
      ? sectionStudentsProgress[userData._id]
      : null;

  // Initialize the optional assignments required value
  React.useEffect(() => {
    if (section) {
      setOptionalAssignmentsRequired(
        section.numOptionalAssignmentsRequired || 0
      );
    }
  }, [section]);

  const handleAddAssignment = async (
    assignmentData: Partial<Assignment>,
    mandatory = true
  ) => {
    try {
      const newAssignment = await educationManagement.createAssignment(
        courseId,
        assignmentData
      );
      await educationManagement.addAssignmentToSection(
        courseId,
        sectionId,
        newAssignment._id,
        mandatory
      );
      setShowAssignmentModal(false);
    } catch (error) {
      console.error('Failed to create assignment:', error);
    }
  };

  const handleOpenAssignmentModal = () => {
    setShowAssignmentModal(true);
  };

  const handleCloseAssignmentModal = () => {
    setShowAssignmentModal(false);
  };

  const handleOptionalRequiredChange = async (value: number) => {
    if (!section) return;
    try {
      await educationManagement.updateSection(courseId, {
        _id: sectionId,
        numOptionalAssignmentsRequired: value,
      });
      setOptionalAssignmentsRequired(value);
    } catch (error) {
      console.error('Failed to update optional assignments required:', error);
    }
  };

  const renderAssignmentList = (
    assignments: Assignment[],
    title: string,
    options: {
      showCompletionCounter?: boolean;
      completedCount?: number;
      showOptionalRequirements?: boolean;
    } = {}
  ) => {
    if (assignments.length === 0) return null;

    const {
      showCompletionCounter = false,
      completedCount = 0,
      showOptionalRequirements = false,
    } = options;

    return (
      <Box sx={{ mb: 4 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 2 }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: 'text.primary' }}
          >
            {title}
          </Typography>
          {showCompletionCounter ? (
            <Typography variant="body2" color="text.secondary">
              {completedCount}/{assignments.length} completed
            </Typography>
          ) : (
            <Typography variant="body2" color="text.secondary">
              {assignments.length} assignment
              {assignments.length !== 1 ? 's' : ''}
            </Typography>
          )}
        </Stack>

        {showOptionalRequirements && (
          <OptionalRequirements
            isStudentView={isStudentView}
            optionalAssignmentsRequired={optionalAssignmentsRequired}
            totalOptionalAssignments={assignments.length}
            onRequiredChange={setOptionalAssignmentsRequired}
            onRequiredUpdate={handleOptionalRequiredChange}
          />
        )}

        <Grid container spacing={2}>
          {assignments.map((assignment) => (
            <Grid item xs={12} key={assignment._id}>
              <AssignmentCard
                assignment={assignment}
                onClick={onAssignmentSelect}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };

  if (!section) {
    return null;
  }

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
          Assignments
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {section.assignments.length} assignment
          {section.assignments.length !== 1 ? 's' : ''}
        </Typography>
      </Stack>

      {!isStudentView && (
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAssignmentModal}
          disabled={educationManagement.isAssignmentModifying}
          fullWidth
          data-cy="add-assignment-button"
          sx={{
            py: 2,
            mb: 3,
            backgroundColor: '#1B6A9C',
            '&:hover': {
              backgroundColor: '#145a87',
            },
          }}
        >
          Add Assignment
        </Button>
      )}

      {section.assignments.length === 0 ? (
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
            📝
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            No assignments yet
          </Typography>
          <Typography variant="body2" color="text.disabled">
            Add your first assignment to get students started
          </Typography>
        </Card>
      ) : (
        <>
          {/* Required Assignments */}
          {renderAssignmentList(
            assignmentsInSection.requiredAssignments,
            'Required Assignments'
          )}

          {/* Optional Assignments */}
          {renderAssignmentList(
            assignmentsInSection.optionalAssignments,
            'Optional Assignments',
            {
              showCompletionCounter: isStudentView,
              completedCount: mySectionProgress
                ? Object.values(
                    mySectionProgress.optionalAssignmentsProgress
                  ).filter((complete) => complete).length
                : 0,
              showOptionalRequirements: true,
            }
          )}
        </>
      )}

      <AssignmentModal
        isOpen={showAssignmentModal}
        onClose={handleCloseAssignmentModal}
        onSubmit={handleAddAssignment}
        mode={AssignmentModalMode.CREATE}
        sectionId={sectionId}
        isLoading={educationManagement.isAssignmentModifying}
      />
    </Box>
  );
};

export default SectionContent;
