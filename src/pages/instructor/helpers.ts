/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import {
  Assignment,
  Section,
} from '../../store/slices/education-management/types';
import { UseWithEducationalManagement } from '../../store/slices/education-management/use-with-educational-management';
import { TreeItem } from './components/collapsible-tree';

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
