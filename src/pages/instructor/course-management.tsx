/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React, { useState, useMemo } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { useWithEducationalManagement } from '../../store/slices/education-management/use-with-educational-management';
import { useWithLogin } from '../../store/slices/login/use-with-login';
import CollapsibleTree, { TreeSection } from './components/collapsible-tree';
import CourseView from './components/course-view';
import SectionView from './components/section-view';
import AssignmentView from './components/assignment-view/assignment-view';
import BreadcrumbNavigation from './components/breadcrumb-navigation';
import CourseModal, { CourseModalMode } from './components/course-modal';
import JoinSectionModal from './components/join-section-modal';
import {
  getCourseManagementTreeData,
  getCourseManagementSectionedTreeData,
  getAssignmentsInSection,
} from './helpers';
import { Course } from '../../store/slices/education-management/types';
import { useWithDocGoalsActivities } from '../../store/slices/doc-goals-activities/use-with-doc-goals-activites';
import { EducationalRole } from '../../types';
import withAuthorizationOnly from '../../hooks/wrap-with-authorization-only';
import { ActivityView } from './components/activity-view';
import { useAppSelector } from '../../store/hooks';
import { LoadingDialog } from '../../components/dialog';
import { JoinUrlSection } from './components/join-url-section';
import { useWithEducationalEvents } from '../../store/slices/education-management/use-with-educational-events';
import { useWithDocumentTimeline } from '../../hooks/use-with-document-timeline';
import { AssignmentDocumentTimelines } from './components/assignment-document-timelines';
import { StudentInfoPage } from './components/section-student-grades/student-info-page';
import { getStudentDocIds } from '../../helpers';

export const courseManagementUrl = '/course-management';
export const studentCoursesUrl = '/student/courses';

interface CourseManagementProps {
  userRole?: EducationalRole;
}

const CourseManagement: React.FC<CourseManagementProps> = ({ userRole }) => {
  const educationManagement = useWithEducationalManagement();
  const {
    viewCourse,
    viewSection,
    viewAssignment,
    viewActivity,
    viewAssignmentDocumentTimelines,
    viewStudentInfo,
    viewDashboard,
    updateSelectedDocId,
    isLoading,
    viewState,
  } = educationManagement;
  const { state: loginState } = useWithLogin();
  useWithEducationalEvents();
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isJoinSectionModalOpen, setIsJoinSectionModalOpen] = useState(false);
  const { builtActivities } = useWithDocGoalsActivities();
  const {
    fetchDocumentTimeline,
    documentStates,
    loadInProgress,
    errorMessage,
    getHydratedTimeline,
  } = useWithDocumentTimeline();

  const isStudent =
    userRole === EducationalRole.STUDENT ||
    loginState.user?.educationalRole === EducationalRole.STUDENT;

  const myInstructorData = useAppSelector(
    (state) => state.educationManagement.instructorData
  );

  const targetStudent = educationManagement.students.find(
    (s) => s.userId === viewState.selectedStudentId
  );

  const allStudentDocIds = targetStudent ? getStudentDocIds(targetStudent) : [];

  const handleViewStudentTimelines = async (
    studentId: string,
    assignmentId: string,
    docId?: string
  ) => {
    const targetStudent = educationManagement.students.find(
      (s) => s.userId === studentId
    );

    if (!targetStudent) {
      throw new Error('No student found.');
    }
    await viewAssignmentDocumentTimelines(
      targetStudent.userId,
      assignmentId,
      docId
    );
    if (docId) {
      try {
        await fetchDocumentTimeline(targetStudent.userId, docId);
      } catch (error) {
        console.error('Failed to fetch document timeline:', error);
      }
    }
  };

  const handleDocumentChange = async (docId: string) => {
    await updateSelectedDocId(docId);
    const currentStudentId = viewState.selectedStudentId;
    if (currentStudentId) {
      try {
        await fetchDocumentTimeline(currentStudentId, docId);
      } catch (error) {
        console.error('Failed to fetch document timeline:', error);
      }
    }
  };

  const handleCreateCourse = async (courseData: Partial<Course>) => {
    if (
      !loginState.user?._id ||
      loginState.user?.educationalRole !== EducationalRole.INSTRUCTOR
    ) {
      console.error('User is not an instructor');
      return;
    }
    try {
      const newCourse = await educationManagement.createCourse(courseData);
      viewCourse(newCourse._id);
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
    viewCourse(courseId);
  };

  const handleSectionSelect = (sectionId: string) => {
    viewSection(sectionId);
  };

  const handleAssignmentSelect = (assignmentId: string) => {
    viewAssignment(assignmentId);
  };

  const handleActivitySelect = (activityId: string) => {
    if (
      !loginState.user?._id ||
      !viewState.selectedCourseId ||
      !viewState.selectedSectionId ||
      !viewState.selectedAssignmentId
    ) {
      console.error('Missing required view state for activity select');
      return;
    }
    educationManagement.studentActivityStarted(
      loginState.user._id,
      viewState.selectedCourseId,
      viewState.selectedSectionId,
      viewState.selectedAssignmentId,
      activityId
    );
    viewActivity(activityId);
  };

  const handleCourseDeleted = () => {
    viewDashboard();
  };

  const handleSectionDeleted = (courseId: string) => {
    viewCourse(courseId);
  };

  const handleAssignmentDeleted = (sectionId: string) => {
    viewSection(sectionId);
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

  const handleRemoveFromSection = async (
    courseId: string,
    sectionId: string
  ) => {
    if (!loginState.user?._id) {
      console.error('No current user found');
      return;
    }

    try {
      await educationManagement.removeStudentFromSection(
        loginState.user._id,
        courseId,
        sectionId
      );
      await educationManagement.loadAllEducationalData(loginState.user._id);
      viewDashboard();
    } catch (error) {
      console.error('Failed to remove from section:', error);
    }
  };

  const treeSections: TreeSection[] = useMemo(() => {
    // For students, use the original function with all courses in one section
    if (isStudent) {
      const treeItems = getCourseManagementTreeData(
        educationManagement,
        handleCourseSelect,
        handleSectionSelect,
        handleAssignmentSelect
      );
      return [
        {
          id: 'my-courses',
          title: 'My Courses',
          items: treeItems,
        },
      ];
    }

    // For instructors, use the new sectioned function
    return getCourseManagementSectionedTreeData(
      educationManagement,
      handleCourseSelect,
      handleSectionSelect,
      handleAssignmentSelect,
      myInstructorData
    );
  }, [
    educationManagement.courses,
    educationManagement.sections,
    educationManagement.assignments,
    educationManagement.instructors,
    myInstructorData,
    isStudent,
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
            onClick={handleOpenJoinSectionModal}
            disabled={educationManagement.isSectionModifying}
            variant="contained"
            fullWidth
            data-cy="join-section-button"
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
            data-cy="new-course-button"
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

        <Box>
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
            <CollapsibleTree
              sections={treeSections}
              selectedId={getSelectedId()}
            />
          )}
        </Box>
      </Paper>

      {/* Main content */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
        data-cy="course-management-main-content-outer"
      >
        <BreadcrumbNavigation
          educationManagement={educationManagement}
          viewState={viewState}
          handleCourseSelect={handleCourseSelect}
          handleSectionSelect={handleSectionSelect}
          handleAssignmentSelect={handleAssignmentSelect}
        />

        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            overflow: 'auto',
            height: '100%',
          }}
          data-cy="course-management-main-content-inner"
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
                data-cy="course-management-main-title"
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
              onSectionSelect={handleSectionSelect}
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
                onAssignmentSelect={handleAssignmentSelect}
                onSectionDeleted={handleSectionDeleted}
                onRemoveFromSection={handleRemoveFromSection}
                isStudentView={isStudent}
                onViewStudentInfo={viewStudentInfo}
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

          {viewState.view === 'activity' &&
            viewState.selectedActivityId &&
            viewState.selectedAssignmentId && (
              <ActivityView
                activityId={viewState.selectedActivityId}
                assignmentId={viewState.selectedAssignmentId}
              />
            )}

          {viewState.view === 'activity-document-timelines' &&
            viewState.selectedStudentId &&
            viewState.selectedAssignmentId &&
            viewState.selectedDocId && (
              <AssignmentDocumentTimelines
                student={viewState.selectedStudent!}
                assignment={viewState.selectedAssignment!}
                studentDocIds={allStudentDocIds}
                documentStates={documentStates}
                loadInProgress={loadInProgress}
                errorMessage={errorMessage}
                selectedDocId={viewState.selectedDocId!}
                getHydratedTimeline={getHydratedTimeline}
                onBackToStudentInfo={() =>
                  viewStudentInfo(viewState.selectedStudentId!)
                }
                onDocumentChange={handleDocumentChange}
              />
            )}

          {viewState.view === 'student-info' &&
            viewState.selectedStudentId &&
            viewState.selectedSectionId &&
            viewState.selectedCourseId && (
              <StudentInfoPage
                selectedStudent={
                  educationManagement.students.find(
                    (s) => s.userId === viewState.selectedStudentId
                  )!
                }
                getStudentProgressCounts={(studentId: string) => {
                  const sectionStudentsProgress =
                    educationManagement.allSectionsStudentsProgress[
                      viewState.selectedSectionId!
                    ];
                  const studentProgress = sectionStudentsProgress[studentId];
                  if (!studentProgress)
                    return { requiredCompleted: 0, optionalCompleted: 0 };

                  const requiredCompleted = Object.values(
                    studentProgress.requiredAssignmentsProgress
                  ).filter(Boolean).length;
                  const optionalCompleted = Object.values(
                    studentProgress.optionalAssignmentsProgress
                  ).filter(Boolean).length;

                  return { requiredCompleted, optionalCompleted };
                }}
                assignmentsInSection={getAssignmentsInSection(
                  educationManagement.assignments,
                  educationManagement.sections.find(
                    (s) => s._id === viewState.selectedSectionId
                  )!
                )}
                sectionStudentsProgress={
                  educationManagement.allSectionsStudentsProgress[
                    viewState.selectedSectionId!
                  ]
                }
                section={
                  educationManagement.sections.find(
                    (s) => s._id === viewState.selectedSectionId
                  )!
                }
                builtActivities={builtActivities}
                handleBanStudent={async (studentUserId: string) => {
                  try {
                    await educationManagement.banStudentFromSection(
                      viewState.selectedSectionId!,
                      studentUserId
                    );
                    handleSectionSelect(viewState.selectedSectionId!);
                  } catch (error) {
                    console.error('Failed to ban student:', error);
                  }
                }}
                educationManagement={educationManagement}
                onViewStudentTimelines={handleViewStudentTimelines}
                onBackToSection={() =>
                  handleSectionSelect(viewState.selectedSectionId!)
                }
              />
            )}
        </Box>
      </Box>

      {/* Modals */}
      <CourseModal
        isOpen={isCourseModalOpen}
        onClose={handleCloseCourseModal}
        onSubmit={handleCreateCourse}
        mode={CourseModalMode.CREATE}
        isLoading={educationManagement.isCourseModifying}
      />
      <JoinSectionModal
        isOpen={isJoinSectionModalOpen}
        onClose={handleCloseJoinSectionModal}
        onSubmit={handleJoinSection}
        isLoading={educationManagement.isSectionModifying}
      />
      <JoinUrlSection />
      <LoadingDialog isLoading={isLoading} />
    </Box>
  );
};

export default withAuthorizationOnly(CourseManagement);
