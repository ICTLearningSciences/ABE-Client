/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
/*
This software is Copyright ©️ 2020 The University of Southern Carolina. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWithEducationalManagement } from '../../store/slices/education-management/use-with-educational-management';
import SectionViewItem from './components/section-view-item';
import { sectionViewUrl } from './section-view';

export const courseEditPath = '/course-edit/:courseId/edit';
export const courseViewPath = '/course-view/:courseId/view';

export const courseEditUrl = (courseId: string) =>
  courseEditPath.replace(':courseId', courseId);
export const courseViewUrl = (courseId: string) =>
  courseViewPath.replace(':courseId', courseId);

export default function CourseView() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { courses, sections } = useWithEducationalManagement();
  const mode = location.pathname.endsWith('/edit') ? 'edit' : 'view';
  const currentCourse = courses.find((course) => course._id === courseId);
  const courseSections = sections.filter(
    (section) => currentCourse?.sectionIds.includes(section._id)
  );

  const handleEditCourse = () => {
    if (courseId) {
      navigate(courseEditUrl(courseId));
    }
  };

  const handleSectionClick = (sectionId: string) => {
    if (courseId) {
      navigate(sectionViewUrl(courseId, sectionId));
    }
  };

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
              {currentCourse.title}
            </h1>
            {currentCourse.courseCode && (
              <p
                style={{
                  margin: '0 0 16px 0',
                  color: '#666',
                  fontSize: '18px',
                  fontWeight: 'bold',
                }}
              >
                Course Code: {currentCourse.courseCode}
              </p>
            )}
            {currentCourse.description && (
              <p
                style={{
                  margin: '0',
                  color: '#333',
                  fontSize: '16px',
                  lineHeight: '1.5',
                }}
              >
                {currentCourse.description}
              </p>
            )}
          </div>
          <button
            onClick={handleEditCourse}
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
            Edit Course
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
          Sections
        </h2>

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
            <p>No sections in this course yet.</p>
            <p style={{ fontSize: '14px', marginTop: '8px' }}>
              Click &quot;Edit Course&quot; to add sections to this course.
            </p>
          </div>
        ) : (
          courseSections.map((section) => (
            <SectionViewItem
              key={section._id}
              section={section}
              onClick={() => handleSectionClick(section._id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
