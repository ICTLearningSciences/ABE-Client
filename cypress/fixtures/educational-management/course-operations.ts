/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { Course } from '../../../src/store/slices/education-management/types';

export const newTestCourse: Course = {
  _id: 'new-course-123',
  title: 'New Test Course',
  description: 'A newly created test course.',
  courseCode: 'TEST101',
  sectionIds: []
};

export const updatedTestCourse: Course = {
  _id: 'course-123',
  title: 'Updated Course Title',
  description: 'An updated course description.',
  courseCode: 'CS101-UPDATED',
  sectionIds: ['section-456', 'section-789']
};

export interface AddOrUpdateCourseResponse {
  addOrUpdateCourse: Course;
}

export const createCourseResponse: AddOrUpdateCourseResponse = {
  addOrUpdateCourse: newTestCourse
};

export const updateCourseResponse: AddOrUpdateCourseResponse = {
  addOrUpdateCourse: updatedTestCourse
};

export const deleteCourseResponse: AddOrUpdateCourseResponse = {
  addOrUpdateCourse: {
    _id: 'course-123',
    title: 'Introduction to Computer Science',
    description: 'A comprehensive introduction to computer science principles and programming fundamentals.',
    courseCode: 'CS101',
    sectionIds: ['section-456', 'section-789']
  }
};