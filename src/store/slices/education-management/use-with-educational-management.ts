import { fetchCourses as _fetchCourses, fetchAssignments as _fetchAssignments, fetchSections as _fetchSections, fetchStudentsInMyCourses as _fetchStudentsInMyCourses, createCourse as _createCourse, updateCourse as _updateCourse, deleteCourse as _deleteCourse, LoadStatus } from '.';
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
  courses: Course[];
  assignments: Assignment[];
  sections: Section[];
  students: StudentData[];
  isLoading: boolean;
  isCourseModifying: boolean;
  courseModificationFailed: boolean;
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

  return {
    loadCourses,
    loadAssignments,
    loadSections,
    loadStudentsInMyCourses,
    createCourse,
    updateCourse,
    deleteCourse,
    courses,
    assignments,
    sections,
    students,
    isLoading: coursesLoadingState === LoadStatus.LOADING || assignmentsLoadingState === LoadStatus.LOADING || sectionsLoadingState === LoadStatus.LOADING || studentsLoadingState === LoadStatus.LOADING,
    isCourseModifying: courseModificationStatus === LoadStatus.LOADING,
    courseModificationFailed: courseModificationStatus === LoadStatus.FAILED,
  };
}