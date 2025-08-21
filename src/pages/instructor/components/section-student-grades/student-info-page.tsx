import React from 'react';
import { AssignmentsInSection } from '../../helpers';
import {
  SectionStudentsProgress,
  UseWithEducationalManagement,
} from '../../../../store/slices/education-management/use-with-educational-management';
import {
  Section,
  StudentData,
} from '../../../../store/slices/education-management/types';
import {
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as UncheckedIcon,
  Block as BanIcon,
  Timeline as TimelineIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Stack,
  Chip,
  Divider,
  Button,
} from '@mui/material';

export function StudentInfoPage(props: {
  selectedStudent: StudentData;
  getStudentProgressCounts: (studentId: string) => {
    requiredCompleted: number;
    optionalCompleted: number;
  };
  assignmentsInSection: AssignmentsInSection;
  sectionStudentsProgress: SectionStudentsProgress;
  section: Section;
  handleBanStudent: (studentUserId: string) => void;
  educationManagement: UseWithEducationalManagement;
  onViewStudentTimelines?: (studentId: string) => void;
  onBackToSection: () => void;
}) {
  const {
    selectedStudent,
    getStudentProgressCounts,
    assignmentsInSection,
    sectionStudentsProgress,
    section,
    handleBanStudent,
    educationManagement,
    onViewStudentTimelines,
    onBackToSection,
  } = props;
  return (
    <Box sx={{ p: 3 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={onBackToSection}
        sx={{ mb: 2, color: 'text.secondary' }}
      >
        Back to Section
      </Button>
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
          {getStudentProgressCounts(selectedStudent._id).requiredCompleted}/
          {assignmentsInSection.requiredAssignments.length} completed
        </Typography>
      </Stack>

      <List sx={{ mb: 3 }}>
        {assignmentsInSection.requiredAssignments.map((assignment) => {
          const studentProgress = sectionStudentsProgress[selectedStudent._id];
          const isCompleted =
            studentProgress?.requiredAssignmentsProgress[assignment._id] ||
            false;

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
                      color: isCompleted ? 'text.primary' : 'text.secondary',
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
              {getStudentProgressCounts(selectedStudent._id).optionalCompleted}/
              {section.numOptionalAssignmentsRequired || 0} completed
            </Typography>
          </Stack>

          <List>
            {assignmentsInSection.optionalAssignments.map((assignment) => {
              const studentProgress =
                sectionStudentsProgress[selectedStudent._id];
              const isCompleted =
                studentProgress?.optionalAssignmentsProgress[assignment._id] ||
                false;

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
        </>
      )}

      <Divider sx={{ mb: 3 }} />

      {/* Action Buttons Section */}
      <Box
        sx={{
          mb: 3,
          display: 'flex',
          gap: 2,
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}
      >
        {onViewStudentTimelines && (
          <Button
            variant="outlined"
            startIcon={<TimelineIcon />}
            onClick={() => onViewStudentTimelines(selectedStudent.userId)}
            sx={{
              borderColor: '#1976d2',
              color: '#1976d2',
              '&:hover': {
                borderColor: '#1565c0',
                backgroundColor: 'rgba(25, 118, 210, 0.04)',
              },
              fontWeight: 600,
              px: 3,
            }}
          >
            VIEW TIMELINES
          </Button>
        )}

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
  );
}
