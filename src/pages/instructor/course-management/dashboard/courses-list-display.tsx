import React from 'react';
import { Paper } from '@mui/material';

import { Course } from '../../../../store/slices/education-management/types';
import { ColumnDiv } from '../../../../styled-components';
import { CourseListItem } from './course-list-item';
import { NoCoursesDisplay } from './no-courses-display';
import { Button } from '@mui/material';
export function CoursesListDisplay(props: {
  isStudent: boolean;
  courses: Course[];
  onCourseSelect: (courseId: string) => void;
  handleOpenCourseModal: () => void;
  handleOpenJoinSectionModal: () => void;
}) {
  const {
    courses,
    isStudent,
    onCourseSelect,
    handleOpenCourseModal,
    handleOpenJoinSectionModal,
  } = props;

  if (courses.length === 0) {
    return (
      <NoCoursesDisplay
        isStudent={isStudent}
        handleOpenCourseModal={handleOpenCourseModal}
        handleOpenJoinSectionModal={handleOpenJoinSectionModal}
      />
    );
  }
  return (
    <Paper
      elevation={2}
      sx={{
        width: '50%',
        height: '100%',
        p: 3,
        borderRadius: 2,
        backgroundColor: '#fafafa',
      }}
    >
      <ColumnDiv
        style={{
          gap: '20px',
          height: '100%',
        }}
      >
        <h1>Courses</h1>
        {isStudent ? (
          <Button variant="contained" onClick={handleOpenJoinSectionModal}>
            + Join Section
          </Button>
        ) : (
          <Button variant="contained" onClick={handleOpenCourseModal}>
            + New Course
          </Button>
        )}
        {courses.map((course) => (
          <CourseListItem
            key={course._id}
            course={course}
            onCourseSelect={onCourseSelect}
          />
        ))}
      </ColumnDiv>
    </Paper>
  );
}
