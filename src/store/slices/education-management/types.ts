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
  bannedStudentUserIds: string[];
  assignments: SectionAssignment[];
  numOptionalAssignmentsRequired: number;
}

export interface RelevantGoogleDoc {
  docId: string;
  primaryDocument: boolean;
  docData: {
    title: string;
  };
}

export interface ActivityCompletion {
  activityId: string;
  relevantGoogleDocs: RelevantGoogleDoc[];
  complete: boolean;
}

export interface AssignmentProgress {
  assignmentId: string;
  instructorGrade?: {
    grade: number;
    comment: string;
  };
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
  OWNER = 'OWNER',
  SHARED = 'SHARED',
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

export function isStudentData(
  data: StudentData | Instructor
): data is StudentData {
  return 'assignmentProgress' in data;
}

export function isInstructorData(
  data: StudentData | Instructor
): data is Instructor {
  return 'courses' in data;
}
