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

// GraphQL query fragment for course data
export const courseQueryData = `
  _id
  title
  description
  instructorId
  sectionIds
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