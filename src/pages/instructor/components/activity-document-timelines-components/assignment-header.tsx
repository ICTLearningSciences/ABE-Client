/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';

interface AssignmentHeaderProps {
  documentId: string;
  studentId: string;
  onBackToStudentInfo?: () => void;
}

export const AssignmentHeader: React.FC<AssignmentHeaderProps> = ({
  documentId,
  studentId,
  onBackToStudentInfo,
}) => {
  return (
    <Box sx={{ mb: 3 }}>
      {onBackToStudentInfo && (
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={onBackToStudentInfo}
          sx={{ mb: 2, color: 'text.secondary' }}
        >
          Back to Student Grades
        </Button>
      )}

      <Typography
        variant="h6"
        sx={{ mb: 2, fontWeight: 600, color: '#1976d2' }}
      >
        Assignment: {documentId}
      </Typography>

      <Typography variant="body1" sx={{ color: 'text.secondary' }}>
        Review {studentId}&apos;s progress across multiple activities

      </Typography>
    </Box>
  );
};
