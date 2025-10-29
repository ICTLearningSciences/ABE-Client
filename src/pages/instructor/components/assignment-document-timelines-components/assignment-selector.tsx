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
  ListSubheader,
  Box,
} from '@mui/material';
import { CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import { useWithEducationalManagement } from '../../../../store/slices/education-management/use-with-educational-management';
import { isStudentData } from '../../../../store/slices/education-management/types';
import {
  AssignmentCompletionStatusForStudent,
  AssignmentCompletionStatus,
} from '../../../../helpers';

interface AssignmentSelectorProps {
  assignmentStatuses: AssignmentCompletionStatusForStudent[];
  currentAssignmentId: string;
  studentId: string;
  onAssignmentChange: (studentId: string, assignmentId: string) => void;
}

export const AssignmentSelector: React.FC<AssignmentSelectorProps> = ({
  assignmentStatuses,
  currentAssignmentId,
  studentId,
  onAssignmentChange,
}) => {
  const { myData } = useWithEducationalManagement();
  const isStudentViewer = myData && isStudentData(myData);

  // Group assignments by completion status
  const completedAssignments = assignmentStatuses.filter(
    (a) => a.status === AssignmentCompletionStatus.ASSIGNMENT_COMPLETE
  );
  const incompleteAssignments = assignmentStatuses.filter(
    (a) => a.status === AssignmentCompletionStatus.IN_PROGRESS
  );
  const notStartedAssignments = assignmentStatuses.filter(
    (a) => a.status === AssignmentCompletionStatus.NOT_STARTED
  );

  const currentAssignment = assignmentStatuses.find(
    (a) => a.assignmentId === currentAssignmentId
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
        <Typography data-cy="assignment-header-assignment-title">
          {currentAssignment?.assignmentTitle || ''}
        </Typography>
      ) : (
        <Select
          data-cy="assignment-select"
          labelId="assignment-select-label"
          value={currentAssignmentId}
          onChange={(e) => onAssignmentChange(studentId, e.target.value)}
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
          {/* Completed Assignments */}
          {completedAssignments.length > 0 && (
            <ListSubheader sx={{ fontWeight: 600, color: '#1976d2' }}>
              Completed
            </ListSubheader>
          )}
          {completedAssignments.map((assignmentStatus) => (
            <MenuItem
              key={assignmentStatus.assignmentId}
              value={assignmentStatus.assignmentId}
              sx={{
                fontWeight:
                  assignmentStatus.assignmentId === currentAssignmentId
                    ? 600
                    : 400,
                backgroundColor:
                  assignmentStatus.assignmentId === currentAssignmentId
                    ? 'rgba(25, 118, 210, 0.08)'
                    : 'transparent',
                '&:hover': {
                  backgroundColor:
                    assignmentStatus.assignmentId === currentAssignmentId
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
                  primary={assignmentStatus.assignmentTitle}
                  primaryTypographyProps={{
                    fontWeight:
                      assignmentStatus.assignmentId === currentAssignmentId
                        ? 600
                        : 400,
                  }}
                />
                {assignmentStatus.isGraded && (
                  <CheckCircleIcon
                    sx={{ color: '#4caf50', fontSize: '1.2rem' }}
                  />
                )}
              </Box>
            </MenuItem>
          ))}

          {/* Incomplete Assignments */}
          {incompleteAssignments.length > 0 && (
            <ListSubheader sx={{ fontWeight: 600, color: '#1976d2' }}>
              Incomplete
            </ListSubheader>
          )}
          {incompleteAssignments.map((assignmentStatus) => (
            <MenuItem
              key={assignmentStatus.assignmentId}
              value={assignmentStatus.assignmentId}
              sx={{
                fontWeight:
                  assignmentStatus.assignmentId === currentAssignmentId
                    ? 600
                    : 400,
                backgroundColor:
                  assignmentStatus.assignmentId === currentAssignmentId
                    ? 'rgba(25, 118, 210, 0.08)'
                    : 'transparent',
                '&:hover': {
                  backgroundColor:
                    assignmentStatus.assignmentId === currentAssignmentId
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
                  primary={assignmentStatus.assignmentTitle}
                  primaryTypographyProps={{
                    fontWeight:
                      assignmentStatus.assignmentId === currentAssignmentId
                        ? 600
                        : 400,
                  }}
                />
                {assignmentStatus.isGraded && (
                  <CheckCircleIcon
                    sx={{ color: '#4caf50', fontSize: '1.2rem' }}
                  />
                )}
              </Box>
            </MenuItem>
          ))}

          {/* Not Started Assignments */}
          {notStartedAssignments.length > 0 && (
            <ListSubheader sx={{ fontWeight: 600, color: '#1976d2' }}>
              Not Started
            </ListSubheader>
          )}
          {notStartedAssignments.map((assignmentStatus) => (
            <MenuItem
              key={assignmentStatus.assignmentId}
              value={assignmentStatus.assignmentId}
              sx={{
                opacity: 0.5,
              }}
            >
              <ListItemText primary={assignmentStatus.assignmentTitle} />
            </MenuItem>
          ))}
        </Select>
      )}
    </FormControl>
  );
};
