/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React, { useState, useMemo } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { useWithEducationalManagement } from '../../store/slices/education-management/use-with-educational-management';
import { useWithLogin } from '../../store/slices/login/use-with-login';
import CollapsibleTree, { TreeItem } from './components/collapsible-tree';
import CourseView from './components/course-view';
import SectionView from './components/section-view';
import AssignmentView from './components/assignment-view';
import BreadcrumbNavigation from './components/breadcrumb-navigation';
import CourseModal from './components/course-modal';
import JoinSectionModal from './components/join-section-modal';
import { getCourseManagementTreeData } from './helpers';
import { Course } from '../../store/slices/education-management/types';
import { useWithDocGoalsActivities } from '../../store/slices/doc-goals-activities/use-with-doc-goals-activites';
import { EducationalRole } from '../../types';
import withAuthorizationOnly from '../../hooks/wrap-with-authorization-only';
import { ActivityView } from './components/activity-view';

export const courseManagementUrl = '/course-management';
export const studentCoursesUrl = '/student/courses';

export interface CourseManagementState {
  view: 'dashboard' | 'course' | 'section' | 'assignment' | 'activity';
  selectedCourseId?: string;
  selectedSectionId?: string;
  selectedAssignmentId?: string;
  selectedActivityId?: string;
}

interface CourseManagementProps {
  userRole?: EducationalRole;
}

const CourseManagement: React.FC<CourseManagementProps> = ({ userRole }) => {
  const educationManagement = useWithEducationalManagement();
  const { state: loginState } = useWithLogin();
  const [viewState, setViewState] = useState<CourseManagementState>({
    view: 'dashboard',
  });
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isJoinSectionModalOpen, setIsJoinSectionModalOpen] = useState(false);
  const { builtActivities } = useWithDocGoalsActivities();

  // Determine if user is a student - either from prop or from login state
  const isStudent =
    userRole === EducationalRole.STUDENT ||
    loginState.user?.educationalRole === EducationalRole.STUDENT;

  const handleCreateCourse = async (courseData: Partial<Course>) => {
    try {
      const newCourse = await educationManagement.createCourse(courseData);
      setViewState({
        view: 'course',
        selectedCourseId: newCourse._id,
      });
      setIsCourseModalOpen(false);
    } catch (error) {
      console.error('Failed to create course:', error);
    }
  };

  const handleOpenCourseModal = () => {
    setIsCourseModalOpen(true);
  };

  const handleCloseCourseModal = () => {
    setIsCourseModalOpen(false);
  };

  const handleCourseSelect = (courseId: string) => {
    setViewState({
      view: 'course',
      selectedCourseId: courseId,
    });
  };

  const handleSectionSelect = (courseId: string, sectionId: string) => {
    setViewState({
      view: 'section',
      selectedCourseId: courseId,
      selectedSectionId: sectionId,
    });
  };

  const handleAssignmentSelect = (
    courseId: string,
    sectionId: string,
    assignmentId: string
  ) => {
    setViewState({
      view: 'assignment',
      selectedCourseId: courseId,
      selectedSectionId: sectionId,
      selectedAssignmentId: assignmentId,
    });
  };

  const handleActivitySelect = (activityId: string) => {
    if (
      !viewState.selectedCourseId ||
      !viewState.selectedSectionId ||
      !viewState.selectedAssignmentId
    ) {
      console.error('Missing required view state for activity select');
      return;
    }
    setViewState({
      view: 'activity',
      selectedCourseId: viewState.selectedCourseId,
      selectedSectionId: viewState.selectedSectionId,
      selectedAssignmentId: viewState.selectedAssignmentId,
      selectedActivityId: activityId,
    });
  };

  // Navigation handlers for deletion scenarios
  const handleCourseDeleted = () => {
    setViewState({
      view: 'dashboard',
    });
  };

  const handleSectionDeleted = (courseId: string) => {
    setViewState({
      view: 'course',
      selectedCourseId: courseId,
    });
  };

  const handleAssignmentDeleted = (courseId: string, sectionId: string) => {
    setViewState({
      view: 'section',
      selectedCourseId: courseId,
      selectedSectionId: sectionId,
    });
  };

  const handleJoinSection = async (sectionCode: string) => {
    if (!loginState.user?._id) {
      throw new Error('User not authenticated');
    }
    await educationManagement.enrollStudentInSection(
      loginState.user._id,
      sectionCode
    );
    setIsJoinSectionModalOpen(false);
  };

  const handleOpenJoinSectionModal = () => {
    setIsJoinSectionModalOpen(true);
  };

  const handleCloseJoinSectionModal = () => {
    setIsJoinSectionModalOpen(false);
  };

  const treeData: TreeItem[] = useMemo(() => {
    return getCourseManagementTreeData(
      educationManagement,
      handleCourseSelect,
      handleSectionSelect,
      handleAssignmentSelect
    );
  }, [
    educationManagement.courses,
    educationManagement.sections,
    educationManagement.assignments,
  ]);

  const getSelectedId = (): string | undefined => {
    if (viewState.selectedAssignmentId) return viewState.selectedAssignmentId;
    if (viewState.selectedSectionId) return viewState.selectedSectionId;
    if (viewState.selectedCourseId) return viewState.selectedCourseId;
    return undefined;
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}
    >
      {/* Sidebar */}
      <Paper
        elevation={0}
        sx={{
          width: '300px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px 0 0 8px',
          borderRight: '1px solid #e9ecef',
          padding: '24px 16px',
        }}
      >
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h5"
            sx={{
              mb: 1,
              color: '#1B6A9C',
              fontWeight: 600,
            }}
          >
            {isStudent ? 'My Courses' : 'Course Management'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {isStudent
              ? 'View your enrolled courses, sections, and assignments'
              : 'Manage your courses, sections, and assignments'}
          </Typography>
        </Box>

        {isStudent ? (
          <Button
            onClick={handleOpenJoinSectionModal}
            disabled={educationManagement.isSectionModifying}
            variant="contained"
            fullWidth
            sx={{
              mb: 3,
              backgroundColor: '#1B6A9C',
              '&:hover': {
                backgroundColor: '#145a87',
              },
              '&:disabled': {
                backgroundColor: '#1B6A9C',
                opacity: 0.6,
              },
            }}
          >
            + Join Section
          </Button>
        ) : (
          <Button
            onClick={handleOpenCourseModal}
            disabled={educationManagement.isCourseModifying}
            variant="contained"
            fullWidth
            sx={{
              mb: 3,
              backgroundColor: '#1B6A9C',
              '&:hover': {
                backgroundColor: '#145a87',
              },
              '&:disabled': {
                backgroundColor: '#1B6A9C',
                opacity: 0.6,
              },
            }}
          >
            + New Course
          </Button>
        )}

        {/* Course Tree */}
        <Box>
          {treeData.length === 0 ? (
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
            <CollapsibleTree items={treeData} selectedId={getSelectedId()} />
          )}
        </Box>
      </Paper>

      {/* Main Content Area */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <BreadcrumbNavigation
          educationManagement={educationManagement}
          viewState={viewState}
          handleCourseSelect={handleCourseSelect}
          handleSectionSelect={handleSectionSelect}
          handleAssignmentSelect={handleAssignmentSelect}
        />

        {/* Content Area */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            overflow: 'auto',
            minHeight: 0,
          }}
        >
          {viewState.view === 'dashboard' && (
            <Box
              sx={{
                textAlign: 'center',
                maxWidth: '400px',
              }}
            >
              <Typography
                sx={{
                  fontSize: '64px',
                  color: '#dee2e6',
                  mb: 3,
                }}
              >
                📖
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  mb: 2,
                  color: 'text.primary',
                  fontWeight: 600,
                }}
              >
                {isStudent ? 'My Courses' : 'Course Management'}
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ lineHeight: 1.5 }}
              >
                {isStudent
                  ? 'Select a course, section, or assignment from the sidebar to view its details and access your learning materials.'
                  : 'Select a course, section, or assignment from the sidebar to view and edit its details. You can also create new items using the buttons in the sidebar.'}
              </Typography>
            </Box>
          )}

          {viewState.view === 'course' && viewState.selectedCourseId && (
            <CourseView
              courseId={viewState.selectedCourseId}
              onSectionSelect={(sectionId) =>
                handleSectionSelect(viewState.selectedCourseId!, sectionId)
              }
              onCourseDeleted={handleCourseDeleted}
              isStudentView={isStudent}
            />
          )}

          {viewState.view === 'section' &&
            viewState.selectedCourseId &&
            viewState.selectedSectionId && (
              <SectionView
                courseId={viewState.selectedCourseId}
                sectionId={viewState.selectedSectionId}
                onAssignmentSelect={(assignmentId) =>
                  handleAssignmentSelect(
                    viewState.selectedCourseId!,
                    viewState.selectedSectionId!,
                    assignmentId
                  )
                }
                onSectionDeleted={handleSectionDeleted}
                isStudentView={isStudent}
              />
            )}

          {viewState.view === 'assignment' &&
            viewState.selectedCourseId &&
            viewState.selectedSectionId &&
            viewState.selectedAssignmentId && (
              <AssignmentView
                courseId={viewState.selectedCourseId}
                sectionId={viewState.selectedSectionId}
                assignmentId={viewState.selectedAssignmentId}
                builtActivities={builtActivities}
                onAssignmentDeleted={handleAssignmentDeleted}
                isStudentView={isStudent}
                onActivitySelect={handleActivitySelect}
              />
            )}

          {viewState.view === 'activity' && viewState.selectedActivityId && (
            <ActivityView activityId={viewState.selectedActivityId} />
          )}
        </Box>
      </Box>
      <CourseModal
        isOpen={isCourseModalOpen}
        onClose={handleCloseCourseModal}
        onSubmit={handleCreateCourse}
        mode="create"
        isLoading={educationManagement.isCourseModifying}
      />
      <JoinSectionModal
        isOpen={isJoinSectionModalOpen}
        onClose={handleCloseJoinSectionModal}
        onSubmit={handleJoinSection}
        isLoading={educationManagement.isSectionModifying}
      />
    </Box>
  );
};

export default withAuthorizationOnly(CourseManagement);
