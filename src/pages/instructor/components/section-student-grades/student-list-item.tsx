/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/

import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
} from "@mui/material";
import { Person as Person } from "@mui/icons-material";
import type { StudentData } from "../../../../store/slices/education-management/types";
import type { AssignmentsInSection } from "../../helpers";

export function StudentListItem(
  student: StudentData,
  requiredCompleted: number,
  optionalCompleted: number,
  assignmentsInSection: AssignmentsInSection,
  handleStudentClick: (student: StudentData) => void,
  numOptionalAssignmentsRequired: number,
) {
  return (
    <ListItem
      key={student._id}
      onClick={() => handleStudentClick(student)}
      data-cy={`student-${student.userId}`}
      sx={{
        cursor: "pointer",
        borderRadius: 2,
        mb: 1,
        border: "1px solid",
        borderColor: "grey.200",
        transition: "all 0.2s ease",
        "&:hover": {
          borderColor: "#1B6A9C",
          backgroundColor: "rgba(27, 106, 156, 0.04)",
        },
      }}
    >
      <ListItemIcon>
        <Person sx={{ color: "#1B6A9C" }} />
      </ListItemIcon>
      <ListItemText
        primary={
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: "text.primary" }}
          >
            {student.name}
          </Typography>
        }
        secondary={
          <Typography variant="body2" color="text.secondary">
            {student.userId}
          </Typography>
        }
      />
      <Box sx={{ textAlign: "right" }}>
        <Typography variant="body1" sx={{ fontWeight: 600, color: "#1B6A9C" }}>
          Required: {requiredCompleted}/
          {assignmentsInSection.requiredAssignments.length}
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 600, color: "#1B6A9C" }}>
          Optional: {optionalCompleted}/{numOptionalAssignmentsRequired || 0}
        </Typography>
      </Box>
    </ListItem>
  );
}
