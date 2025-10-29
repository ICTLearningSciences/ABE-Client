/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import { useWithEducationalManagement } from '../../store/slices/education-management/use-with-educational-management';
import { useWithLogin } from '../../store/slices/login/use-with-login';
import { TreeSection } from './components/collapsible-tree';
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
import {
  Course,
  isStudentData,
} from '../../store/slices/education-management/types';
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
import { getStudentAssignmentDocs, getStudentDocIds } from '../../helpers';
import { LoginStatus } from '../../store/slices/login';
import { CourseManagementSidebar } from './components/course-management-sidebar';
import { ErrorToast } from '../../components/shared/error-toast';
import { DashboardMain } from './course-management/dashboard/dashboard-main';
import { useWithWindowSize } from '../../hooks/use-with-window-size';

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
    myData,
    loadUserEducationalData,
    goToPreviousView,
  } = educationManagement;
  const { state: loginState, updateUserInfo } = useWithLogin();
  useWithEducationalEvents();
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isJoinSectionModalOpen, setIsJoinSectionModalOpen] = useState(false);
  const config = useAppSelector((state) => state.config).config;
  const docGoalActivities = useWithDocGoalsActivities(
    loginState.user?._id || '',
    config
  );
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { isMobile } = useWithWindowSize();
  const {
    fetchDocumentTimeline,
    documentStates,
    loadInProgress,
    errorMessage,
    getHydratedTimeline,
  } = useWithDocumentTimeline();
  const alreadyLoadedDataRef = useRef(false);

  useEffect(() => {
    const alreadyHaveEducationalData =
      Boolean(loginState.user?.educationalRole) || myData;
    if (
      loginState.loginStatus !== LoginStatus.AUTHENTICATED ||
      !loginState.user ||
      alreadyHaveEducationalData ||
      isLoading ||
      alreadyLoadedDataRef.current
    ) {
      return;
    }
    alreadyLoadedDataRef.current = true;
    updateUserInfo({ educationalRole: EducationalRole.STUDENT }).then(
      (user) => {
        loadUserEducationalData(user._id, EducationalRole.STUDENT);
      }
    );
  }, [loginState.loginStatus, myData, isLoading]);

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
    assignmentId: string
  ) => {
    const targetStudent =
      myData?._id && myData.userId === studentId && isStudentData(myData)
        ? myData
        : educationManagement.students.find((s) => s.userId === studentId);
    if (!targetStudent) {
      throw new Error('No student found.');
    }
    const docs = getStudentAssignmentDocs(targetStudent, assignmentId);
    const primaryDoc =
      docs.find((d) => d.primaryDocument) ||
      (docs.length > 0 ? docs[0] : undefined);

    await viewAssignmentDocumentTimelines(
      targetStudent.userId,
      assignmentId,
      primaryDoc?.docId
    );
    try {
      if (primaryDoc?.docId) {
        await fetchDocumentTimeline(targetStudent.userId, primaryDoc.docId);
      }
    } catch (error) {
      console.error('Failed to fetch document timeline:', error);
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
    const newCourse = await educationManagement.createCourse(courseData);
    viewCourse(newCourse._id);
    setIsCourseModalOpen(false);
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
    handleCourseSelect,
    handleSectionSelect,
    handleAssignmentSelect,
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
      {!isMobile ? (
        <CourseManagementSidebar
          isStudent={isStudent}
          treeSections={treeSections}
          selectedId={getSelectedId()}
          isSectionModifying={educationManagement.isSectionModifying}
          isCourseModifying={educationManagement.isCourseModifying}
          onOpenJoinSectionModal={handleOpenJoinSectionModal}
          onOpenCourseModal={handleOpenCourseModal}
          isSidebarCollapsed={isSidebarCollapsed}
          setIsSidebarCollapsed={setIsSidebarCollapsed}
        />
      ) : undefined}

      {/* Main content */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          width: '100%',
        }}
        data-cy="course-management-main-content-outer"
      >
        <BreadcrumbNavigation
          educationManagement={educationManagement}
          viewState={viewState}
          handleDashboardSelect={viewDashboard}
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
            width: '100%',
          }}
          data-cy="course-management-main-content-inner"
        >
          {viewState.view === 'dashboard' && (
            <DashboardMain
              courses={educationManagement.courses}
              isStudent={isStudent}
              onCourseSelect={handleCourseSelect}
              handleOpenCourseModal={handleOpenCourseModal}
              handleOpenJoinSectionModal={handleOpenJoinSectionModal}
            />
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
                docGoalActivities={docGoalActivities}
                onAssignmentDeleted={handleAssignmentDeleted}
                isStudentView={isStudent}
                onActivitySelect={handleActivitySelect}
                onViewDocumentTimeline={handleViewStudentTimelines}
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
            viewState.selectedStudent &&
            viewState.selectedAssignment &&
            viewState.selectedSectionId && (
              <AssignmentDocumentTimelines
                sectionId={viewState.selectedSectionId}
                student={viewState.selectedStudent}
                assignment={viewState.selectedAssignment}
                studentDocIds={allStudentDocIds}
                documentStates={documentStates}
                loadInProgress={loadInProgress}
                errorMessage={errorMessage}
                selectedDocId={viewState.selectedDocId || ''}
                getHydratedTimeline={getHydratedTimeline}
                onBackToStudentInfo={() => {
                  goToPreviousView();
                }}
                onDocumentChange={handleDocumentChange}
                isSidebarCollapsed={isSidebarCollapsed}
                handleViewStudentTimelines={handleViewStudentTimelines}
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
      <ErrorToast />
    </Box>
  );
};

export default withAuthorizationOnly(CourseManagement);
