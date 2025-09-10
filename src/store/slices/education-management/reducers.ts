/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { State, LoadStatus } from './state';
import { CourseOwnership } from './types';
import {
  // Fetch thunks
  fetchCourses,
  fetchAssignments,
  fetchSections,
  fetchStudentsInMyCourses,
  fetchInstructors,
  // Course thunks
  createCourse,
  updateCourse,
  deleteCourse,
  // Section thunks
  createSection,
  updateSection,
  deleteSection,
  // Assignment thunks
  createAssignment,
  updateAssignment,
  deleteAssignment,
  // Enrollment thunks
  enrollInSection,
  removeFromSection,
  updateStudentAssignmentProgress,
  // User data thunks
  loadInstructorData,
  loadStudentData,
  // Course sharing thunks
  shareCourseWithInstructor,
  unshareCourseWithInstructor,
  // Student ban/unban thunks
  banStudentFromSection,
  unbanStudentFromSection,
  gradeStudentAssignment,
} from './thunks';

export const buildExtraReducers = (builder: ActionReducerMapBuilder<State>) => {
  // Student ban/unban reducers
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
    .addCase(banStudentFromSection.rejected, (state, action) => {
      state.errorMessage = `Failed to ban student from section: ${action.error.message}`;
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
    .addCase(unbanStudentFromSection.rejected, (state, action) => {
      state.errorMessage = `Failed to unban student from section: ${action.error.message}`;
      state.sectionModificationStatus = LoadStatus.FAILED;
    });

  // Instructor reducers
  builder
    .addCase(fetchInstructors.pending, (state) => {
      state.instructorsLoadStatus = LoadStatus.LOADING;
    })
    .addCase(fetchInstructors.fulfilled, (state, action) => {
      state.instructors = action.payload;
      state.instructorsLoadStatus = LoadStatus.SUCCEEDED;
    })
    .addCase(fetchInstructors.rejected, (state) => {
      state.instructorsLoadStatus = LoadStatus.FAILED;
    });

  // Course sharing reducers
  builder
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
    .addCase(shareCourseWithInstructor.rejected, (state, action) => {
      state.errorMessage = `Failed to share course with instructor: ${action.error.message}`;
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
    .addCase(unshareCourseWithInstructor.rejected, (state, action) => {
      state.errorMessage = `Failed to unshare course with instructor: ${action.error.message}`;
      state.courseModificationStatus = LoadStatus.FAILED;
    });

  // User data loading reducers
  builder
    .addCase(loadInstructorData.pending, (state) => {
      state.educationalDataLoadStatus = LoadStatus.LOADING;
    })
    .addCase(loadInstructorData.fulfilled, (state, action) => {
      state.educationalDataLoadStatus = LoadStatus.SUCCEEDED;
      state.instructorData = action.payload;
    })
    .addCase(loadInstructorData.rejected, (state, action) => {
      state.errorMessage = `Failed to load instructor data: ${action.error.message}`;
      state.educationalDataLoadStatus = LoadStatus.FAILED;
    })

    .addCase(loadStudentData.pending, (state) => {
      state.educationalDataLoadStatus = LoadStatus.LOADING;
    })
    .addCase(loadStudentData.fulfilled, (state, action) => {
      state.educationalDataLoadStatus = LoadStatus.SUCCEEDED;
      state.studentData = action.payload;
      state.students = [...state.students, action.payload];
    })
    .addCase(loadStudentData.rejected, (state, action) => {
      state.errorMessage = `Failed to load student data: ${action.error.message}`;
      state.educationalDataLoadStatus = LoadStatus.FAILED;
    });

  // Fetch reducers
  builder
    .addCase(fetchCourses.pending, (state) => {
      state.coursesLoadStatus = LoadStatus.LOADING;
    })
    .addCase(fetchCourses.fulfilled, (state, action) => {
      state.courses = action.payload;
      state.coursesLoadStatus = LoadStatus.SUCCEEDED;
    })
    .addCase(fetchCourses.rejected, (state, action) => {
      state.errorMessage = `Failed to fetch courses: ${action.error.message}`;
      state.coursesLoadStatus = LoadStatus.FAILED;
    })

    .addCase(fetchAssignments.pending, (state) => {
      state.assignmentsLoadStatus = LoadStatus.LOADING;
    })
    .addCase(fetchAssignments.fulfilled, (state, action) => {
      state.assignments = action.payload;
      state.assignmentsLoadStatus = LoadStatus.SUCCEEDED;
    })
    .addCase(fetchAssignments.rejected, (state, action) => {
      state.errorMessage = `Failed to fetch assignments: ${action.error.message}`;
      state.assignmentsLoadStatus = LoadStatus.FAILED;
    })

    .addCase(fetchSections.pending, (state) => {
      state.sectionsLoadStatus = LoadStatus.LOADING;
    })
    .addCase(fetchSections.fulfilled, (state, action) => {
      state.sections = action.payload;
      state.sectionsLoadStatus = LoadStatus.SUCCEEDED;
    })
    .addCase(fetchSections.rejected, (state, action) => {
      state.errorMessage = `Failed to fetch sections: ${action.error.message}`;
      state.sectionsLoadStatus = LoadStatus.FAILED;
    })

    .addCase(fetchStudentsInMyCourses.pending, (state) => {
      state.studentsLoadStatus = LoadStatus.LOADING;
    })
    .addCase(fetchStudentsInMyCourses.fulfilled, (state, action) => {
      state.students = action.payload;
      state.studentsLoadStatus = LoadStatus.SUCCEEDED;
    })
    .addCase(fetchStudentsInMyCourses.rejected, (state, action) => {
      state.errorMessage = `Failed to fetch students in my courses: ${action.error.message}`;
      state.studentsLoadStatus = LoadStatus.FAILED;
    });

  // Course CRUD reducers
  builder
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
    .addCase(createCourse.rejected, (state, action) => {
      state.errorMessage = `Failed to create course: ${action.error.message}`;
      state.courseModificationStatus = LoadStatus.FAILED;
    })

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
    .addCase(updateCourse.rejected, (state, action) => {
      state.errorMessage = `Failed to update course: ${action.error.message}`;
      state.courseModificationStatus = LoadStatus.FAILED;
    })

    .addCase(deleteCourse.pending, (state) => {
      state.courseModificationStatus = LoadStatus.LOADING;
    })
    .addCase(deleteCourse.fulfilled, (state, action) => {
      state.courseModificationStatus = LoadStatus.SUCCEEDED;
      // Remove the course from the list
      state.courses = state.courses.filter((c) => c._id !== action.payload._id);
    })
    .addCase(deleteCourse.rejected, (state, action) => {
      state.errorMessage = `Failed to delete course: ${action.error.message}`;
      state.courseModificationStatus = LoadStatus.FAILED;
    });

  // Section CRUD reducers
  builder
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
    .addCase(createSection.rejected, (state, action) => {
      state.errorMessage = `Failed to create section: ${action.error.message}`;
      state.sectionModificationStatus = LoadStatus.FAILED;
    })

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
    .addCase(updateSection.rejected, (state, action) => {
      state.errorMessage = `Failed to update section: ${action.error.message}`;
      state.sectionModificationStatus = LoadStatus.FAILED;
    })

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
    .addCase(deleteSection.rejected, (state, action) => {
      state.errorMessage = `Failed to delete section: ${action.error.message}`;
      state.sectionModificationStatus = LoadStatus.FAILED;
    });

  // Assignment CRUD reducers
  builder
    .addCase(createAssignment.pending, (state) => {
      state.assignmentModificationStatus = LoadStatus.LOADING;
    })
    .addCase(createAssignment.fulfilled, (state, action) => {
      state.assignmentModificationStatus = LoadStatus.SUCCEEDED;
      // Add the new assignment to the list
      state.assignments.push(action.payload);
    })
    .addCase(createAssignment.rejected, (state, action) => {
      state.errorMessage = `Failed to create assignment: ${action.error.message}`;
      state.assignmentModificationStatus = LoadStatus.FAILED;
    })

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
    .addCase(updateAssignment.rejected, (state, action) => {
      state.errorMessage = `Failed to update assignment: ${action.error.message}`;
      state.assignmentModificationStatus = LoadStatus.FAILED;
    })

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
    .addCase(deleteAssignment.rejected, (state, action) => {
      state.errorMessage = `Failed to delete assignment: ${action.error.message}`;
      state.assignmentModificationStatus = LoadStatus.FAILED;
    });

  // Enrollment reducers
  builder
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
    .addCase(enrollInSection.rejected, (state, action) => {
      state.errorMessage = `Failed to enroll in section: ${action.error.message}`;
      state.enrollmentModificationStatus = LoadStatus.FAILED;
    })

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
    .addCase(removeFromSection.rejected, (state, action) => {
      state.errorMessage = `Failed to remove from section: ${action.error.message}`;
      state.enrollmentModificationStatus = LoadStatus.FAILED;
    })

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
    .addCase(updateStudentAssignmentProgress.rejected, (state, action) => {
      state.errorMessage = `Failed to update student assignment progress: ${action.error.message}`;
      state.enrollmentModificationStatus = LoadStatus.FAILED;
    })

    // grading student assignment reducers
    .addCase(gradeStudentAssignment.fulfilled, (state, action) => {
      const studentIndex = state.students.findIndex(
        (s) => s.userId === action.payload.userId
      );
      if (studentIndex >= 0) {
        state.students[studentIndex] = action.payload;
      }
    })
    .addCase(gradeStudentAssignment.rejected, (state, action) => {
      state.errorMessage = `Failed to grade student assignment: ${action.error.message}`;
    });
};
