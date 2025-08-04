/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { ACCESS_TOKEN_KEY, localStorageGet } from '../../local-storage';
import { execGql } from '../../../hooks/api';

// TypeScript interface for Course
export interface Course {
  _id: string;
  title: string;
  description: string;
  instructorId: string;
  sectionIds: string[];
}

// TypeScript interface for Assignment
export interface Assignment {
  _id: string;
  title: string;
  description: string;
  activityIds: string[];
  instructorId: string;
}

// TypeScript interface for Section
export interface SectionAssignment {
  assignmentId: string;
  mandatory: boolean;
}

export interface Section {
  _id: string;
  title: string;
  sectionCode: string;
  description: string;
  instructorId: string;
  assignments: SectionAssignment[];
  numOptionalAssignmentsRequired: number;
}

// TypeScript interface for StudentData
export interface AssignmentProgress {
  assignmentId: string;
  complete: boolean;
}

export interface StudentData {
  _id: string;
  userId: string;
  enrolledCourses: string[];
  enrolledSections: string[];
  assignmentProgress: AssignmentProgress[];
}

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
  instructorId
`;

// GraphQL query fragment for section data
export const sectionQueryData = `
  _id
  title
  sectionCode
  description
  instructorId
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
  assignmentProgress {
    assignmentId
    complete
  }
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
export async function fetchAssignments(forUserId: string): Promise<Assignment[]> {
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
export async function fetchStudentsInMyCourses(instructorId: string): Promise<StudentData[]> {
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