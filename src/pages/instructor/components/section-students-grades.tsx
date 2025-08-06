/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React, { useState } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Drawer,
  Card,
  Stack,
  Chip,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Person as PersonIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as UncheckedIcon,
} from '@mui/icons-material';
import {
  Assignment,
  StudentData,
} from '../../../store/slices/education-management/types';

interface SectionStudentsGradesProps {
  assignmentsInSection: Assignment[];
  studentsInSection: StudentData[];
}

const SectionStudentsGrades: React.FC<SectionStudentsGradesProps> = ({
  assignmentsInSection,
  studentsInSection,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(
    null
  );

  const getStudentAssignmentCompletion = (student: StudentData) => {
    const completedAssignments =
      student.assignmentProgress?.filter((progress) =>
        assignmentsInSection.some(
          (assignment) => assignment._id === progress.assignmentId
        )
      ) || [];

    return {
      completed: completedAssignments.length,
      total: assignmentsInSection.length,
    };
  };

  const getStudentAssignmentDetails = (student: StudentData) => {
    const completedAssignmentIds = new Set(
      student.assignmentProgress?.map((progress) => progress.assignmentId) || []
    );

    const assignmentDetails = assignmentsInSection.map((assignment) => ({
      assignment,
      isCompleted: completedAssignmentIds.has(assignment._id),
    }));

    return assignmentDetails.sort((a, b) => {
      if (a.isCompleted === b.isCompleted) return 0;
      return a.isCompleted ? 1 : -1;
    });
  };

  const handleStudentClick = (student: StudentData) => {
    setSelectedStudent(student);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedStudent(null);
  };

  if (studentsInSection.length === 0) {
    return (
      <Box>
        <Typography
          variant="h5"
          sx={{ fontWeight: 600, color: 'text.primary', mb: 3 }}
        >
          Students and Grades
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
            👥
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            No students enrolled
          </Typography>
          <Typography variant="body2" color="text.disabled">
            Students will appear here once they join this section
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
          Students and Grades
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {studentsInSection.length} student
          {studentsInSection.length !== 1 ? 's' : ''}
        </Typography>
      </Stack>

      <List sx={{ width: '100%' }}>
        {studentsInSection.map((student) => {
          const completion = getStudentAssignmentCompletion(student);
          return (
            <ListItem
              key={student._id}
              onClick={() => handleStudentClick(student)}
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
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color:
                      completion.completed === completion.total
                        ? '#4caf50'
                        : '#1B6A9C',
                  }}
                >
                  {completion.completed}/{completion.total}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  assignments complete
                </Typography>
              </Box>
            </ListItem>
          );
        })}
      </List>

      <Drawer
        anchor="bottom"
        open={drawerOpen}
        onClose={handleCloseDrawer}
        PaperProps={{
          sx: {
            maxHeight: '70vh',
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
          },
        }}
      >
        {selectedStudent && (
          <Box sx={{ p: 3 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 3 }}
            >
              <Box>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 600, color: 'text.primary' }}
                >
                  {selectedStudent.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedStudent.userId}
                </Typography>
              </Box>
              <IconButton
                onClick={handleCloseDrawer}
                sx={{ color: 'grey.500' }}
              >
                <CloseIcon />
              </IconButton>
            </Stack>

            <Divider sx={{ mb: 3 }} />

            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Assignment Progress
            </Typography>

            <List>
              {getStudentAssignmentDetails(selectedStudent).map((item) => (
                <ListItem
                  key={item.assignment._id}
                  sx={{
                    borderRadius: 2,
                    mb: 1,
                    border: '1px solid',
                    borderColor: item.isCompleted ? '#4caf50' : 'grey.200',
                    backgroundColor: item.isCompleted
                      ? 'rgba(76, 175, 80, 0.04)'
                      : 'transparent',
                  }}
                >
                  <ListItemIcon>
                    {item.isCompleted ? (
                      <CheckCircleIcon sx={{ color: '#4caf50' }} />
                    ) : (
                      <UncheckedIcon sx={{ color: 'grey.400' }} />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 500,
                          color: item.isCompleted
                            ? 'text.primary'
                            : 'text.secondary',
                        }}
                      >
                        {item.assignment.title}
                      </Typography>
                    }
                    secondary={
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                      >
                        {item.assignment.description}
                      </Typography>
                    }
                  />
                  <Chip
                    label={item.isCompleted ? 'Complete' : 'Incomplete'}
                    size="small"
                    sx={{
                      backgroundColor: item.isCompleted
                        ? '#4caf50'
                        : 'grey.200',
                      color: item.isCompleted ? 'white' : 'text.secondary',
                      fontWeight: 500,
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </Drawer>
    </Box>
  );
};

export default SectionStudentsGrades;
