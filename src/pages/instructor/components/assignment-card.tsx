/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Stack,
  IconButton,
} from '@mui/material';
import { KeyboardArrowUp, KeyboardArrowDown } from '@mui/icons-material';
import {
  Assignment,
  Section,
} from '../../../store/slices/education-management/types';
import { ColumnDiv, RowDiv } from '../../../styled-components';
import { useAppSelector } from '../../../store/hooks';
import { EducationalRole } from '../../../types';
import { CheckBoxInput } from '../../../components/activity-builder/shared/input-components';

interface AssignmentCardProps {
  assignment: Assignment;
  onClick: (assignmentId: string) => void;
  assignmentGrade:
    | {
        grade: number;
        comment: string;
      }
    | undefined;
  isCompleted: boolean;
  onAssignmentOrderChange?: (
    assignmentId: string,
    direction: 'up' | 'down'
  ) => Promise<void>;
  isFirst?: boolean;
  isLast?: boolean;
  isAssignmentMandatory: boolean;
  onMandatoryChange: (
    assignmentId: string,
    mandatory: boolean
  ) => Promise<Section>;
  updateInProgress: boolean;
}

const AssignmentCard: React.FC<AssignmentCardProps> = ({
  assignment,
  onClick,
  assignmentGrade,
  isCompleted,
  onAssignmentOrderChange,
  isAssignmentMandatory,
  onMandatoryChange,
  isFirst,
  isLast,
  updateInProgress,
}) => {
  const myRole = useAppSelector((state) => state.login.user?.educationalRole);
  const isStudent = myRole === EducationalRole.STUDENT;
  return (
    <RowDiv style={{ width: '100%' }}>
      <Card
        variant="outlined"
        data-cy={`assignment-card-${assignment._id}`}
        sx={{
          width: '100%',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          '&:hover': {
            borderColor: '#1B6A9C',
            boxShadow: 2,
          },
        }}
        onClick={() => onClick(assignment._id)}
      >
        <CardContent
          style={{
            position: 'relative',
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ mb: 1.5 }}
          >
            <Stack direction="row" alignItems="center">
              <Typography sx={{ fontSize: '20px', mr: 1.5 }}>📝</Typography>
              <Typography
                variant="h6"
                sx={{
                  color: '#1B6A9C',
                  fontWeight: 600,
                  fontSize: '1rem',
                }}
              >
                {assignment.title}
              </Typography>
            </Stack>
          </Stack>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 1.5, lineHeight: 1.4 }}
          >
            {assignment.description}
          </Typography>
          <ColumnDiv
            style={{
              position: 'absolute',
              right: 20,
              top: 20,
            }}
          >
            {isStudent ? (
              isCompleted && assignmentGrade ? (
                <Typography variant="body2">
                  <span style={{ fontWeight: 600, color: 'darkgreen' }}>
                    Grade:
                  </span>{' '}
                  {assignmentGrade.grade}/5
                </Typography>
              ) : isCompleted ? (
                <Typography variant="body2" color="text.secondary">
                  Waiting for grade
                </Typography>
              ) : (
                <Typography variant="body2" color="darkred" fontWeight={600}>
                  Incomplete
                </Typography>
              )
            ) : null}
          </ColumnDiv>
        </CardContent>
      </Card>
      {!isStudent && onAssignmentOrderChange && (
        <RowDiv>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              onAssignmentOrderChange(assignment._id, 'up');
            }}
            disabled={isFirst || updateInProgress}
            size="small"
            data-cy={`move-assignment-up-${assignment._id}`}
          >
            <KeyboardArrowUp />
          </IconButton>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              onAssignmentOrderChange(assignment._id, 'down');
            }}
            disabled={isLast || updateInProgress}
            size="small"
            data-cy={`move-assignment-down-${assignment._id}`}
          >
            <KeyboardArrowDown />
          </IconButton>
        </RowDiv>
      )}

      <CheckBoxInput
        label="Required?"
        labelPlacement="top"
        value={isAssignmentMandatory}
        disabled={updateInProgress}
        onChange={(e) => {
          onMandatoryChange(assignment._id, e);
        }}
      />
    </RowDiv>
  );
};

export default AssignmentCard;
