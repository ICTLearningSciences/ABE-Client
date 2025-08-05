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
  Stack
} from '@mui/material';
import { Edit as EditIcon, Add as AddIcon } from '@mui/icons-material';
import { useWithEducationalManagement } from '../../../store/slices/education-management/use-with-educational-management';
import { Course } from '../../../store/slices/education-management/types';
import CourseModal from './course-modal';

interface CourseViewProps {
  courseId: string;
  onSectionSelect?: (sectionId: string) => void;
}

const CourseView: React.FC<CourseViewProps> = ({ courseId, onSectionSelect }) => {
  const educationManagement = useWithEducationalManagement();
  const [showEditModal, setShowEditModal] = useState(false);

  const course = educationManagement.courses.find(c => c._id === courseId);
  const courseSections = educationManagement.sections.filter(section => 
    course?.sectionIds.includes(section._id)
  );

  const handleEditCourse = async (courseData: Partial<Course>) => {
    try {
      await educationManagement.updateCourse(courseData);
      setShowEditModal(false);
    } catch (error) {
      console.error('Failed to update course:', error);
    }
  };

  const handleAddSection = async () => {
    try {
      await educationManagement.createSection(courseId);
    } catch (error) {
      console.error('Failed to create section:', error);
    }
  };

  if (!course) {
    return (
      <Box sx={{ 
        textAlign: 'center', 
        maxWidth: 400,
        mx: 'auto',
        py: 8
      }}>
        <Typography variant="h1" sx={{ fontSize: '48px', mb: 3 }}>
          ❌
        </Typography>
        <Typography variant="h4" sx={{ mb: 2, color: 'text.primary' }}>
          Course Not Found
        </Typography>
        <Typography variant="body1" color="text.secondary">
          The course you&apos;re looking for could not be found.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 800, px: 2.5 }}>
      {/* Course Header */}
      <Card sx={{ mb: 4, backgroundColor: 'grey.50' }}>
        <CardContent sx={{ p: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Box sx={{ flex: 1 }}>
              <Stack direction="row" alignItems="center" sx={{ mb: 1.5 }}>
                <Typography sx={{ fontSize: '32px', mr: 2 }}>📚</Typography>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    color: '#1B6A9C',
                    fontWeight: 600,
                    fontSize: '1.75rem'
                  }}
                >
                  {course.title}
                </Typography>
              </Stack>
              
              <Typography 
                variant="body1" 
                color="text.primary" 
                sx={{ mb: 1.5, lineHeight: 1.5 }}
              >
                {course.description}
              </Typography>

            </Box>

            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => setShowEditModal(true)}
              disabled={educationManagement.isCourseModifying}
              sx={{
                color: '#1B6A9C',
                borderColor: '#1B6A9C',
                '&:hover': {
                  backgroundColor: '#1B6A9C',
                  color: 'white'
                }
              }}
            >
              Edit Course
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Sections */}
      <Box>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.5 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary' }}>
            Sections
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {courseSections.length} section{courseSections.length !== 1 ? 's' : ''}
          </Typography>
        </Stack>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddSection}
          disabled={educationManagement.isSectionModifying}
          fullWidth
          sx={{
            py: 2,
            mb: 3,
            backgroundColor: '#1B6A9C',
            '&:hover': {
              backgroundColor: '#145a87'
            }
          }}
        >
          Add Section
        </Button>

        {courseSections.length === 0 ? (
          <Card 
            variant="outlined" 
            sx={{ 
              border: '2px dashed',
              borderColor: 'grey.300',
              textAlign: 'center',
              py: 5,
              px: 2.5
            }}
          >
            <Typography sx={{ fontSize: '48px', color: 'grey.300', mb: 2 }}>
              📑
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
              No sections yet
            </Typography>
            <Typography variant="body2" color="text.disabled">
              Add your first section to organize course content
            </Typography>
          </Card>
        ) : (
          <Grid container spacing={2}>
            {courseSections.map((section) => (
              <Grid item xs={12} key={section._id}>
                <Card 
                  variant="outlined"
                  sx={{
                    cursor: onSectionSelect ? 'pointer' : 'default',
                    transition: 'all 0.2s ease',
                    '&:hover': onSectionSelect ? {
                      borderColor: '#1B6A9C',
                      boxShadow: 2
                    } : {}
                  }}
                  onClick={() => onSectionSelect?.(section._id)}
                >
                  <CardContent>
                    <Stack direction="row" alignItems="center" sx={{ mb: 1.5 }}>
                      <Typography sx={{ fontSize: '20px', mr: 1.5 }}>📑</Typography>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          color: '#1B6A9C',
                          fontWeight: 600,
                          fontSize: '1rem'
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
                      Section Code: {section.sectionCode} • {section.assignments.length} assignment{section.assignments.length !== 1 ? 's' : ''}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Edit Course Modal */}
      <CourseModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSubmit={handleEditCourse}
        mode="edit"
        initialData={course}
        isLoading={educationManagement.isCourseModifying}
      />
    </Box>
  );
};

export default CourseView;