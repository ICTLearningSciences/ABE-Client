/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { Section } from './educational-types';

export const testSection: Section = {
  _id: 'section-456',
  title: 'CS101 Section A',
  sectionCode: 'CS101A',
  description: 'Morning section for Introduction to Computer Science.',
  assignments: [
    { assignmentId: 'assignment-123', mandatory: true },
    { assignmentId: 'assignment-456', mandatory: false }
  ],
  assignmentOrder: ['assignment-123', 'assignment-456'],
  numOptionalAssignmentsRequired: 1
};

export const testSection2: Section = {
  _id: 'section-789',
  title: 'CS101 Section B',
  sectionCode: 'CS101B',
  description: 'Evening section for Introduction to Computer Science.',
  assignments: [
    { assignmentId: 'assignment-123', mandatory: true }
  ],
  assignmentOrder: ['assignment-123'],
  numOptionalAssignmentsRequired: 0
};

export const testSection3: Section = {
  _id: 'section-abc',
  title: 'CS201 Section A',
  sectionCode: 'CS201A',
  description: 'Advanced Programming section.',
  assignments: [
    { assignmentId: 'assignment-789', mandatory: true }
  ],
  assignmentOrder: ['assignment-789'],
  numOptionalAssignmentsRequired: 0
};

export interface FetchSectionsResponse {
  fetchSections: Section[];
}

export const fetchSectionsResponseInstructor: FetchSectionsResponse = {
  fetchSections: [testSection, testSection2, testSection3]
};

export const fetchSectionsResponseStudent: FetchSectionsResponse = {
  fetchSections: [testSection]
};

export const fetchSectionsResponseEmpty: FetchSectionsResponse = {
  fetchSections: []
};