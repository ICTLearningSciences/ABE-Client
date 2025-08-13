/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { ACCESS_TOKEN_KEY, localStorageGet } from '../../local-storage';
import { execGql } from '../../../hooks/api';
import {
  Course,
  Assignment,
  Section,
  StudentData,
  Instructor,
  ActivityCompletion,
} from './types';

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
`;

// GraphQL query fragment for section data
export const sectionQueryData = `
  _id
  title
  sectionCode
  description
  bannedStudentUserIds
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
    activityCompletions {
      activityId
      complete
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

// Modify student assignment progress
export async function modifyStudentAssignmentProgress(
  targetUserId: string,
  courseId: string,
  sectionId: string,
  assignmentId: string,
  activityCompletions: ActivityCompletion[]
): Promise<StudentData> {
  const accessToken = localStorageGet(ACCESS_TOKEN_KEY) || '';
  const res = await execGql<StudentData>(
    {
      query: `
        mutation ModifyStudentAssignmentProgress($targetUserId: ID!, $courseId: ID!, $sectionId: ID!, $assignmentId: ID!, $activityCompletions: [ActivityCompletionInputType!]!) {
          modifyStudentAssignmentProgress(targetUserId: $targetUserId, courseId: $courseId, sectionId: $sectionId, assignmentId: $assignmentId, activityCompletions: $activityCompletions) {
            ${studentDataQueryData}
          }
        }
      `,
      variables: {
        targetUserId,
        courseId,
        sectionId,
        assignmentId,
        activityCompletions,
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
