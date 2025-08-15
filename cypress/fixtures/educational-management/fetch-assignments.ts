/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { Assignment } from './educational-types';

export const testAssignment: Assignment = {
  _id: 'assignment-123',
  title: 'Programming Fundamentals Quiz',
  description: 'A quiz covering basic programming concepts including variables, loops, and functions.',
  activityIds: ['my-editable-activity', 'my-read-only-activity']
};

export const testAssignment2: Assignment = {
  _id: 'assignment-456',
  title: 'Data Structures Project',
  description: 'Implement various data structures in your chosen programming language.',
  activityIds: ['my-editable-activity']
};

export const testAssignment3: Assignment = {
  _id: 'assignment-789',
  title: 'Algorithm Analysis',
  description: 'Analyze the time and space complexity of different algorithms.',
  activityIds: ['my-read-only-activity']
};

export interface FetchAssignmentsResponse {
  fetchAssignments: Assignment[];
}

export const fetchAssignmentsResponseInstructor: FetchAssignmentsResponse = {
  fetchAssignments: [testAssignment, testAssignment2, testAssignment3]
};

export const fetchAssignmentsResponseStudent: FetchAssignmentsResponse = {
  fetchAssignments: [testAssignment, testAssignment2]
};

export const fetchAssignmentsResponseEmpty: FetchAssignmentsResponse = {
  fetchAssignments: []
};