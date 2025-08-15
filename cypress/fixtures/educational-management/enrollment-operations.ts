/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { StudentData } from './educational-types';
import { testStudent } from './fetch-students';

// Student after enrolling in section
export const studentAfterEnrollment: StudentData = {
  ...testStudent,
  enrolledCourses: ['course-123'],
  enrolledSections: ['section-456'],
  assignmentProgress: []
};

// Student after removing from section (empty enrollments)
export const studentAfterRemoval: StudentData = {
  ...testStudent,
  enrolledCourses: [],
  enrolledSections: [],
  assignmentProgress: []
};

// Student with updated activity progress
export const studentWithUpdatedProgress: StudentData = {
  ...testStudent,
  enrolledCourses: ['course-123'],
  enrolledSections: ['section-456'],
  assignmentProgress: [
    {
      assignmentId: 'assignment-123',
      activityCompletions: [
        { activityId: 'my-editable-activity', complete: true },
        { activityId: 'my-read-only-activity', complete: true }
      ]
    }
  ]
};

export interface ModifySectionEnrollmentResponse {
  modifySectionEnrollment: StudentData;
}

export interface ModifyStudentAssignmentProgressResponse {
  modifyStudentAssignmentProgress: StudentData;
}

export const enrollInSectionResponse: ModifySectionEnrollmentResponse = {
  modifySectionEnrollment: studentAfterEnrollment
};

export const removeFromSectionResponse: ModifySectionEnrollmentResponse = {
  modifySectionEnrollment: studentAfterRemoval
};

export const updateStudentProgressResponse: ModifyStudentAssignmentProgressResponse = {
  modifyStudentAssignmentProgress: studentWithUpdatedProgress
};