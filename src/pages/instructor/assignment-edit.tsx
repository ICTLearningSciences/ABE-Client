/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWithEducationalManagement } from '../../store/slices/education-management/use-with-educational-management';
import { TwoOptionDialog } from '../../components/dialog';
import ActivityManager from './components/activity-manager';

export const assignmentEditPath =
  '/assignment-edit/:courseId/:sectionId/:assignmentId';
export const assignmentEditUrl = (
  courseId: string,
  sectionId: string,
  assignmentId: string
) =>
  assignmentEditPath
    .replace(':courseId', courseId)
    .replace(':sectionId', sectionId)
    .replace(':assignmentId', assignmentId);

export default function AssignmentEdit() {
  const { courseId, sectionId, assignmentId } = useParams<{
    courseId: string;
    sectionId: string;
    assignmentId: string;
  }>();
  const navigate = useNavigate();
  const {
    assignments,
    sections,
    updateAssignment,
    deleteAssignment,
    updateSection,
    isAssignmentModifying,
  } = useWithEducationalManagement();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    activityIds: [] as string[],
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const currentAssignment = assignments.find(
    (assignment) => assignment._id === assignmentId
  );
  const currentSection = sections.find((section) => section._id === sectionId);

  useEffect(() => {
    if (currentAssignment) {
      setFormData({
        title: currentAssignment.title,
        description: currentAssignment.description,
        activityIds: [...currentAssignment.activityIds],
      });
    }
  }, [currentAssignment]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleActivityIdsChange = (newActivityIds: string[]) => {
    setFormData((prev) => ({ ...prev, activityIds: newActivityIds }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseId || !assignmentId || !currentAssignment) return;

    try {
      await updateAssignment(courseId, {
        _id: assignmentId,
        ...formData,
      });
      navigate(-1);
    } catch (error) {
      console.error('Failed to update assignment:', error);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleDeleteAssignment = async () => {
    if (!courseId || !sectionId || !assignmentId || !currentSection) return;

    try {
      // Remove assignment from section first
      const updatedAssignments = currentSection.assignments.filter(
        (sectionAssignment) => sectionAssignment.assignmentId !== assignmentId
      );
      await updateSection(courseId, {
        _id: sectionId,
        assignments: updatedAssignments,
      });

      // Then delete the assignment
      await deleteAssignment(courseId, assignmentId);

      navigate(-1);
    } catch (error) {
      console.error('Failed to delete assignment:', error);
    }
  };

  if (!currentAssignment) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '400px',
        }}
      >
        <p>Assignment not found</p>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: '80%',
        margin: '0 auto',
        padding: '24px',
      }}
    >
      <h1 style={{ margin: '0 0 32px 0', color: '#000' }}>Edit Assignment</h1>

      <form onSubmit={handleSave} style={{ marginBottom: '48px' }}>
        <div style={{ marginBottom: '24px' }}>
          <label
            style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: 'bold',
            }}
          >
            Assignment Title
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

        <div style={{ marginBottom: '32px' }}>
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

        <ActivityManager
          activityIds={formData.activityIds}
          onActivityIdsChange={handleActivityIdsChange}
        />

        <div
          style={{
            display: 'flex',
            gap: '16px',
            paddingTop: '24px',
            borderTop: '1px solid #ccc',
          }}
        >
          <button
            type="submit"
            disabled={isAssignmentModifying}
            style={{
              backgroundColor: '#1B6A9C',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '16px',
              cursor: isAssignmentModifying ? 'not-allowed' : 'pointer',
              opacity: isAssignmentModifying ? 0.6 : 1,
            }}
          >
            {isAssignmentModifying ? 'Saving...' : 'Save'}
          </button>

          <button
            type="button"
            onClick={handleCancel}
            disabled={isAssignmentModifying}
            style={{
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '16px',
              cursor: isAssignmentModifying ? 'not-allowed' : 'pointer',
              opacity: isAssignmentModifying ? 0.6 : 1,
            }}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            disabled={isAssignmentModifying}
            style={{
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '16px',
              cursor: isAssignmentModifying ? 'not-allowed' : 'pointer',
              opacity: isAssignmentModifying ? 0.6 : 1,
            }}
          >
            Delete Assignment
          </button>
        </div>
      </form>

      <TwoOptionDialog
        title={`Delete assignment "${currentAssignment.title}"?`}
        open={showDeleteConfirm}
        actionInProgress={isAssignmentModifying}
        option1={{
          display: 'Cancel',
          onClick: () => setShowDeleteConfirm(false),
        }}
        option2={{
          display: 'Delete',
          onClick: handleDeleteAssignment,
        }}
      />
    </div>
  );
}
