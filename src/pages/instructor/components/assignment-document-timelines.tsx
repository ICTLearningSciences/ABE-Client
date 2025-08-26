/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React, { useState, useEffect, useMemo } from 'react';
import { Box, CircularProgress, Grid, Typography } from '@mui/material';
import {
  LoadingError,
  LoadingStatusType,
} from '../../../hooks/generic-loading-reducer';
import {
  DehydratedGQLDocumentTimeline,
  GQLDocumentTimeline,
} from '../../../types';
import { AssignmentHeader } from './assignment-document-timelines-components/assignment-header';
import { DocumentSelector } from './assignment-document-timelines-components/document-selector';
import { TimelineView } from './assignment-document-timelines-components/timeline-view';
import { DocumentTextView } from './assignment-document-timelines-components/document-text-view';
import { TabbedInfoPanel } from './assignment-document-timelines-components/tabbed-info-panel';
import createPatch from 'textdiff-create';
import {
  Assignment,
  StudentData,
} from '../../../store/slices/education-management/types';

export interface TextDiffResult {
  diffContent: React.ReactNode[];
  charactersRemoved: number;
  charactersAdded: number;
}

export const applyTextDiff = (
  prevText: string,
  currentText: string
): TextDiffResult => {
  const delta = createPatch(prevText, currentText);
  const result: React.ReactNode[] = [];
  let prevIndex = 0;
  let key = 0;

  for (const operation of delta) {
    const [type, value] = operation;

    if (type === 0) {
      const unchangedText = prevText.slice(prevIndex, prevIndex + value);
      result.push(unchangedText);
      prevIndex += value;
    } else if (type === -1) {
      const deletedText = prevText.slice(prevIndex, prevIndex + value);
      result.push(
        <span
          key={`deleted-${key++}`}
          style={{
            backgroundColor: '#ffebee',
            color: '#c62828',
            textDecoration: 'line-through',
          }}
        >
          {deletedText}
        </span>
      );
      prevIndex += value;
    } else if (type === 1) {
      const insertedText = value as string;
      result.push(
        <span
          key={`inserted-${key++}`}
          style={{ backgroundColor: '#e8f5e8', color: '#2e7d32' }}
        >
          {insertedText}
        </span>
      );
    }
  }

  return {
    diffContent: result,
    charactersRemoved: delta
      .filter((operation) => operation[0] === -1)
      .reduce((acc, operation) => acc + (operation[1] as number), 0),
    charactersAdded: delta
      .filter((operation) => operation[0] === 1)
      .reduce((acc, operation) => acc + (operation[1] as string).length, 0),
  };
};

interface AssignmentDocumentTimelinesProps {
  student: StudentData;
  assignment: Assignment;
  studentDocIds: string[];
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
  getHydratedTimeline: (docId: string) => GQLDocumentTimeline | undefined;
  onBackToStudentInfo: () => void;
  onDocumentChange: (docId: string) => void;
}

export const AssignmentDocumentTimelines: React.FC<
  AssignmentDocumentTimelinesProps
> = ({
  student,
  assignment,
  documentStates,
  studentDocIds,
  loadInProgress,
  errorMessage,
  selectedDocId,
  getHydratedTimeline,
  onBackToStudentInfo,
  onDocumentChange,
}) => {
  const documentIds = studentDocIds;
  const currentDocState = documentStates[selectedDocId];
  const [selectedTimelineIndex, setSelectedTimelineIndex] = useState(0);

  const currentTimeline = useMemo(() => {
    if (currentDocState?.status === LoadingStatusType.SUCCESS) {
      return getHydratedTimeline(selectedDocId);
    }
    return undefined;
  }, [currentDocState?.status, getHydratedTimeline, selectedDocId]);

  const timelinePoints = currentTimeline?.timelinePoints || [];
  const currentTimelinePoint =
    timelinePoints[selectedTimelineIndex] || undefined;
  const previousTimelinePoint =
    timelinePoints[selectedTimelineIndex - 1] || undefined;

  const currentText =
    currentTimelinePoint?.version?.markdownText ||
    currentTimelinePoint?.version?.plainText ||
    '';
  const previousText =
    previousTimelinePoint?.version?.markdownText ||
    previousTimelinePoint?.version?.plainText ||
    '';
  const diffContent = applyTextDiff(previousText, currentText);

  useEffect(() => {
    setSelectedTimelineIndex(0);
  }, [selectedDocId]);

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
          assignmentTitle={currentTimelinePoint?.version?.title}
          studentName={student.name}
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
          assignmentTitle={assignment.title}
          studentName={student.name}
          onBackToStudentInfo={onBackToStudentInfo}
        />
        <DocumentSelector
          documentIds={documentIds}
          selectedDocId={selectedDocId}
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

  return (
    <Box
      sx={{ width: '100%', display: 'flex', flexDirection: 'column', flex: 1 }}
      height="100%"
      key={selectedDocId}
      data-cy="activity-document-timelines"
    >
      <AssignmentHeader
        assignmentTitle={assignment.title}
        studentName={student.name}
        onBackToStudentInfo={onBackToStudentInfo}
      />

      <DocumentSelector
        documentIds={documentIds}
        selectedDocId={selectedDocId}
        onDocumentChange={onDocumentChange}
      />

      <TimelineView
        timelinePoints={timelinePoints}
        selectedTimelineIndex={selectedTimelineIndex}
        onTimelinePointSelect={setSelectedTimelineIndex}
      />

      <Grid container spacing={3} sx={{ flex: 1, mb: 1 }} height="60%">
        <Grid item xs={6} style={{ height: '100%' }}>
          <DocumentTextView
            timelinePoint={currentTimelinePoint}
            diffContent={diffContent}
          />
        </Grid>
        <Grid item xs={6} style={{ height: '100%' }}>
          <TabbedInfoPanel timelinePoint={currentTimelinePoint} />
        </Grid>
      </Grid>
    </Box>
  );
};
