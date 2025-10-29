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
  ListSubheader,
  ListItemText,
  Typography,
  Box,
} from '@mui/material';
import { CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import {
  StudentAssignmentCompletionStatus,
  AssignmentCompletionStatus,
} from '../../../../helpers';
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
  // Group students by completion status
  const completedStudents = studentStatuses.filter(
    (s) => s.status === AssignmentCompletionStatus.ASSIGNMENT_COMPLETE
  );
  const incompleteStudents = studentStatuses.filter(
    (s) => s.status === AssignmentCompletionStatus.IN_PROGRESS
  );
  const notStartedStudents = studentStatuses.filter(
    (s) => s.status === AssignmentCompletionStatus.NOT_STARTED
  );

  return (
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
          {/* Completed Students */}
          {completedStudents.length > 0 && (
            <ListSubheader sx={{ fontWeight: 600, color: '#1976d2' }}>
              Completed
            </ListSubheader>
          )}
          {completedStudents.map((studentStatus) => (
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
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  width: '100%',
                }}
              >
                <ListItemText
                  primary={studentStatus.studentName}
                  primaryTypographyProps={{
                    fontWeight:
                      studentStatus.studentId === currentStudentId ? 600 : 400,
                  }}
                />
                {studentStatus.isGraded && (
                  <CheckCircleIcon
                    sx={{ color: '#4caf50', fontSize: '1.2rem' }}
                  />
                )}
              </Box>
            </MenuItem>
          ))}

          {/* Incomplete Students */}
          {incompleteStudents.length > 0 && (
            <ListSubheader sx={{ fontWeight: 600, color: '#1976d2' }}>
              Incomplete
            </ListSubheader>
          )}
          {incompleteStudents.map((studentStatus) => (
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
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  width: '100%',
                }}
              >
                <ListItemText
                  primary={studentStatus.studentName}
                  primaryTypographyProps={{
                    fontWeight:
                      studentStatus.studentId === currentStudentId ? 600 : 400,
                  }}
                />
                {studentStatus.isGraded && (
                  <CheckCircleIcon
                    sx={{ color: '#4caf50', fontSize: '1.2rem' }}
                  />
                )}
              </Box>
            </MenuItem>
          ))}

          {/* Not Started Students (Disabled) */}
          {notStartedStudents.length > 0 && (
            <ListSubheader sx={{ fontWeight: 600, color: '#1976d2' }}>
              Not Started
            </ListSubheader>
          )}
          {notStartedStudents.map((studentStatus) => (
            <MenuItem
              key={studentStatus.studentId}
              value={studentStatus.studentId}
              // disabled
              sx={{
                opacity: 0.5,
              }}
            >
              <ListItemText primary={studentStatus.studentName} />
            </MenuItem>
          ))}
        </Select>
      )}
    </FormControl>
  );
};
