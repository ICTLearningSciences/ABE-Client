/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React, { useState, useMemo } from 'react';
import { Box, Typography, Button, Card } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useWithEducationalManagement } from '../../../store/slices/education-management/use-with-educational-management';
import {
  Assignment,
  isStudentData,
} from '../../../store/slices/education-management/types';
import AssignmentModal, { AssignmentModalMode } from './assignment-modal';
import { getAssignmentsDataInSection } from '../helpers';
import { SectionAssignmentList } from './section-assignments/section-assignment-list';

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

  const section = educationManagement.sections.find((s) => s._id === sectionId);
  const assignmentsInSection = useMemo(
    () => getAssignmentsDataInSection(educationManagement.assignments, section),
    [educationManagement.assignments, section]
  );

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

  const getAssignmentGrade = useMemo(() => {
    return (assignmentId: string) => {
      const myData = educationManagement.myData;
      if (!myData || !isStudentData(myData)) return undefined;
      const assignmentProgress = myData.assignmentProgress.find(
        (ap) => ap.assignmentId === assignmentId
      );
      return assignmentProgress?.instructorGrade || undefined;
    };
  }, [educationManagement.myData]);

  const handleOpenAssignmentModal = () => {
    setShowAssignmentModal(true);
  };

  const handleCloseAssignmentModal = () => {
    setShowAssignmentModal(false);
  };

  if (!section) {
    return null;
  }

  return (
    <Box>
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
        <SectionAssignmentList
          assignments={assignmentsInSection}
          title="Assignments"
          getAssignmentGrade={getAssignmentGrade}
          options={{
            showCompletionCounter: isStudentView,
            showOptionalRequirements: true,
          }}
          section={section}
          courseId={courseId}
          sectionId={sectionId}
          isStudentView={isStudentView}
          onAssignmentSelect={onAssignmentSelect}
          educationManagement={educationManagement}
        />
      )}

      <AssignmentModal
        isOpen={showAssignmentModal}
        onClose={handleCloseAssignmentModal}
        onSubmit={handleAddAssignment}
        mode={AssignmentModalMode.CREATE}
        section={section}
        isLoading={educationManagement.isAssignmentModifying}
      />
    </Box>
  );
};

export default SectionContent;
