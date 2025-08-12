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
  Tabs,
  Tab,
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { useWithEducationalManagement } from '../../../store/slices/education-management/use-with-educational-management';
import {
  Course,
  CourseOwnership,
} from '../../../store/slices/education-management/types';
import CourseModal from './course-modal';
import DeleteConfirmationModal from './delete-confirmation-modal';
import CourseContent from './course-content';
import CourseSharedInstructors from './course-shared-instructors';
import { useAppSelector } from '../../../store/hooks';

interface CourseViewProps {
  courseId: string;
  onSectionSelect?: (sectionId: string) => void;
  onCourseDeleted?: () => void;
  startWithEditModal?: boolean;
  isStudentView?: boolean;
}

const CourseView: React.FC<CourseViewProps> = ({
  courseId,
  onSectionSelect,
  onCourseDeleted,
  startWithEditModal = false,
  isStudentView = false,
}) => {
  const educationManagement = useWithEducationalManagement();
  const [showEditModal, setShowEditModal] = useState(startWithEditModal);
  const [selectedTab, setSelectedTab] = useState(0);
  const course = educationManagement.courses.find((c) => c._id === courseId);
  const myInstructorData = useAppSelector(
    (state) => state.educationManagement.instructorData
  );
  const ownsThisCourse = myInstructorData?.courses.some(
    (c) => c.courseId === courseId && c.ownership === CourseOwnership.OWNER
  );

  const handleEditCourse = async (courseData: Partial<Course>) => {
    try {
      await educationManagement.updateCourse(courseData);
      setShowEditModal(false);
    } catch (error) {
      console.error('Failed to update course:', error);
    }
  };

  const handleDeleteCourse = async () => {
    try {
      await educationManagement.deleteCourse(courseId);
      onCourseDeleted?.();
    } catch (error) {
      console.error('Failed to delete course:', error);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  if (!course) {
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
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
          >
            <Box sx={{ flex: 1 }}>
              <Stack direction="row" alignItems="center" sx={{ mb: 1.5 }}>
                <Typography sx={{ fontSize: '32px', mr: 2 }}>📚</Typography>
                <Typography
                  variant="h4"
                  sx={{
                    color: '#1B6A9C',
                    fontWeight: 600,
                    fontSize: '1.75rem',
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
            {!isStudentView && ownsThisCourse && (
              <>
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={() => setShowEditModal(true)}
                  disabled={educationManagement.isCourseModifying}
                  data-cy="edit-course-button"
                  sx={{
                    color: '#1B6A9C',
                    borderColor: '#1B6A9C',
                    '&:hover': {
                      backgroundColor: '#1B6A9C',
                      color: 'white',
                    },
                  }}
                >
                  Edit Course
                </Button>
                <DeleteConfirmationModal
                  onDelete={handleDeleteCourse}
                  entityType="course"
                  entityName={course.title}
                />
              </>
            )}
          </Stack>
        </CardContent>
      </Card>

      {/* Course Tabs - Only visible to instructors who own the course */}
      {!isStudentView && ownsThisCourse ? (
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
            <Tab label="Content" />
            <Tab label="Share Course" />
          </Tabs>

          {selectedTab === 0 && (
            <CourseContent
              courseId={courseId}
              onSectionSelect={onSectionSelect}
            />
          )}

          {selectedTab === 1 && <CourseSharedInstructors courseId={courseId} />}
        </Box>
      ) : (
        <CourseContent
          courseId={courseId}
          onSectionSelect={onSectionSelect}
          isStudentView={isStudentView}
        />
      )}

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
