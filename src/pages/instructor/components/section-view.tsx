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
  Stack,
  Chip,
  Tabs,
  Tab,
} from '@mui/material';
import { Edit as EditIcon, ExitToApp as ExitIcon } from '@mui/icons-material';
import { useWithEducationalManagement } from '../../../store/slices/education-management/use-with-educational-management';
import { Section } from '../../../store/slices/education-management/types';
import SectionModal, { SectionModalMode } from './section-modal';
import DeleteConfirmationModal from './delete-confirmation-modal';
import SectionContent from './section-content';
import SectionStudentsGrades from './section-student-grades/section-students-grades';
import BannedStudents from './banned-students';

interface SectionViewProps {
  sectionId: string;
  courseId: string;
  onAssignmentSelect: (assignmentId: string) => void;
  onSectionDeleted?: (courseId: string) => void;
  onRemoveFromSection?: (courseId: string, sectionId: string) => void;
  isStudentView?: boolean;
  onViewStudentTimelines?: (studentId: string) => void;
}

const SectionView: React.FC<SectionViewProps> = ({
  sectionId,
  courseId,
  onAssignmentSelect,
  onSectionDeleted,
  onRemoveFromSection,
  isStudentView = false,
  onViewStudentTimelines,
}) => {
  const educationManagement = useWithEducationalManagement();
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const section = educationManagement.getSectionForSectionId(sectionId);
  const currentSectionStudentsProgress =
    educationManagement.allSectionsStudentsProgress[sectionId] || {};
  const handleEditSection = async (sectionData: Partial<Section>) => {
    try {
      await educationManagement.updateSection(courseId, sectionData);
      setShowEditModal(false);
    } catch (error) {
      console.error('Failed to update section:', error);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleDeleteSection = async () => {
    try {
      await educationManagement.deleteSection(courseId, sectionId);
      onSectionDeleted?.(courseId);
    } catch (error) {
      console.error('Failed to delete section:', error);
    }
  };

  const handleRemoveFromSection = async () => {
    if (onRemoveFromSection) {
      await onRemoveFromSection(courseId, sectionId);
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

            {!isStudentView && (
              <>
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={() => setShowEditModal(true)}
                  disabled={educationManagement.isSectionModifying}
                  data-cy="edit-section-button"
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
              </>
            )}
            {isStudentView && (
              <Button
                variant="outlined"
                startIcon={<ExitIcon />}
                onClick={handleRemoveFromSection}
                disabled={educationManagement.isEnrollmentModifying}
                data-cy="remove-from-section-button"
                sx={{
                  color: '#d32f2f',
                  borderColor: '#d32f2f',
                  '&:hover': {
                    backgroundColor: '#d32f2f',
                    color: 'white',
                  },
                }}
              >
                Leave Section
              </Button>
            )}
          </Stack>
        </CardContent>
      </Card>

      {/* Section Tabs - Only visible to instructors */}
      {!isStudentView ? (
        <Box>
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              mb: 3,
              '& .MuiTab-root': {
                color: '#666',
                '&.Mui-selected': {
                  color: '#1B6A9C',
                },
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#1B6A9C',
              },
            }}
          >
            <Tab label="Section Content" />
            <Tab label="Students and Grades" />
            <Tab label="Banned Students" />
          </Tabs>

          {selectedTab === 0 && (
            <SectionContent
              sectionId={sectionId}
              courseId={courseId}
              onAssignmentSelect={onAssignmentSelect}
              isStudentView={isStudentView}
            />
          )}

          {selectedTab === 1 && (
            <SectionStudentsGrades
              sectionStudentsProgress={currentSectionStudentsProgress}
              section={section}
              assignments={educationManagement.assignments}
              onViewStudentTimelines={onViewStudentTimelines}
            />
          )}

          {selectedTab === 2 && (
            <BannedStudents
              section={section}
              students={educationManagement.students}
            />
          )}
        </Box>
      ) : (
        <SectionContent
          sectionId={sectionId}
          courseId={courseId}
          onAssignmentSelect={onAssignmentSelect}
          isStudentView={isStudentView}
        />
      )}

      <SectionModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSubmit={handleEditSection}
        mode={SectionModalMode.EDIT}
        initialData={section}
        isLoading={educationManagement.isSectionModifying}
      />
    </Box>
  );
};

export default SectionView;
