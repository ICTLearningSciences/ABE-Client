/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
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
import {
  Course,
  Assignment,
  Section,
  StudentData,
  ActivityCompletion,
  Instructor,
  CourseOwnership,
} from './types';

export enum LoadStatus {
  NONE,
  LOADING,
  SUCCEEDED,
  FAILED,
}

export interface CourseManagementState {
  view: 'dashboard' | 'course' | 'section' | 'assignment' | 'activity';
  selectedCourseId?: string;
  selectedSectionId?: string;
  selectedAssignmentId?: string;
  selectedActivityId?: string;
}

export interface State {
  courses: Course[];
  coursesLoadStatus: LoadStatus;
  courseModificationStatus: LoadStatus;
  assignments: Assignment[];
  assignmentsLoadStatus: LoadStatus;
  assignmentModificationStatus: LoadStatus;
  sections: Section[];
  sectionsLoadStatus: LoadStatus;
  sectionModificationStatus: LoadStatus;
  students: StudentData[];
  studentsLoadStatus: LoadStatus;
  enrollmentModificationStatus: LoadStatus;
  instructorData?: Instructor;
  studentData?: StudentData;
  educationalDataLoadStatus: LoadStatus;
  instructors: Instructor[];
  instructorsLoadStatus: LoadStatus;
  viewState: CourseManagementState;
}

const initialState: State = {
  courses: [],
  coursesLoadStatus: LoadStatus.NONE,
  courseModificationStatus: LoadStatus.NONE,
  assignments: [],
  assignmentsLoadStatus: LoadStatus.NONE,
  assignmentModificationStatus: LoadStatus.NONE,
  sections: [],
  sectionsLoadStatus: LoadStatus.NONE,
  sectionModificationStatus: LoadStatus.NONE,
  students: [],
  studentsLoadStatus: LoadStatus.NONE,
  enrollmentModificationStatus: LoadStatus.NONE,
  instructorData: undefined,
  studentData: undefined,
  educationalDataLoadStatus: LoadStatus.NONE,
  instructors: [],
  instructorsLoadStatus: LoadStatus.NONE,
  viewState: {
    view: 'dashboard',
  },
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

export const fetchInstructors = createAsyncThunk(
  'educationManagement/fetchInstructors',
  async () => {
    return await _fetchInstructors();
  }
);

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

/** Reducer */
export const educationManagementSlice = createSlice({
  name: 'educationManagement',
  initialState,
  reducers: {
    setViewState: (state, action: PayloadAction<CourseManagementState>) => {
      state.viewState = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(banStudentFromSection.pending, (state) => {
        state.sectionModificationStatus = LoadStatus.LOADING;
      })
      .addCase(banStudentFromSection.fulfilled, (state, action) => {
        state.sectionModificationStatus = LoadStatus.SUCCEEDED;
        const sectionIndex = state.sections.findIndex(
          (s) => s._id === action.payload.section._id
        );
        if (sectionIndex >= 0) {
          state.sections[sectionIndex] = action.payload.section;
        }

        const bannedStudentId = action.payload.bannedStudentId;
        const studentIndex = state.students.findIndex(
          (s) => s.userId === bannedStudentId
        );
        if (studentIndex >= 0) {
          state.students[studentIndex].enrolledSections = state.students[
            studentIndex
          ].enrolledSections.filter((s) => s !== action.payload.section._id);
        }
      })
      .addCase(banStudentFromSection.rejected, (state) => {
        state.sectionModificationStatus = LoadStatus.FAILED;
      })

      .addCase(unbanStudentFromSection.pending, (state) => {
        state.sectionModificationStatus = LoadStatus.LOADING;
      })
      .addCase(unbanStudentFromSection.fulfilled, (state, action) => {
        state.sectionModificationStatus = LoadStatus.SUCCEEDED;
        const sectionIndex = state.sections.findIndex(
          (s) => s._id === action.payload.section._id
        );
        if (sectionIndex >= 0) {
          state.sections[sectionIndex] = action.payload.section;
        }
      })
      .addCase(unbanStudentFromSection.rejected, (state) => {
        state.sectionModificationStatus = LoadStatus.FAILED;
      })

      .addCase(fetchInstructors.pending, (state) => {
        state.instructorsLoadStatus = LoadStatus.LOADING;
      })
      .addCase(fetchInstructors.fulfilled, (state, action) => {
        state.instructors = action.payload;
        state.instructorsLoadStatus = LoadStatus.SUCCEEDED;
      })
      .addCase(fetchInstructors.rejected, (state) => {
        state.instructorsLoadStatus = LoadStatus.FAILED;
      })

      .addCase(shareCourseWithInstructor.pending, (state) => {
        state.courseModificationStatus = LoadStatus.LOADING;
      })
      .addCase(shareCourseWithInstructor.fulfilled, (state, action) => {
        state.courseModificationStatus = LoadStatus.SUCCEEDED;
        // Update the instructor data in the instructors list
        const instructorIndex = state.instructors.findIndex(
          (i) => i.userId === action.payload.userId
        );
        if (instructorIndex >= 0) {
          state.instructors[instructorIndex] = action.payload;
        } else {
          // If instructor not in list, add them
          state.instructors.push(action.payload);
        }
      })
      .addCase(shareCourseWithInstructor.rejected, (state) => {
        state.courseModificationStatus = LoadStatus.FAILED;
      })

      .addCase(unshareCourseWithInstructor.pending, (state) => {
        state.courseModificationStatus = LoadStatus.LOADING;
      })
      .addCase(unshareCourseWithInstructor.fulfilled, (state, action) => {
        state.courseModificationStatus = LoadStatus.SUCCEEDED;
        // Update the instructor data in the instructors list
        const instructorIndex = state.instructors.findIndex(
          (i) => i.userId === action.payload.userId
        );
        if (instructorIndex >= 0) {
          state.instructors[instructorIndex] = action.payload;
        } else {
          // If instructor not in list, add them
          state.instructors.push(action.payload);
        }
      })
      .addCase(unshareCourseWithInstructor.rejected, (state) => {
        state.courseModificationStatus = LoadStatus.FAILED;
      })

      // Instructor data loading
      .addCase(loadInstructorData.pending, (state) => {
        state.educationalDataLoadStatus = LoadStatus.LOADING;
      })
      .addCase(loadInstructorData.fulfilled, (state, action) => {
        state.educationalDataLoadStatus = LoadStatus.SUCCEEDED;
        state.instructorData = action.payload;
      })
      .addCase(loadInstructorData.rejected, (state) => {
        state.educationalDataLoadStatus = LoadStatus.FAILED;
      })

      .addCase(loadStudentData.pending, (state) => {
        state.educationalDataLoadStatus = LoadStatus.LOADING;
      })
      .addCase(loadStudentData.fulfilled, (state, action) => {
        state.educationalDataLoadStatus = LoadStatus.SUCCEEDED;
        state.studentData = action.payload;
      })
      .addCase(loadStudentData.rejected, (state) => {
        state.educationalDataLoadStatus = LoadStatus.FAILED;
      })

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
        // Add the course to the instructor's courses
        if (state.instructorData) {
          state.instructorData.courses.push({
            courseId: action.payload._id,
            ownership: CourseOwnership.OWNER,
          });
        }
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
        state.sections.push(action.payload.newSection);
        const courseIndex = state.courses.findIndex(
          (c) => c._id === action.payload.courseId
        );
        if (courseIndex >= 0) {
          state.courses[courseIndex].sectionIds.push(
            action.payload.newSection._id
          );
        }
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
          (s) => s._id !== action.payload.sectionId
        );
        const courseIndex = state.courses.findIndex(
          (c) => c._id === action.payload.courseId
        );
        if (courseIndex >= 0) {
          state.courses[courseIndex].sectionIds = state.courses[
            courseIndex
          ].sectionIds.filter((id) => id !== action.payload.sectionId);
        }
      })
      .addCase(deleteSection.rejected, (state) => {
        state.sectionModificationStatus = LoadStatus.FAILED;
      })

      // Assignment creation
      .addCase(createAssignment.pending, (state) => {
        state.assignmentModificationStatus = LoadStatus.LOADING;
      })
      .addCase(createAssignment.fulfilled, (state, action) => {
        state.assignmentModificationStatus = LoadStatus.SUCCEEDED;
        // Add the new assignment to the list
        state.assignments.push(action.payload);
      })
      .addCase(createAssignment.rejected, (state) => {
        state.assignmentModificationStatus = LoadStatus.FAILED;
      })

      // Assignment update
      .addCase(updateAssignment.pending, (state) => {
        state.assignmentModificationStatus = LoadStatus.LOADING;
      })
      .addCase(updateAssignment.fulfilled, (state, action) => {
        state.assignmentModificationStatus = LoadStatus.SUCCEEDED;
        // Update the existing assignment in the list
        const assignmentIndex = state.assignments.findIndex(
          (a) => a._id === action.payload._id
        );
        if (assignmentIndex >= 0) {
          state.assignments[assignmentIndex] = action.payload;
        }
      })
      .addCase(updateAssignment.rejected, (state) => {
        state.assignmentModificationStatus = LoadStatus.FAILED;
      })

      // Assignment deletion
      .addCase(deleteAssignment.pending, (state) => {
        state.assignmentModificationStatus = LoadStatus.LOADING;
      })
      .addCase(deleteAssignment.fulfilled, (state, action) => {
        state.assignmentModificationStatus = LoadStatus.SUCCEEDED;
        // Remove the assignment from the list
        state.assignments = state.assignments.filter(
          (a) => a._id !== action.payload._id
        );
        // Remove the assignment from the sections
        state.sections = state.sections.map((s) => ({
          ...s,
          assignments: s.assignments.filter(
            (a) => a.assignmentId !== action.payload._id
          ),
        }));
      })
      .addCase(deleteAssignment.rejected, (state) => {
        state.assignmentModificationStatus = LoadStatus.FAILED;
      })

      // Section enrollment
      .addCase(enrollInSection.pending, (state) => {
        state.enrollmentModificationStatus = LoadStatus.LOADING;
      })
      .addCase(enrollInSection.fulfilled, (state, action) => {
        state.enrollmentModificationStatus = LoadStatus.SUCCEEDED;
        // Update the student data in the students list
        const studentIndex = state.students.findIndex(
          (s) => s.userId === action.payload.userId
        );
        if (studentIndex >= 0) {
          state.students[studentIndex] = action.payload;
        } else {
          // If student not in list, add them
          state.students.push(action.payload);
        }
        if (state.studentData?.userId === action.payload.userId) {
          state.studentData = action.payload;
        }
      })
      .addCase(enrollInSection.rejected, (state) => {
        state.enrollmentModificationStatus = LoadStatus.FAILED;
      })

      // Section removal
      .addCase(removeFromSection.pending, (state) => {
        state.enrollmentModificationStatus = LoadStatus.LOADING;
      })
      .addCase(removeFromSection.fulfilled, (state, action) => {
        state.enrollmentModificationStatus = LoadStatus.SUCCEEDED;
        // Update the student data in the students list
        const studentIndex = state.students.findIndex(
          (s) => s.userId === action.payload.userId
        );
        if (studentIndex >= 0) {
          state.students[studentIndex] = action.payload;
        }
        if (state.studentData?.userId === action.payload.userId) {
          state.studentData = action.payload;
        }
      })
      .addCase(removeFromSection.rejected, (state) => {
        state.enrollmentModificationStatus = LoadStatus.FAILED;
      })

      // Assignment progress update
      .addCase(updateStudentAssignmentProgress.pending, (state) => {
        state.enrollmentModificationStatus = LoadStatus.LOADING;
      })
      .addCase(updateStudentAssignmentProgress.fulfilled, (state, action) => {
        state.enrollmentModificationStatus = LoadStatus.SUCCEEDED;
        // Update the student data in the students list
        const studentIndex = state.students.findIndex(
          (s) => s.userId === action.payload.userId
        );
        if (studentIndex >= 0) {
          state.students[studentIndex] = action.payload;
        }
        if (state.studentData?.userId === action.payload.userId) {
          state.studentData = action.payload;
        }
      })
      .addCase(updateStudentAssignmentProgress.rejected, (state) => {
        state.enrollmentModificationStatus = LoadStatus.FAILED;
      });
  },
});

export const { setViewState } = educationManagementSlice.actions;

export default educationManagementSlice.reducer;
