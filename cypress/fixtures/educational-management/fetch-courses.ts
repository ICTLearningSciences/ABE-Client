/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { Course } from './educational-types';

export const testCourse: Course = {
  _id: 'course-123',
  title: 'Introduction to Computer Science',
  description: 'A comprehensive introduction to computer science principles and programming fundamentals.',
  courseCode: 'CS101',
  sectionIds: ['section-456', 'section-789']
};

export const testCourse2: Course = {
  _id: 'course-456',
  title: 'Advanced Programming',
  description: 'Advanced topics in programming including data structures and algorithms.',
  courseCode: 'CS201',
  sectionIds: ['section-abc']
};

export interface FetchCoursesResponse {
  fetchCourses: Course[];
}

export const fetchCoursesResponseInstructor: FetchCoursesResponse = {
  fetchCourses: [testCourse, testCourse2]
};

export const fetchCoursesResponseStudent: FetchCoursesResponse = {
  fetchCourses: [testCourse]
};

export const fetchCoursesResponseEmpty: FetchCoursesResponse = {
  fetchCourses: []
};