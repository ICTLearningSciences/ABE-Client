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
import { Section } from '../../../store/slices/education-management/types';
import SectionModal, { SectionModalMode } from './section-modal';

interface CourseContentProps {
  courseId: string;
  onSectionSelect?: (sectionId: string) => void;
  isStudentView?: boolean;
}

const CourseContent: React.FC<CourseContentProps> = ({
  courseId,
  onSectionSelect,
  isStudentView = false,
}) => {
  const educationManagement = useWithEducationalManagement();
  const [showSectionModal, setShowSectionModal] = useState(false);

  const course = educationManagement.courses.find((c) => c._id === courseId);
  const courseSections = educationManagement.sections.filter(
    (section) => course?.sectionIds.includes(section._id)
  );

  const handleAddSection = async (sectionData: Partial<Section>) => {
    try {
      await educationManagement.createSection(courseId, sectionData);
      setShowSectionModal(false);
    } catch (error) {
      console.error('Failed to create section:', error);
    }
  };

  const handleOpenSectionModal = () => {
    setShowSectionModal(true);
  };

  const handleCloseSectionModal = () => {
    setShowSectionModal(false);
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
          Sections
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {courseSections.length} section
          {courseSections.length !== 1 ? 's' : ''}
        </Typography>
      </Stack>

      {!isStudentView && (
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenSectionModal}
          disabled={educationManagement.isSectionModifying}
          fullWidth
          data-cy="add-section-button"
          sx={{
            py: 2,
            mb: 3,
            backgroundColor: '#1B6A9C',
            '&:hover': {
              backgroundColor: '#145a87',
            },
          }}
        >
          Add Section
        </Button>
      )}

      {courseSections.length === 0 ? (
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
            📑
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            No sections yet
          </Typography>
          <Typography variant="body2" color="text.disabled">
            {isStudentView
              ? 'Sections will appear here when added by instructors'
              : 'Add your first section to organize course content'}
          </Typography>
        </Card>
      ) : (
        <Grid container spacing={2}>
          {courseSections.map((section) => (
            <Grid item xs={12} key={section._id}>
              <Card
                variant="outlined"
                data-cy={`section-card-${section._id}`}
                sx={{
                  cursor: onSectionSelect ? 'pointer' : 'default',
                  transition: 'all 0.2s ease',
                  '&:hover': onSectionSelect
                    ? {
                        borderColor: '#1B6A9C',
                        boxShadow: 2,
                      }
                    : {},
                }}
                onClick={() => onSectionSelect?.(section._id)}
              >
                <CardContent>
                  <Stack direction="row" alignItems="center" sx={{ mb: 1.5 }}>
                    <Typography sx={{ fontSize: '20px', mr: 1.5 }}>
                      📑
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        color: '#1B6A9C',
                        fontWeight: 600,
                        fontSize: '1rem',
                      }}
                    >
                      {section.title}
                    </Typography>
                  </Stack>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1.5, lineHeight: 1.4 }}
                  >
                    {section.description}
                  </Typography>

                  <Typography variant="caption" color="text.disabled">
                    Section Code: {section.sectionCode} •{' '}
                    {section.assignments.length} assignment
                    {section.assignments.length !== 1 ? 's' : ''}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <SectionModal
        isOpen={showSectionModal}
        onClose={handleCloseSectionModal}
        onSubmit={handleAddSection}
        mode={SectionModalMode.CREATE}
        isLoading={educationManagement.isSectionModifying}
      />
    </Box>
  );
};

export default CourseContent;
