/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
export enum EducationalRole {
    INSTRUCTOR = 'INSTRUCTOR',
    STUDENT = 'STUDENT',
  }

export interface Course {
    _id: string;
    title: string;
    description: string;
    courseCode: string;
    sectionIds: string[];
  }
  
  export interface Assignment {
    _id: string;
    title: string;
    description: string;
    activityIds: string[];
  }
  
  export interface SectionAssignment {
    assignmentId: string;
    mandatory: boolean;
  }
  
  export interface Section {
    _id: string;
    title: string;
    sectionCode: string;
    description: string;
    assignments: SectionAssignment[];
    numOptionalAssignmentsRequired: number;
  }
  
  export interface RelevantGoogleDoc {
    docId: string;
    primaryDocument: boolean;
    docData: {
      title: string;
    }
  }
  
  export interface ActivityCompletion {
    activityId: string;
    relevantGoogleDocs: RelevantGoogleDoc[];
    complete: boolean;
  }
  
  export interface AssignmentProgress {
    assignmentId: string;
    activityCompletions: ActivityCompletion[];
  }
  
  export interface StudentData {
    _id: string;
    userId: string;
    enrolledCourses: string[];
    enrolledSections: string[];
    assignmentProgress: AssignmentProgress[];
    name: string;
  }

export enum CourseOwnership {
  OWNER = "OWNER",
  SHARED = "SHARED",
}

export interface CourseData {
  courseId: string;
  ownership: CourseOwnership;
}
  
  export interface Instructor {
    _id: string;
    userId: string;
    courses: CourseData[];
    name: string;
  }
  