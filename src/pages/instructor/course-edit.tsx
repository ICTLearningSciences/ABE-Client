/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWithEducationalManagement } from '../../store/slices/education-management/use-with-educational-management';
import { TwoOptionDialog } from '../../components/dialog';
import SectionListItem from './components/section-list-item';
import { instructorDashboardUrl } from './dashboard';
import { Course } from '../../store/slices/education-management/types';
import { sectionViewUrl } from './section-view';

export const courseEditPath = '/course-edit/:courseId/edit';
export const courseViewPath = '/course-view/:courseId/view';

export const courseEditUrl = (courseId: string) =>
  courseEditPath.replace(':courseId', courseId);
export const courseViewUrl = (courseId: string) =>
  courseViewPath.replace(':courseId', courseId);

export default function CourseEdit() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const {
    courses,
    sections,
    updateCourse,
    deleteCourse,
    createSection,
    isLoading,
    isCourseModifying,
    isSectionModifying,
  } = useWithEducationalManagement();

  const [formData, setFormData] = useState<Partial<Course>>({
    title: '',
    description: '',
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const mode = location.pathname.endsWith('/edit') ? 'edit' : 'view';
  const currentCourse = courses.find((course) => course._id === courseId);
  const courseSections = sections.filter(
    (section) => currentCourse?.sectionIds.includes(section._id)
  );

  useEffect(() => {
    if (currentCourse) {
      setFormData({
        title: currentCourse.title,
        description: currentCourse.description,
      });
    }
  }, [currentCourse]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseId || !currentCourse) return;

    try {
      await updateCourse({
        _id: courseId,
        ...formData,
      });
      navigate(-1);
    } catch (error) {
      console.error('Failed to update course:', error);
    }
  };

  const handleDeleteCourse = async () => {
    if (!courseId) return;

    try {
      await deleteCourse(courseId);
      navigate(instructorDashboardUrl);
    } catch (error) {
      console.error('Failed to delete course:', error);
    }
  };

  const handleCreateSection = async () => {
    if (!courseId) return;

    try {
      const newSection = await createSection(courseId);
      navigate(sectionViewUrl(courseId, newSection._id));
    } catch (error) {
      console.error('Failed to create section:', error);
    }
  };

  const handleEditSection = (sectionId: string) => {
    navigate(sectionViewUrl(courseId!, sectionId));
  };

  const handleRemoveSection = async (sectionId: string) => {
    if (!courseId || !currentCourse) return;

    try {
      const updatedSectionIds = currentCourse.sectionIds.filter(
        (id) => id !== sectionId
      );
      await updateCourse({
        _id: courseId,
        sectionIds: updatedSectionIds,
      });
    } catch (error) {
      console.error('Failed to remove section from course:', error);
    }
  };

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '400px',
        }}
      >
        <p>Loading course...</p>
      </div>
    );
  }

  if (!currentCourse) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '400px',
        }}
      >
        <p>Course not found</p>
      </div>
    );
  }

  return (
    <div
      key={`${window.location.pathname}-${mode}`}
      style={{
        maxWidth: '80%',
        margin: '0 auto',
        padding: '24px',
      }}
    >
      <h1 style={{ margin: '0 0 32px 0', color: '#000' }}>Edit Course</h1>

      <form onSubmit={handleSave} style={{ marginBottom: '48px' }}>
        <div style={{ marginBottom: '24px' }}>
          <label
            style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: 'bold',
            }}
          >
            Course Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '16px',
            }}
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label
            style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: 'bold',
            }}
          >
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '16px',
              resize: 'vertical',
            }}
          />
        </div>

        <button
          type="submit"
          disabled={isCourseModifying}
          style={{
            backgroundColor: '#1B6A9C',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 24px',
            fontSize: '16px',
            cursor: isCourseModifying ? 'not-allowed' : 'pointer',
            opacity: isCourseModifying ? 0.6 : 1,
          }}
        >
          {isCourseModifying ? 'Saving...' : 'Save'}
        </button>
      </form>

      <div style={{ marginBottom: '48px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
          }}
        >
          <h2 style={{ margin: '0', color: '#000' }}>Manage Sections</h2>
          <button
            onClick={handleCreateSection}
            disabled={isSectionModifying}
            style={{
              backgroundColor: '#1B6A9C',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '16px',
              cursor: isSectionModifying ? 'not-allowed' : 'pointer',
              opacity: isSectionModifying ? 0.6 : 1,
            }}
          >
            {isSectionModifying ? 'Creating...' : 'Create New Section'}
          </button>
        </div>

        <div>
          {courseSections.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '48px',
                color: '#666',
                border: '1px solid #ccc',
                borderRadius: '8px',
              }}
            >
              <p>
                No sections found. Create your first section to get started!
              </p>
            </div>
          ) : (
            courseSections.map((section) => (
              <SectionListItem
                key={section._id}
                section={section}
                onEdit={() => handleEditSection(section._id)}
                onRemove={() => handleRemoveSection(section._id)}
                isRemoving={isCourseModifying}
              />
            ))
          )}
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          gap: '16px',
          paddingTop: '24px',
          borderTop: '1px solid #ccc',
        }}
      >
        <button
          onClick={() => setShowDeleteConfirm(true)}
          disabled={isCourseModifying}
          style={{
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 24px',
            fontSize: '16px',
            cursor: isCourseModifying ? 'not-allowed' : 'pointer',
            opacity: isCourseModifying ? 0.6 : 1,
          }}
        >
          Delete Course
        </button>
      </div>

      <TwoOptionDialog
        title={`Delete course "${currentCourse.title}"?`}
        open={showDeleteConfirm}
        actionInProgress={isCourseModifying}
        option1={{
          display: 'Cancel',
          onClick: () => setShowDeleteConfirm(false),
        }}
        option2={{
          display: 'Delete',
          onClick: handleDeleteCourse,
        }}
      />
    </div>
  );
}
