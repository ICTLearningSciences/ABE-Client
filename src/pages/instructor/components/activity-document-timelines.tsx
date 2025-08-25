/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, Grid, Typography } from '@mui/material';
import {
  LoadingError,
  LoadingStatusType,
} from '../../../hooks/generic-loading-reducer';
import { DehydratedGQLDocumentTimeline } from '../../../types';
import { AssignmentHeader } from './activity-document-timelines-components/assignment-header';
import { DocumentSelector } from './activity-document-timelines-components/document-selector';
import { TimelineView } from './activity-document-timelines-components/timeline-view';
import { DocumentTextView } from './activity-document-timelines-components/document-text-view';
import { TabbedInfoPanel } from './activity-document-timelines-components/tabbed-info-panel';

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
  selectedDocId: string;
  onBackToStudentInfo: () => void;
  onDocumentChange: (docId: string) => void;
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
  const currentDocId = selectedDocId;
  const currentDocState = documentStates[currentDocId];
  const [selectedTimelineIndex, setSelectedTimelineIndex] = useState(0);

  const currentTimeline = currentDocState?.timeline;
  const timelinePoints = currentTimeline?.timelinePoints || [];
  const currentTimelinePoint = timelinePoints[selectedTimelineIndex] || null;

  useEffect(() => {
    setSelectedTimelineIndex(0);
  }, [currentDocId]);

  if (loadInProgress && !currentTimeline) {
    return (
      <Box
        sx={{
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '400px',
        }}
      >
        <CircularProgress size={32} sx={{ mb: 2 }} />
        <Typography>Loading document timeline...</Typography>
      </Box>
    );
  }

  if (currentDocState?.error || errorMessage) {
    return (
      <Box sx={{ p: 3 }}>
        <AssignmentHeader
          documentId={currentDocId}
          studentId={studentId}
          onBackToStudentInfo={onBackToStudentInfo}
        />
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography color="error">
            Error loading timeline:{' '}
            {currentDocState?.error
              ? JSON.stringify(currentDocState.error)
              : errorMessage}
          </Typography>
        </Box>
      </Box>
    );
  }

  if (!currentTimeline || !timelinePoints.length) {
    return (
      <Box sx={{ p: 3 }}>
        <AssignmentHeader
          documentId={currentDocId}
          studentId={studentId}
          onBackToStudentInfo={onBackToStudentInfo}
        />
        <DocumentSelector
          documentIds={documentIds}
          selectedDocId={currentDocId}
          onDocumentChange={onDocumentChange}
        />
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography color="text.secondary">
            {documentIds.length === 0
              ? 'No documents available'
              : 'No timeline data available for this document'}
          </Typography>
        </Box>
      </Box>
    );
  }
  console.log(currentDocId);

  return (
    <Box sx={{ p: 3 }} key={currentDocId}>
      <AssignmentHeader
        documentId={currentDocId}
        studentId={studentId}
        onBackToStudentInfo={onBackToStudentInfo}
      />

      <DocumentSelector
        documentIds={documentIds}
        selectedDocId={currentDocId}
        onDocumentChange={onDocumentChange}
      />

      <TimelineView
        timelinePoints={timelinePoints}
        selectedTimelineIndex={selectedTimelineIndex}
        onTimelinePointSelect={setSelectedTimelineIndex}
      />

      <Grid container spacing={3} sx={{ height: '600px' }}>
        <Grid item xs={6}>
          <DocumentTextView timelinePoint={currentTimelinePoint} />
        </Grid>
        <Grid item xs={6}>
          <TabbedInfoPanel timelinePoint={currentTimelinePoint} />
        </Grid>
      </Grid>
    </Box>
  );
};
