/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from 'react';
import { Box, Typography, Button, Paper, IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import CollapsibleTree, { TreeSection } from './collapsible-tree';

interface CourseManagementSidebarProps {
  isStudent: boolean;
  treeSections: TreeSection[];
  selectedId?: string;
  isSectionModifying: boolean;
  isCourseModifying: boolean;
  onOpenJoinSectionModal: () => void;
  onOpenCourseModal: () => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (isSidebarCollapsed: boolean) => void;
}

export const CourseManagementSidebar: React.FC<
  CourseManagementSidebarProps
> = ({
  isStudent,
  treeSections,
  selectedId,
  isSectionModifying,
  isCourseModifying,
  onOpenJoinSectionModal,
  onOpenCourseModal,
  isSidebarCollapsed,
  setIsSidebarCollapsed,
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        width: isSidebarCollapsed ? '1vw' : '15vw',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px 0 0 8px',
        borderRight: '1px solid #e9ecef',
        padding: isSidebarCollapsed ? '24px 12px' : '24px 16px',
        position: 'relative',
        overflow: 'hidden',
        transition: 'width 0.3s ease-in-out, padding 0.3s ease-in-out',
      }}
    >
      {/* Collapse/Expand Button */}
      <IconButton
        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        sx={{
          position: 'absolute',
          top: '16px',
          right: '8px',
          zIndex: 1,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
          },
          width: '32px',
          height: '32px',
        }}
      >
        {isSidebarCollapsed ? <ChevronRight /> : <ChevronLeft />}
      </IconButton>

      <Box
        sx={{
          mb: 3,
          opacity: isSidebarCollapsed ? 0 : 1,
          transition: 'opacity 0.3s ease-in-out',
        }}
      >
        <Typography
          variant="h5"
          data-cy="course-management-title"
          sx={{
            mb: 1,
            color: '#1B6A9C',
            fontWeight: 600,
          }}
        >
          {isStudent ? 'My Courses' : 'Course Management'}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          data-cy="course-management-description"
        >
          {isStudent
            ? 'View your enrolled courses, sections, and assignments'
            : 'Manage your courses, sections, and assignments'}
        </Typography>
      </Box>

      {isStudent ? (
        <Button
          onClick={onOpenJoinSectionModal}
          disabled={isSectionModifying || isSidebarCollapsed}
          variant="contained"
          fullWidth
          data-cy="join-section-button"
          sx={{
            mb: 3,
            backgroundColor: '#1B6A9C',
            opacity: isSidebarCollapsed ? 0 : 1,
            transition: 'opacity 0.3s ease-in-out',
            '&:hover': {
              backgroundColor: '#145a87',
            },
          }}
        >
          + Join Section
        </Button>
      ) : (
        <Button
          onClick={onOpenCourseModal}
          disabled={isCourseModifying || isSidebarCollapsed}
          variant="contained"
          fullWidth
          data-cy="new-course-button"
          sx={{
            mb: 3,
            backgroundColor: '#1B6A9C',
            opacity: isSidebarCollapsed ? 0 : 1,
            transition: 'opacity 0.3s ease-in-out',
            '&:hover': {
              backgroundColor: '#145a87',
            },
          }}
        >
          + New Course
        </Button>
      )}

      <Box
        sx={{
          opacity: isSidebarCollapsed ? 0 : 1,
          transition: 'opacity 0.3s ease-in-out',
        }}
      >
        {treeSections.length === 0 ||
        treeSections.every((section) => section.items.length === 0) ? (
          <Box
            sx={{
              textAlign: 'center',
              py: 5,
              px: 2.5,
            }}
          >
            <Typography
              sx={{
                fontSize: '48px',
                color: '#dee2e6',
                mb: 2,
              }}
            >
              📚
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ lineHeight: 1.5 }}
            >
              {isStudent ? (
                <>
                  No courses yet
                  <br />
                  Join your first section to get started
                </>
              ) : (
                <>
                  No courses yet
                  <br />
                  Create your first course to get started
                </>
              )}
            </Typography>
          </Box>
        ) : (
          <CollapsibleTree sections={treeSections} selectedId={selectedId} />
        )}
      </Box>
    </Paper>
  );
};
