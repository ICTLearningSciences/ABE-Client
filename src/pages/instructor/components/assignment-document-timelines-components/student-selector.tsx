/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved.
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from 'react';
import {
  FormControl,
  Select,
  MenuItem,
  ListItemText,
  Typography,
  IconButton,
  Box,
} from '@mui/material';
import {
  NavigateBefore as ArrowBackIcon,
  NavigateNext as ArrowForwardIcon,
} from '@mui/icons-material';
import { StudentAssignmentCompletionStatus } from '../../../../helpers';
import { useWithEducationalManagement } from '../../../../store/slices/education-management/use-with-educational-management';
import { isStudentData } from '../../../../store/slices/education-management/types';

interface StudentSelectorProps {
  studentStatuses: StudentAssignmentCompletionStatus[];
  currentStudentId: string;
  assignmentId: string;
  onStudentChange: (studentId: string, assignmentId: string) => void;
}

export const StudentSelector: React.FC<StudentSelectorProps> = ({
  studentStatuses,
  currentStudentId,
  assignmentId,
  onStudentChange,
}) => {
  const { myData } = useWithEducationalManagement();
  const isStudentViewer = myData && isStudentData(myData);

  const currentStudentIndex = studentStatuses.findIndex(
    (status) => status.studentId === currentStudentId
  );
  const canGoPrevious = currentStudentIndex > 0;
  const canGoNext = currentStudentIndex < studentStatuses.length - 1;

  const handlePrevious = () => {
    if (canGoPrevious) {
      const previousStudent = studentStatuses[currentStudentIndex - 1];
      onStudentChange(previousStudent.studentId, assignmentId);
    }
  };

  const handleNext = () => {
    if (canGoNext) {
      const nextStudent = studentStatuses[currentStudentIndex + 1];
      onStudentChange(nextStudent.studentId, assignmentId);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        gap: 0.5,
      }}
    >
      {!isStudentViewer && (
        <Box
          sx={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: -30,
          }}
        >
          <IconButton
            data-cy="student-selector-previous"
            onClick={handlePrevious}
            disabled={!canGoPrevious}
            size="small"
            sx={{
              padding: 0.5,
              '&:disabled': {
                opacity: 0.3,
              },
            }}
          >
            <ArrowBackIcon fontSize="small" />
          </IconButton>
          <IconButton
            data-cy="student-selector-next"
            onClick={handleNext}
            disabled={!canGoNext}
            size="small"
            sx={{
              padding: 0.5,
              '&:disabled': {
                opacity: 0.3,
              },
            }}
          >
            <ArrowForwardIcon fontSize="small" />
          </IconButton>
        </Box>
      )}
      <FormControl
        sx={{
          minWidth: 300,
          padding: 0,
          height: 'fit-content',
          width: 'fit-content',
        }}
        style={{
          padding: 0,
        }}
      >
        {isStudentViewer ? (
          <Typography data-cy="assignment-header-student-name">
            {myData?.name}
          </Typography>
        ) : (
          <Select
            data-cy="student-select"
            labelId="student-select-label"
            value={currentStudentId}
            onChange={(e) => onStudentChange(e.target.value, assignmentId)}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': {
                  borderColor: '#1976d2',
                },
              },
              '& .MuiSelect-select': {
                padding: 0,
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#1976d2',
              },
              padding: 0,
            }}
          >
            {studentStatuses.map((studentStatus) => (
              <MenuItem
                key={studentStatus.studentId}
                value={studentStatus.studentId}
                sx={{
                  fontWeight:
                    studentStatus.studentId === currentStudentId ? 600 : 400,
                  backgroundColor:
                    studentStatus.studentId === currentStudentId
                      ? 'rgba(25, 118, 210, 0.08)'
                      : 'transparent',
                  '&:hover': {
                    backgroundColor:
                      studentStatus.studentId === currentStudentId
                        ? 'rgba(25, 118, 210, 0.12)'
                        : undefined,
                  },
                }}
              >
                <ListItemText
                  primary={studentStatus.studentName}
                  primaryTypographyProps={{
                    fontWeight:
                      studentStatus.studentId === currentStudentId ? 600 : 400,
                  }}
                />
              </MenuItem>
            ))}
          </Select>
        )}
      </FormControl>
    </Box>
  );
};
