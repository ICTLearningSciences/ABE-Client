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
  Button,
} from '@mui/material';
import {
  Person as PersonIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as UncheckedIcon,
  Block as BanIcon,
} from '@mui/icons-material';
import {
  Section,
  StudentData,
  Assignment,
} from '../../../store/slices/education-management/types';
import {
  SectionStudentsProgress,
  useWithEducationalManagement,
} from '../../../store/slices/education-management/use-with-educational-management';
import { getAssignmentsInSection } from '../helpers';

interface SectionStudentsGradesProps {
  sectionStudentsProgress: SectionStudentsProgress;
  section: Section;
  assignments: Assignment[];
}

const SectionStudentsGrades: React.FC<SectionStudentsGradesProps> = ({
  sectionStudentsProgress,
  section,
  assignments,
}) => {
  const educationManagement = useWithEducationalManagement();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(
    null
  );

  const assignmentsInSection = getAssignmentsInSection(assignments, section);

  const getStudentProgressCounts = (studentId: string) => {
    const studentProgress = sectionStudentsProgress[studentId];
    if (!studentProgress) return { requiredCompleted: 0, optionalCompleted: 0 };

    const requiredCompleted = Object.values(
      studentProgress.requiredAssignmentsProgress
    ).filter(Boolean).length;
    const optionalCompleted = Object.values(
      studentProgress.optionalAssignmentsProgress
    ).filter(Boolean).length;

    return { requiredCompleted, optionalCompleted };
  };

  const handleStudentClick = (student: StudentData) => {
    setSelectedStudent(student);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedStudent(null);
  };

  const handleBanStudent = async (studentUserId: string) => {
    try {
      await educationManagement.banStudentFromSection(
        section._id,
        studentUserId
      );
      setDrawerOpen(false);
      setSelectedStudent(null);
    } catch (error) {
      console.error('Failed to ban student:', error);
    }
  };

  if (Object.keys(sectionStudentsProgress).length === 0) {
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
          {Object.keys(sectionStudentsProgress).length} student
          {Object.keys(sectionStudentsProgress).length !== 1 ? 's' : ''}
        </Typography>
      </Stack>

      <List sx={{ width: '100%' }}>
        {Object.entries(sectionStudentsProgress).map(
          ([studentId, studentProgress]) => {
            const { requiredCompleted, optionalCompleted } =
              getStudentProgressCounts(studentId);
            const student = studentProgress.studentData;

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
                    variant="body1"
                    sx={{ fontWeight: 600, color: '#1B6A9C' }}
                  >
                    Required: {requiredCompleted}/
                    {assignmentsInSection.requiredAssignments.length}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: 600, color: '#1B6A9C' }}
                  >
                    Optional: {optionalCompleted}/
                    {section.numOptionalAssignmentsRequired || 0}
                  </Typography>
                </Box>
              </ListItem>
            );
          }
        )}
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

            {/* Required Assignments Section */}
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 2 }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Required Assignments
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {
                  getStudentProgressCounts(selectedStudent._id)
                    .requiredCompleted
                }
                /{assignmentsInSection.requiredAssignments.length} completed
              </Typography>
            </Stack>

            <List sx={{ mb: 3 }}>
              {assignmentsInSection.requiredAssignments.map((assignment) => {
                const studentProgress =
                  sectionStudentsProgress[selectedStudent._id];
                const isCompleted =
                  studentProgress?.requiredAssignmentsProgress[
                    assignment._id
                  ] || false;

                return (
                  <ListItem
                    key={assignment._id}
                    sx={{
                      borderRadius: 2,
                      mb: 1,
                      border: '1px solid',
                      borderColor: isCompleted ? '#4caf50' : 'grey.200',
                      backgroundColor: isCompleted
                        ? 'rgba(76, 175, 80, 0.04)'
                        : 'transparent',
                    }}
                  >
                    <ListItemIcon>
                      {isCompleted ? (
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
                            color: isCompleted
                              ? 'text.primary'
                              : 'text.secondary',
                          }}
                        >
                          {assignment.title}
                        </Typography>
                      }
                      secondary={
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 0.5 }}
                        >
                          {assignment.description}
                        </Typography>
                      }
                    />
                    <Chip
                      label={isCompleted ? 'Complete' : 'Incomplete'}
                      size="small"
                      sx={{
                        backgroundColor: isCompleted ? '#4caf50' : 'grey.200',
                        color: isCompleted ? 'white' : 'text.secondary',
                        fontWeight: 500,
                      }}
                    />
                  </ListItem>
                );
              })}
            </List>

            {/* Optional Assignments Section */}
            {assignmentsInSection.optionalAssignments.length > 0 && (
              <>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mb: 2 }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Optional Assignments
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {
                      getStudentProgressCounts(selectedStudent._id)
                        .optionalCompleted
                    }
                    /{section.numOptionalAssignmentsRequired || 0} completed
                  </Typography>
                </Stack>

                <List>
                  {assignmentsInSection.optionalAssignments.map(
                    (assignment) => {
                      const studentProgress =
                        sectionStudentsProgress[selectedStudent._id];
                      const isCompleted =
                        studentProgress?.optionalAssignmentsProgress[
                          assignment._id
                        ] || false;

                      return (
                        <ListItem
                          key={assignment._id}
                          sx={{
                            borderRadius: 2,
                            mb: 1,
                            border: '1px solid',
                            borderColor: isCompleted ? '#4caf50' : 'grey.200',
                            backgroundColor: isCompleted
                              ? 'rgba(76, 175, 80, 0.04)'
                              : 'transparent',
                          }}
                        >
                          <ListItemIcon>
                            {isCompleted ? (
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
                                  color: isCompleted
                                    ? 'text.primary'
                                    : 'text.secondary',
                                }}
                              >
                                {assignment.title}
                              </Typography>
                            }
                            secondary={
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mt: 0.5 }}
                              >
                                {assignment.description}
                              </Typography>
                            }
                          />
                          <Chip
                            label={isCompleted ? 'Complete' : 'Incomplete'}
                            size="small"
                            sx={{
                              backgroundColor: isCompleted
                                ? '#4caf50'
                                : 'grey.200',
                              color: isCompleted ? 'white' : 'text.secondary',
                              fontWeight: 500,
                            }}
                          />
                        </ListItem>
                      );
                    }
                  )}
                </List>
              </>
            )}

            <Divider sx={{ mb: 3 }} />

            {/* Ban Student Section */}
            <Box sx={{ mb: 3, textAlign: 'center' }}>
              <Button
                variant="contained"
                startIcon={<BanIcon />}
                onClick={() => handleBanStudent(selectedStudent.userId)}
                disabled={educationManagement.isSectionModifying}
                sx={{
                  backgroundColor: '#d32f2f',
                  '&:hover': {
                    backgroundColor: '#c62828',
                  },
                  fontWeight: 600,
                  px: 3,
                }}
              >
                BAN STUDENT
              </Button>
            </Box>
          </Box>
        )}
      </Drawer>
    </Box>
  );
};

export default SectionStudentsGrades;
