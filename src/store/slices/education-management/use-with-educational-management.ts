import { fetchCourses as _fetchCourses, fetchAssignments as _fetchAssignments, LoadStatus } from '.';
import { Course, Assignment } from './educational-api';
import { useAppDispatch, useAppSelector } from '../../hooks';

export interface UseWithEducationalManagement {
  loadCourses: (forUserId: string) => Promise<Course[]>;
  loadAssignments: (forUserId: string) => Promise<Assignment[]>;
  courses: Course[];
  assignments: Assignment[];
  isLoading: boolean;
}

export function useWithEducationalManagement(): UseWithEducationalManagement {
  const dispatch = useAppDispatch();
  const coursesLoadingState = useAppSelector(
    (state) => state.educationManagement.coursesLoadStatus
  );
  const assignmentsLoadingState = useAppSelector(
    (state) => state.educationManagement.assignmentsLoadStatus
  );
  const courses = useAppSelector(
    (state) => state.educationManagement.courses
  );
  const assignments = useAppSelector(
    (state) => state.educationManagement.assignments
  );

  async function loadCourses(forUserId: string) {
    return await dispatch(_fetchCourses(forUserId)).unwrap();
  }

  async function loadAssignments(forUserId: string) {
    return await dispatch(_fetchAssignments(forUserId)).unwrap();
  }

  return {
    loadCourses,
    loadAssignments,
    courses,
    assignments,
    isLoading: coursesLoadingState === LoadStatus.LOADING || assignmentsLoadingState === LoadStatus.LOADING,
  };
}