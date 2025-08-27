/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { StudentData } from './educational-types';

export const testStudent: StudentData = {
  _id: 'student-123',
  userId: 'user-123',
  enrolledCourses: ['course-123'],
  enrolledSections: ['section-456'],
  name: 'John Doe',
  assignmentProgress: [
    {
      assignmentId: 'assignment-123',
      activityCompletions: [
        { activityId: 'my-editable-activity', complete: false, relevantGoogleDocs: [
          {
            primaryDocument: false,
            docId:"1LqProM_kIFbMbMfZKzvlgaFNl5ii6z5xwyAsQZ0U87Y"
          },
          {
            primaryDocument: false,
            docId:"1Cu_jvKeZGH9obZ2-39q1mZXg_n6M-DnDmHpgXGmJ2fB"
          }
        ] },
        { activityId: 'my-read-only-activity', complete: false, relevantGoogleDocs: [] }
      ]
    }
  ]
};

export const testStudent2: StudentData = {
  _id: 'student-456',
  userId: 'user-456',
  enrolledCourses: ['course-123'],
  enrolledSections: ['section-789'],
  name: 'Jane Smith',
  assignmentProgress: [
    {
      assignmentId: 'assignment-123',
      activityCompletions: [
        { activityId: 'my-editable-activity', complete: true, relevantGoogleDocs: [] },
        { activityId: 'my-read-only-activity', complete: true, relevantGoogleDocs: [] }
      ]
    }
  ]
};

// Student with no enrollments (for testing enrollment)
export const testStudentEmpty: StudentData = {
  _id: 'student-789',
  userId: 'user-789',
  enrolledCourses: [],
  enrolledSections: [],
  name: 'Bob Johnson',
  assignmentProgress: []
};

export interface FetchStudentsResponse {
  fetchStudentsInMyCourses: StudentData[];
}

export const fetchStudentsResponseInstructor: FetchStudentsResponse = {
  fetchStudentsInMyCourses: [testStudent, testStudent2]
};

export const fetchStudentsResponseEmpty: FetchStudentsResponse = {
  fetchStudentsInMyCourses: []
};