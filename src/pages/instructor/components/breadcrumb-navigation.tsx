/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React, { useMemo } from 'react';
import { Box, Typography, Breadcrumbs } from '@mui/material';
import { NavigateNext } from '@mui/icons-material';
import { UseWithEducationalManagement } from '../../../store/slices/education-management/use-with-educational-management';
import { useWithDocGoalsActivities } from '../../../store/slices/doc-goals-activities/use-with-doc-goals-activites';
import { CourseManagementState } from '../../../store/slices/education-management';

export interface BreadcrumbItem {
  id: string;
  title: string;
  icon: string;
  onClick: () => void;
}

interface BreadcrumbNavigationProps {
  educationManagement: UseWithEducationalManagement;
  viewState: CourseManagementState;
  handleDashboardSelect: () => void;
  handleCourseSelect: (courseId: string) => void;
  handleSectionSelect: (sectionId: string) => void;
  handleAssignmentSelect: (assignmentId: string) => void;
}

const BreadcrumbNavigation: React.FC<BreadcrumbNavigationProps> = ({
  educationManagement,
  viewState,
  handleDashboardSelect,
  handleCourseSelect,
  handleSectionSelect,
  handleAssignmentSelect,
}) => {
  const { getActivityById } = useWithDocGoalsActivities();
  const items: BreadcrumbItem[] = useMemo(() => {
    const items: BreadcrumbItem[] = [
      {
        id: 'dashboard',
        title: 'Courses',
        icon: '🏫',
        onClick: () => handleDashboardSelect(),
      },
    ];

    if (viewState.selectedCourseId) {
      const course = educationManagement.courses.find(
        (c) => c._id === viewState.selectedCourseId
      );
      if (course) {
        items.push({
          id: course._id,
          title: `Course: ${course.title}`,
          icon: '📚',
          onClick: () => handleCourseSelect(course._id),
        });
      }
    }

    if (viewState.selectedSectionId && viewState.selectedCourseId) {
      const section = educationManagement.sections.find(
        (s) => s._id === viewState.selectedSectionId
      );
      if (section) {
        items.push({
          id: section._id,
          title: `Section: ${section.title}`,
          icon: '📑',
          onClick: () => handleSectionSelect(section._id),
        });
      }
    }

    if (
      viewState.selectedAssignmentId &&
      viewState.selectedCourseId &&
      viewState.selectedSectionId
    ) {
      const assignment = educationManagement.assignments.find(
        (a) => a._id === viewState.selectedAssignmentId
      );
      if (assignment) {
        items.push({
          id: assignment._id,
          title: `Assignment: ${assignment.title}`,
          icon: '📝',
          onClick: () => handleAssignmentSelect(assignment._id),
        });
      }
    }

    if (viewState.selectedStudentId) {
      const student = educationManagement.students.find(
        (s) => s.userId === viewState.selectedStudentId
      );
      if (student) {
        items.push({
          id: student.userId,
          title: `Student: ${student.name}`,
          icon: '👤',
          onClick: () => {
            console.log('student clicked');
          },
        });
      }
    }

    if (
      viewState.selectedActivityId &&
      viewState.selectedCourseId &&
      viewState.selectedSectionId &&
      viewState.selectedAssignmentId
    ) {
      const activity = getActivityById(viewState.selectedActivityId);
      items.push({
        id: viewState.selectedActivityId,
        title: `Activity: ${activity?.title || 'Activity'}`,
        icon: '📝',
        onClick: () => {
          console.log('activity clicked');
        },
      });
    }

    return items;
  }, [
    viewState,
    educationManagement.courses,
    educationManagement.sections,
    educationManagement.assignments,
  ]);

  if (items.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        py: 1.5,
        borderBottom: '1px solid #e9ecef',
      }}
      data-cy="breadcrumb-navigation"
    >
      <Breadcrumbs
        separator={<NavigateNext fontSize="small" />}
        sx={{
          '& .MuiBreadcrumbs-separator': {
            color: 'text.disabled',
            fontSize: '12px',
          },
        }}
      >
        {items.map((item, index) => (
          <Box
            key={item.id}
            onClick={item.onClick}
            data-cy={`breadcrumb-item-${item.id}`}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.75,
              px: 1,
              py: 0.5,
              borderRadius: 0.5,
              cursor: 'pointer',
              transition: 'background-color 0.2s ease',
              backgroundColor: 'transparent',
              '&:hover': {
                backgroundColor: 'grey.50',
              },
            }}
          >
            <Typography
              sx={{
                fontSize: '14px',
              }}
            >
              {item.icon}
            </Typography>
            <Typography
              sx={{
                fontSize: '14px',
                fontWeight: index === items.length - 1 ? '600' : '500',
                color: index === items.length - 1 ? '#1B6A9C' : 'text.primary',
              }}
            >
              {item.title}
            </Typography>
          </Box>
        ))}
      </Breadcrumbs>
    </Box>
  );
};

export default BreadcrumbNavigation;
