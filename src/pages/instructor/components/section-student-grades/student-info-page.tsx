/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/

import { Box, Typography, Stack, Divider, Button } from "@mui/material";
import { Block, ArrowBack } from "@mui/icons-material";
import type { AssignmentsInSection } from "../../helpers";
import type {
  SectionStudentsProgress,
  UseWithEducationalManagement,
} from "../../../../store/slices/education-management/use-with-educational-management";
import type {
  Section,
  StudentData,
} from "../../../../store/slices/education-management/types";
import { StudentAssignmentsSection } from "./student-assignments-section";

export function StudentInfoPage(props: {
  selectedStudent: StudentData;
  getStudentProgressCounts: (studentId: string) => {
    requiredCompleted: number;
    optionalCompleted: number;
  };
  assignmentsInSection: AssignmentsInSection;
  sectionStudentsProgress: SectionStudentsProgress;
  section: Section;
  handleBanStudent: (studentUserId: string) => void;
  educationManagement: UseWithEducationalManagement;
  onViewStudentTimelines: (studentId: string, assignmentId: string) => void;
  onBackToSection: () => void;
}) {
  const {
    selectedStudent,
    getStudentProgressCounts,
    assignmentsInSection,
    sectionStudentsProgress,
    section,
    handleBanStudent,
    educationManagement,
    onViewStudentTimelines,
    onBackToSection,
  } = props;

  const goToAssignmentTimeline = (assignmentId: string) => {
    onViewStudentTimelines(selectedStudent.userId, assignmentId);
  };
  return (
    <Box sx={{ p: 3, width: "80%" }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={onBackToSection}
        sx={{ mb: 2, color: "text.secondary" }}
      >
        Back to Students
      </Button>
      <Stack
        direction="row"
        sx={{ mb: 3, alignItems: "center", justifyContent: "space-between" }}
      >
        <Box>
          <Typography
            variant="h5"
            sx={{ fontWeight: 600, color: "text.primary" }}
          >
            {selectedStudent.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {selectedStudent.userId}
          </Typography>
        </Box>
      </Stack>

      <Divider sx={{ mb: 3 }} />

      {/* Required Assignments Section */}
      <StudentAssignmentsSection
        title="Required Assignments"
        assignments={assignmentsInSection.requiredAssignments}
        completedCount={
          getStudentProgressCounts(selectedStudent.userId).requiredCompleted
        }
        totalCount={assignmentsInSection.requiredAssignments.length}
        getIsCompleted={(assignment) => {
          const studentProgress =
            sectionStudentsProgress[selectedStudent.userId];
          return (
            studentProgress?.requiredAssignmentsProgress[assignment._id] ||
            false
          );
        }}
        onGoToAssignmentTimeline={goToAssignmentTimeline}
        student={selectedStudent}
      />

      {/* Optional Assignments Section */}
      {assignmentsInSection.optionalAssignments.length > 0 && (
        <StudentAssignmentsSection
          title="Optional Assignments"
          assignments={assignmentsInSection.optionalAssignments}
          completedCount={
            getStudentProgressCounts(selectedStudent.userId).optionalCompleted
          }
          totalCount={section.numOptionalAssignmentsRequired || 0}
          getIsCompleted={(assignment) => {
            const studentProgress =
              sectionStudentsProgress[selectedStudent.userId];
            return (
              studentProgress?.optionalAssignmentsProgress[assignment._id] ||
              false
            );
          }}
          onGoToAssignmentTimeline={goToAssignmentTimeline}
          student={selectedStudent}
        />
      )}

      <Divider sx={{ mb: 3 }} />

      {/* Action Buttons Section */}
      <Box
        sx={{
          mb: 3,
          display: "flex",
          gap: 2,
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <Button
          variant="contained"
          startIcon={<Block />}
          onClick={() => handleBanStudent(selectedStudent.userId)}
          disabled={educationManagement.isSectionModifying}
          sx={{
            backgroundColor: "#d32f2f",
            "&:hover": {
              backgroundColor: "#c62828",
            },
            fontWeight: 600,
            px: 3,
          }}
        >
          BLOCK STUDENT
        </Button>
      </Box>
    </Box>
  );
}
