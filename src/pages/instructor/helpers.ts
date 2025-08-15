/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import {
  Assignment,
  AssignmentProgress,
  Section,
  StudentData,
  CourseOwnership,
  Instructor,
  Course,
} from '../../store/slices/education-management/types';
import { UseWithEducationalManagement } from '../../store/slices/education-management/use-with-educational-management';
import { TreeItem, TreeSection } from './components/collapsible-tree';

export const getSectionsForCourse = (
  educationManagement: UseWithEducationalManagement,
  courseId: string
): Section[] => {
  return educationManagement.sections.filter((section) =>
    educationManagement.courses.find(
      (course) =>
        course._id === courseId && course.sectionIds.includes(section._id)
    )
  );
};

export const getAssignmentsForSection = (
  educationManagement: UseWithEducationalManagement,
  sectionId: string
): Assignment[] => {
  const section = educationManagement.sections.find((s) => s._id === sectionId);
  if (!section) return [];

  return educationManagement.assignments.filter((assignment) =>
    section.assignments.some((sa) => sa.assignmentId === assignment._id)
  );
};

export function getCourseManagementTreeData(
  educationManagement: UseWithEducationalManagement,
  handleCourseSelect: (courseId: string) => void,
  handleSectionSelect: (courseId: string, sectionId: string) => void,
  handleAssignmentSelect: (
    courseId: string,
    sectionId: string,
    assignmentId: string
  ) => void
): TreeItem[] {
  return educationManagement.courses.map(
    (course): TreeItem => ({
      id: course._id,
      icon: '📚',
      title: course.title,
      onClick: () => handleCourseSelect(course._id),
      subItems: getSectionsForCourse(educationManagement, course._id).map(
        (section): TreeItem => ({
          id: section._id,
          icon: '📑',
          title: section.title,
          onClick: () => handleSectionSelect(course._id, section._id),
          subItems: getAssignmentsForSection(
            educationManagement,
            section._id
          ).map(
            (assignment): TreeItem => ({
              id: assignment._id,
              icon: '📝',
              title: assignment.title,
              onClick: () =>
                handleAssignmentSelect(course._id, section._id, assignment._id),
            })
          ),
        })
      ),
    })
  );
}

export function getCourseManagementSectionedTreeData(
  educationManagement: UseWithEducationalManagement,
  handleCourseSelect: (courseId: string) => void,
  handleSectionSelect: (courseId: string, sectionId: string) => void,
  handleAssignmentSelect: (
    courseId: string,
    sectionId: string,
    assignmentId: string
  ) => void,
  currentInstructor?: Instructor
): TreeSection[] {
  if (!currentInstructor) {
    return [];
  }

  const createCourseTreeItem = (course: Course): TreeItem => ({
    id: course._id,
    icon: '📚',
    title: course.title,
    onClick: () => handleCourseSelect(course._id),
    subItems: getSectionsForCourse(educationManagement, course._id).map(
      (section): TreeItem => ({
        id: section._id,
        icon: '📑',
        title: section.title,
        onClick: () => handleSectionSelect(course._id, section._id),
        subItems: getAssignmentsForSection(
          educationManagement,
          section._id
        ).map(
          (assignment): TreeItem => ({
            id: assignment._id,
            icon: '📝',
            title: assignment.title,
            onClick: () =>
              handleAssignmentSelect(course._id, section._id, assignment._id),
          })
        ),
      })
    ),
  });

  // Separate owned and shared courses
  const ownedCourseIds = currentInstructor.courses
    .filter((courseData) => courseData.ownership === CourseOwnership.OWNER)
    .map((courseData) => courseData.courseId);

  const sharedCourseIds = currentInstructor.courses
    .filter((courseData) => courseData.ownership === CourseOwnership.SHARED)
    .map((courseData) => courseData.courseId);

  const ownedCourses = educationManagement.courses
    .filter((course) => ownedCourseIds.includes(course._id))
    .map(createCourseTreeItem);

  const sharedCourses = educationManagement.courses
    .filter((course) => sharedCourseIds.includes(course._id))
    .map(createCourseTreeItem);

  const sections: TreeSection[] = [];

  if (ownedCourses.length > 0) {
    sections.push({
      id: 'my-courses',
      title: 'My Courses',
      items: ownedCourses,
    });
  }

  if (sharedCourses.length > 0) {
    sections.push({
      id: 'shared-courses',
      title: 'Courses Shared with Me',
      items: sharedCourses,
    });
  }

  return sections;
}

export interface CompletedAssignmentDict {
  [assignmentId: string]: boolean;
}

export function isAssignmentComplete(
  assignmentProgress: AssignmentProgress
): boolean {
  return assignmentProgress.activityCompletions.every((ac) => ac.complete);
}

export function getCompletedAssignmentDictForStudent(
  studentData?: StudentData
): CompletedAssignmentDict {
  if (!studentData) return {};
  return studentData.assignmentProgress.reduce(
    (acc: CompletedAssignmentDict, progress: AssignmentProgress) => {
      acc[progress.assignmentId] = isAssignmentComplete(progress);
      return acc;
    },
    {}
  );
}

export interface AssignmentsInSection {
  requiredAssignments: Assignment[];
  optionalAssignments: Assignment[];
}

export function getAssignmentsInSection(
  assignments: Assignment[],
  section?: Section
): AssignmentsInSection {
  if (!section) {
    return {
      requiredAssignments: [],
      optionalAssignments: [],
    };
  }
  const _requiredAssignments = section.assignments.filter((sa) => sa.mandatory);
  const _optionalAssignments = section.assignments.filter(
    (sa) => !sa.mandatory
  );
  return {
    requiredAssignments: _requiredAssignments.reduce((acc, sa) => {
      const assignment = assignments.find((a) => a._id === sa.assignmentId);
      if (assignment) {
        acc.push(assignment);
      }
      return acc;
    }, [] as Assignment[]),
    optionalAssignments: _optionalAssignments.reduce((acc, sa) => {
      const assignment = assignments.find((a) => a._id === sa.assignmentId);
      if (assignment) {
        acc.push(assignment);
      }
      return acc;
    }, [] as Assignment[]),
  };
}

// takes a student and a section and returns a dict
export interface StudentSectionProgress {
  studentData: StudentData;
  requiredAssignmentsProgress: {
    [assignmentId: string]: boolean;
  };
  optionalAssignmentsProgress: {
    [assignmentId: string]: boolean;
  };
}

export function getStudentSectionProgress(
  studentData: StudentData,
  assignments: AssignmentsInSection
): StudentSectionProgress {
  const { requiredAssignments, optionalAssignments } = assignments;
  const requiredAssignmentsProgress = requiredAssignments.reduce(
    (acc, assignment) => {
      const assignmentProgress = studentData.assignmentProgress.find(
        (ap) => ap.assignmentId === assignment._id
      );
      acc[assignment._id] = assignmentProgress
        ? isAssignmentComplete(assignmentProgress)
        : false;
      return acc;
    },
    {} as { [assignmentId: string]: boolean }
  );
  const optionalAssignmentsProgress = optionalAssignments.reduce(
    (acc, assignment) => {
      const assignmentProgress = studentData.assignmentProgress.find(
        (ap) => ap.assignmentId === assignment._id
      );
      acc[assignment._id] = assignmentProgress
        ? isAssignmentComplete(assignmentProgress)
        : false;
      return acc;
    },
    {} as { [assignmentId: string]: boolean }
  );
  return {
    studentData,
    requiredAssignmentsProgress,
    optionalAssignmentsProgress,
  };
}
