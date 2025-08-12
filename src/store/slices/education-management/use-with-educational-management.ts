import {
  fetchCourses as _fetchCourses,
  fetchAssignments as _fetchAssignments,
  fetchSections as _fetchSections,
  fetchStudentsInMyCourses as _fetchStudentsInMyCourses,
  createCourse as _createCourse,
  updateCourse as _updateCourse,
  deleteCourse as _deleteCourse,
  createSection as _createSection,
  updateSection as _updateSection,
  deleteSection as _deleteSection,
  createAssignment as _createAssignment,
  updateAssignment as _updateAssignment,
  deleteAssignment as _deleteAssignment,
  enrollInSection as _enrollInSection,
  removeFromSection as _removeFromSection,
  updateStudentAssignmentProgress as _updateStudentAssignmentProgress,
  LoadStatus,
  loadInstructorData as _loadInstructorData,
  loadStudentData as _loadStudentData,
  fetchInstructors as _fetchInstructors,
  shareCourseWithInstructor as _shareCourseWithInstructor,
  unshareCourseWithInstructor as _unshareCourseWithInstructor,
} from '.';
import {
  Course,
  Assignment,
  Section,
  StudentData,
  ActivityCompletion,
  Instructor,
} from './types';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { EducationalRole } from '../../../types';
import { useMemo } from 'react';
import {
  getAssignmentsInSection,
  getStudentSectionProgress,
  StudentSectionProgress,
} from '../../../pages/instructor/helpers';

export interface UseWithEducationalManagement {
  loadCourses: (forUserId: string) => Promise<Course[]>;
  loadAssignments: (forUserId: string) => Promise<Assignment[]>;
  loadSections: (forUserId: string) => Promise<Section[]>;
  loadStudentsInMyCourses: (instructorId: string) => Promise<StudentData[]>;
  loadAllEducationalData: (forUserId: string) => Promise<{
    courses: Course[];
    assignments: Assignment[];
    sections: Section[];
    students: StudentData[];
  }>;
  loadAllEducationalDataWithUserData: (
    forUserId: string,
    educationalRole: EducationalRole
  ) => Promise<{
    courses: Course[];
    assignments: Assignment[];
    sections: Section[];
    students: StudentData[];
    userData: StudentData | Instructor;
  }>;
  createCourse: (courseData?: Partial<Course>) => Promise<Course>;
  updateCourse: (courseData: Partial<Course>) => Promise<Course>;
  deleteCourse: (courseId: string) => Promise<Course>;
  createSection: (
    courseId: string,
    sectionData?: Partial<Section>
  ) => Promise<Section>;
  updateSection: (
    courseId: string,
    sectionData: Partial<Section>
  ) => Promise<Section>;
  deleteSection: (courseId: string, sectionId: string) => Promise<Section>;
  createAssignment: (
    courseId: string,
    assignmentData?: Partial<Assignment>
  ) => Promise<Assignment>;
  updateAssignment: (
    courseId: string,
    assignmentData: Partial<Assignment>
  ) => Promise<Assignment>;
  deleteAssignment: (
    courseId: string,
    assignmentId: string
  ) => Promise<Assignment>;
  enrollStudentInSection: (
    targetUserId: string,
    sectionCode: string
  ) => Promise<StudentData>;
  removeStudentFromSection: (
    targetUserId: string,
    courseId: string,
    sectionId: string
  ) => Promise<StudentData>;
  updateStudentAssignmentProgress: (
    targetUserId: string,
    courseId: string,
    sectionId: string,
    assignmentId: string,
    activityCompletions: ActivityCompletion[]
  ) => Promise<StudentData>;
  loadInstructors: () => Promise<Instructor[]>;
  courses: Course[];
  assignments: Assignment[];
  sections: Section[];
  students: StudentData[];
  instructors: Instructor[];
  myData: StudentData | Instructor | undefined;
  isLoading: boolean;
  isCourseModifying: boolean;
  courseModificationFailed: boolean;
  isSectionModifying: boolean;
  sectionModificationFailed: boolean;
  isAssignmentModifying: boolean;
  assignmentModificationFailed: boolean;
  isEnrollmentModifying: boolean;
  enrollmentModificationFailed: boolean;
  addAssignmentToSection: (
    courseId: string,
    sectionId: string,
    assignmentId: string,
    mandatory: boolean
  ) => Promise<Section>;
  getSectionForSectionId: (sectionId: string) => Section | undefined;
  getStudentsInSection: (sectionId: string) => StudentData[];
  loadUserEducationalData: (
    forUserId: string,
    educationalRole: EducationalRole
  ) => void;
  allSectionsStudentsProgress: AllSectionsStudentsProgress;
  shareCourseWithInstructor: (
    instructorId: string,
    courseId: string
  ) => Promise<Instructor>;
  unshareCourseWithInstructor: (
    instructorId: string,
    courseId: string
  ) => Promise<Instructor>;
}

export interface SectionStudentsProgress {
  [studentId: string]: StudentSectionProgress;
}

export interface AllSectionsStudentsProgress {
  [sectionId: string]: SectionStudentsProgress;
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
  const courses = useAppSelector((state) => state.educationManagement.courses);
  const assignments = useAppSelector(
    (state) => state.educationManagement.assignments
  );
  const sections = useAppSelector(
    (state) => state.educationManagement.sections
  );
  const students = useAppSelector(
    (state) => state.educationManagement.students
  );
  const instructors = useAppSelector(
    (state) => state.educationManagement.instructors
  );
  const myData = useAppSelector(
    (state) =>
      state.educationManagement.instructorData ||
      state.educationManagement.studentData
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
    const res = await dispatch(_fetchStudentsInMyCourses(instructorId));
    return res.payload as StudentData[];
  }

  async function createCourse(courseData?: Partial<Course>) {
    const res = await dispatch(_createCourse(courseData));
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

  async function createSection(
    courseId: string,
    sectionData?: Partial<Section>
  ) {
    const res = await dispatch(_createSection({ courseId, sectionData }));
    return res.payload as Section;
  }

  async function updateSection(
    courseId: string,
    sectionData: Partial<Section>
  ) {
    const res = await dispatch(_updateSection({ courseId, sectionData }));
    return res.payload as Section;
  }

  async function deleteSection(courseId: string, sectionId: string) {
    const res = await dispatch(_deleteSection({ courseId, sectionId }));
    return res.payload as Section;
  }

  async function createAssignment(
    courseId: string,
    assignmentData?: Partial<Assignment>
  ) {
    const res = await dispatch(_createAssignment({ courseId, assignmentData }));
    return res.payload as Assignment;
  }

  async function updateAssignment(
    courseId: string,
    assignmentData: Partial<Assignment>
  ) {
    const res = await dispatch(_updateAssignment({ courseId, assignmentData }));
    return res.payload as Assignment;
  }

  async function deleteAssignment(courseId: string, assignmentId: string) {
    const res = await dispatch(_deleteAssignment({ courseId, assignmentId }));
    return res.payload as Assignment;
  }

  async function enrollStudentInSection(
    targetUserId: string,
    sectionCode: string
  ) {
    return await dispatch(
      _enrollInSection({ targetUserId, sectionCode })
    ).unwrap();
  }

  async function removeStudentFromSection(
    targetUserId: string,
    courseId: string,
    sectionId: string
  ) {
    const res = await dispatch(
      _removeFromSection({ targetUserId, courseId, sectionId })
    );
    return res.payload as StudentData;
  }

  async function updateStudentAssignmentProgress(
    targetUserId: string,
    courseId: string,
    sectionId: string,
    assignmentId: string,
    activityCompletions: ActivityCompletion[]
  ) {
    const res = await dispatch(
      _updateStudentAssignmentProgress({
        targetUserId,
        courseId,
        sectionId,
        assignmentId,
        activityCompletions,
      })
    );
    return res.payload as StudentData;
  }

  async function addAssignmentToSection(
    courseId: string,
    sectionId: string,
    assignmentId: string,
    mandatory: boolean
  ) {
    const section = sections.find((s) => s._id === sectionId);
    if (!section) {
      throw new Error('Section not found');
    }
    const assignmentAlreadyExists = section.assignments.some(
      (a) => a.assignmentId === assignmentId
    );
    if (assignmentAlreadyExists) {
      throw new Error('Assignment already exists in section');
    }
    const newAssignmentList = [
      ...section.assignments,
      { assignmentId, mandatory },
    ];
    const res = await dispatch(
      _updateSection({
        courseId,
        sectionData: { _id: sectionId, assignments: newAssignmentList },
      })
    ).unwrap();
    return res as Section;
  }

  function getSectionForSectionId(sectionId: string) {
    return sections.find((s) => s._id === sectionId);
  }

  function getStudentsInSection(sectionId: string) {
    return students.filter((s) => s.enrolledSections.includes(sectionId));
  }

  function loadUserEducationalData(
    forUserId: string,
    educationalRole: EducationalRole
  ) {
    if (educationalRole === EducationalRole.INSTRUCTOR) {
      dispatch(_loadInstructorData(forUserId));
    } else if (educationalRole === EducationalRole.STUDENT) {
      dispatch(_loadStudentData(forUserId));
    } else {
      throw new Error('Invalid educational role');
    }
  }

  const allSectionsStudentsProgress: AllSectionsStudentsProgress =
    useMemo(() => {
      const allSectionsStudentsProgress: AllSectionsStudentsProgress = {};
      for (const section of sections) {
        const assignmentsInSection = getAssignmentsInSection(
          assignments,
          section
        );
        allSectionsStudentsProgress[section._id] = students
          .filter((student) => student.enrolledSections.includes(section._id))
          .reduce(
            (acc, student) => {
              acc[student._id] = getStudentSectionProgress(
                student,
                assignmentsInSection
              );
              return acc;
            },
            {} as { [studentId: string]: StudentSectionProgress }
          );
      }
      return allSectionsStudentsProgress;
    }, [students, sections, assignments]);

  async function loadAllEducationalData(forUserId: string) {
    const [courses, assignments, sections, students] = await Promise.all([
      dispatch(_fetchCourses(forUserId)).unwrap(),
      dispatch(_fetchAssignments(forUserId)).unwrap(),
      dispatch(_fetchSections(forUserId)).unwrap(),
      dispatch(_fetchStudentsInMyCourses(forUserId)).unwrap(),
    ]);

    return {
      courses,
      assignments,
      sections,
      students,
    };
  }

  async function loadAllEducationalDataWithUserData(
    forUserId: string,
    educationalRole: EducationalRole
  ) {
    // Perform all fetches in parallel including user data

    const userData =
      educationalRole === EducationalRole.INSTRUCTOR
        ? await dispatch(_loadInstructorData(forUserId)).unwrap()
        : await dispatch(_loadStudentData(forUserId)).unwrap();

    const [courses, assignments, sections, students, instructors] =
      await Promise.all([
        dispatch(_fetchCourses(forUserId)).unwrap(),
        dispatch(_fetchAssignments(forUserId)).unwrap(),
        dispatch(_fetchSections(forUserId)).unwrap(),
        dispatch(_fetchStudentsInMyCourses(forUserId)).unwrap(),
        educationalRole === EducationalRole.INSTRUCTOR
          ? dispatch(_fetchInstructors()).unwrap()
          : [],
      ]);

    return {
      courses,
      assignments,
      sections,
      students,
      instructors,
      userData,
    };
  }

  async function loadInstructors() {
    const res = await dispatch(_fetchInstructors());
    return res.payload as Instructor[];
  }

  async function shareCourseWithInstructor(
    instructorId: string,
    courseId: string
  ) {
    const res = await dispatch(
      _shareCourseWithInstructor({ instructorId, courseId })
    );
    return res.payload as Instructor;
  }

  async function unshareCourseWithInstructor(
    instructorId: string,
    courseId: string
  ) {
    const res = await dispatch(
      _unshareCourseWithInstructor({ instructorId, courseId })
    );
    return res.payload as Instructor;
  }

  return {
    loadCourses,
    loadAssignments,
    loadSections,
    loadStudentsInMyCourses,
    loadAllEducationalData,
    loadAllEducationalDataWithUserData,
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
    loadInstructors,
    courses,
    assignments,
    sections,
    students,
    instructors,
    myData,
    isLoading:
      coursesLoadingState === LoadStatus.LOADING ||
      assignmentsLoadingState === LoadStatus.LOADING ||
      sectionsLoadingState === LoadStatus.LOADING ||
      studentsLoadingState === LoadStatus.LOADING,
    isCourseModifying: courseModificationStatus === LoadStatus.LOADING,
    courseModificationFailed: courseModificationStatus === LoadStatus.FAILED,
    isSectionModifying: sectionModificationStatus === LoadStatus.LOADING,
    sectionModificationFailed: sectionModificationStatus === LoadStatus.FAILED,
    isAssignmentModifying: assignmentModificationStatus === LoadStatus.LOADING,
    assignmentModificationFailed:
      assignmentModificationStatus === LoadStatus.FAILED,
    isEnrollmentModifying: enrollmentModificationStatus === LoadStatus.LOADING,
    enrollmentModificationFailed:
      enrollmentModificationStatus === LoadStatus.FAILED,
    allSectionsStudentsProgress,
    addAssignmentToSection,
    getSectionForSectionId,
    getStudentsInSection,
    loadUserEducationalData,
    shareCourseWithInstructor,
    unshareCourseWithInstructor,
  };
}
