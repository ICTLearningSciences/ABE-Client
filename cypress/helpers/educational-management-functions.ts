/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { CypressGlobal, cySetup, cyMockLogin, cyInterceptGraphQL, mockGQL, cyMockGoogleDoc, cyMockCreateNewDoc, cyMockGetDocTimeline } from './functions';
import { DocService, UserRole } from './types';
import { refreshAccessTokenResponse } from '../fixtures/refresh-access-token';
import { fetchConfigResponse } from '../fixtures/fetch-config';
import {
  fetchCoursesResponseInstructor,
  fetchCoursesResponseStudent,
  fetchCoursesResponseEmpty,
  fetchSectionsResponseInstructor,
  fetchSectionsResponseStudent,
  fetchSectionsResponseEmpty,
  fetchAssignmentsResponseInstructor,
  fetchAssignmentsResponseStudent,
  fetchAssignmentsResponseEmpty,
  fetchStudentsResponseInstructor,
  fetchStudentsResponseEmpty,
  createNewInstructorResponse,
  createNewStudentResponse,
  createNewStudentEmptyResponse,
  createCourseResponse,
  updateCourseResponse,
  deleteCourseResponse,
  createSectionResponse,
  updateSectionResponse,
  deleteSectionResponse,
  createAssignmentResponse,
  updateAssignmentResponse,
  deleteAssignmentResponse,
  enrollInSectionResponse,
  removeFromSectionResponse,
  updateStudentProgressResponse,
} from '../fixtures/educational-management';
import { fetchBuiltActivitiesResponse } from '../fixtures/fetch-built-activities';
import { EducationalRole } from '../fixtures/educational-management/educational-types';
import { MockGraphQLQuery } from './functions';
import { gDocWithAllIntentions, storeUserDocResponse } from '../fixtures/intentions/google-docs-intentions';
import { fetchGoogleDocsResponse } from '../fixtures/fetch-google-docs';
import { fetchDocVersionsBuilder } from '../fixtures/fetch-doc-versions-builder';
import { fetchDocGoalsResponse } from '../fixtures/fetch-doc-goals';
import { fetchActivitiesResponse } from '../fixtures/fetch-activities';
import { fetchPromptTemplates } from '../fixtures/fetch-prompt-templates';
import { fetchInstructorsResponseEmpty } from '../fixtures/educational-management/fetch-instructors';
import { realExampleDocumentTimeline } from '../fixtures/document-timeline/real-example';

export interface EducationalMockOptions {
  gqlQueries?: MockGraphQLQuery[] | MockGraphQLQuery;
  userRole?: UserRole;
  educationalRole?: EducationalRole;
  emptyCourses?: boolean;
  emptySections?: boolean;
  emptyAssignments?: boolean;
  emptyStudents?: boolean;
}

export function cyMockEducationalManagement(
  cy: CypressGlobal,
  options: EducationalMockOptions = {}
): void {
  const {
    gqlQueries = [],
    userRole = UserRole.USER,
    educationalRole = EducationalRole.INSTRUCTOR,
    emptyCourses = false,
    emptySections = false,
    emptyAssignments = false,
    emptyStudents = false,
  } = options;

  cySetup(cy);
  cyMockLogin(cy);
  cyMockGoogleDoc(cy);
  cyMockCreateNewDoc(cy);
  cyMockGetDocTimeline(cy, {
    response: realExampleDocumentTimeline,
  });

  // Choose appropriate responses based on role and empty flags
  const coursesResponse = emptyCourses 
    ? fetchCoursesResponseEmpty 
    : educationalRole === EducationalRole.INSTRUCTOR 
      ? fetchCoursesResponseInstructor 
      : fetchCoursesResponseStudent;

  const sectionsResponse = emptySections 
    ? fetchSectionsResponseEmpty 
    : educationalRole === EducationalRole.INSTRUCTOR 
      ? fetchSectionsResponseInstructor 
      : fetchSectionsResponseStudent;

  const assignmentsResponse = emptyAssignments 
    ? fetchAssignmentsResponseEmpty 
    : educationalRole === EducationalRole.INSTRUCTOR 
      ? fetchAssignmentsResponseInstructor 
      : fetchAssignmentsResponseStudent;

  const studentsResponse = emptyStudents 
    ? fetchStudentsResponseEmpty 
    : fetchStudentsResponseInstructor;

  const userDataResponse = educationalRole === EducationalRole.INSTRUCTOR
    ? createNewInstructorResponse
    : emptyCourses
      ? createNewStudentEmptyResponse
      : createNewStudentResponse;

  cyInterceptGraphQL(cy, [
    ...(Array.isArray(gqlQueries) ? gqlQueries : [gqlQueries]),
    // Authentication
    mockGQL('RefreshAccessToken', refreshAccessTokenResponse(userRole, undefined, educationalRole)),
    
    // Configuration
    mockGQL('FetchConfig', fetchConfigResponse),
    
    // Educational Management - Fetch Operations
    mockGQL('FetchCourses', coursesResponse),
    mockGQL('FetchSections', sectionsResponse),
    mockGQL('FetchAssignments', assignmentsResponse),
    mockGQL('FetchStudentsInMyCourses', studentsResponse),
    mockGQL('FetchInstructors', fetchInstructorsResponseEmpty),
    // User Data
    mockGQL('CreateNewInstructor', userDataResponse),
    mockGQL('CreateNewStudent', userDataResponse),
    
    // Course Operations
    mockGQL('AddOrUpdateCourse', [
      createCourseResponse,
      updateCourseResponse,
      deleteCourseResponse,
    ]),
    
    // Section Operations
    mockGQL('AddOrUpdateSection', [
      createSectionResponse,
      updateSectionResponse,
      deleteSectionResponse,
    ]),
    
    // Assignment Operations
    mockGQL('AddOrUpdateAssignment', [
      createAssignmentResponse,
      updateAssignmentResponse,
      deleteAssignmentResponse,
    ]),
    
    // Enrollment Operations
    mockGQL('ModifySectionEnrollment', [
      enrollInSectionResponse,
      removeFromSectionResponse,
    ]),
    
    // Student Progress
    mockGQL('ModifyStudentAssignmentProgress', updateStudentProgressResponse),
    
    // Built Activities (for assignment activities)
    mockGQL('FetchBuiltActivities', fetchBuiltActivitiesResponse),


    //
    mockGQL('FetchVersionsById', fetchDocVersionsBuilder([])),
    mockGQL('FetchGoogleDocs', fetchGoogleDocsResponse(DocService.GOOGLE_DOCS)),
    mockGQL('FetchPrompts', fetchPromptTemplates),
    mockGQL('FetchConfig', fetchConfigResponse),
    mockGQL('FetchDocGoals', fetchDocGoalsResponse),
    mockGQL('FetchSystemPrompts', fetchConfigResponse),
    mockGQL('StoreUserDoc', storeUserDocResponse(gDocWithAllIntentions)),
    mockGQL('FetchActivities', fetchActivitiesResponse),
    mockGQL('FetchBuiltActivities', fetchBuiltActivitiesResponse),
    mockGQL('FetchBuiltActivityVersions', {fetchBuiltActivityVersions: {
      edges: []
    }}),
  ]);
}