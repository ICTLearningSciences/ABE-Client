import React from 'react';
import { Course } from '../../../../store/slices/education-management/types';
import { CoursesListDisplay } from './courses-list-display';

export function DashboardMain(props: {
  courses: Course[];
  isStudent: boolean;
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
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        marginLeft: '20px',
        alignItems: 'center',
      }}
    >
      <CoursesListDisplay
        courses={courses}
        isStudent={isStudent}
        onCourseSelect={onCourseSelect}
        handleOpenCourseModal={handleOpenCourseModal}
        handleOpenJoinSectionModal={handleOpenJoinSectionModal}
      />
    </div>
  );
}
