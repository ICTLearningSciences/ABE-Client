import React from 'react';
import { AccordionDetails, Box, Chip, Typography } from '@mui/material';
import {
  Assignment,
  RelevantGoogleDoc,
} from '../../../../store/slices/education-management/types';
import { ColumnDiv } from '../../../../styled-components';

export function StudentActivityDocumentDisplay(props: {
  assignment: Assignment;
  getStudentDocDataForActivity: (
    assignmentId: string,
    activityId: string
  ) => RelevantGoogleDoc[];
  getActivityTitle: (activityId: string) => string;
  onDocumentClick?: (assignmentId: string, docId: string) => void;
  studentId: string;
}) {
  const {
    assignment,
    getStudentDocDataForActivity,
    getActivityTitle,
    onDocumentClick,
  } = props;

  function getDocLabel(doc: RelevantGoogleDoc): React.ReactNode {
    return (
      <span>
        <span style={{ fontWeight: doc.primaryDocument ? 600 : 400 }}>
          {doc.primaryDocument ? 'Main Document: ' : ''}
        </span>
        <span> </span>
        {doc.docData.title || "Untitled"}
      </span>
    );
  }

  return (
    <AccordionDetails>
      <Box sx={{ pl: 2 }}>
        {assignment.activityIds.map((activityId) => {
          const docData = getStudentDocDataForActivity(
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
              {docData.length > 0 ? (
                <Box sx={{ pl: 1 }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: 'block', mb: 0.5 }}
                  >
                    Documents
                  </Typography>
                  <ColumnDiv>
                    {docData.map((doc) => (
                      <Chip
                        key={doc.docId}
                        data-cy={`${doc.docId}-doc-select`}
                        label={getDocLabel(doc)}
                        size="small"
                        variant="outlined"
                        sx={{ mr: 0.5, mb: 0.5 }}
                        onClick={() =>
                          onDocumentClick?.(assignment._id, doc.docId)
                        }
                      />
                    ))}
                  </ColumnDiv>
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
