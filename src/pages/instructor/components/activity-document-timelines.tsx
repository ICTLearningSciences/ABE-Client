/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
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
  onDocumentChange?: (docId: string) => void;
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
  onDocumentChange,
}) => {
  const documentIds = Object.keys(documentStates);
  const currentDocId = selectedDocId || documentIds[0];
  const currentDocState = documentStates[currentDocId];
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

      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
          Document Timeline
        </Typography>

        <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
          Student ID: {studentId}
        </Typography>

        {documentIds.length > 1 && (
          <FormControl sx={{ minWidth: 300, mb: 3 }}>
            <InputLabel id="document-select-label">Select Document</InputLabel>
            <Select
              labelId="document-select-label"
              value={currentDocId || ''}
              label="Select Document"
              onChange={(e) => onDocumentChange?.(e.target.value)}
            >
              {documentIds.map((docId) => (
                <MenuItem key={docId} value={docId}>
                  {docId}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {currentDocId && (
          <Typography
            variant="body1"
            sx={{ mb: 2, color: 'text.primary', fontWeight: 500 }}
          >
            Current Document: {currentDocId}
          </Typography>
        )}
      </Box>

      {currentDocState && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '300px',
          }}
        >
          {loadInProgress && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <CircularProgress size={24} />
              <Typography>Loading document timeline...</Typography>
            </Box>
          )}

          {currentDocState.error && !loadInProgress && (
            <Typography color="error" sx={{ textAlign: 'center', mb: 2 }}>
              Error loading timeline: {JSON.stringify(currentDocState.error)}
            </Typography>
          )}

          {errorMessage && !loadInProgress && (
            <Typography color="error" sx={{ textAlign: 'center', mb: 2 }}>
              Error: {errorMessage}
            </Typography>
          )}

          <Box sx={{ width: '100%', maxWidth: '600px' }}>
            <Box sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Document Status
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Status: {currentDocState.status}
              </Typography>

              {currentDocState.timeline && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  Timeline Points:{' '}
                  {currentDocState.timeline.timelinePoints?.length || 0}
                </Typography>
              )}

              {!loadInProgress &&
                !currentDocState.error &&
                !errorMessage &&
                currentDocState.status === LoadingStatusType.SUCCESS && (
                  <Typography sx={{ color: 'success.main', fontWeight: 500 }}>
                    Timeline loaded successfully
                  </Typography>
                )}
            </Box>
          </Box>
        </Box>
      )}

      {!currentDocState && documentIds.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography color="text.secondary">No documents available</Typography>
        </Box>
      )}
    </Box>
  );
};
