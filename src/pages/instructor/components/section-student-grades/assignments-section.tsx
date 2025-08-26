import React from 'react';
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
import { Assignment } from '../../../../store/slices/education-management/types';

interface AssignmentsSectionProps {
  title: string;
  assignments: Assignment[];
  completedCount: number;
  totalCount: number;
  getIsCompleted: (assignment: Assignment) => boolean;
  getStudentDocIdsForActivity: (
    assignmentId: string,
    activityId: string
  ) => string[];
  getActivityTitle: (activityId: string) => string;
  onDocumentClick?: (docId: string) => void;
  studentId: string;
}

export function AssignmentsSection({
  title,
  assignments,
  completedCount,
  totalCount,
  getIsCompleted,
  getStudentDocIdsForActivity,
  getActivityTitle,
  onDocumentClick,
  studentId,
}: AssignmentsSectionProps) {
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

          return (
            <Accordion
              key={assignment._id}
              sx={{
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
                getStudentDocIdsForActivity={getStudentDocIdsForActivity}
                getActivityTitle={getActivityTitle}
                onDocumentClick={onDocumentClick}
                studentId={studentId}
              />
            </Accordion>
          );
        })}
      </Box>
    </>
  );
}
