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
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useWithEducationalManagement } from '../../../store/slices/education-management/use-with-educational-management';
import { Assignment } from '../../../store/slices/education-management/types';
import AssignmentModal from './assignment-modal';
import { getAssignmentsForSection } from '../helpers';

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
  const assignments = getAssignmentsForSection(educationManagement, sectionId);
  const section = educationManagement.sections.find((s) => s._id === sectionId);

  const handleAddAssignment = async (assignmentData: Partial<Assignment>) => {
    try {
      const newAssignment = await educationManagement.createAssignment(
        courseId,
        assignmentData
      );
      await educationManagement.addAssignmentToSection(
        courseId,
        sectionId,
        newAssignment._id,
        true
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
        <Grid container spacing={2}>
          {assignments.map((assignment) => (
            <Grid item xs={12} key={assignment._id}>
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
                onClick={() => onAssignmentSelect(assignment._id)}
              >
                <CardContent>
                  <Stack direction="row" alignItems="center" sx={{ mb: 1.5 }}>
                    <Typography sx={{ fontSize: '20px', mr: 1.5 }}>
                      📝
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        color: '#1B6A9C',
                        fontWeight: 600,
                        fontSize: '1rem',
                      }}
                    >
                      {assignment.title}
                    </Typography>
                  </Stack>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1.5, lineHeight: 1.4 }}
                  >
                    {assignment.description} hello
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <AssignmentModal
        isOpen={showAssignmentModal}
        onClose={handleCloseAssignmentModal}
        onSubmit={handleAddAssignment}
        mode="create"
        sectionId={sectionId}
        isLoading={educationManagement.isAssignmentModifying}
      />
    </Box>
  );
};

export default SectionContent;
