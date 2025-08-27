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
import { AssignmentsSection } from './assignments-section';
import { getStudentAssignmentDocs } from '../../../../helpers';

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
  onViewStudentTimelines: (
    studentId: string,
    assignmentId: string,
    docId?: string
  ) => void;
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
    const docs = getStudentAssignmentDocs(selectedStudent, assignmentId);
    if (!docs.length) {
      return;
    }
    const primaryDoc = docs.find((d) => d.primaryDocument) || docs[0];
    onViewStudentTimelines(
      selectedStudent.userId,
      assignmentId,
      primaryDoc.docId
    );
  };
  return (
    <Box sx={{ p: 3, width: '80%' }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={onBackToSection}
        sx={{ mb: 2, color: 'text.secondary' }}
      >
        Back to Section
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
      <AssignmentsSection
        title="Required Assignments"
        assignments={assignmentsInSection.requiredAssignments}
        completedCount={
          getStudentProgressCounts(selectedStudent._id).requiredCompleted
        }
        totalCount={assignmentsInSection.requiredAssignments.length}
        getIsCompleted={(assignment) => {
          const studentProgress = sectionStudentsProgress[selectedStudent._id];
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
        <AssignmentsSection
          title="Optional Assignments"
          assignments={assignmentsInSection.optionalAssignments}
          completedCount={
            getStudentProgressCounts(selectedStudent._id).optionalCompleted
          }
          totalCount={section.numOptionalAssignmentsRequired || 0}
          getIsCompleted={(assignment) => {
            const studentProgress =
              sectionStudentsProgress[selectedStudent._id];
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
