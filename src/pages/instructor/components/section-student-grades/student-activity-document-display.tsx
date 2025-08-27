import React from 'react';
import { AccordionDetails, Box, Chip, Typography } from '@mui/material';
import { Assignment } from '../../../../store/slices/education-management/types';

export function StudentActivityDocumentDisplay(props: {
  assignment: Assignment;
  getStudentDocIdsForActivity: (
    assignmentId: string,
    activityId: string
  ) => string[];
  getActivityTitle: (activityId: string) => string;
  onDocumentClick?: (assignmentId: string, docId: string) => void;
  studentId: string;
}) {
  const {
    assignment,
    getStudentDocIdsForActivity,
    getActivityTitle,
    onDocumentClick,
  } = props;

  return (
    <AccordionDetails>
      <Box sx={{ pl: 2 }}>
        {assignment.activityIds.map((activityId) => {
          const docIds = getStudentDocIdsForActivity(
            assignment._id,
            activityId
          );
          return (
            <Box key={activityId} sx={{ mb: 2 }}>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 600, color: '#1B6A9C', mb: 1 }}
              >
                {getActivityTitle(activityId)}
              </Typography>
              {docIds.length > 0 ? (
                <Box sx={{ pl: 1 }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: 'block', mb: 0.5 }}
                  >
                    Document IDs:
                  </Typography>
                  {docIds.map((docId) => (
                    <Chip
                      key={docId}
                      data-cy={`${docId}-doc-select`}
                      label={docId}
                      size="small"
                      variant="outlined"
                      sx={{ mr: 0.5, mb: 0.5 }}
                      onClick={() => onDocumentClick?.(assignment._id, docId)}
                    />
                  ))}
                </Box>
              ) : (
                <Typography
                  variant="body2"
                  color="text.disabled"
                  sx={{ pl: 1, fontStyle: 'italic' }}
                >
                  No documents for this activity
                </Typography>
              )}
            </Box>
          );
        })}
      </Box>
    </AccordionDetails>
  );
}
