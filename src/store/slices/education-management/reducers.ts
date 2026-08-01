/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/

import type { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import type { State } from "./state";
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
} from "./thunks";

export const buildExtraReducers = (builder: ActionReducerMapBuilder<State>) => {
  // Student ban/unban reducers
  builder
    .addCase(banStudentFromSection.pending, (state) => {
      state.sectionModificationStatus = 1;
    })
    .addCase(banStudentFromSection.fulfilled, (state, action) => {
      state.sectionModificationStatus = 2;
      const sectionIndex = state.sections.findIndex(
        (s) => s._id === action.payload.section._id,
      );
      if (sectionIndex >= 0) {
        state.sections[sectionIndex] = action.payload.section;
      }

      const bannedStudentId = action.payload.bannedStudentId;
      const studentIndex = state.students.findIndex(
        (s) => s.userId === bannedStudentId,
      );
      if (studentIndex >= 0) {
        state.students[studentIndex].enrolledSections = state.students[
          studentIndex
        ].enrolledSections.filter((s) => s !== action.payload.section._id);
      }
    })
    .addCase(banStudentFromSection.rejected, (state, action) => {
      state.errorMessage = `Failed to ban student from section: ${action.error.message}`;
      state.sectionModificationStatus = 3;
    })

    .addCase(unbanStudentFromSection.pending, (state) => {
      state.sectionModificationStatus = 1;
    })
    .addCase(unbanStudentFromSection.fulfilled, (state, action) => {
      state.sectionModificationStatus = 2;
      const sectionIndex = state.sections.findIndex(
        (s) => s._id === action.payload.section._id,
      );
      if (sectionIndex >= 0) {
        state.sections[sectionIndex] = action.payload.section;
      }
    })
    .addCase(unbanStudentFromSection.rejected, (state, action) => {
      state.errorMessage = `Failed to unban student from section: ${action.error.message}`;
      state.sectionModificationStatus = 3;
    });

  // Instructor reducers
  builder
    .addCase(fetchInstructors.pending, (state) => {
      state.instructorsLoadStatus = 1;
    })
    .addCase(fetchInstructors.fulfilled, (state, action) => {
      state.instructors = action.payload;
      state.instructorsLoadStatus = 2;
    })
    .addCase(fetchInstructors.rejected, (state) => {
      state.instructorsLoadStatus = 3;
    });

  // Course sharing reducers
  builder
    .addCase(shareCourseWithInstructor.pending, (state) => {
      state.courseModificationStatus = 1;
    })
    .addCase(shareCourseWithInstructor.fulfilled, (state, action) => {
      state.courseModificationStatus = 2;
      // Update the instructor data in the instructors list
      const instructorIndex = state.instructors.findIndex(
        (i) => i.userId === action.payload.userId,
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
      state.courseModificationStatus = 3;
    })

    .addCase(unshareCourseWithInstructor.pending, (state) => {
      state.courseModificationStatus = 1;
    })
    .addCase(unshareCourseWithInstructor.fulfilled, (state, action) => {
      state.courseModificationStatus = 2;
      // Update the instructor data in the instructors list
      const instructorIndex = state.instructors.findIndex(
        (i) => i.userId === action.payload.userId,
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
      state.courseModificationStatus = 3;
    });

  // User data loading reducers
  builder
    .addCase(loadInstructorData.pending, (state) => {
      state.educationalDataLoadStatus = 1;
    })
    .addCase(loadInstructorData.fulfilled, (state, action) => {
      state.educationalDataLoadStatus = 2;
      state.instructorData = action.payload;
    })
    .addCase(loadInstructorData.rejected, (state, action) => {
      state.errorMessage = `Failed to load instructor data: ${action.error.message}`;
      state.educationalDataLoadStatus = 3;
    })

    .addCase(loadStudentData.pending, (state) => {
      state.educationalDataLoadStatus = 1;
    })
    .addCase(loadStudentData.fulfilled, (state, action) => {
      state.educationalDataLoadStatus = 2;
      state.studentData = action.payload;
      state.students = [...state.students, action.payload];
    })
    .addCase(loadStudentData.rejected, (state, action) => {
      state.errorMessage = `Failed to load student data: ${action.error.message}`;
      state.educationalDataLoadStatus = 3;
    });

  // Fetch reducers
  builder
    .addCase(fetchCourses.pending, (state) => {
      state.coursesLoadStatus = 1;
    })
    .addCase(fetchCourses.fulfilled, (state, action) => {
      state.courses = action.payload;
      state.coursesLoadStatus = 2;
    })
    .addCase(fetchCourses.rejected, (state, action) => {
      state.errorMessage = `Failed to fetch courses: ${action.error.message}`;
      state.coursesLoadStatus = 3;
    })

    .addCase(fetchAssignments.pending, (state) => {
      state.assignmentsLoadStatus = 1;
    })
    .addCase(fetchAssignments.fulfilled, (state, action) => {
      state.assignments = action.payload;
      state.assignmentsLoadStatus = 2;
    })
    .addCase(fetchAssignments.rejected, (state, action) => {
      state.errorMessage = `Failed to fetch assignments: ${action.error.message}`;
      state.assignmentsLoadStatus = 3;
    })

    .addCase(fetchSections.pending, (state) => {
      state.sectionsLoadStatus = 1;
    })
    .addCase(fetchSections.fulfilled, (state, action) => {
      state.sections = action.payload;
      state.sectionsLoadStatus = 2;
    })
    .addCase(fetchSections.rejected, (state, action) => {
      state.errorMessage = `Failed to fetch sections: ${action.error.message}`;
      state.sectionsLoadStatus = 3;
    })

    .addCase(fetchStudentsInMyCourses.pending, (state) => {
      state.studentsLoadStatus = 1;
    })
    .addCase(fetchStudentsInMyCourses.fulfilled, (state, action) => {
      state.students = action.payload;
      state.studentsLoadStatus = 2;
    })
    .addCase(fetchStudentsInMyCourses.rejected, (state, action) => {
      state.errorMessage = `Failed to fetch students in my courses: ${action.error.message}`;
      state.studentsLoadStatus = 3;
    });

  // Course CRUD reducers
  builder
    .addCase(createCourse.pending, (state) => {
      state.courseModificationStatus = 1;
    })
    .addCase(createCourse.fulfilled, (state, action) => {
      state.courseModificationStatus = 2;
      // Add the new course to the list
      state.courses.push(action.payload);
      // Add the course to the instructor's courses
      if (state.instructorData) {
        state.instructorData.courses.push({
          courseId: action.payload._id,
          ownership: "OWNER",
        });
      }
    })
    .addCase(createCourse.rejected, (state, action) => {
      state.errorMessage = `Failed to create course: ${action.error.message}`;
      state.courseModificationStatus = 3;
    })

    .addCase(updateCourse.pending, (state) => {
      state.courseModificationStatus = 1;
    })
    .addCase(updateCourse.fulfilled, (state, action) => {
      state.courseModificationStatus = 2;
      // Update the existing course in the list
      const courseIndex = state.courses.findIndex(
        (c) => c._id === action.payload._id,
      );
      if (courseIndex >= 0) {
        state.courses[courseIndex] = action.payload;
      }
    })
    .addCase(updateCourse.rejected, (state, action) => {
      state.errorMessage = `Failed to update course: ${action.error.message}`;
      state.courseModificationStatus = 3;
    })

    .addCase(deleteCourse.pending, (state) => {
      state.courseModificationStatus = 1;
    })
    .addCase(deleteCourse.fulfilled, (state, action) => {
      state.courseModificationStatus = 2;
      // Remove the course from the list
      state.courses = state.courses.filter((c) => c._id !== action.payload._id);
    })
    .addCase(deleteCourse.rejected, (state, action) => {
      state.errorMessage = `Failed to delete course: ${action.error.message}`;
      state.courseModificationStatus = 3;
    });

  // Section CRUD reducers
  builder
    .addCase(createSection.pending, (state) => {
      state.sectionModificationStatus = 1;
    })
    .addCase(createSection.fulfilled, (state, action) => {
      state.sectionModificationStatus = 2;
      // Add the new section to the list
      state.sections.push(action.payload.newSection);
      const courseIndex = state.courses.findIndex(
        (c) => c._id === action.payload.courseId,
      );
      if (courseIndex >= 0) {
        state.courses[courseIndex].sectionIds.push(
          action.payload.newSection._id,
        );
      }
    })
    .addCase(createSection.rejected, (state, action) => {
      state.errorMessage = `Failed to create section: ${action.error.message}`;
      state.sectionModificationStatus = 3;
    })

    .addCase(updateSection.pending, (state) => {
      state.sectionModificationStatus = 1;
    })
    .addCase(updateSection.fulfilled, (state, action) => {
      state.sectionModificationStatus = 2;
      // Update the existing section in the list
      const sectionIndex = state.sections.findIndex(
        (s) => s._id === action.payload._id,
      );
      if (sectionIndex >= 0) {
        state.sections[sectionIndex] = action.payload;
      }
    })
    .addCase(updateSection.rejected, (state, action) => {
      state.errorMessage = `Failed to update section: ${action.error.message}`;
      state.sectionModificationStatus = 3;
    })

    .addCase(deleteSection.pending, (state) => {
      state.sectionModificationStatus = 1;
    })
    .addCase(deleteSection.fulfilled, (state, action) => {
      state.sectionModificationStatus = 2;
      // Remove the section from the list
      state.sections = state.sections.filter(
        (s) => s._id !== action.payload.sectionId,
      );
      const courseIndex = state.courses.findIndex(
        (c) => c._id === action.payload.courseId,
      );
      if (courseIndex >= 0) {
        state.courses[courseIndex].sectionIds = state.courses[
          courseIndex
        ].sectionIds.filter((id) => id !== action.payload.sectionId);
      }
    })
    .addCase(deleteSection.rejected, (state, action) => {
      state.errorMessage = `Failed to delete section: ${action.error.message}`;
      state.sectionModificationStatus = 3;
    });

  // Assignment CRUD reducers
  builder
    .addCase(createAssignment.pending, (state) => {
      state.assignmentModificationStatus = 1;
    })
    .addCase(createAssignment.fulfilled, (state, action) => {
      state.assignmentModificationStatus = 2;
      // Add the new assignment to the list
      state.assignments.push(action.payload);
    })
    .addCase(createAssignment.rejected, (state, action) => {
      state.errorMessage = `Failed to create assignment: ${action.error.message}`;
      state.assignmentModificationStatus = 3;
    })

    .addCase(updateAssignment.pending, (state) => {
      state.assignmentModificationStatus = 1;
    })
    .addCase(updateAssignment.fulfilled, (state, action) => {
      state.assignmentModificationStatus = 2;
      // Update the existing assignment in the list
      const assignmentIndex = state.assignments.findIndex(
        (a) => a._id === action.payload._id,
      );
      if (assignmentIndex >= 0) {
        state.assignments[assignmentIndex] = action.payload;
      }
    })
    .addCase(updateAssignment.rejected, (state, action) => {
      state.errorMessage = `Failed to update assignment: ${action.error.message}`;
      state.assignmentModificationStatus = 3;
    })

    .addCase(deleteAssignment.pending, (state) => {
      state.assignmentModificationStatus = 1;
    })
    .addCase(deleteAssignment.fulfilled, (state, action) => {
      state.assignmentModificationStatus = 2;
      // Remove the assignment from the list
      state.assignments = state.assignments.filter(
        (a) => a._id !== action.payload._id,
      );
      // Remove the assignment from the sections
      state.sections = state.sections.map((s) => ({
        ...s,
        assignments: s.assignments.filter(
          (a) => a.assignmentId !== action.payload._id,
        ),
      }));
    })
    .addCase(deleteAssignment.rejected, (state, action) => {
      state.errorMessage = `Failed to delete assignment: ${action.error.message}`;
      state.assignmentModificationStatus = 3;
    });

  // Enrollment reducers
  builder
    .addCase(enrollInSection.pending, (state) => {
      state.enrollmentModificationStatus = 1;
    })
    .addCase(enrollInSection.fulfilled, (state, action) => {
      state.enrollmentModificationStatus = 2;
      // Update the student data in the students list
      const studentIndex = state.students.findIndex(
        (s) => s.userId === action.payload.userId,
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
      state.enrollmentModificationStatus = 3;
    })

    .addCase(removeFromSection.pending, (state) => {
      state.enrollmentModificationStatus = 1;
    })
    .addCase(removeFromSection.fulfilled, (state, action) => {
      state.enrollmentModificationStatus = 2;
      // Update the student data in the students list
      const studentIndex = state.students.findIndex(
        (s) => s.userId === action.payload.userId,
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
      state.enrollmentModificationStatus = 3;
    })

    .addCase(updateStudentAssignmentProgress.pending, (state) => {
      state.enrollmentModificationStatus = 1;
    })
    .addCase(updateStudentAssignmentProgress.fulfilled, (state, action) => {
      state.enrollmentModificationStatus = 2;
      // Update the student data in the students list
      const studentIndex = state.students.findIndex(
        (s) => s.userId === action.payload.userId,
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
      state.enrollmentModificationStatus = 3;
    })

    // grading student assignment reducers
    .addCase(gradeStudentAssignment.fulfilled, (state, action) => {
      const studentIndex = state.students.findIndex(
        (s) => s.userId === action.payload.userId,
      );
      if (studentIndex >= 0) {
        state.students[studentIndex] = action.payload;
      }
    })
    .addCase(gradeStudentAssignment.rejected, (state, action) => {
      state.errorMessage = `Failed to grade student assignment: ${action.error.message}`;
    });
};
