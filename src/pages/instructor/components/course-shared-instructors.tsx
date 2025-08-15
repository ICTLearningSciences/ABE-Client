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
  Stack,
  Autocomplete,
  TextField,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from '@mui/material';
import { Delete as DeleteIcon, Share as ShareIcon } from '@mui/icons-material';
import { useWithEducationalManagement } from '../../../store/slices/education-management/use-with-educational-management';
import {
  Instructor,
  CourseOwnership,
} from '../../../store/slices/education-management/types';
import { useAppSelector } from '../../../store/hooks';

interface CourseSharedInstructorsProps {
  courseId: string;
}

const CourseSharedInstructors: React.FC<CourseSharedInstructorsProps> = ({
  courseId,
}) => {
  const educationManagement = useWithEducationalManagement();
  const [selectedInstructor, setSelectedInstructor] =
    useState<Instructor | null>(null);

  const availableInstructors = useAppSelector(
    (state) => state.educationManagement.instructors
  );
  const sharedInstructors = availableInstructors.filter((instructor) =>
    instructor.courses.some(
      (courseData) =>
        courseData.courseId === courseId &&
        courseData.ownership === CourseOwnership.SHARED
    )
  );

  const unsharedInstructors = availableInstructors.filter(
    (instructor) =>
      !instructor.courses.some(
        (courseData) =>
          courseData.courseId === courseId &&
          courseData.ownership === CourseOwnership.SHARED
      )
  );

  const handleShareCourse = async () => {
    if (!selectedInstructor) return;

    try {
      await educationManagement.shareCourseWithInstructor(
        selectedInstructor.userId,
        courseId
      );
      setSelectedInstructor(null);
    } catch (error) {
      console.error('Failed to share course:', error);
    }
  };

  const handleUnshareCourse = async (instructorId: string) => {
    try {
      await educationManagement.unshareCourseWithInstructor(
        instructorId,
        courseId
      );
    } catch (error) {
      console.error('Failed to unshare course:', error);
    }
  };

  return (
    <Box>
      <Typography
        variant="h5"
        sx={{ fontWeight: 600, color: 'text.primary', mb: 3 }}
      >
        Share Course with Instructors
      </Typography>

      {/* Instructor Selector */}
      <Card sx={{ mb: 3, p: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Autocomplete
            options={unsharedInstructors}
            getOptionLabel={(option) => option.name}
            value={selectedInstructor}
            onChange={(event, newValue) => setSelectedInstructor(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Instructor"
                placeholder="Type to search instructors..."
              />
            )}
            sx={{ flex: 1 }}
            disabled={educationManagement.isCourseModifying}
          />
          <Button
            variant="contained"
            startIcon={<ShareIcon />}
            onClick={handleShareCourse}
            disabled={
              !selectedInstructor || educationManagement.isCourseModifying
            }
            sx={{
              backgroundColor: '#1B6A9C',
              '&:hover': {
                backgroundColor: '#145a87',
              },
            }}
          >
            Share
          </Button>
        </Stack>
      </Card>

      {/* Shared Instructors List */}
      <Typography
        variant="h6"
        sx={{ fontWeight: 600, color: 'text.primary', mb: 2 }}
      >
        Shared Instructors ({sharedInstructors.length})
      </Typography>

      {sharedInstructors.length === 0 ? (
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
            👥
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            No instructors sharing this course
          </Typography>
          <Typography variant="body2" color="text.disabled">
            Use the selector above to share this course with other instructors
          </Typography>
        </Card>
      ) : (
        <Card variant="outlined">
          <List>
            {sharedInstructors.map((instructor, index) => (
              <ListItem
                key={instructor._id}
                sx={{
                  borderBottom: index < sharedInstructors.length - 1 ? 1 : 0,
                  borderColor: 'divider',
                }}
                secondaryAction={
                  <IconButton
                    edge="end"
                    onClick={() => handleUnshareCourse(instructor.userId)}
                    disabled={educationManagement.isCourseModifying}
                    sx={{ color: '#d32f2f' }}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={instructor.name}
                  secondary={`User ID: ${instructor.userId}`}
                />
              </ListItem>
            ))}
          </List>
        </Card>
      )}
    </Box>
  );
};

export default CourseSharedInstructors;
