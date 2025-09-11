import React from 'react';
import { Box, Button, Typography } from '@mui/material';

interface NoCoursesDisplayProps {
  isStudent: boolean;
  handleOpenCourseModal: () => void;
  handleOpenJoinSectionModal: () => void;
}

export function NoCoursesDisplay(props: NoCoursesDisplayProps) {
  const { isStudent, handleOpenCourseModal, handleOpenJoinSectionModal } =
    props;
  return (
    <Box
      sx={{
        textAlign: 'center',
        maxWidth: '400px',
        height: '90%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Typography
        sx={{
          fontSize: '64px',
          color: '#dee2e6',
        }}
      >
        📖
      </Typography>
      <Typography
        variant="h4"
        data-cy="course-management-main-title"
        sx={{
          mb: 2,
          color: 'text.primary',
          fontWeight: 600,
        }}
      >
        {isStudent ? 'My Courses' : 'Course Management'}
      </Typography>
      {isStudent ? (
        <Button variant="contained" onClick={handleOpenJoinSectionModal}>
          + Join Section
        </Button>
      ) : (
        <Button variant="contained" onClick={handleOpenCourseModal}>
          + New Course
        </Button>
      )}

      <Typography color="text.secondary" sx={{ lineHeight: 1.5, marginTop: 2 }}>
        {isStudent
          ? 'Join a section to get started.'
          : 'Create a course to get started.'}
      </Typography>
    </Box>
  );
}
