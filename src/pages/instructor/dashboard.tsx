/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useWithEducationalManagement } from '../../store/slices/education-management/use-with-educational-management';
import { Course } from '../../store/slices/education-management/types';

interface CourseListItemProps {
  course: Course;
  onClick: () => void;
}

function CourseListItem({ course, onClick }: CourseListItemProps) {
  return (
    <div
      onClick={onClick}
      style={{
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '16px',
        margin: '8px 0',
        cursor: 'pointer',
        backgroundColor: '#fff',
        transition: 'background-color 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#f5f5f5';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = '#fff';
      }}
    >
      <h3 style={{ margin: '0 0 8px 0', color: '#1B6A9C' }}>{course.title}</h3>
      <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>
        {course.description}
      </p>
    </div>
  );
}

export const instructorDashboardUrl = '/instructor-dashboard';

export default function InstructorDashboard() {
  const navigate = useNavigate();
  const { courses, createCourse, isLoading, isCourseModifying } =
    useWithEducationalManagement();

  const handleCreateCourse = async () => {
    try {
      const newCourse = await createCourse();
      navigate(`/courses/${newCourse._id}/edit`);
    } catch (error) {
      console.error('Failed to create course:', error);
    }
  };

  const handleCourseClick = (courseId: string) => {
    navigate(`/courses/${courseId}`);
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
        <p>Loading courses...</p>
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
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px',
        }}
      >
        <h1 style={{ margin: '0', color: '#000' }}>My Courses</h1>
        <button
          onClick={handleCreateCourse}
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
          {isCourseModifying ? 'Creating...' : 'Create New Course'}
        </button>
      </div>

      <div>
        {courses.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '48px',
              color: '#666',
            }}
          >
            <p>No courses found. Create your first course to get started!</p>
          </div>
        ) : (
          courses.map((course) => (
            <CourseListItem
              key={course._id}
              course={course}
              onClick={() => handleCourseClick(course._id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
