/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/

import { Box, Button, Typography } from "@mui/material";

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
        textAlign: "center",
        maxWidth: "400px",
        height: "90%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography
        sx={{
          fontSize: "64px",
          color: "#dee2e6",
        }}
      >
        📖
      </Typography>
      <Typography
        variant="h4"
        data-cy="course-management-main-title"
        sx={{
          mb: 2,
          color: "text.primary",
          fontWeight: 600,
        }}
      >
        {isStudent ? "My Courses" : "Course Management"}
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
          ? "Join a section to get started."
          : "Create a course to get started."}
      </Typography>
    </Box>
  );
}
