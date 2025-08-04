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
  fetchStudentsInMyCourses as _fetchStudentsInMyCourses,
  addOrUpdateCourse as _addOrUpdateCourse,
  addOrUpdateSection as _addOrUpdateSection
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
  courseModificationStatus: LoadStatus;
  assignments: Assignment[];
  assignmentsLoadStatus: LoadStatus;
  sections: Section[];
  sectionsLoadStatus: LoadStatus;
  sectionModificationStatus: LoadStatus;
  students: StudentData[];
  studentsLoadStatus: LoadStatus;
}

const initialState: State = {
  courses: [],
  coursesLoadStatus: LoadStatus.NONE,
  courseModificationStatus: LoadStatus.NONE,
  assignments: [],
  assignmentsLoadStatus: LoadStatus.NONE,
  sections: [],
  sectionsLoadStatus: LoadStatus.NONE,
  sectionModificationStatus: LoadStatus.NONE,
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

export const createCourse = createAsyncThunk(
  'educationManagement/createCourse',
  async () => {
    return await _addOrUpdateCourse(undefined, 'CREATE');
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

export const createSection = createAsyncThunk(
  'educationManagement/createSection',
  async (courseId: string) => {
    return await _addOrUpdateSection(courseId, undefined, 'CREATE');
  }
);

export const updateSection = createAsyncThunk(
  'educationManagement/updateSection',
  async (params: { courseId: string; sectionData: Partial<Section> }) => {
    return await _addOrUpdateSection(params.courseId, params.sectionData, 'MODIFY');
  }
);

export const deleteSection = createAsyncThunk(
  'educationManagement/deleteSection',
  async (params: { courseId: string; sectionId: string }) => {
    return await _addOrUpdateSection(params.courseId, { _id: params.sectionId }, 'DELETE');
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
      })

      // Course creation
      .addCase(createCourse.pending, (state) => {
        state.courseModificationStatus = LoadStatus.LOADING;
      })
      .addCase(createCourse.fulfilled, (state, action) => {
        state.courseModificationStatus = LoadStatus.SUCCEEDED;
        // Add the new course to the list
        state.courses.push(action.payload);
      })
      .addCase(createCourse.rejected, (state) => {
        state.courseModificationStatus = LoadStatus.FAILED;
      })

      // Course update
      .addCase(updateCourse.pending, (state) => {
        state.courseModificationStatus = LoadStatus.LOADING;
      })
      .addCase(updateCourse.fulfilled, (state, action) => {
        state.courseModificationStatus = LoadStatus.SUCCEEDED;
        // Update the existing course in the list
        const courseIndex = state.courses.findIndex(
          (c) => c._id === action.payload._id
        );
        if (courseIndex >= 0) {
          state.courses[courseIndex] = action.payload;
        }
      })
      .addCase(updateCourse.rejected, (state) => {
        state.courseModificationStatus = LoadStatus.FAILED;
      })

      // Course deletion
      .addCase(deleteCourse.pending, (state) => {
        state.courseModificationStatus = LoadStatus.LOADING;
      })
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.courseModificationStatus = LoadStatus.SUCCEEDED;
        // Remove the course from the list
        state.courses = state.courses.filter(
          (c) => c._id !== action.payload._id
        );
      })
      .addCase(deleteCourse.rejected, (state) => {
        state.courseModificationStatus = LoadStatus.FAILED;
      })

      // Section creation
      .addCase(createSection.pending, (state) => {
        state.sectionModificationStatus = LoadStatus.LOADING;
      })
      .addCase(createSection.fulfilled, (state, action) => {
        state.sectionModificationStatus = LoadStatus.SUCCEEDED;
        // Add the new section to the list
        state.sections.push(action.payload);
      })
      .addCase(createSection.rejected, (state) => {
        state.sectionModificationStatus = LoadStatus.FAILED;
      })

      // Section update
      .addCase(updateSection.pending, (state) => {
        state.sectionModificationStatus = LoadStatus.LOADING;
      })
      .addCase(updateSection.fulfilled, (state, action) => {
        state.sectionModificationStatus = LoadStatus.SUCCEEDED;
        // Update the existing section in the list
        const sectionIndex = state.sections.findIndex(
          (s) => s._id === action.payload._id
        );
        if (sectionIndex >= 0) {
          state.sections[sectionIndex] = action.payload;
        }
      })
      .addCase(updateSection.rejected, (state) => {
        state.sectionModificationStatus = LoadStatus.FAILED;
      })

      // Section deletion
      .addCase(deleteSection.pending, (state) => {
        state.sectionModificationStatus = LoadStatus.LOADING;
      })
      .addCase(deleteSection.fulfilled, (state, action) => {
        state.sectionModificationStatus = LoadStatus.SUCCEEDED;
        // Remove the section from the list
        state.sections = state.sections.filter(
          (s) => s._id !== action.payload._id
        );
      })
      .addCase(deleteSection.rejected, (state) => {
        state.sectionModificationStatus = LoadStatus.FAILED;
      });
  },
});

export default educationManagementSlice.reducer;