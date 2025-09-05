/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { ACCESS_TOKEN_KEY, localStorageGet } from '../../local-storage';
import { execGql } from '../../../hooks/api';
import { Course, Assignment, Section, StudentData, Instructor } from './types';
import { AiServiceModel, Connection, UserDoc } from '../../../types';

// GraphQL query fragment for course data
export const courseQueryData = `
  _id
  title
  description
  instructorId
  sectionIds
`;

// GraphQL query fragment for assignment data
export const assignmentQueryData = `
  _id
  title
  description
  activityIds
  activityOrder
  defaultLLM{
    serviceName
    model
  }
`;

// GraphQL query fragment for section data
export const sectionQueryData = `
  _id
  title
  sectionCode
  description
  bannedStudentUserIds
  assignmentOrder
  assignments {
    assignmentId
    mandatory
  }
  numOptionalAssignmentsRequired
`;

// GraphQL query fragment for student data
export const studentDataQueryData = `
  _id
  userId
  enrolledCourses
  enrolledSections
  name
  assignmentProgress {
    assignmentId
    instructorGrade { 
      grade
      comment
    }
    relevantGoogleDocs {
        docId
        primaryDocument
        docData {
          title
        }
      }
    activityCompletions {
      activityId
      complete
      defaultLLM{
        serviceName
        model
      }
    }
  }
`;

// GraphQL query fragment for instructor data
export const instructorQueryData = `
  _id
  userId
  courses {
    courseId
    ownership
  }
  name
`;

// Fetch courses for a specific user
export async function fetchCourses(forUserId: string): Promise<Course[]> {
  const accessToken = localStorageGet(ACCESS_TOKEN_KEY) || '';
  const res = await execGql<Course[]>(
    {
      query: `
        query FetchCourses($forUserId: ID!) {
          fetchCourses(forUserId: $forUserId) {
            ${courseQueryData}
          }
        }
      `,
      variables: {
        forUserId,
      },
    },
    {
      dataPath: 'fetchCourses',
      accessToken,
    }
  );
  return res;
}

// Fetch assignments for a specific user
export async function fetchAssignments(
  forUserId: string
): Promise<Assignment[]> {
  const accessToken = localStorageGet(ACCESS_TOKEN_KEY) || '';
  const res = await execGql<Assignment[]>(
    {
      query: `
        query FetchAssignments($forUserId: ID!) {
          fetchAssignments(forUserId: $forUserId) {
            ${assignmentQueryData}
          }
        }
      `,
      variables: {
        forUserId,
      },
    },
    {
      dataPath: 'fetchAssignments',
      accessToken,
    }
  );
  return res;
}

// Fetch sections for a specific user
export async function fetchSections(forUserId: string): Promise<Section[]> {
  const accessToken = localStorageGet(ACCESS_TOKEN_KEY) || '';
  const res = await execGql<Section[]>(
    {
      query: `
        query FetchSections($forUserId: ID!) {
          fetchSections(forUserId: $forUserId) {
            ${sectionQueryData}
          }
        }
      `,
      variables: {
        forUserId,
      },
    },
    {
      dataPath: 'fetchSections',
      accessToken,
    }
  );
  return res;
}

// Fetch students in instructor's courses
export async function fetchStudentsInMyCourses(
  instructorId: string
): Promise<StudentData[]> {
  const accessToken = localStorageGet(ACCESS_TOKEN_KEY) || '';
  const res = await execGql<StudentData[]>(
    {
      query: `
        query FetchStudentsInMyCourses($instructorId: ID!) {
          fetchStudentsInMyCourses(instructorId: $instructorId) {
            ${studentDataQueryData}
          }
        }
      `,
      variables: {
        instructorId,
      },
    },
    {
      dataPath: 'fetchStudentsInMyCourses',
      accessToken,
    }
  );
  return res;
}

// Create, modify, or delete a course
export async function addOrUpdateCourse(
  courseData?: Partial<Course>,
  action: 'CREATE' | 'MODIFY' | 'DELETE' = 'CREATE'
): Promise<Course> {
  const accessToken = localStorageGet(ACCESS_TOKEN_KEY) || '';
  const res = await execGql<Course>(
    {
      query: `
        mutation AddOrUpdateCourse($courseData: CourseInputType, $action: CourseAction!) {
          addOrUpdateCourse(courseData: $courseData, action: $action) {
            ${courseQueryData}
          }
        }
      `,
      variables: {
        courseData,
        action,
      },
    },
    {
      dataPath: 'addOrUpdateCourse',
      accessToken,
    }
  );
  return res;
}

// Create, modify, or delete a section
export async function addOrUpdateSection(
  courseId: string,
  sectionData?: Partial<Section>,
  action: 'CREATE' | 'MODIFY' | 'DELETE' = 'CREATE'
): Promise<Section> {
  const accessToken = localStorageGet(ACCESS_TOKEN_KEY) || '';
  const res = await execGql<Section>(
    {
      query: `
        mutation AddOrUpdateSection($courseId: ID!, $sectionData: SectionInputType, $action: SectionAction!) {
          addOrUpdateSection(courseId: $courseId, sectionData: $sectionData, action: $action) {
            ${sectionQueryData}
          }
        }
      `,
      variables: {
        courseId,
        sectionData,
        action,
      },
    },
    {
      dataPath: 'addOrUpdateSection',
      accessToken,
    }
  );
  return res;
}

// Create, modify, or delete an assignment
export async function addOrUpdateAssignment(
  courseId: string,
  assignmentData?: Partial<Assignment>,
  action: 'CREATE' | 'MODIFY' | 'DELETE' = 'CREATE'
): Promise<Assignment> {
  const accessToken = localStorageGet(ACCESS_TOKEN_KEY) || '';
  const res = await execGql<Assignment>(
    {
      query: `
        mutation AddOrUpdateAssignment($courseId: ID!, $assignmentData: AssignmentInputType, $action: AssignmentAction!) {
          addOrUpdateAssignment(courseId: $courseId, assignmentData: $assignmentData, action: $action) {
            ${assignmentQueryData}
          }
        }
      `,
      variables: {
        courseId,
        assignmentData,
        action,
      },
    },
    {
      dataPath: 'addOrUpdateAssignment',
      accessToken,
    }
  );
  return res;
}

// Modify section enrollment (enroll/remove student)
export async function modifySectionEnrollment(
  targetUserId: string,
  action: 'ENROLL' | 'REMOVE',
  courseId?: string,
  sectionId?: string,
  sectionCode?: string
): Promise<StudentData> {
  const accessToken = localStorageGet(ACCESS_TOKEN_KEY) || '';
  const res = await execGql<StudentData>(
    {
      query: `
        mutation ModifySectionEnrollment($targetUserId: ID!, $courseId: ID, $sectionId: ID, $action: SectionEnrollmentAction!, $sectionCode: String) {
          modifySectionEnrollment(targetUserId: $targetUserId, courseId: $courseId, sectionId: $sectionId, action: $action, sectionCode: $sectionCode) {
            ${studentDataQueryData}
          }
        }
      `,
      variables: {
        targetUserId,
        courseId,
        sectionId,
        action,
        sectionCode,
      },
    },
    {
      dataPath: 'modifySectionEnrollment',
      accessToken,
    }
  );
  return res;
}

export enum ModifyStudentAssignmentProgressActions {
  ACTIVITY_STARTED = 'ACTIVITY_STARTED', // if activity not in list, add it with complete false
  ACTIVITY_COMPLETED = 'ACTIVITY_COMPLETED', // if activity in list, set complete to true

  NEW_DOC_CREATED = 'NEW_DOC_CREATED', // if doc not in list, add it with primaryDocument true IF only doc in list, else set primaryDocument to false
  DOC_PRIMARY_STATUS_SET = 'DOC_PRIMARY_STATUS_SET', // if doc in list, update it with primaryDocument
  DOC_DELETED = 'DOC_DELETED', // if doc in list, delete it
  DEFAULT_LLM_SET = 'DEFAULT_LLM_SET', // if activity in list, set defaultLLM
}
// Modify student assignment progress
export async function modifyStudentAssignmentProgress(
  targetUserId: string,
  courseId: string,
  sectionId: string,
  assignmentId: string,
  activityId: string,
  action: ModifyStudentAssignmentProgressActions,
  docId?: string,
  defaultLLM?: AiServiceModel
): Promise<StudentData> {
  const accessToken = localStorageGet(ACCESS_TOKEN_KEY) || '';
  const res = await execGql<StudentData>(
    {
      query: `
        mutation ModifyStudentAssignmentProgress($targetUserId: ID!, $courseId: ID!, $sectionId: ID!, $assignmentId: ID!, $activityId: ID!, $action: String!, $docId: String, $defaultLLM: AiModelServiceInputType) {
          modifyStudentAssignmentProgress(targetUserId: $targetUserId, courseId: $courseId, sectionId: $sectionId, assignmentId: $assignmentId, activityId: $activityId, action: $action, docId: $docId, defaultLLM: $defaultLLM) {
            ${studentDataQueryData}
          }
        }
      `,
      variables: {
        targetUserId,
        courseId,
        sectionId,
        assignmentId,
        activityId,
        action,
        docId,
        defaultLLM,
      },
    },
    {
      dataPath: 'modifyStudentAssignmentProgress',
      accessToken,
    }
  );
  return res;
}

export async function createNewStudent(userId: string): Promise<StudentData> {
  const accessToken = localStorageGet(ACCESS_TOKEN_KEY) || '';
  const res = await execGql<StudentData>(
    {
      query: `
        mutation CreateNewStudent($userId: ID!) {
          createNewStudent(userId: $userId) {
            ${studentDataQueryData}
          }
        }
      `,
      variables: {
        userId,
      },
    },
    {
      dataPath: 'createNewStudent',
      accessToken,
    }
  );
  return res;
}

export async function createNewInstructor(userId: string): Promise<Instructor> {
  const accessToken = localStorageGet(ACCESS_TOKEN_KEY) || '';
  const res = await execGql<Instructor>(
    {
      query: `
        mutation CreateNewInstructor($userId: ID!) {
          createNewInstructor(userId: $userId) {
            ${instructorQueryData}
          }
        }
      `,
      variables: {
        userId,
      },
    },
    {
      dataPath: 'createNewInstructor',
      accessToken,
    }
  );
  return res;
}

const courseShareStatusMutation = `
mutation ModifyCourseShareStatus($instructorId: ID!, $courseId: ID!, $action: ShareCourseWithInstructorAction!) {
  modifyCourseShareStatus(instructorId: $instructorId, courseId: $courseId, action: $action) {
    ${instructorQueryData}
  }
}
`;

export async function modifyCourseShareStatus(
  instructorId: string,
  courseId: string,
  action: 'SHARE' | 'UNSHARE'
): Promise<Instructor> {
  const accessToken = localStorageGet(ACCESS_TOKEN_KEY) || '';
  const res = await execGql<Instructor>(
    {
      query: courseShareStatusMutation,
      variables: {
        instructorId: instructorId,
        courseId: courseId,
        action: action,
      },
    },
    {
      dataPath: 'modifyCourseShareStatus',
      accessToken,
    }
  );
  return res;
}

export async function fetchInstructors(): Promise<Instructor[]> {
  const accessToken = localStorageGet(ACCESS_TOKEN_KEY) || '';
  const res = await execGql<Instructor[]>(
    {
      query: `
    query FetchInstructors {
          fetchInstructors {
            ${instructorQueryData}
          }
        }
      `,
    },
    {
      dataPath: 'fetchInstructors',
      accessToken,
    }
  );
  return res;
}

export enum BanStudentFromSectionAction {
  BAN = 'BAN',
  UNBAN = 'UNBAN',
}

export async function modifyStudentBanInSection(
  sectionId: string,
  studentId: string,
  action: BanStudentFromSectionAction
): Promise<Section> {
  const accessToken = localStorageGet(ACCESS_TOKEN_KEY) || '';
  const res = await execGql<Section>(
    {
      query: `mutation ModifyStudentBanInSection($sectionId: ID!, $studentId: ID!, $action: BanStudentFromSectionAction!) {
          modifyStudentBanInSection(sectionId: $sectionId, studentId: $studentId, action: $action) {
            ${sectionQueryData}
          }
        }`,
      variables: {
        sectionId,
        studentId,
        action,
      },
    },
    {
      dataPath: 'modifyStudentBanInSection',
      accessToken,
    }
  );
  return res;
}

export async function fetchStudentsGoogleDocIds(
  userId: string,
  courseAssignmentId: string
): Promise<string[]> {
  const accessToken = localStorageGet(ACCESS_TOKEN_KEY) || '';
  const res = await execGql<Connection<UserDoc>>(
    {
      query: `query FindAllGoogleDocs($limit: Int, $filter: String, $filterObject: Object, $sortAscending: Boolean, $sortBy: String){
            findAllGoogleDocs(limit: $limit, filter: $filter, filterObject: $filterObject, sortAscending: $sortAscending, sortBy: $sortBy) {
            edges {
                node{
                    user
                    title
                    googleDocId
                    courseAssignmentId
                  }
                }
            }
        }`,
      variables: {
        filterObject: {
          user: userId,
          courseAssignmentId: courseAssignmentId,
        },
      },
    },
    {
      dataPath: 'findAllGoogleDocs',
      accessToken,
    }
  );
  return res.edges.map((edge) => edge.node.googleDocId);
}

export async function gradeStudentAssignment(
  targetUserId: string,
  assignmentId: string,
  grade: number,
  comment: string
): Promise<StudentData> {
  const accessToken = localStorageGet(ACCESS_TOKEN_KEY) || '';
  const res = await execGql<StudentData>(
    {
      query: `
mutation GradeStudentAssignment($studentId: String!, $assignmentId: String!, $grade: Int!, $comment: String) {
          gradeStudentAssignment(studentId: $studentId, assignmentId: $assignmentId, grade: $grade, comment: $comment) {
            ${studentDataQueryData}
          }
        }
      `,
      variables: {
        studentId: targetUserId,
        assignmentId,
        grade,
        comment,
      },
    },
    {
      dataPath: 'gradeStudentAssignment',
      accessToken,
    }
  );
  return res;
}
