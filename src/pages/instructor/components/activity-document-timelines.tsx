/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from 'react';
import { Box, Typography, CircularProgress, Button } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import {
  LoadingError,
  LoadingStatusType,
} from '../../../hooks/generic-loading-reducer';
import { DehydratedGQLDocumentTimeline } from '../../../types';

interface ActivityDocumentTimelinesProps {
  studentId: string;
  documentStates: Record<
    string,
    {
      timeline?: DehydratedGQLDocumentTimeline;
      status: LoadingStatusType;
      error?: LoadingError;
    }
  >;
  loadInProgress: boolean;
  errorMessage?: string;
  selectedDocId?: string;
  onBackToStudentInfo?: () => void;
}

export const ActivityDocumentTimelines: React.FC<
  ActivityDocumentTimelinesProps
> = ({
  studentId,
  documentStates,
  loadInProgress,
  errorMessage,
  selectedDocId,
  onBackToStudentInfo,
}) => {
  return (
    <Box sx={{ p: 3 }}>
      {onBackToStudentInfo && (
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={onBackToStudentInfo}
          sx={{ mb: 2, color: 'text.secondary' }}
        >
          Back to Student Grades
        </Button>
      )}

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '400px',
        }}
      >
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
          Document Timelines
        </Typography>

        <Typography variant="body1" sx={{ mb: 2, color: 'text.secondary' }}>
          Student ID: {studentId}
        </Typography>

        {selectedDocId && (
          <Typography
            variant="body1"
            sx={{ mb: 2, color: 'text.primary', fontWeight: 500 }}
          >
            Selected Document: {selectedDocId}
          </Typography>
        )}

        {loadInProgress && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <CircularProgress size={24} />
            <Typography>Loading document timeline...</Typography>
          </Box>
        )}

        {errorMessage && !loadInProgress && (
          <Typography color="error" sx={{ textAlign: 'center' }}>
            Error loading timeline: {JSON.stringify(errorMessage)}
          </Typography>
        )}

        {!loadInProgress && !errorMessage && (
          <Typography sx={{ textAlign: 'center', color: 'text.secondary' }}>
            Timeline loaded successfully
          </Typography>
        )}

        <Box sx={{ mt: 4, width: '100%', maxWidth: '600px' }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Document States:
          </Typography>
          {Object.entries(documentStates).map(([docId, state]) => (
            <Box
              key={docId}
              sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Document: {docId}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Status: {state.status}
              </Typography>
              {state.timeline && (
                <Typography variant="body2" color="text.secondary">
                  Timeline Points: {state.timeline.timelinePoints?.length || 0}
                </Typography>
              )}
              {state.error && (
                <Typography variant="body2" color="error">
                  Error: {JSON.stringify(state.error)}
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};
