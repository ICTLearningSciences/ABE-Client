/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { 
  Course, 
  Assignment,
  Section,
  StudentData,
  fetchCourses as _fetchCourses,
  fetchAssignments as _fetchAssignments,
  fetchSections as _fetchSections,
  fetchStudentsInMyCourses as _fetchStudentsInMyCourses
} from './educational-api';

export enum LoadStatus {
  NONE,
  LOADING,
  SUCCEEDED,
  FAILED,
}

export interface State {
  courses: Course[];
  coursesLoadStatus: LoadStatus;
  assignments: Assignment[];
  assignmentsLoadStatus: LoadStatus;
  sections: Section[];
  sectionsLoadStatus: LoadStatus;
  students: StudentData[];
  studentsLoadStatus: LoadStatus;
}

const initialState: State = {
  courses: [],
  coursesLoadStatus: LoadStatus.NONE,
  assignments: [],
  assignmentsLoadStatus: LoadStatus.NONE,
  sections: [],
  sectionsLoadStatus: LoadStatus.NONE,
  students: [],
  studentsLoadStatus: LoadStatus.NONE,
};

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

/** Reducer */
export const educationManagementSlice = createSlice({
  name: 'educationManagement',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.coursesLoadStatus = LoadStatus.LOADING;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.courses = action.payload;
        state.coursesLoadStatus = LoadStatus.SUCCEEDED;
      })
      .addCase(fetchCourses.rejected, (state) => {
        state.coursesLoadStatus = LoadStatus.FAILED;
      })

      .addCase(fetchAssignments.pending, (state) => {
        state.assignmentsLoadStatus = LoadStatus.LOADING;
      })
      .addCase(fetchAssignments.fulfilled, (state, action) => {
        state.assignments = action.payload;
        state.assignmentsLoadStatus = LoadStatus.SUCCEEDED;
      })
      .addCase(fetchAssignments.rejected, (state) => {
        state.assignmentsLoadStatus = LoadStatus.FAILED;
      })

      .addCase(fetchSections.pending, (state) => {
        state.sectionsLoadStatus = LoadStatus.LOADING;
      })
      .addCase(fetchSections.fulfilled, (state, action) => {
        state.sections = action.payload;
        state.sectionsLoadStatus = LoadStatus.SUCCEEDED;
      })
      .addCase(fetchSections.rejected, (state) => {
        state.sectionsLoadStatus = LoadStatus.FAILED;
      })

      .addCase(fetchStudentsInMyCourses.pending, (state) => {
        state.studentsLoadStatus = LoadStatus.LOADING;
      })
      .addCase(fetchStudentsInMyCourses.fulfilled, (state, action) => {
        state.students = action.payload;
        state.studentsLoadStatus = LoadStatus.SUCCEEDED;
      })
      .addCase(fetchStudentsInMyCourses.rejected, (state) => {
        state.studentsLoadStatus = LoadStatus.FAILED;
      });
  },
});

export default educationManagementSlice.reducer;