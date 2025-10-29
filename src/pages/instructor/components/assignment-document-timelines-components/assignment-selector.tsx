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
} from '@mui/material';
import { Assignment } from '../../../../store/slices/education-management/types';
import { useWithEducationalManagement } from '../../../../store/slices/education-management/use-with-educational-management';
import { isStudentData } from '../../../../store/slices/education-management/types';

interface AssignmentSelectorProps {
  assignments: Assignment[];
  currentAssignmentId: string;
  studentId: string;
  onAssignmentChange: (studentId: string, assignmentId: string) => void;
}

export const AssignmentSelector: React.FC<AssignmentSelectorProps> = ({
  assignments,
  currentAssignmentId,
  studentId,
  onAssignmentChange,
}) => {
  const { myData } = useWithEducationalManagement();
  const isStudentViewer = myData && isStudentData(myData);

  const currentAssignment = assignments.find(
    (a) => a._id === currentAssignmentId
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
          {currentAssignment?.title || ''}
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
          {assignments.map((assignment) => (
            <MenuItem
              key={assignment._id}
              value={assignment._id}
              sx={{
                fontWeight: assignment._id === currentAssignmentId ? 600 : 400,
                backgroundColor:
                  assignment._id === currentAssignmentId
                    ? 'rgba(25, 118, 210, 0.08)'
                    : 'transparent',
                '&:hover': {
                  backgroundColor:
                    assignment._id === currentAssignmentId
                      ? 'rgba(25, 118, 210, 0.12)'
                      : undefined,
                },
              }}
            >
              <ListItemText
                primary={assignment.title}
                primaryTypographyProps={{
                  fontWeight:
                    assignment._id === currentAssignmentId ? 600 : 400,
                }}
              />
            </MenuItem>
          ))}
        </Select>
      )}
    </FormControl>
  );
};
