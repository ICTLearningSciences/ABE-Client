/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React, { useState } from 'react';
import { Box, Typography, List, Card, Stack } from '@mui/material';
import {
  Section,
  StudentData,
  Assignment,
} from '../../../../store/slices/education-management/types';
import {
  SectionStudentsProgress,
  useWithEducationalManagement,
} from '../../../../store/slices/education-management/use-with-educational-management';
import { getAssignmentsInSection } from '../../helpers';
import { StudentListItem } from './student-list-item';
import { StudentInfoDrawer } from './student-info-drawer';

interface SectionStudentsGradesProps {
  sectionStudentsProgress: SectionStudentsProgress;
  section: Section;
  assignments: Assignment[];
  onViewStudentTimelines?: (studentId: string) => void;
}

const SectionStudentsGrades: React.FC<SectionStudentsGradesProps> = ({
  sectionStudentsProgress,
  section,
  assignments,
  onViewStudentTimelines,
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

            return StudentListItem(
              student,
              requiredCompleted,
              optionalCompleted,
              assignmentsInSection,
              handleStudentClick,
              section.numOptionalAssignmentsRequired
            );
          }
        )}
      </List>
      {selectedStudent && (
        <StudentInfoDrawer
          selectedStudent={selectedStudent}
          drawerOpen={drawerOpen}
          handleCloseDrawer={handleCloseDrawer}
          getStudentProgressCounts={getStudentProgressCounts}
          assignmentsInSection={assignmentsInSection}
          sectionStudentsProgress={sectionStudentsProgress}
          section={section}
          handleBanStudent={handleBanStudent}
          educationManagement={educationManagement}
          onViewStudentTimelines={onViewStudentTimelines}
        />
      )}
    </Box>
  );
};

export default SectionStudentsGrades;
