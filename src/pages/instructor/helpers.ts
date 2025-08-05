import { Assignment, Section } from "../../store/slices/education-management/types";
import { UseWithEducationalManagement } from "../../store/slices/education-management/use-with-educational-management";
import { TreeItem } from "./components/collapsible-tree";

const getSectionsForCourse = (educationManagement: UseWithEducationalManagement, courseId: string): Section[] => {
    return educationManagement.sections.filter(section => 
      educationManagement.courses.find(course => 
        course._id === courseId && course.sectionIds.includes(section._id)
      )
    );
  };

  const getAssignmentsForSection = (educationManagement: UseWithEducationalManagement, sectionId: string): Assignment[] => {
    const section = educationManagement.sections.find(s => s._id === sectionId);
    if (!section) return [];
    
    return educationManagement.assignments.filter(assignment =>
      section.assignments.some(sa => sa.assignmentId === assignment._id)
    );
  };

export function getCourseManagementTreeData(educationManagement: UseWithEducationalManagement, handleCourseSelect: (courseId: string) => void, handleSectionSelect: (courseId: string, sectionId: string) => void, handleAssignmentSelect: (courseId: string, sectionId: string, assignmentId: string) => void): TreeItem[] {
    return educationManagement.courses.map((course): TreeItem => ({
        id: course._id,
        icon: '📚',
        title: course.title,
        onClick: () => handleCourseSelect(course._id),
        subItems: getSectionsForCourse(educationManagement, course._id).map((section): TreeItem => ({
          id: section._id,
          icon: '📑',
          title: section.title,
          onClick: () => handleSectionSelect(course._id, section._id),
          subItems: getAssignmentsForSection(educationManagement, section._id).map((assignment): TreeItem => ({
            id: assignment._id,
            icon: '📝',
            title: assignment.title,
            onClick: () => handleAssignmentSelect(course._id, section._id, assignment._id)
          }))
        }))
      }));
}