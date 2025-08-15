/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/

import { cyMockEducationalManagement } from '../helpers/educational-management-functions';
import { EducationalRole } from '../fixtures/educational-management/educational-types';
import { UserRole } from '../helpers/types';

describe('Course Management Fixtures Test', () => {
  it('Should load all fixtures without errors - Instructor', () => {
    cyMockEducationalManagement(cy, {
      userRole: UserRole.USER,
      educationalRole: EducationalRole.INSTRUCTOR
    });
    
    cy.visit('/course-management');
    
    // Wait for all the GraphQL calls to complete
    cy.wait('@RefreshAccessToken');
    cy.wait('@FetchConfig');
    cy.wait('@CreateNewInstructor');
    cy.wait('@FetchCourses');
    cy.wait('@FetchSections');
    cy.wait('@FetchAssignments');
    cy.wait('@FetchStudentsInMyCourses');
    cy.wait('@FetchBuiltActivities');
    
    // Verify page loads without errors
    cy.get('body').should('exist');
  });

  it('Should load all fixtures without errors - Student', () => {
    cyMockEducationalManagement(cy, {
      userRole: UserRole.USER,
      educationalRole: EducationalRole.STUDENT
    });
    
    cy.visit('/course-management');
    
    // Wait for all the GraphQL calls to complete
    cy.wait('@RefreshAccessToken');
    cy.wait('@FetchConfig');
    cy.wait('@CreateNewStudent');
    cy.wait('@FetchCourses');
    cy.wait('@FetchSections');
    cy.wait('@FetchAssignments');
    cy.wait('@FetchBuiltActivities');
    
    // Verify page loads without errors
    cy.get('body').should('exist');
  });

  it('Should load empty state fixtures without errors', () => {
    cyMockEducationalManagement(cy, {
      userRole: UserRole.USER,
      educationalRole: EducationalRole.STUDENT,
      emptyCourses: true,
      emptySections: true,
      emptyAssignments: true,
      emptyStudents: true
    });
    
    cy.visit('/course-management');
    
    // Wait for all the GraphQL calls to complete
    cy.wait('@RefreshAccessToken');
    cy.wait('@FetchConfig');
    cy.wait('@CreateNewStudent');
    cy.wait('@FetchCourses');
    cy.wait('@FetchSections');
    cy.wait('@FetchAssignments');
    cy.wait('@FetchBuiltActivities');
    
    // Verify page loads without errors
    cy.get('body').should('exist');
  });
});