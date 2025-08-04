export interface Course {
  _id: string;
  title: string;
  description: string;
  courseCode: string;
  instructorId: string;
  sectionIds: string[];
}

export interface Assignment {
  _id: string;
  title: string;
  description: string;
  activityIds: string[];
  instructorId: string;
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
  instructorId: string;
  assignments: SectionAssignment[];
  numOptionalAssignmentsRequired: number;
}

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

export interface Instructor {
  _id: string;
  userId: string;
  courseIds: string[];
}
