/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/

import { Card, CardContent, Typography, Stack } from "@mui/material";
import type { Course } from "../../../../store/slices/education-management/types";

export function CourseListItem(props: {
  course: Course;
  onCourseSelect: (courseId: string) => void;
}) {
  const { course, onCourseSelect } = props;
  return (
    <Card
      variant="outlined"
      data-cy={`course-card-${course._id}`}
      sx={{
        width: "100%",
        cursor: "pointer",
        transition: "all 0.2s ease",
        "&:hover": {
          borderColor: "#1B6A9C",
          boxShadow: 2,
        },
      }}
      onClick={() => onCourseSelect(course._id)}
    >
      <CardContent>
        <Stack
          direction="row"
          sx={{
            mb: 1.5,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Stack direction="row" style={{ alignItems: "center" }}>
            <Typography sx={{ fontSize: "20px", mr: 1.5 }}>📚</Typography>
            <Typography
              variant="h6"
              sx={{
                color: "#1B6A9C",
                fontWeight: 600,
                fontSize: "1rem",
              }}
            >
              {course.title}
            </Typography>
          </Stack>
        </Stack>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 1.5, lineHeight: 1.4 }}
        >
          {course.description}
        </Typography>
      </CardContent>
    </Card>
  );
}
