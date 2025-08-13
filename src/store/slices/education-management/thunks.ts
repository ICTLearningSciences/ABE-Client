/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchCourses as _fetchCourses,
  fetchAssignments as _fetchAssignments,
  fetchSections as _fetchSections,
  fetchStudentsInMyCourses as _fetchStudentsInMyCourses,
  addOrUpdateCourse as _addOrUpdateCourse,
  addOrUpdateSection as _addOrUpdateSection,
  addOrUpdateAssignment as _addOrUpdateAssignment,
  modifySectionEnrollment as _modifySectionEnrollment,
  modifyStudentAssignmentProgress as _modifyStudentAssignmentProgress,
  createNewInstructor as _createNewInstructor,
  createNewStudent as _createNewStudent,
  modifyCourseShareStatus as _modifyCourseShareStatus,
  fetchInstructors as _fetchInstructors,
  modifyStudentBanInSection as _modifyStudentBanInSection,
  BanStudentFromSectionAction,
} from './educational-api';
import { Course, Assignment, Section, ActivityCompletion } from './types';

// Fetch thunks
export const fetchCourses = createAsyncThunk(
  'educationManagement/fetchCourses',
  async (forUserId: string) => {
    return await _fetchCourses(forUserId);
  }
);

export const fetchAssignments = createAsyncThunk(
  'educationManagement/fetchAssignments',
  async (forUserId: string) => {
    return await _fetchAssignments(forUserId);
  }
);

export const fetchSections = createAsyncThunk(
  'educationManagement/fetchSections',
  async (forUserId: string) => {
    return await _fetchSections(forUserId);
  }
);

export const fetchStudentsInMyCourses = createAsyncThunk(
  'educationManagement/fetchStudentsInMyCourses',
  async (instructorId: string) => {
    return await _fetchStudentsInMyCourses(instructorId);
  }
);

export const fetchInstructors = createAsyncThunk(
  'educationManagement/fetchInstructors',
  async () => {
    return await _fetchInstructors();
  }
);

// Course thunks
export const createCourse = createAsyncThunk(
  'educationManagement/createCourse',
  async (courseData?: Partial<Course>) => {
    return await _addOrUpdateCourse(courseData, 'CREATE');
  }
);

export const updateCourse = createAsyncThunk(
  'educationManagement/updateCourse',
  async (courseData: Partial<Course>) => {
    return await _addOrUpdateCourse(courseData, 'MODIFY');
  }
);

export const deleteCourse = createAsyncThunk(
  'educationManagement/deleteCourse',
  async (courseId: string) => {
    return await _addOrUpdateCourse({ _id: courseId }, 'DELETE');
  }
);

// Section thunks
export const createSection = createAsyncThunk(
  'educationManagement/createSection',
  async (params: { courseId: string; sectionData?: Partial<Section> }) => {
    const newSection = await _addOrUpdateSection(
      params.courseId,
      params.sectionData,
      'CREATE'
    );
    return {
      courseId: params.courseId,
      newSection,
    };
  }
);

export const updateSection = createAsyncThunk(
  'educationManagement/updateSection',
  async (params: { courseId: string; sectionData: Partial<Section> }) => {
    return await _addOrUpdateSection(
      params.courseId,
      params.sectionData,
      'MODIFY'
    );
  }
);

export const deleteSection = createAsyncThunk(
  'educationManagement/deleteSection',
  async (params: { courseId: string; sectionId: string }) => {
    await _addOrUpdateSection(
      params.courseId,
      { _id: params.sectionId },
      'DELETE'
    );
    return {
      courseId: params.courseId,
      sectionId: params.sectionId,
    };
  }
);

// Assignment thunks
export const createAssignment = createAsyncThunk(
  'educationManagement/createAssignment',
  async (params: {
    courseId: string;
    assignmentData?: Partial<Assignment>;
  }) => {
    return await _addOrUpdateAssignment(
      params.courseId,
      params.assignmentData,
      'CREATE'
    );
  }
);

export const updateAssignment = createAsyncThunk(
  'educationManagement/updateAssignment',
  async (params: { courseId: string; assignmentData: Partial<Assignment> }) => {
    return await _addOrUpdateAssignment(
      params.courseId,
      params.assignmentData,
      'MODIFY'
    );
  }
);

export const deleteAssignment = createAsyncThunk(
  'educationManagement/deleteAssignment',
  async (params: { courseId: string; assignmentId: string }) => {
    return await _addOrUpdateAssignment(
      params.courseId,
      { _id: params.assignmentId },
      'DELETE'
    );
  }
);

// Enrollment thunks
export const enrollInSection = createAsyncThunk(
  'educationManagement/enrollInSection',
  async (params: { targetUserId: string; sectionCode: string }) => {
    return await _modifySectionEnrollment(
      params.targetUserId,
      'ENROLL',
      undefined,
      undefined,
      params.sectionCode
    );
  }
);

export const removeFromSection = createAsyncThunk(
  'educationManagement/removeFromSection',
  async (params: {
    targetUserId: string;
    courseId: string;
    sectionId: string;
  }) => {
    return await _modifySectionEnrollment(
      params.targetUserId,
      'REMOVE',
      params.courseId,
      params.sectionId,
      undefined
    );
  }
);

export const updateStudentAssignmentProgress = createAsyncThunk(
  'educationManagement/updateStudentAssignmentProgress',
  async (params: {
    targetUserId: string;
    courseId: string;
    sectionId: string;
    assignmentId: string;
    activityCompletions: ActivityCompletion[];
  }) => {
    return await _modifyStudentAssignmentProgress(
      params.targetUserId,
      params.courseId,
      params.sectionId,
      params.assignmentId,
      params.activityCompletions
    );
  }
);

// User data thunks
export const loadInstructorData = createAsyncThunk(
  'educationManagement/loadInstructorData',
  async (userId: string) => {
    return await _createNewInstructor(userId);
  }
);

export const loadStudentData = createAsyncThunk(
  'educationManagement/loadStudentData',
  async (userId: string) => {
    return await _createNewStudent(userId);
  }
);

// Course sharing thunks
export const shareCourseWithInstructor = createAsyncThunk(
  'educationManagement/shareCourseWithInstructor',
  async (params: { instructorId: string; courseId: string }) => {
    return await _modifyCourseShareStatus(
      params.instructorId,
      params.courseId,
      'SHARE'
    );
  }
);

export const unshareCourseWithInstructor = createAsyncThunk(
  'educationManagement/unshareCourseWithInstructor',
  async (params: { instructorId: string; courseId: string }) => {
    return await _modifyCourseShareStatus(
      params.instructorId,
      params.courseId,
      'UNSHARE'
    );
  }
);

// Student ban/unban thunks
export const banStudentFromSection = createAsyncThunk(
  'educationManagement/banStudentFromSection',
  async (params: { sectionId: string; studentId: string }) => {
    const updatedSection = await _modifyStudentBanInSection(
      params.sectionId,
      params.studentId,
      BanStudentFromSectionAction.BAN
    );
    return {
      section: updatedSection,
      bannedStudentId: params.studentId,
    };
  }
);

export const unbanStudentFromSection = createAsyncThunk(
  'educationManagement/unbanStudentFromSection',
  async (params: { sectionId: string; studentId: string }) => {
    const updatedSection = await _modifyStudentBanInSection(
      params.sectionId,
      params.studentId,
      BanStudentFromSectionAction.UNBAN
    );
    return {
      section: updatedSection,
      bannedStudentId: params.studentId,
    };
  }
);
