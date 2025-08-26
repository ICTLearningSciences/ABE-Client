import React from 'react';
import { StudentData } from '../../../../store/slices/education-management/types';
import { AssignmentsInSection } from '../../helpers';
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
} from '@mui/material';
import { Person as PersonIcon } from '@mui/icons-material';

export function StudentListItem(
  student: StudentData,
  requiredCompleted: number,
  optionalCompleted: number,
  assignmentsInSection: AssignmentsInSection,
  handleStudentClick: (student: StudentData) => void,
  numOptionalAssignmentsRequired: number
) {
  return (
    <ListItem
      key={student._id}
      onClick={() => handleStudentClick(student)}
      data-cy={`student-${student.userId}`}
      sx={{
        cursor: 'pointer',
        borderRadius: 2,
        mb: 1,
        border: '1px solid',
        borderColor: 'grey.200',
        transition: 'all 0.2s ease',
        '&:hover': {
          borderColor: '#1B6A9C',
          backgroundColor: 'rgba(27, 106, 156, 0.04)',
        },
      }}
    >
      <ListItemIcon>
        <PersonIcon sx={{ color: '#1B6A9C' }} />
      </ListItemIcon>
      <ListItemText
        primary={
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: 'text.primary' }}
          >
            {student.name}
          </Typography>
        }
        secondary={
          <Typography variant="body2" color="text.secondary">
            {student.userId}
          </Typography>
        }
      />
      <Box sx={{ textAlign: 'right' }}>
        <Typography variant="body1" sx={{ fontWeight: 600, color: '#1B6A9C' }}>
          Required: {requiredCompleted}/
          {assignmentsInSection.requiredAssignments.length}
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 600, color: '#1B6A9C' }}>
          Optional: {optionalCompleted}/{numOptionalAssignmentsRequired || 0}
        </Typography>
      </Box>
    </ListItem>
  );
}
