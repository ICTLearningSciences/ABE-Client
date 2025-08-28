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
  Button,
} from '@mui/material';
import {
  Assignment,
  isInstructorData,
  isStudentData,
  StudentData,
} from '../../../../store/slices/education-management/types';
import { AssignmentDocsDisplay } from './assignment-docs-display';
import { getStudentAssignmentDocs } from '../../../../helpers';
import { useWithEducationalManagement } from '../../../../store/slices/education-management/use-with-educational-management';

export interface AssignmentGrade {
  grade: number;
  comment: string;
}

interface AssignmentsSectionProps {
  title: string;
  assignments: Assignment[];
  completedCount: number;
  totalCount: number;
  getIsCompleted: (assignment: Assignment) => boolean;
  onGoToAssignmentTimeline: (assignmentId: string) => void;
  student: StudentData;
}

export function StudentAssignmentsSection({
  title,
  assignments,
  completedCount,
  totalCount,
  getIsCompleted,
  onGoToAssignmentTimeline,
  student,
}: AssignmentsSectionProps) {
  const { myData } = useWithEducationalManagement();

  const getAssignmentGrade = useMemo(() => {
    return (assignment: Assignment) => {
      const assignmentProgress = student.assignmentProgress.find(
        (ap) => ap.assignmentId === assignment._id
      );
      return assignmentProgress?.instructorGrade;
    };
  }, [student]);

  const getAssignmentDocs = useMemo(() => {
    return (assignment: Assignment) => {
      return getStudentAssignmentDocs(student, assignment._id);
    };
  }, [student, assignments]);

  function getGradeDisplay(
    assignment: Assignment,
    isCompleted: boolean,
    assignmentGrade?: AssignmentGrade
  ) {
    if (!myData) {
      return null;
    }
    if (isInstructorData(myData)) {
      if (!isCompleted) {
        return null;
      }

      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '10%',
          }}
        >
          {assignmentGrade ? (
            <Typography variant="body2">
              <span style={{ fontWeight: 'bold', color: 'darkgreen' }}>
                Grade:
              </span>{' '}
              {assignmentGrade.grade}/5
            </Typography>
          ) : (
            <Typography variant="body2">
              <span style={{ fontWeight: 'bold', color: 'darkred' }}>
                Not Graded
              </span>
            </Typography>
          )}

          <Button
            variant="contained"
            onClick={() => onGoToAssignmentTimeline(assignment._id)}
            data-cy="review-documents-button"
          >
            Grade
          </Button>
        </Box>
      );
    }
    if (isStudentData(myData)) {
      return assignmentGrade && isCompleted ? (
        <Box
          sx={{
            width: '10%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography variant="body2">
            <span style={{ fontWeight: 'bold', color: 'darkgreen' }}>
              Grade:
            </span>{' '}
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
      );
    }
  }

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
          const docData = getAssignmentDocs(assignment);
          return (
            <div
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
              data-cy={`assignments-section-${assignment._id}`}
              key={assignment._id}
            >
              <Accordion
                key={assignment._id}
                sx={{
                  width: '90%',
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
                <AssignmentDocsDisplay assignmentDocs={docData} />
              </Accordion>
              {getGradeDisplay(assignment, isCompleted, assignmentGrade)}
            </div>
          );
        })}
      </Box>
    </>
  );
}
