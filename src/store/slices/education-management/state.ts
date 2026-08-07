/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/

import type { ActivityBuilder } from "../../../components/activity-builder/types";
import type { LoadStatus } from "../doc-goals-activities";
import type {
  Course,
  Assignment,
  Section,
  StudentData,
  Instructor,
} from "./types";

export type CourseViews =
  | "dashboard"
  | "course"
  | "section"
  | "assignment"
  | "activity"
  | "student-info"
  | "activity-document-timelines";

export interface CourseManagementState {
  view: CourseViews;
  previousView?: CourseViews;
  selectedCourseId?: string;
  selectedCourse?: Course;
  selectedSectionId?: string;
  selectedSection?: Section;
  selectedAssignmentId?: string;
  selectedAssignment?: Assignment;
  selectedActivityId?: string;
  selectedActivity?: ActivityBuilder;
  selectedStudentId?: string;
  selectedStudent?: StudentData;
  selectedDocId?: string;
  // selectedDoc?: Doc;
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
  errorMessage?: string;
}

export const initialState: State = {
  courses: [],
  coursesLoadStatus: 0,
  courseModificationStatus: 0,
  assignments: [],
  assignmentsLoadStatus: 0,
  assignmentModificationStatus: 0,
  sections: [],
  sectionsLoadStatus: 0,
  sectionModificationStatus: 0,
  students: [],
  studentsLoadStatus: 0,
  enrollmentModificationStatus: 0,
  instructorData: undefined,
  studentData: undefined,
  educationalDataLoadStatus: 0,
  instructors: [],
  instructorsLoadStatus: 0,
  viewState: {
    view: "dashboard",
    previousView: "dashboard",
  },
  errorMessage: undefined,
};
