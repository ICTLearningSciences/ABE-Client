import { fetchCourses as _fetchCourses, LoadStatus } from '.';
import { Course } from './educational-api';
import { useAppDispatch, useAppSelector } from '../../hooks';

export interface UseWithEducationalManagement {
  loadCourses: (forUserId: string) => Promise<Course[]>;
  courses: Course[];
  isLoading: boolean;
}

export function useWithEducationalManagement(): UseWithEducationalManagement {
  const dispatch = useAppDispatch();
  const coursesLoadingState = useAppSelector(
    (state) => state.educationManagement.coursesLoadStatus
  );
  const courses = useAppSelector(
    (state) => state.educationManagement.courses
  );

  async function loadCourses(forUserId: string) {
    return await dispatch(_fetchCourses(forUserId)).unwrap();
  }

  return {
    loadCourses,
    courses,
    isLoading: coursesLoadingState === LoadStatus.LOADING,
  };
}