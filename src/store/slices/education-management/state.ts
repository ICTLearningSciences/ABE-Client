/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { Course, Assignment, Section, StudentData, Instructor } from './types';

export enum LoadStatus {
  NONE,
  LOADING,
  SUCCEEDED,
  FAILED,
}

export interface CourseManagementState {
  view: 'dashboard' | 'course' | 'section' | 'assignment' | 'activity';
  selectedCourseId?: string;
  selectedSectionId?: string;
  selectedAssignmentId?: string;
  selectedActivityId?: string;
}

export interface State {
  courses: Course[];
  coursesLoadStatus: LoadStatus;
  courseModificationStatus: LoadStatus;
  assignments: Assignment[];
  assignmentsLoadStatus: LoadStatus;
  assignmentModificationStatus: LoadStatus;
  sections: Section[];
  sectionsLoadStatus: LoadStatus;
  sectionModificationStatus: LoadStatus;
  students: StudentData[];
  studentsLoadStatus: LoadStatus;
  enrollmentModificationStatus: LoadStatus;
  instructorData?: Instructor;
  studentData?: StudentData;
  educationalDataLoadStatus: LoadStatus;
  instructors: Instructor[];
  instructorsLoadStatus: LoadStatus;
  viewState: CourseManagementState;
}

export const initialState: State = {
  courses: [],
  coursesLoadStatus: LoadStatus.NONE,
  courseModificationStatus: LoadStatus.NONE,
  assignments: [],
  assignmentsLoadStatus: LoadStatus.NONE,
  assignmentModificationStatus: LoadStatus.NONE,
  sections: [],
  sectionsLoadStatus: LoadStatus.NONE,
  sectionModificationStatus: LoadStatus.NONE,
  students: [],
  studentsLoadStatus: LoadStatus.NONE,
  enrollmentModificationStatus: LoadStatus.NONE,
  instructorData: undefined,
  studentData: undefined,
  educationalDataLoadStatus: LoadStatus.NONE,
  instructors: [],
  instructorsLoadStatus: LoadStatus.NONE,
  viewState: {
    view: 'dashboard',
  },
};
