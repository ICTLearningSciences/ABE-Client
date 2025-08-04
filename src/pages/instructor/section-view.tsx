/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWithEducationalManagement } from '../../store/slices/education-management/use-with-educational-management';
import AssignmentViewItem from './components/assignment-view-item';

export const sectionViewPath = '/section-view/:courseId/:sectionId';
export const sectionViewUrl = (courseId: string, sectionId: string) =>
  sectionViewPath
    .replace(':courseId', courseId)
    .replace(':sectionId', sectionId);

export const sectionEditPath = '/section-edit/:courseId/:sectionId';
export const sectionEditUrl = (courseId: string, sectionId: string) =>
  sectionEditPath
    .replace(':courseId', courseId)
    .replace(':sectionId', sectionId);

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

export default function SectionView() {
  const { courseId, sectionId } = useParams<{
    courseId: string;
    sectionId: string;
  }>();
  const navigate = useNavigate();
  const { sections, assignments } = useWithEducationalManagement();

  const currentSection = sections.find((section) => section._id === sectionId);

  const requiredAssignments = currentSection
    ? assignments.filter((assignment) =>
        currentSection.assignments.some(
          (sectionAssignment) =>
            sectionAssignment.assignmentId === assignment._id &&
            sectionAssignment.mandatory
        )
      )
    : [];

  const optionalAssignments = currentSection
    ? assignments.filter((assignment) =>
        currentSection.assignments.some(
          (sectionAssignment) =>
            sectionAssignment.assignmentId === assignment._id &&
            !sectionAssignment.mandatory
        )
      )
    : [];

  const handleEditSection = () => {
    if (courseId && sectionId) {
      navigate(sectionEditUrl(courseId, sectionId));
    }
  };

  const handleAssignmentClick = (assignmentId: string) => {
    if (courseId && sectionId) {
      navigate(assignmentViewUrl(courseId, sectionId, assignmentId));
    }
  };

  if (!currentSection) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '400px',
        }}
      >
        <p>Section not found</p>
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
            <h1 style={{ margin: '0 0 8px 0', color: '#000' }}>
              {currentSection.title}
            </h1>
            <p
              style={{
                margin: '0 0 16px 0',
                color: '#666',
                fontSize: '18px',
                fontWeight: 'bold',
              }}
            >
              {currentSection.description}
            </p>
            {currentSection.sectionCode && (
              <p
                style={{
                  margin: '0 0 16px 0',
                  color: '#666',
                  fontSize: '18px',
                  fontWeight: 'bold',
                }}
              >
                Section Code: {currentSection.sectionCode}
              </p>
            )}
            {currentSection.description && (
              <p
                style={{
                  margin: '0',
                  color: '#333',
                  fontSize: '16px',
                  lineHeight: '1.5',
                }}
              >
                {currentSection.description}
              </p>
            )}
          </div>
          <button
            onClick={handleEditSection}
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
            Edit Section
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '48px' }}>
        <h2
          style={{
            margin: '0 0 24px 0',
            color: '#000',
            borderBottom: '2px solid #1B6A9C',
            paddingBottom: '8px',
          }}
        >
          Required Assignments
        </h2>

        {requiredAssignments.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '32px',
              color: '#666',
              border: '1px solid #ccc',
              borderRadius: '8px',
            }}
          >
            <p>No required assignments in this section.</p>
          </div>
        ) : (
          requiredAssignments.map((assignment) => (
            <AssignmentViewItem
              key={assignment._id}
              assignment={assignment}
              onClick={() => handleAssignmentClick(assignment._id)}
            />
          ))
        )}
      </div>

      <div>
        <h2
          style={{
            margin: '0 0 16px 0',
            color: '#000',
            borderBottom: '2px solid #1B6A9C',
            paddingBottom: '8px',
          }}
        >
          Optional Assignments
        </h2>

        {optionalAssignments.length > 0 && (
          <p
            style={{
              margin: '0 0 24px 0',
              color: '#333',
              fontSize: '16px',
              fontWeight: 'bold',
            }}
          >
            **Student must complete{' '}
            {currentSection.numOptionalAssignmentsRequired} of the optional
            assignments below.**
          </p>
        )}

        {optionalAssignments.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '32px',
              color: '#666',
              border: '1px solid #ccc',
              borderRadius: '8px',
            }}
          >
            <p>No optional assignments in this section.</p>
          </div>
        ) : (
          optionalAssignments.map((assignment) => (
            <AssignmentViewItem
              key={assignment._id}
              assignment={assignment}
              onClick={() => handleAssignmentClick(assignment._id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
