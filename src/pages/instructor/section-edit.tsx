/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWithEducationalManagement } from '../../store/slices/education-management/use-with-educational-management';
import { Section } from '../../store/slices/education-management/types';
import { TwoOptionDialog } from '../../components/dialog';
import AssignmentListItem from './components/assignment-list-item';
import { sectionViewUrl } from './section-view';
import { courseViewUrl } from './course-view';

export const sectionEditPath = '/section-edit/:courseId/:sectionId';
export const sectionEditUrl = (courseId: string, sectionId: string) =>
  sectionEditPath
    .replace(':courseId', courseId)
    .replace(':sectionId', sectionId);

export const assignmentEditPath = '/assignment-edit/:courseId/:sectionId/:assignmentId';
export const assignmentEditUrl = (courseId: string, sectionId: string, assignmentId: string) =>
  assignmentEditPath
    .replace(':courseId', courseId)
    .replace(':sectionId', sectionId)
    .replace(':assignmentId', assignmentId);

export default function SectionEdit() {
  const { courseId, sectionId } = useParams<{ courseId: string; sectionId: string }>();
  const navigate = useNavigate();
  const {
    courses,
    sections,
    assignments,
    updateSection,
    deleteSection,
    createAssignment,
    isSectionModifying,
    isAssignmentModifying,
  } = useWithEducationalManagement();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    sectionCode: '',
    numOptionalAssignmentsRequired: 0,
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const currentCourse = courses.find((course) => course._id === courseId);
  const currentSection = sections.find((section) => section._id === sectionId);
  
  const requiredAssignments = currentSection
    ? assignments.filter((assignment) =>
        currentSection.assignments.some(
          (sectionAssignment) =>
            sectionAssignment.assignmentId === assignment._id && sectionAssignment.mandatory
        )
      )
    : [];

  const optionalAssignments = currentSection
    ? assignments.filter((assignment) =>
        currentSection.assignments.some(
          (sectionAssignment) =>
            sectionAssignment.assignmentId === assignment._id && !sectionAssignment.mandatory
        )
      )
    : [];

  useEffect(() => {
    if (currentSection) {
      setFormData({
        title: currentSection.title,
        description: currentSection.description,
        sectionCode: currentSection.sectionCode || '',
        numOptionalAssignmentsRequired: currentSection.numOptionalAssignmentsRequired || 0,
      });
    }
  }, [currentSection]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: name === 'numOptionalAssignmentsRequired' ? parseInt(value) || 0 : value 
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseId || !sectionId || !currentSection) return;

    try {
      await updateSection(courseId, {
        _id: sectionId,
        ...formData,
      });
      navigate(-1);
    } catch (error) {
      console.error('Failed to update section:', error);
    }
  };

  const handleDeleteSection = async () => {
    if (!courseId || !sectionId) return;

    try {
      await deleteSection(courseId, sectionId);
      navigate(courseViewUrl(courseId));
    } catch (error) {
      console.error('Failed to delete section:', error);
    }
  };

  const handleCreateRequiredAssignment = async () => {
    if (!courseId) return;

    try {
      const newAssignment = await createAssignment(courseId);
      // Add to section as required assignment
      if (currentSection) {
        const updatedAssignments = [
          ...currentSection.assignments,
          { assignmentId: newAssignment._id, mandatory: true }
        ];
        await updateSection(courseId, {
          _id: sectionId!,
          assignments: updatedAssignments,
        });
      }
      navigate(assignmentEditUrl(courseId, sectionId!, newAssignment._id));
    } catch (error) {
      console.error('Failed to create assignment:', error);
    }
  };

  const handleCreateOptionalAssignment = async () => {
    if (!courseId) return;

    try {
      const newAssignment = await createAssignment(courseId);
      // Add to section as optional assignment
      if (currentSection) {
        const updatedAssignments = [
          ...currentSection.assignments,
          { assignmentId: newAssignment._id, mandatory: false }
        ];
        await updateSection(courseId, {
          _id: sectionId!,
          assignments: updatedAssignments,
        });
      }
      navigate(assignmentEditUrl(courseId, sectionId!, newAssignment._id));
    } catch (error) {
      console.error('Failed to create assignment:', error);
    }
  };

  const handleEditAssignment = (assignmentId: string) => {
    navigate(assignmentEditUrl(courseId!, sectionId!, assignmentId));
  };

  const handleRemoveAssignment = async (assignmentId: string) => {
    if (!courseId || !sectionId || !currentSection) return;

    try {
      const updatedAssignments = currentSection.assignments.filter(
        (sectionAssignment) => sectionAssignment.assignmentId !== assignmentId
      );
      await updateSection(courseId, {
        _id: sectionId,
        assignments: updatedAssignments,
      });
    } catch (error) {
      console.error('Failed to remove assignment from section:', error);
    }
  };

  if (!currentSection) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '400px' 
      }}>
        <p>Section not found</p>
      </div>
    );
  }

  return (
    <div style={{ 
      maxWidth: '80%', 
      margin: '0 auto', 
      padding: '24px' 
    }}>
      <h1 style={{ margin: '0 0 32px 0', color: '#000' }}>Edit Section</h1>

      <form onSubmit={handleSave} style={{ marginBottom: '48px' }}>
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Section Title
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
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Section Code
          </label>
          <input
            type="text"
            name="sectionCode"
            value={formData.sectionCode}
            onChange={handleInputChange}
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
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
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

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Number of Optional Assignments Required
          </label>
          <input
            type="number"
            name="numOptionalAssignmentsRequired"
            value={formData.numOptionalAssignmentsRequired}
            onChange={handleInputChange}
            min="0"
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '16px',
            }}
          />
        </div>

        <button
          type="submit"
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
          {isSectionModifying ? 'Saving...' : 'Save'}
        </button>
      </form>

      <div style={{ marginBottom: '48px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '24px' 
        }}>
          <h2 style={{ margin: '0', color: '#000' }}>Manage Required Assignments</h2>
          <button
            onClick={handleCreateRequiredAssignment}
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
            {isAssignmentModifying ? 'Creating...' : 'Create New Assignment'}
          </button>
        </div>

        <div>
          {requiredAssignments.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '32px', 
              color: '#666',
              border: '1px solid #ccc',
              borderRadius: '8px',
            }}>
              <p>No required assignments. Create your first required assignment!</p>
            </div>
          ) : (
            requiredAssignments.map((assignment) => (
              <AssignmentListItem
                key={assignment._id}
                assignment={assignment}
                onEdit={() => handleEditAssignment(assignment._id)}
                onRemove={() => handleRemoveAssignment(assignment._id)}
                isRemoving={isSectionModifying}
              />
            ))
          )}
        </div>
      </div>

      <div style={{ marginBottom: '48px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '24px' 
        }}>
          <h2 style={{ margin: '0', color: '#000' }}>Manage Optional Assignments</h2>
          <button
            onClick={handleCreateOptionalAssignment}
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
            {isAssignmentModifying ? 'Creating...' : 'Create New Assignment'}
          </button>
        </div>

        <div>
          {optionalAssignments.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '32px', 
              color: '#666',
              border: '1px solid #ccc',
              borderRadius: '8px',
            }}>
              <p>No optional assignments. Create your first optional assignment!</p>
            </div>
          ) : (
            optionalAssignments.map((assignment) => (
              <AssignmentListItem
                key={assignment._id}
                assignment={assignment}
                onEdit={() => handleEditAssignment(assignment._id)}
                onRemove={() => handleRemoveAssignment(assignment._id)}
                isRemoving={isSectionModifying}
              />
            ))
          )}
        </div>
      </div>

      <div style={{ 
        display: 'flex', 
        gap: '16px', 
        paddingTop: '24px', 
        borderTop: '1px solid #ccc' 
      }}>
        <button
          onClick={() => setShowDeleteConfirm(true)}
          disabled={isSectionModifying}
          style={{
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 24px',
            fontSize: '16px',
            cursor: isSectionModifying ? 'not-allowed' : 'pointer',
            opacity: isSectionModifying ? 0.6 : 1,
          }}
        >
          Delete Section
        </button>
      </div>

      <TwoOptionDialog
        title={`Delete section "${currentSection.title}"?`}
        open={showDeleteConfirm}
        actionInProgress={isSectionModifying}
        option1={{
          display: 'Cancel',
          onClick: () => setShowDeleteConfirm(false),
        }}
        option2={{
          display: 'Delete',
          onClick: handleDeleteSection,
        }}
      />
    </div>
  );
}