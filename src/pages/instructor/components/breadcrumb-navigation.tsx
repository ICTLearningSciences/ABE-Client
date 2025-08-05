/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React, { useMemo } from 'react';
import { UseWithEducationalManagement } from '../../../store/slices/education-management/use-with-educational-management';
import { CourseManagementState } from '../course-management';

export interface BreadcrumbItem {
  id: string;
  title: string;
  icon: string;
  onClick: () => void;
}

interface BreadcrumbNavigationProps {
  educationManagement: UseWithEducationalManagement;
  viewState: CourseManagementState;
  handleCourseSelect: (courseId: string) => void;
  handleSectionSelect: (courseId: string, sectionId: string) => void;
  handleAssignmentSelect: (courseId: string, sectionId: string, assignmentId: string) => void;
}

const BreadcrumbNavigation: React.FC<BreadcrumbNavigationProps> = ({
  educationManagement,
  viewState,
  handleCourseSelect,
  handleSectionSelect,
  handleAssignmentSelect
}) => {


  const items: BreadcrumbItem[] = useMemo(() => {
    const items: BreadcrumbItem[] = [];

    if (viewState.selectedCourseId) {
      const course = educationManagement.courses.find(c => c._id === viewState.selectedCourseId);
      if (course) {
        items.push({
          id: course._id,
          title: course.title,
          icon: '📚',
          onClick: () => handleCourseSelect(course._id)
        });
      }
    }

    if (viewState.selectedSectionId && viewState.selectedCourseId) {
      const section = educationManagement.sections.find(s => s._id === viewState.selectedSectionId);
      if (section) {
        items.push({
          id: section._id,
          title: section.title,
          icon: '📑',
          onClick: () => handleSectionSelect(viewState.selectedCourseId!, section._id)
        });
      }
    }

    if (viewState.selectedAssignmentId && viewState.selectedCourseId && viewState.selectedSectionId) {
      const assignment = educationManagement.assignments.find(a => a._id === viewState.selectedAssignmentId);
      if (assignment) {
        items.push({
          id: assignment._id,
          title: assignment.title,
          icon: '📝',
          onClick: () => handleAssignmentSelect(viewState.selectedCourseId!, viewState.selectedSectionId!, assignment._id)
        });
      }
    }

    return items;
  }, [viewState, educationManagement.courses, educationManagement.sections, educationManagement.assignments]);

  console.log(items);
  
  if (items.length === 0) {
    return null;
  }

  return (
    <nav 
      style={{
        padding: '12px 0',
        borderBottom: '1px solid #e9ecef',
        marginBottom: '24px',
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        {items.map((item, index) => (
          <React.Fragment key={item.id}>
            <div
              onClick={item.onClick}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 8px',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease',
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f8f9fa';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <span style={{
                fontSize: '14px'
              }}>
                {item.icon}
              </span>
              <span style={{
                fontSize: '14px',
                fontWeight: index === items.length - 1 ? '600' : '500',
                color: index === items.length - 1 ? '#1B6A9C' : '#495057'
              }}>
                {item.title}
              </span>
            </div>
            
            {index < items.length - 1 && (
              <span style={{
                fontSize: '12px',
                color: '#6c757d',
                userSelect: 'none'
              }}>
                →
              </span>
            )}
          </React.Fragment>
        ))}
      </div>
    </nav>
  );
};

export default BreadcrumbNavigation;