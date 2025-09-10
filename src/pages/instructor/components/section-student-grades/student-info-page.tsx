import React from 'react';
import { AssignmentsInSection } from '../../helpers';
import {
  SectionStudentsProgress,
  UseWithEducationalManagement,
} from '../../../../store/slices/education-management/use-with-educational-management';
import {
  Section,
  StudentData,
} from '../../../../store/slices/education-management/types';
import {
  Block as BanIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { Box, Typography, Stack, Divider, Button } from '@mui/material';
import { StudentAssignmentsSection } from './student-assignments-section';

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
    <Box sx={{ p: 3, width: '80%' }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={onBackToSection}
        sx={{ mb: 2, color: 'text.secondary' }}
      >
        Back to Students
      </Button>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography
            variant="h5"
            sx={{ fontWeight: 600, color: 'text.primary' }}
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
          display: 'flex',
          gap: 2,
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}
      >
        <Button
          variant="contained"
          startIcon={<BanIcon />}
          onClick={() => handleBanStudent(selectedStudent.userId)}
          disabled={educationManagement.isSectionModifying}
          sx={{
            backgroundColor: '#d32f2f',
            '&:hover': {
              backgroundColor: '#c62828',
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
