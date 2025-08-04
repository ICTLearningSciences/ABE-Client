import { fetchCourses as _fetchCourses, fetchAssignments as _fetchAssignments, fetchSections as _fetchSections, fetchStudentsInMyCourses as _fetchStudentsInMyCourses, createCourse as _createCourse, updateCourse as _updateCourse, deleteCourse as _deleteCourse, createSection as _createSection, updateSection as _updateSection, deleteSection as _deleteSection, createAssignment as _createAssignment, updateAssignment as _updateAssignment, deleteAssignment as _deleteAssignment, enrollInSection as _enrollInSection, removeFromSection as _removeFromSection, updateStudentAssignmentProgress as _updateStudentAssignmentProgress, LoadStatus } from '.';
import { Course, Assignment, Section, StudentData } from './educational-api';
import { useAppDispatch, useAppSelector } from '../../hooks';

export interface UseWithEducationalManagement {
  loadCourses: (forUserId: string) => Promise<Course[]>;
  loadAssignments: (forUserId: string) => Promise<Assignment[]>;
  loadSections: (forUserId: string) => Promise<Section[]>;
  loadStudentsInMyCourses: (instructorId: string) => Promise<StudentData[]>;
  createCourse: () => Promise<Course>;
  updateCourse: (courseData: Partial<Course>) => Promise<Course>;
  deleteCourse: (courseId: string) => Promise<Course>;
  createSection: (courseId: string) => Promise<Section>;
  updateSection: (courseId: string, sectionData: Partial<Section>) => Promise<Section>;
  deleteSection: (courseId: string, sectionId: string) => Promise<Section>;
  createAssignment: (courseId: string) => Promise<Assignment>;
  updateAssignment: (courseId: string, assignmentData: Partial<Assignment>) => Promise<Assignment>;
  deleteAssignment: (courseId: string, assignmentId: string) => Promise<Assignment>;
  enrollStudentInSection: (targetUserId: string, courseId: string, sectionId: string, sectionCode: string) => Promise<StudentData>;
  removeStudentFromSection: (targetUserId: string, courseId: string, sectionId: string) => Promise<StudentData>;
  updateStudentAssignmentProgress: (targetUserId: string, courseId: string, sectionId: string, assignmentId: string, progress: 'COMPLETE' | 'INCOMPLETE') => Promise<StudentData>;
  courses: Course[];
  assignments: Assignment[];
  sections: Section[];
  students: StudentData[];
  isLoading: boolean;
  isCourseModifying: boolean;
  courseModificationFailed: boolean;
  isSectionModifying: boolean;
  sectionModificationFailed: boolean;
  isAssignmentModifying: boolean;
  assignmentModificationFailed: boolean;
  isEnrollmentModifying: boolean;
  enrollmentModificationFailed: boolean;
}

export function useWithEducationalManagement(): UseWithEducationalManagement {
  const dispatch = useAppDispatch();
  const coursesLoadingState = useAppSelector(
    (state) => state.educationManagement.coursesLoadStatus
  );
  const assignmentsLoadingState = useAppSelector(
    (state) => state.educationManagement.assignmentsLoadStatus
  );
  const sectionsLoadingState = useAppSelector(
    (state) => state.educationManagement.sectionsLoadStatus
  );
  const studentsLoadingState = useAppSelector(
    (state) => state.educationManagement.studentsLoadStatus
  );
  const courseModificationStatus = useAppSelector(
    (state) => state.educationManagement.courseModificationStatus
  );
  const sectionModificationStatus = useAppSelector(
    (state) => state.educationManagement.sectionModificationStatus
  );
  const assignmentModificationStatus = useAppSelector(
    (state) => state.educationManagement.assignmentModificationStatus
  );
  const enrollmentModificationStatus = useAppSelector(
    (state) => state.educationManagement.enrollmentModificationStatus
  );
  const courses = useAppSelector(
    (state) => state.educationManagement.courses
  );
  const assignments = useAppSelector(
    (state) => state.educationManagement.assignments
  );
  const sections = useAppSelector(
    (state) => state.educationManagement.sections
  );
  const students = useAppSelector(
    (state) => state.educationManagement.students
  );

  async function loadCourses(forUserId: string) {
    return await dispatch(_fetchCourses(forUserId)).unwrap();
  }

  async function loadAssignments(forUserId: string) {
    return await dispatch(_fetchAssignments(forUserId)).unwrap();
  }

  async function loadSections(forUserId: string) {
    return await dispatch(_fetchSections(forUserId)).unwrap();
  }

  async function loadStudentsInMyCourses(instructorId: string) {
    return await dispatch(_fetchStudentsInMyCourses(instructorId)).unwrap();
  }

  async function createCourse() {
    const res = await dispatch(_createCourse());
    return res.payload as Course;
  }

  async function updateCourse(courseData: Partial<Course>) {
    const res = await dispatch(_updateCourse(courseData));
    return res.payload as Course;
  }

  async function deleteCourse(courseId: string) {
    const res = await dispatch(_deleteCourse(courseId));
    return res.payload as Course;
  }

  async function createSection(courseId: string) {
    const res = await dispatch(_createSection(courseId));
    return res.payload as Section;
  }

  async function updateSection(courseId: string, sectionData: Partial<Section>) {
    const res = await dispatch(_updateSection({ courseId, sectionData }));
    return res.payload as Section;
  }

  async function deleteSection(courseId: string, sectionId: string) {
    const res = await dispatch(_deleteSection({ courseId, sectionId }));
    return res.payload as Section;
  }

  async function createAssignment(courseId: string) {
    const res = await dispatch(_createAssignment(courseId));
    return res.payload as Assignment;
  }

  async function updateAssignment(courseId: string, assignmentData: Partial<Assignment>) {
    const res = await dispatch(_updateAssignment({ courseId, assignmentData }));
    return res.payload as Assignment;
  }

  async function deleteAssignment(courseId: string, assignmentId: string) {
    const res = await dispatch(_deleteAssignment({ courseId, assignmentId }));
    return res.payload as Assignment;
  }

  async function enrollStudentInSection(targetUserId: string, courseId: string, sectionId: string, sectionCode: string) {
    const res = await dispatch(_enrollInSection({ targetUserId, courseId, sectionId, sectionCode }));
    return res.payload as StudentData;
  }

  async function removeStudentFromSection(targetUserId: string, courseId: string, sectionId: string) {
    const res = await dispatch(_removeFromSection({ targetUserId, courseId, sectionId }));
    return res.payload as StudentData;
  }

  async function updateStudentAssignmentProgress(targetUserId: string, courseId: string, sectionId: string, assignmentId: string, progress: 'COMPLETE' | 'INCOMPLETE') {
    const res = await dispatch(_updateStudentAssignmentProgress({ targetUserId, courseId, sectionId, assignmentId, progress }));
    return res.payload as StudentData;
  }

  return {
    loadCourses,
    loadAssignments,
    loadSections,
    loadStudentsInMyCourses,
    createCourse,
    updateCourse,
    deleteCourse,
    createSection,
    updateSection,
    deleteSection,
    createAssignment,
    updateAssignment,
    deleteAssignment,
    enrollStudentInSection,
    removeStudentFromSection,
    updateStudentAssignmentProgress,
    courses,
    assignments,
    sections,
    students,
    isLoading: coursesLoadingState === LoadStatus.LOADING || assignmentsLoadingState === LoadStatus.LOADING || sectionsLoadingState === LoadStatus.LOADING || studentsLoadingState === LoadStatus.LOADING,
    isCourseModifying: courseModificationStatus === LoadStatus.LOADING,
    courseModificationFailed: courseModificationStatus === LoadStatus.FAILED,
    isSectionModifying: sectionModificationStatus === LoadStatus.LOADING,
    sectionModificationFailed: sectionModificationStatus === LoadStatus.FAILED,
    isAssignmentModifying: assignmentModificationStatus === LoadStatus.LOADING,
    assignmentModificationFailed: assignmentModificationStatus === LoadStatus.FAILED,
    isEnrollmentModifying: enrollmentModificationStatus === LoadStatus.LOADING,
    enrollmentModificationFailed: enrollmentModificationStatus === LoadStatus.FAILED,
  };
}