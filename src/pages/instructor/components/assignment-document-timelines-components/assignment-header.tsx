/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { DocumentSelector } from './document-selector';
import { StudentSelector } from './student-selector';
import {
  Assignment,
  RelevantGoogleDoc,
  StudentData,
} from '../../../../store/slices/education-management/types';
import { RowDiv } from '../../../../styled-components';
import { AssignmentGrader } from './assignment-grader';
import { StudentAssignmentCompletionStatus } from '../../../../helpers';

interface AssignmentHeaderProps {
  studentAssignmentCompletionStatuses: StudentAssignmentCompletionStatus[];
  handleViewStudentTimelines: (studentId: string, assignmentId: string) => void;
  student: StudentData;
  assignment: Assignment;
  onBackToStudentInfo?: () => void;
  docData?: RelevantGoogleDoc[];
  selectedDocId?: string;
  onDocumentChange?: (docId: string) => void;
}

export const AssignmentHeader: React.FC<AssignmentHeaderProps> = ({
  studentAssignmentCompletionStatuses,
  handleViewStudentTimelines,
  student,
  assignment,
  onBackToStudentInfo,
  docData,
  selectedDocId,
  onDocumentChange,
}) => {
  const { title: assignmentTitle } = assignment;
  return (
    <Box
      data-cy="assignment-header"
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
      }}
    >
      {onBackToStudentInfo && (
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={onBackToStudentInfo}
          sx={{ color: 'text.secondary', alignSelf: 'flex-start' }}
        >
          Back
        </Button>
      )}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          columnGap: 1,
          alignItems: 'center',
        }}
      >
        <RowDiv
          style={{
            flex: 1,
            gap: 5,
            textAlign: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography
            sx={{ fontWeight: 600, color: '#1976d2', textAlign: 'right' }}
          >
            Student:
          </Typography>
          <StudentSelector
            studentStatuses={studentAssignmentCompletionStatuses}
            currentStudentId={student.userId}
            assignmentId={assignment._id}
            onStudentChange={handleViewStudentTimelines}
          />
        </RowDiv>

        <RowDiv
          style={{
            flex: 1,
            gap: 5,
            textAlign: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography
            sx={{ fontWeight: 600, color: '#1976d2', textAlign: 'right' }}
          >
            Assignment:
          </Typography>
          <Typography
            data-cy="assignment-header-assignment-title"
            sx={{ fontWeight: 400, color: 'black' }}
          >
            {assignmentTitle}
          </Typography>
        </RowDiv>

        <RowDiv
          style={{
            flex: 1,
            gap: 5,
            textAlign: 'center',
            justifyContent: 'center',
          }}
        >
          {docData && docData.length > 0 && onDocumentChange && (
            <>
              <Typography
                sx={{ fontWeight: 600, color: '#1976d2', textAlign: 'right' }}
              >
                Document:
              </Typography>
              <DocumentSelector
                docData={docData}
                selectedDocId={selectedDocId || ''}
                onDocumentChange={onDocumentChange}
              />
            </>
          )}
        </RowDiv>

        <Box sx={{ flex: 0.3 }}>
          <AssignmentGrader student={student} assignment={assignment} />
        </Box>
      </Box>
    </Box>
  );
};
