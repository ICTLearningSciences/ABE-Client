/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React, { useState, useMemo } from 'react';
import { useWithEducationalManagement } from '../../store/slices/education-management/use-with-educational-management';
import CollapsibleTree, { TreeItem } from './components/collapsible-tree';
import CourseView from './components/course-view';
import SectionView from './components/section-view';
import AssignmentView from './components/assignment-view';
import { getCourseManagementTreeData } from './helpers';

export const courseManagementUrl = '/course-management';

interface CourseManagementState {
  view: 'dashboard' | 'course' | 'section' | 'assignment';
  selectedCourseId?: string;
  selectedSectionId?: string;
  selectedAssignmentId?: string;
}

const CourseManagement: React.FC = () => {
  const educationManagement = useWithEducationalManagement();
  const [viewState, setViewState] = useState<CourseManagementState>({
    view: 'dashboard'
  });

  const handleCreateCourse = async () => {
    try {
      await educationManagement.createCourse();
    } catch (error) {
      console.error('Failed to create course:', error);
    }
  };

  const handleCourseSelect = (courseId: string) => {
    setViewState({
      view: 'course',
      selectedCourseId: courseId
    });
  };

  const handleSectionSelect = (courseId: string, sectionId: string) => {
    setViewState({
      view: 'section',
      selectedCourseId: courseId,
      selectedSectionId: sectionId
    });
  };

  const handleAssignmentSelect = (courseId: string, sectionId: string, assignmentId: string) => {
    setViewState({
      view: 'assignment',
      selectedCourseId: courseId,
      selectedSectionId: sectionId,
      selectedAssignmentId: assignmentId
    });
  };

  const treeData: TreeItem[] = useMemo(() => {
    return getCourseManagementTreeData(educationManagement, handleCourseSelect, handleSectionSelect, handleAssignmentSelect);
  }, [educationManagement.courses, educationManagement.sections, educationManagement.assignments]);

  const getSelectedId = (): string | undefined => {
    if (viewState.selectedAssignmentId) return viewState.selectedAssignmentId;
    if (viewState.selectedSectionId) return viewState.selectedSectionId;
    if (viewState.selectedCourseId) return viewState.selectedCourseId;
    return undefined;
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '1200px',
      height: '100%',
      display: 'flex',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      {/* Sidebar */}
      <div style={{
        width: '300px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px 0 0 8px',
        borderRight: '1px solid #e9ecef',
        padding: '24px 16px'
      }}>
        <div style={{
          marginBottom: '24px'
        }}>
          <h2 style={{
            margin: '0 0 8px 0',
            fontSize: '20px',
            fontWeight: '600',
            color: '#1B6A9C'
          }}>
            Course Management
          </h2>
          <p style={{
            margin: '0',
            fontSize: '14px',
            color: '#6c757d'
          }}>
            Manage your courses, sections, and assignments
          </p>
        </div>

        <button
          onClick={handleCreateCourse}
          disabled={educationManagement.isCourseModifying}
          style={{
            width: '100%',
            padding: '12px 16px',
            backgroundColor: '#1B6A9C',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: educationManagement.isCourseModifying ? 'not-allowed' : 'pointer',
            opacity: educationManagement.isCourseModifying ? 0.6 : 1,
            marginBottom: '24px'
          }}
        >
          + New Course
        </button>

        {/* Course Tree */}
        <div>
          {treeData.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px'
            }}>
              <div style={{
                fontSize: '48px',
                color: '#dee2e6',
                marginBottom: '16px'
              }}>
                📚
              </div>
              <div style={{
                fontSize: '14px',
                color: '#6c757d',
                lineHeight: '1.5'
              }}>
                No courses yet
                <br />
                Create your first course to get started
              </div>
            </div>
          ) : (
            <CollapsibleTree
              items={treeData}
              selectedId={getSelectedId()}
            />
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{
        flex: 1,
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {viewState.view === 'dashboard' && (
          <div style={{
            textAlign: 'center',
            maxWidth: '400px'
          }}>
            <div style={{
              fontSize: '64px',
              color: '#dee2e6',
              marginBottom: '24px'
            }}>
              📖
            </div>
            <h3 style={{
              margin: '0 0 16px 0',
              fontSize: '24px',
              fontWeight: '600',
              color: '#495057'
            }}>
              Course Management
            </h3>
            <p style={{
              margin: '0',
              fontSize: '16px',
              color: '#6c757d',
              lineHeight: '1.5'
            }}>
              Select a course, section, or assignment from the sidebar to view and edit its details. You can also create new items using the buttons in the sidebar.
            </p>
          </div>
        )}

        {viewState.view === 'course' && viewState.selectedCourseId && (
          <CourseView courseId={viewState.selectedCourseId} />
        )}

        {viewState.view === 'section' && viewState.selectedCourseId && viewState.selectedSectionId && (
          <SectionView 
            courseId={viewState.selectedCourseId}
            sectionId={viewState.selectedSectionId}
          />
        )}

        {viewState.view === 'assignment' && viewState.selectedCourseId && viewState.selectedSectionId && viewState.selectedAssignmentId && (
          <AssignmentView 
            courseId={viewState.selectedCourseId}
            sectionId={viewState.selectedSectionId}
            assignmentId={viewState.selectedAssignmentId}
          />
        )}
      </div>
    </div>
  );
};

export default CourseManagement;