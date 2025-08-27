/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Card,
  Button,
  Stack,
} from '@mui/material';
import {
  PersonOff as PersonOffIcon,
  LockOpen as UnbanIcon,
} from '@mui/icons-material';
import {
  Section,
  StudentData,
} from '../../../store/slices/education-management/types';
import { useWithEducationalManagement } from '../../../store/slices/education-management/use-with-educational-management';

interface BannedStudentsProps {
  section: Section;
  students: StudentData[];
}

const BannedStudents: React.FC<BannedStudentsProps> = ({
  section,
  students,
}) => {
  const educationManagement = useWithEducationalManagement();

  const bannedStudents = students.filter(
    (student) => section.bannedStudentUserIds?.includes(student.userId)
  );

  const handleUnbanStudent = async (studentUserId: string) => {
    try {
      await educationManagement.unbanStudentFromSection(
        section._id,
        studentUserId
      );
    } catch (error) {
      console.error('Failed to unban student:', error);
    }
  };

  if (bannedStudents.length === 0) {
    return (
      <Box>
        <Typography
          variant="h5"
          sx={{ fontWeight: 600, color: 'text.primary', mb: 3 }}
        >
          Blocked Students
        </Typography>
        <Card
          variant="outlined"
          sx={{
            border: '2px dashed',
            borderColor: 'grey.300',
            textAlign: 'center',
            py: 5,
            px: 2.5,
          }}
        >
          <Typography sx={{ fontSize: '48px', color: 'grey.300', mb: 2 }}>
            🚫
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            No blocked students
          </Typography>
          <Typography variant="body2" color="text.disabled">
            Students who are blocked from this section will appear here
          </Typography>
        </Card>
      </Box>
    );
  }

  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: 600, color: 'text.primary' }}
        >
          Blocked Students
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {bannedStudents.length} blocked student
          {bannedStudents.length !== 1 ? 's' : ''}
        </Typography>
      </Stack>

      <List sx={{ width: '100%' }}>
        {bannedStudents.map((student) => (
          <ListItem
            key={student._id}
            sx={{
              borderRadius: 2,
              mb: 1,
              border: '1px solid',
              borderColor: '#d32f2f',
              backgroundColor: 'rgba(211, 47, 47, 0.04)',
            }}
          >
            <ListItemIcon>
              <PersonOffIcon sx={{ color: '#d32f2f' }} />
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
            <Button
              variant="contained"
              size="small"
              startIcon={<UnbanIcon />}
              onClick={() => handleUnbanStudent(student.userId)}
              disabled={educationManagement.isSectionModifying}
              sx={{
                backgroundColor: '#d32f2f',
                '&:hover': {
                  backgroundColor: '#c62828',
                },
                fontWeight: 600,
              }}
            >
              Unblock
            </Button>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default BannedStudents;
