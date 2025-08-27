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
import { ActivityBuilder } from '../../../../components/activity-builder/types';
import {
  Block as BanIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { Box, Typography, Stack, Divider, Button } from '@mui/material';
import { AssignmentsSection } from './assignments-section';

export function StudentInfoPage(props: {
  selectedStudent: StudentData;
  getStudentProgressCounts: (studentId: string) => {
    requiredCompleted: number;
    optionalCompleted: number;
  };
  assignmentsInSection: AssignmentsInSection;
  sectionStudentsProgress: SectionStudentsProgress;
  section: Section;
  builtActivities: ActivityBuilder[];
  handleBanStudent: (studentUserId: string) => void;
  educationManagement: UseWithEducationalManagement;
  onViewStudentTimelines?: (
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
    builtActivities,
    handleBanStudent,
    educationManagement,
    onViewStudentTimelines,
    onBackToSection,
  } = props;

  const getActivityTitle = (activityId: string): string => {
    const activity = builtActivities.find((a) => a._id === activityId);
    return activity ? activity.title : `Activity ${activityId}`;
  };

  const getStudentDocIdsForActivity = (
    assignmentId: string,
    activityId: string
  ): string[] => {
    const assignmentProgress = selectedStudent.assignmentProgress.find(
      (progress) => progress.assignmentId === assignmentId
    );
    if (!assignmentProgress) return [];

    const activityCompletion = assignmentProgress.activityCompletions.find(
      (completion) => completion.activityId === activityId
    );
    if (!activityCompletion) return [];

    return activityCompletion.relevantGoogleDocs.map((doc) => doc.docId);
  };

  const handleDocumentClick = (assignmentId: string, docId: string) => {
    if (onViewStudentTimelines) {
      onViewStudentTimelines(selectedStudent.userId, assignmentId, docId);
    }
  };
  return (
    <Box sx={{ p: 3 }}>
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
        getStudentDocIdsForActivity={getStudentDocIdsForActivity}
        getActivityTitle={getActivityTitle}
        onDocumentClick={handleDocumentClick}
        studentId={selectedStudent.userId}
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
          getStudentDocIdsForActivity={getStudentDocIdsForActivity}
          getActivityTitle={getActivityTitle}
          onDocumentClick={handleDocumentClick}
          studentId={selectedStudent.userId}
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
          BAN STUDENT
        </Button>
      </Box>
    </Box>
  );
}
