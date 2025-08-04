/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWithEducationalManagement } from '../../store/slices/education-management/use-with-educational-management';
import ActivityViewItem from './components/activity-view-item';

export const assignmentViewPath =
  '/assignment-view/:courseId/:sectionId/:assignmentId';
export const assignmentViewUrl = (
  courseId: string,
  sectionId: string,
  assignmentId: string
) =>
  assignmentViewPath
    .replace(':courseId', courseId)
    .replace(':sectionId', sectionId)
    .replace(':assignmentId', assignmentId);

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

export default function AssignmentView() {
  const { courseId, sectionId, assignmentId } = useParams<{
    courseId: string;
    sectionId: string;
    assignmentId: string;
  }>();
  const navigate = useNavigate();
  const { assignments } = useWithEducationalManagement();

  const currentAssignment = assignments.find(
    (assignment) => assignment._id === assignmentId
  );

  const handleEditAssignment = () => {
    if (courseId && sectionId && assignmentId) {
      navigate(assignmentEditUrl(courseId, sectionId, assignmentId));
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
      <div style={{ marginBottom: '48px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '24px',
          }}
        >
          <div style={{ flex: 1 }}>
            <h1 style={{ margin: '0 0 16px 0', color: '#000' }}>
              {currentAssignment.title || 'New assignment'}
            </h1>
            {currentAssignment.description && (
              <p
                style={{
                  margin: '0',
                  color: '#333',
                  fontSize: '16px',
                  lineHeight: '1.5',
                }}
              >
                {currentAssignment.description}
              </p>
            )}
          </div>
          <button
            onClick={handleEditAssignment}
            style={{
              backgroundColor: '#1B6A9C',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '16px',
              cursor: 'pointer',
              marginLeft: '24px',
              flexShrink: 0,
            }}
          >
            Edit Assignment
          </button>
        </div>
      </div>

      <div>
        <h2
          style={{
            margin: '0 0 24px 0',
            color: '#000',
            borderBottom: '2px solid #1B6A9C',
            paddingBottom: '8px',
          }}
        >
          Activities
        </h2>

        {currentAssignment.activityIds.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '48px',
              color: '#666',
              border: '1px solid #ccc',
              borderRadius: '8px',
            }}
          >
            <p>No activities linked to this assignment yet.</p>
            <p style={{ fontSize: '14px', marginTop: '8px' }}>
              Click &quot;Edit Assignment&quot; to add activities to this
              assignment.
            </p>
          </div>
        ) : (
          currentAssignment.activityIds.map((activityId) => (
            <ActivityViewItem key={activityId} activityId={activityId} />
          ))
        )}
      </div>
    </div>
  );
}
