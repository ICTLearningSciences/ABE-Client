/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/

import { Button, Paper } from "@mui/material";
import type { Course } from "../../../../store/slices/education-management/types";
import { ColumnDiv } from "../../../../styled-components";
import { CourseListItem } from "./course-list-item";
import { NoCoursesDisplay } from "./no-courses-display";
import { useWithWindowSize } from "../../../../hooks/use-with-window-size";

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
  const { isMobile } = useWithWindowSize();

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
        width: isMobile ? "95%" : "50%",
        height: "100%",
        p: 3,
        borderRadius: 2,
        backgroundColor: "#fafafa",
      }}
    >
      <ColumnDiv
        style={{
          gap: "20px",
          height: "100%",
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
