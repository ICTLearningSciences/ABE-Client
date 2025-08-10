/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/

import { cyMockEducationalManagement } from '../helpers/educational-management-functions';
import { UserRole } from '../helpers/types';
import { EducationalRole } from '../../src/types';
import { mockGQL } from '../helpers/functions';
import { createAssignmentResponse, deleteAssignmentResponse, newTestAssignment, updateAssignmentResponse, updatedTestAssignment } from '../fixtures/educational-management/assignment-operations';
import { fetchCoursesResponseEmpty, fetchCoursesResponseStudent, removeFromSectionResponse, studentAfterRemoval, updatedTestSection, updateTestSectionWithAssignmentsResponse } from '../fixtures/educational-management';

describe('Course Management', () => {
  
  describe('Initial View', () => {
    it('Instructors see course management page on login', () => {
      cyMockEducationalManagement(cy, {
        userRole: UserRole.USER,
        educationalRole: EducationalRole.INSTRUCTOR
      });
      
      cy.visit('/course-management');
      
      // Wait for initial load
      cy.wait('@RefreshAccessToken');
      cy.wait('@FetchConfig');
      cy.wait('@CreateNewInstructor');
      
      // Check instructor-specific elements
      cy.get('[data-cy=course-management-title]').should('contain.text', 'Course Management');
      cy.get('[data-cy=course-management-description]').should('contain.text', 'Manage your courses, sections, and assignments');
      cy.get('[data-cy=new-course-button]').should('be.visible');
      cy.get('[data-cy=join-section-button]').should('not.exist');
    });

    it('Students see course viewing page on login', () => {
      cyMockEducationalManagement(cy, {
        userRole: UserRole.USER,
        educationalRole: EducationalRole.STUDENT
      });
      
      cy.visit('/course-management');
      
      // Wait for initial load
      cy.wait('@RefreshAccessToken');
      cy.wait('@FetchConfig');
      cy.wait('@CreateNewStudent');
      
      // Check student-specific elements
      cy.get('[data-cy=course-management-title]').should('contain.text', 'My Courses');
      cy.get('[data-cy=course-management-description]').should('contain.text', 'View your enrolled courses, sections, and assignments');
      cy.get('[data-cy=join-section-button]').should('be.visible');
      cy.get('[data-cy=new-course-button]').should('not.exist');
    });
  });

  describe('Course CRUD Operations', () => {
    it('Instructors can CRUD a new course', () => {
      cyMockEducationalManagement(cy, {
        userRole: UserRole.USER,
        educationalRole: EducationalRole.INSTRUCTOR,
        emptyCourses: true,
        gqlQueries: [
          mockGQL('AddOrUpdateCourse', [
            {
              addOrUpdateCourse: {
                _id: 'new-course-123',
                title: 'Test Course',
                description: 'This is a test course description',
                courseCode: 'TEST101',
                sectionIds: []
              }
            },
            {
              addOrUpdateCourse: {
                _id: 'new-course-123',
                title: 'Updated Test Course',
                description: 'This is a test course description',
                courseCode: 'TEST101',
                sectionIds: []
              }
            },
            {
              addOrUpdateCourse: {
                _id: 'new-course-123',
                title: 'Updated Test Course',
                description: 'This is a test course description',
                courseCode: 'TEST101',
                sectionIds: []
              }
            }
          ])
        ]
      });
      
      cy.visit('/course-management');
      
      // Wait for initial load
      cy.wait('@RefreshAccessToken');
      cy.wait('@FetchConfig');
      cy.wait('@CreateNewInstructor');
      cy.wait('@FetchCourses');
      cy.wait('@FetchSections');
      cy.wait('@FetchAssignments');
      
      // Initially no courses - should see empty state
      cy.get('[data-cy=course-management-main-title]').should('contain.text', 'Course Management');
      
      // CREATE: Click new course button
      cy.get('[data-cy=new-course-button]').click();
      cy.get('[data-cy=course-modal]').should('be.visible');
      
      // Fill out the form
      cy.get('[data-cy=course-title-input]').type('Test Course');
      cy.get('[data-cy=course-description-input]').type('This is a test course description');
      
      // Submit the form
      cy.get('[data-cy=course-modal-submit-button]').click();
      
      // Wait for course creation
      cy.wait('@AddOrUpdateCourse');
      
      // Modal should close
      cy.get('[data-cy=course-modal]').should('not.exist');
      
      // Should navigate to course view automatically after creation
      cy.get('[data-cy=tree-item-new-course-123]').should('exist');
      
      // READ/EDIT: Click edit course button in the course view
      cy.get('[data-cy=edit-course-button]').should('be.visible').click();
      cy.get('[data-cy=course-modal]').should('be.visible');
      
      // Modify the course
      cy.get('[data-cy=course-title-input]').clear().type('Updated Test Course');
      cy.get('[data-cy=course-modal-submit-button]').click();
      
      // Wait for course update
      cy.wait('@AddOrUpdateCourse');
      
      // Modal should close
      cy.get('[data-cy=course-modal]').should('not.exist');
      
      // DELETE: Click the delete course button
      cy.get('[data-cy=delete-course-button]').click();
      cy.get('[data-cy=delete-confirmation-modal]').should('be.visible');
      cy.get('[data-cy=delete-confirm-button]').click();
      
      // Wait for course deletion
      cy.wait('@AddOrUpdateCourse');
      
      // Should navigate back to dashboard
      cy.get('[data-cy=course-management-main-title]').should('contain.text', 'Course Management');
      
      // Course should no longer appear in the tree hierarchy
      cy.get('[data-cy=tree-item-new-course-123]').should('not.exist');
    });
  });

  describe('Section CRUD Operations', () => {
    it('Instructors can CRUD a new section', () => {
      cyMockEducationalManagement(cy, {
        userRole: UserRole.USER,
        educationalRole: EducationalRole.INSTRUCTOR,
        gqlQueries: [
          mockGQL('AddOrUpdateSection', [
            {
              addOrUpdateSection: {
                _id: 'new-section-123',
                title: 'Test Section',
                sectionCode: 'TEST123',
                description: 'This is a test section description',
                assignments: [],
                numOptionalAssignmentsRequired: 0
              }
            },
            {
              addOrUpdateSection: {
                _id: 'new-section-123',
                title: 'Updated Test Section',
                sectionCode: 'TEST123',
                description: 'This is an updated test section description',
                assignments: [],
                numOptionalAssignmentsRequired: 0
              }
            },
            {
              addOrUpdateSection: {
                _id: 'new-section-123',
                title: 'Updated Test Section',
                sectionCode: 'TEST123',
                description: 'This is an updated test section description',
                assignments: [],
                numOptionalAssignmentsRequired: 0
              }
            }
          ])
        ]
      });
      
      cy.visit('/course-management');
      
      // Wait for initial load
      cy.wait('@RefreshAccessToken');
      cy.wait('@FetchConfig');
      cy.wait('@CreateNewInstructor');
      cy.wait('@FetchCourses');
      cy.wait('@FetchSections');
      cy.wait('@FetchAssignments');
      cy.wait('@FetchStudentsInMyCourses');
      
      // Click on a course in the tree to view it
      cy.get('[data-cy=tree-item-course-123]').click();
      
      // CREATE: Should be in course view now
      cy.get('[data-cy=add-section-button]').should('be.visible').click();
      cy.get('[data-cy=section-modal]').should('be.visible');
      
      // Fill out the section form
      cy.get('[data-cy=section-title-input]').type('Test Section');
      cy.get('[data-cy=section-code-input]').type('TEST123');
      cy.get('[data-cy=section-description-input]').type('This is a test section description');
      
      // Submit the form
      cy.get('[data-cy=section-modal-submit-button]').click();

      // Wait for section creation
      cy.wait('@AddOrUpdateSection');
      
      // Click on the newly created section card
      cy.get('[data-cy=section-card-new-section-123]').scrollIntoView().should('be.visible').click();
      
      // READ/EDIT: Should navigate to section view
      cy.get('[data-cy=edit-section-button]').should('be.visible').click();
      cy.get('[data-cy=section-modal]').should('be.visible');

      // Modify the section
      cy.get('[data-cy=section-title-input]').clear().type('Updated Test Section');
      cy.get('[data-cy=section-description-input]').clear().type('This is an updated test section description');
      
      // Submit the form
      cy.get('[data-cy=section-modal-submit-button]').click();
      
      // Wait for section update
      cy.wait('@AddOrUpdateSection');
      
      // DELETE: Delete the section
      cy.get('[data-cy=delete-section-button]').click();
      cy.get('[data-cy=delete-confirmation-modal]').should('be.visible');
      cy.get('[data-cy=delete-confirm-button]').click();
      
      // Wait for section deletion
      cy.wait('@AddOrUpdateSection');
      
      // Should navigate back to course view
      cy.get('[data-cy=add-section-button]').should('be.visible');
      
      // Section should no longer appear in the course
      cy.get('[data-cy=section-card-new-section-123]').should('not.exist');
    });
  });

  describe('Assignment CRUD Operations', () => {
    it('Instructors can CRUD a new assignment', () => {
      cyMockEducationalManagement(cy, {
        userRole: UserRole.USER,  
        educationalRole: EducationalRole.INSTRUCTOR,
        gqlQueries: [
          mockGQL('AddOrUpdateAssignment', [
            createAssignmentResponse,
            updateAssignmentResponse,
            deleteAssignmentResponse
          ]),
          mockGQL('AddOrUpdateSection', [
            updateTestSectionWithAssignmentsResponse([newTestAssignment])
          ])
        ]
      });
      
      cy.visit('/course-management');
      
      // Wait for initial load
      cy.wait('@RefreshAccessToken');
      cy.wait('@FetchConfig');
      cy.wait('@CreateNewInstructor');
      cy.wait('@FetchCourses');
      cy.wait('@FetchSections');
      cy.wait('@FetchAssignments');
      cy.wait('@FetchStudentsInMyCourses');
      cy.wait('@FetchBuiltActivities');
      
      // Navigate to course -> section
      cy.get('[data-cy=tree-item-course-123]').click();
      cy.get('[data-cy=section-card-section-456]').click();
      
      // CREATE: Should be in section view now
      cy.get('[data-cy=add-assignment-button]').should('be.visible').click();
      cy.get('[data-cy=assignment-modal]').should('be.visible');

      // TODO: input new assignment title, description, and activity into the assignment modal and submit new assignment
      cy.get('[data-cy=assignment-modal-title-input]').type('Test Assignment');
      cy.get('[data-cy=assignment-modal-description-input]').type('This is a test assignment description');
      cy.get('[data-cy=assignment-modal-submit-button]').click();
      
      cy.wait('@AddOrUpdateAssignment');
      
      // Click on assignment card to view it
      cy.get('[data-cy=assignment-card-new-assignment-123]').should('be.visible').click();
      
      // Should be in assignment view
      // Add activity to assignment
      cy.get('[data-cy=activity-select-dropdown]').click();
      cy.get('[role="option"]').first().click();
      cy.get('[data-cy=add-activity-to-assignment-button]').click();
      
      cy.wait('@AddOrUpdateAssignment');
      
      // READ/EDIT: Edit assignment
      cy.get('[data-cy=edit-assignment-button]').scrollIntoView().should('be.visible').click();
      cy.get('[data-cy=assignment-modal]').should('be.visible');

      cy.get('[data-cy=assignment-modal-title-input]').clear().type('Updated Test Assignment');
      cy.get('[data-cy=assignment-modal-description-input]').clear().type('This is an updated test assignment description');
      cy.get('[data-cy=assignment-modal-submit-button]').click();
      
      cy.wait('@AddOrUpdateAssignment');
      
      // DELETE: Delete assignment
      cy.get('[data-cy=delete-assignment-button]').click();
      cy.get('[data-cy=delete-confirmation-modal]').should('be.visible');
      cy.get('[data-cy=delete-confirm-button]').click();
      
      // Wait for assignment deletion
      cy.wait('@AddOrUpdateAssignment');
      
      // Should navigate back to section view
      cy.get('[data-cy=add-assignment-button]').should('be.visible');

      // Assignment should no longer appear in the section
      cy.get('[data-cy=assignment-card-new-assignment-123]').should('not.exist');
    });
  });

  describe('Student Operations', () => {
    it('Students can add themselves to an existing course', () => {
      cyMockEducationalManagement(cy, {
        userRole: UserRole.USER,
        educationalRole: EducationalRole.STUDENT,
        emptyCourses: true,
        gqlQueries: [
          mockGQL('FetchCourses', [
            fetchCoursesResponseEmpty,
            fetchCoursesResponseEmpty,
            fetchCoursesResponseStudent
          ])
        ]
      });
      
      cy.visit('/course-management');
      
      // Wait for initial load
      cy.wait('@RefreshAccessToken');
      cy.wait('@FetchConfig');
      cy.wait('@CreateNewStudent');
      cy.wait('@FetchCourses');
      cy.wait('@FetchSections');
      cy.wait('@FetchAssignments');
      
      // Initially no courses enrolled
      cy.get('[data-cy=course-management-title]').should('contain.text', 'My Courses');
      
      // Click join section button
      cy.get('[data-cy=join-section-button]').click();
      cy.get('[data-cy=join-section-modal]').should('be.visible');
      
      // Enter section code
      cy.get('[data-cy=section-code-input]').type('CS101A');
      
      // Submit
      cy.get('[data-cy=join-section-submit-button]').click();
      
      // Wait for enrollment
      cy.wait('@ModifySectionEnrollment');
      cy.wait('@FetchCourses');
      cy.wait('@FetchSections');
      cy.wait('@FetchAssignments');
      
      // Modal should close
      cy.get('[data-cy=join-section-modal]').should('not.exist');
      
      // Should now see the course in the tree
      cy.get('[data-cy=tree-item-course-123]').should('be.visible');
      
      // Ensure course info appears
      cy.get('[data-cy=tree-item-course-123]').click();
      cy.get('[data-cy=section-card-section-456]').should('be.visible');
      cy.get('[data-cy=section-card-section-456]').click();
      cy.get('[data-cy=assignment-card-assignment-123]').should('be.visible');
    });

    it('Students can remove themselves from a section', () => {
      cyMockEducationalManagement(cy, {
        userRole: UserRole.USER,
        educationalRole: EducationalRole.STUDENT,
        gqlQueries: [
          mockGQL('FetchCourses', [
            fetchCoursesResponseStudent,
            fetchCoursesResponseStudent,
            fetchCoursesResponseEmpty,
          ]),
          mockGQL("ModifySectionEnrollment", [
            removeFromSectionResponse
          ])
        ]
      });
      
      cy.visit('/course-management');
      
      // Wait for initial load
      cy.wait('@RefreshAccessToken');
      cy.wait('@FetchConfig');
      cy.wait('@CreateNewStudent');
      cy.wait('@FetchCourses');
      cy.wait('@FetchSections');
      cy.wait('@FetchAssignments');
      
      // Navigate to course -> section
      cy.get('[data-cy=tree-item-course-123]').click();
      cy.get('[data-cy=section-card-section-456]').click();
      
      // Should be in section view - click remove from section
      cy.get('[data-cy=remove-from-section-button]').should('be.visible').click();
      
      // Wait for removal
      cy.wait('@ModifySectionEnrollment');
      cy.wait('@FetchCourses');
      cy.wait('@FetchSections');
      cy.wait('@FetchAssignments');
      
      // Should navigate back to dashboard since no more enrollments
      cy.get('[data-cy=course-management-main-title]').should('contain.text', 'My Courses');
      
      // Both section and course should no longer be visible
      cy.get('[data-cy=tree-item-course-123]').should('not.exist');
    });
  });

  describe('Activity Progress', () => {
    it('When a student opens an activity, logs them completing that activity', () => {
      cyMockEducationalManagement(cy, {
        userRole: UserRole.USER,
        educationalRole: EducationalRole.STUDENT
      });
      
      cy.visit('/course-management');
      
      // Wait for initial load
      cy.wait('@RefreshAccessToken');
      cy.wait('@FetchConfig');
      cy.wait('@CreateNewStudent');
      cy.wait('@FetchCourses');
      cy.wait('@FetchSections');
      cy.wait('@FetchAssignments');
      cy.wait('@FetchBuiltActivities');
      
      // Navigate to course -> section -> assignment
      cy.get('[data-cy=tree-item-course-123]').click();
      cy.get('[data-cy=section-card-section-456]').click();
      cy.get('[data-cy=assignment-card-assignment-123]').click();
      
      // Click on an activity
      cy.get('[data-cy=activity-item-my-editable-activity]').click();
      
      // Verify the API request is made to update student progress
      cy.wait('@ModifyStudentAssignmentProgress').then((xhr) => {
        const data = xhr.request.body.variables;
        expect(data.activityCompletions).to.deep.include({
          activityId: 'my-editable-activity',
          complete: true
        });
        expect(data.targetUserId).to.exist;
        expect(data.courseId).to.exist;
        expect(data.sectionId).to.exist;
        expect(data.assignmentId).to.exist;
      });
    });
  });
});