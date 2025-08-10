/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { Assignment, Section } from '../../../src/store/slices/education-management/types';

export const newTestSection: Section = {
  _id: 'new-section-123',
  title: 'New Test Section',
  sectionCode: 'TEST123',
  description: 'A newly created test section.',
  assignments: [],
  numOptionalAssignmentsRequired: 0
};

export const updatedTestSection: Section = {
  _id: 'section-456',
  title: 'Updated Section Title',
  sectionCode: 'CS101A-UPDATED',
  description: 'An updated section description.',
  assignments: [
    { assignmentId: 'assignment-123', mandatory: true },
    { assignmentId: 'assignment-456', mandatory: false }
  ],
  numOptionalAssignmentsRequired: 1
};

export interface AddOrUpdateSectionResponse {
  addOrUpdateSection: Section;
}

export const createSectionResponse: AddOrUpdateSectionResponse = {
  addOrUpdateSection: newTestSection
};

export const updateSectionResponse: AddOrUpdateSectionResponse = {
  addOrUpdateSection: updatedTestSection
};

export function updateTestSectionWithAssignmentsResponse(assignments: Assignment[]) {
  return {
    addOrUpdateSection: {
    ...updatedTestSection,
    assignments: [
      ...updatedTestSection.assignments,
      ...assignments.map(assignment => ({
        assignmentId: assignment._id,
        mandatory: true
      }))
    ]
  }
}
};

export const deleteSectionResponse: AddOrUpdateSectionResponse = {
  addOrUpdateSection: {
    _id: 'section-456',
    title: 'CS101 Section A',
    sectionCode: 'CS101A',
    description: 'Morning section for Introduction to Computer Science.',
    assignments: [
      { assignmentId: 'assignment-123', mandatory: true },
      { assignmentId: 'assignment-456', mandatory: false }
    ],
    numOptionalAssignmentsRequired: 1
  }
};