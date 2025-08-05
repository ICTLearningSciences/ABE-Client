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
import {
  Section,
  Assignment,
} from '../../../store/slices/education-management/types';
import SectionModal from './section-modal';
import AssignmentModal from './assignment-modal';
import { getAssignmentsForSection } from '../helpers';
import DeleteConfirmationModal from './delete-confirmation-modal';

interface SectionViewProps {
  sectionId: string;
  courseId: string;
  onAssignmentSelect: (assignmentId: string) => void;
}

const SectionView: React.FC<SectionViewProps> = ({
  sectionId,
  courseId,
  onAssignmentSelect,
}) => {
  const educationManagement = useWithEducationalManagement();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const assignments = getAssignmentsForSection(educationManagement, sectionId);
  const section = educationManagement.sections.find((s) => s._id === sectionId);

  const handleEditSection = async (sectionData: Partial<Section>) => {
    try {
      await educationManagement.updateSection(courseId, sectionData);
      setShowEditModal(false);
    } catch (error) {
      console.error('Failed to update section:', error);
    }
  };

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

  const handleDeleteSection = async () => {
    try {
      await educationManagement.deleteSection(courseId, sectionId);
    } catch (error) {
      console.error('Failed to delete section:', error);
    }
  };

  if (!section) {
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
          Section Not Found
        </Typography>
        <Typography variant="body1" color="text.secondary">
          The section you&apos;re looking for could not be found.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 800,
        px: 2.5,
      }}
    >
      {/* Section Header */}
      <Card sx={{ mb: 4, backgroundColor: 'grey.50' }}>
        <CardContent sx={{ p: 3 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
          >
            <Box sx={{ flex: 1 }}>
              <Stack direction="row" alignItems="center" sx={{ mb: 1.5 }}>
                <Typography sx={{ fontSize: '32px', mr: 2 }}>📑</Typography>
                <Typography
                  variant="h4"
                  sx={{
                    color: '#1B6A9C',
                    fontWeight: 600,
                    fontSize: '1.75rem',
                  }}
                >
                  {section.title}
                </Typography>
              </Stack>

              <Typography
                variant="body1"
                color="text.primary"
                sx={{ mb: 1.5, lineHeight: 1.5 }}
              >
                {section.description}
              </Typography>

              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ mb: 1 }}
              >
                <Chip
                  label={`Section Code: ${section.sectionCode}`}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '11px' }}
                />
              </Stack>
            </Box>

            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => setShowEditModal(true)}
              disabled={educationManagement.isSectionModifying}
              sx={{
                color: '#1B6A9C',
                borderColor: '#1B6A9C',
                '&:hover': {
                  backgroundColor: '#1B6A9C',
                  color: 'white',
                },
              }}
            >
              Edit Section
            </Button>
            <DeleteConfirmationModal
              onDelete={handleDeleteSection}
              entityType="section"
              entityName={section.title}
            />
          </Stack>
        </CardContent>
      </Card>

      {/* Assignments */}
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
      </Box>

      {/* Edit Section Modal */}
      <SectionModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSubmit={handleEditSection}
        mode="edit"
        initialData={section}
        isLoading={educationManagement.isSectionModifying}
      />

      {/* Assignment Modal */}
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

export default SectionView;
