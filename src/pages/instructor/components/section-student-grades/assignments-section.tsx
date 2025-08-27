import React, { useMemo } from 'react';
import {
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as UncheckedIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import {
  Box,
  Typography,
  ListItemIcon,
  Stack,
  Chip,
  Accordion,
  AccordionSummary,
} from '@mui/material';
import { StudentActivityDocumentDisplay } from './student-activity-document-display';
import {
  Assignment,
  RelevantGoogleDoc,
  StudentData,
} from '../../../../store/slices/education-management/types';

interface AssignmentsSectionProps {
  title: string;
  assignments: Assignment[];
  completedCount: number;
  totalCount: number;
  getIsCompleted: (assignment: Assignment) => boolean;
  getStudentDocDataForActivity: (
    assignmentId: string,
    activityId: string
  ) => RelevantGoogleDoc[];
  getActivityTitle: (activityId: string) => string;
  onDocumentClick?: (assignmentId: string, docId: string) => void;
  student: StudentData;
}

export function AssignmentsSection({
  title,
  assignments,
  completedCount,
  totalCount,
  getIsCompleted,
  getStudentDocDataForActivity,
  getActivityTitle,
  onDocumentClick,
  student,
}: AssignmentsSectionProps) {
  const { userId: studentId } = student;

  const getAssignmentGrade = useMemo(() => {
    return (assignment: Assignment) => {
      const assignmentProgress = student.assignmentProgress.find(
        (ap) => ap.assignmentId === assignment._id
      );
      return assignmentProgress?.instructorGrade;
    };
  }, [student]);

  return (
    <>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {completedCount}/{totalCount} completed
        </Typography>
      </Stack>

      <Box sx={{ mb: 3 }}>
        {assignments.map((assignment) => {
          const isCompleted = getIsCompleted(assignment);
          const assignmentGrade = getAssignmentGrade(assignment);

          return (
            <div
              style={{ width: '100%', display: 'flex', flexDirection: 'row' }}
              key={assignment._id}
            >
              <Accordion
                key={assignment._id}
                sx={{
                  width: '90%',
                  mb: 1,
                  border: '1px solid',
                  borderColor: isCompleted ? '#4caf50' : 'grey.200',
                  backgroundColor: isCompleted
                    ? 'rgba(76, 175, 80, 0.04)'
                    : 'transparent',
                  borderRadius: '8px !important',
                  '&:before': {
                    display: 'none',
                  },
                }}
              >
                <AccordionSummary
                  data-cy={`${title.replaceAll(' ', '-')}-assignments-section`}
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    '& .MuiAccordionSummary-content': {
                      alignItems: 'center',
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40, mr: 1 }}>
                    {isCompleted ? (
                      <CheckCircleIcon sx={{ color: '#4caf50' }} />
                    ) : (
                      <UncheckedIcon sx={{ color: 'grey.400' }} />
                    )}
                  </ListItemIcon>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 500,
                        color: isCompleted ? 'text.primary' : 'text.secondary',
                      }}
                    >
                      {assignment.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 0.5 }}
                    >
                      {assignment.description}
                    </Typography>
                  </Box>
                  <Chip
                    label={isCompleted ? 'Complete' : 'Incomplete'}
                    size="small"
                    sx={{
                      backgroundColor: isCompleted ? '#4caf50' : 'grey.200',
                      color: isCompleted ? 'white' : 'text.secondary',
                      fontWeight: 500,
                      ml: 1,
                    }}
                  />
                </AccordionSummary>
                <StudentActivityDocumentDisplay
                  assignment={assignment}
                  getStudentDocDataForActivity={getStudentDocDataForActivity}
                  getActivityTitle={getActivityTitle}
                  onDocumentClick={onDocumentClick}
                  studentId={studentId}
                />
              </Accordion>
              {assignmentGrade && isCompleted ? (
                <Box
                  sx={{
                    width: '10%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant="body2">
                    <span style={{ fontWeight: 'bold' }}>Grade:</span>{' '}
                    {assignmentGrade.grade}/5
                  </Typography>
                </Box>
              ) : !isCompleted ? null : (
                <Box
                  sx={{
                    width: '10%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant="body2">
                    <span style={{ fontWeight: 'bold' }}>Not Graded</span>
                  </Typography>
                </Box>
              )}
            </div>
          );
        })}
      </Box>
    </>
  );
}
