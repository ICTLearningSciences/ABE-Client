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
  CourseManagementState,
  setViewState,
  banStudentFromSection as _banStudentFromSection,
  unbanStudentFromSection as _unbanStudentFromSection,
  gradeStudentAssignment as _gradeStudentAssignment,
} from '.';
import {
  Course,
  Assignment,
  Section,
  StudentData,
  ActivityCompletion,
  Instructor,
  AssignmentProgress,
  isInstructorData,
} from './types';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { EducationalRole } from '../../../types';
import { useMemo } from 'react';
import {
  getAssignmentsInSection,
  getStudentSectionProgress,
  StudentSectionProgress,
} from '../../../pages/instructor/helpers';
import { ModifyStudentAssignmentProgressActions } from './educational-api';

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
  studentActivityStarted: (
    targetUserId: string,
    courseId: string,
    sectionId: string,
    assignmentId: string,
    activityId: string
  ) => Promise<StudentData>;
  studentActivityCompleted: (
    targetUserId: string,
    courseId: string,
    sectionId: string,
    assignmentId: string,
    activityId: string
  ) => Promise<StudentData>;
  studentActivityNewDocCreated: (
    targetUserId: string,
    courseId: string,
    sectionId: string,
    assignmentId: string,
    activityId: string,
    docId: string
  ) => Promise<StudentData>;
  studentActivityDocPrimaryStatusSet: (docId: string) => Promise<StudentData>;
  studentActivityDocDeleted: (
    targetUserId: string,
    courseId: string,
    sectionId: string,
    assignmentId: string,
    activityId: string,
    docId: string
  ) => Promise<StudentData>;
  loadInstructors: () => Promise<Instructor[]>;
  courses: Course[];
  assignments: Assignment[];
  sections: Section[];
  students: StudentData[];
  instructors: Instructor[];
  myData: StudentData | Instructor | undefined;
  viewState: CourseManagementState;
  isLoading: boolean;
  sectionsLoadState: LoadStatus;
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
  ) => Promise<StudentData | Instructor>;
  allSectionsStudentsProgress: AllSectionsStudentsProgress;
  shareCourseWithInstructor: (
    instructorId: string,
    courseId: string
  ) => Promise<Instructor>;
  unshareCourseWithInstructor: (
    instructorId: string,
    courseId: string
  ) => Promise<Instructor>;
  viewCourse: (courseId: string) => Promise<void>;
  viewSection: (sectionId: string) => Promise<void>;
  viewAssignment: (assignmentId: string) => Promise<void>;
  viewActivity: (activityId: string) => Promise<void>;
  viewAssignmentDocumentTimelines: (
    studentId: string,
    assignmentId: string,
    docId?: string
  ) => Promise<void>;
  viewStudentInfo: (studentId: string) => Promise<void>;
  viewDashboard: () => Promise<void>;
  haveICompletedActivity: (assignmentId: string, activityId: string) => boolean;
  banStudentFromSection: (
    sectionId: string,
    studentId: string
  ) => Promise<Section>;
  unbanStudentFromSection: (
    sectionId: string,
    studentId: string
  ) => Promise<Section>;
  updateSelectedDocId: (docId: string) => Promise<void>;
  gradeStudentAssignment: (
    grade: number,
    comment: string
  ) => Promise<StudentData>;
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
  const educationalDataLoadStatus = useAppSelector(
    (state) => state.educationManagement.educationalDataLoadStatus
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
  const viewState = useAppSelector(
    (state) => state.educationManagement.viewState
  );

  const activities = useAppSelector(
    (state) => state.docGoalsActivities.builtActivities
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
    const res = await dispatch(
      _enrollInSection({ targetUserId, sectionCode })
    ).unwrap();
    await loadAllEducationalData(targetUserId);
    return res as StudentData;
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

  async function studentActivityStarted(
    targetUserId: string,
    courseId: string,
    sectionId: string,
    assignmentId: string,
    activityId: string
  ) {
    if (!myData) {
      throw new Error('no user educational data found');
    }
    if (isInstructorData(myData)) {
      throw new Error('instructor cannot start activity');
    }
    const assignmentProgress = myData.assignmentProgress.find(
      (a) => a.assignmentId === assignmentId
    );
    const activityAlreadyInProgress = Boolean(
      assignmentProgress?.activityCompletions.some(
        (ac) => ac.activityId === activityId
      )
    );
    if (activityAlreadyInProgress) {
      //  if activity already in progress, no-op
      return myData;
    }
    const res = await dispatch(
      _updateStudentAssignmentProgress({
        targetUserId,
        courseId,
        sectionId,
        assignmentId,
        activityId,
        action: ModifyStudentAssignmentProgressActions.ACTIVITY_STARTED,
      })
    );
    return res.payload as StudentData;
  }

  async function studentActivityCompleted(
    targetUserId: string,
    courseId: string,
    sectionId: string,
    assignmentId: string,
    activityId: string
  ) {
    if (!myData) {
      throw new Error('no user educational data found');
    }
    if (isInstructorData(myData)) {
      throw new Error('instructor cannot complete activity');
    }
    // if activity already completed, no-op
    if (haveICompletedActivity(assignmentId, activityId)) {
      return myData;
    }
    const res = await dispatch(
      _updateStudentAssignmentProgress({
        targetUserId,
        courseId,
        sectionId,
        assignmentId,
        activityId,
        action: ModifyStudentAssignmentProgressActions.ACTIVITY_COMPLETED,
      })
    );
    return res.payload as StudentData;
  }

  async function studentActivityNewDocCreated(
    targetUserId: string,
    courseId: string,
    sectionId: string,
    assignmentId: string,
    activityId: string,
    docId: string
  ) {
    const res = await dispatch(
      _updateStudentAssignmentProgress({
        targetUserId,
        courseId,
        sectionId,
        assignmentId,
        activityId,
        action: ModifyStudentAssignmentProgressActions.NEW_DOC_CREATED,
        docId,
      })
    );
    return res.payload as StudentData;
  }

  async function studentActivityDocPrimaryStatusSet(docId: string) {
    if (
      !viewState.selectedCourseId ||
      !viewState.selectedSectionId ||
      !viewState.selectedAssignmentId ||
      !viewState.selectedActivityId
    ) {
      throw new Error('No course, section, assignment, activity selected');
    }
    if (!myData) {
      throw new Error('no user educational data found');
    }
    if (isInstructorData(myData)) {
      throw new Error('only students can set doc primary status');
    }
    const assignmentProgress = myData.assignmentProgress.find(
      (a) => a.assignmentId === viewState.selectedAssignmentId
    );
    const docAlreadyPrimary = Boolean(
      assignmentProgress?.relevantGoogleDocs.some(
        (rd) => rd.docId === docId && rd.primaryDocument
      )
    );
    if (docAlreadyPrimary) {
      return myData;
    }
    const res = await dispatch(
      _updateStudentAssignmentProgress({
        targetUserId: myData.userId,
        courseId: viewState.selectedCourseId,
        sectionId: viewState.selectedSectionId,
        assignmentId: viewState.selectedAssignmentId,
        activityId: viewState.selectedActivityId,
        action: ModifyStudentAssignmentProgressActions.DOC_PRIMARY_STATUS_SET,
        docId,
      })
    );
    return res.payload as StudentData;
  }

  async function studentActivityDocDeleted(
    targetUserId: string,
    courseId: string,
    sectionId: string,
    assignmentId: string,
    activityId: string,
    docId: string
  ) {
    const res = await dispatch(
      _updateStudentAssignmentProgress({
        targetUserId,
        courseId,
        sectionId,
        assignmentId,
        activityId,
        action: ModifyStudentAssignmentProgressActions.DOC_DELETED,
        docId,
      })
    );
    return res.payload as StudentData;
  }

  async function gradeStudentAssignment(grade: number, comment: string) {
    if (!viewState.selectedStudentId || !viewState.selectedAssignmentId) {
      throw new Error('No student or assignment selected');
    }
    return await dispatch(
      _gradeStudentAssignment({
        studentId: viewState.selectedStudentId,
        assignmentId: viewState.selectedAssignmentId,
        grade,
        comment,
      })
    ).unwrap();
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

  async function loadUserEducationalData(
    forUserId: string,
    educationalRole: EducationalRole
  ) {
    if (educationalRole === EducationalRole.INSTRUCTOR) {
      return await dispatch(_loadInstructorData(forUserId)).unwrap();
    } else if (educationalRole === EducationalRole.STUDENT) {
      return await dispatch(_loadStudentData(forUserId)).unwrap();
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
    const isInstructor = myData && isInstructorData(myData);
    const [courses, assignments, sections, students] = await Promise.all([
      dispatch(_fetchCourses(forUserId)).unwrap(),
      dispatch(_fetchAssignments(forUserId)).unwrap(),
      dispatch(_fetchSections(forUserId)).unwrap(),
      isInstructor
        ? dispatch(_fetchStudentsInMyCourses(forUserId)).unwrap()
        : [],
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
        educationalRole === EducationalRole.INSTRUCTOR
          ? dispatch(_fetchStudentsInMyCourses(forUserId)).unwrap()
          : [],
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

  async function viewDashboard() {
    dispatch(setViewState({ view: 'dashboard' }));
  }

  async function viewCourse(courseId: string) {
    dispatch(setViewState({ view: 'course', selectedCourseId: courseId }));
  }

  async function viewSection(sectionId: string) {
    if (!viewState.selectedCourseId) {
      throw new Error('No course selected in viewSection');
    }
    dispatch(
      setViewState({
        view: 'section',
        selectedCourseId: viewState.selectedCourseId,
        selectedSectionId: sectionId,
      })
    );
  }

  async function viewAssignment(assignmentId: string) {
    if (!viewState.selectedCourseId || !viewState.selectedSectionId) {
      throw new Error('No course or section selected');
    }
    dispatch(
      setViewState({
        view: 'assignment',
        selectedCourseId: viewState.selectedCourseId,
        selectedSectionId: viewState.selectedSectionId,
        selectedAssignmentId: assignmentId,
      })
    );
  }

  async function viewActivity(activityId: string) {
    if (
      !viewState.selectedCourseId ||
      !viewState.selectedSectionId ||
      !viewState.selectedAssignmentId
    ) {
      throw new Error('No course, section, or assignment selected');
    }
    dispatch(
      setViewState({
        view: 'activity',
        selectedCourseId: viewState.selectedCourseId,
        selectedSectionId: viewState.selectedSectionId,
        selectedAssignmentId: viewState.selectedAssignmentId,
        selectedActivityId: activityId,
      })
    );
  }

  async function viewAssignmentDocumentTimelines(
    studentId: string,
    assignmentId: string,
    docId?: string
  ) {
    if (!viewState.selectedCourseId || !viewState.selectedSectionId) {
      throw new Error('No course or section selected');
    }
    dispatch(
      setViewState({
        view: 'activity-document-timelines',
        selectedCourseId: viewState.selectedCourseId,
        selectedSectionId: viewState.selectedSectionId,
        selectedAssignmentId: assignmentId,
        selectedStudentId: studentId,
        selectedDocId: docId,
      })
    );
  }

  async function updateSelectedDocId(docId: string) {
    if (
      !viewState.selectedCourseId ||
      !viewState.selectedSectionId ||
      !viewState.selectedAssignmentId ||
      !viewState.selectedStudentId
    ) {
      throw new Error('No course, section, assignment, or student selected');
    }
    dispatch(
      setViewState({
        view: 'activity-document-timelines',
        selectedCourseId: viewState.selectedCourseId,
        selectedSectionId: viewState.selectedSectionId,
        selectedAssignmentId: viewState.selectedAssignmentId,
        selectedStudentId: viewState.selectedStudentId,
        selectedDocId: docId,
      })
    );
  }

  async function viewStudentInfo(studentId: string) {
    const targetStudent = students.find((s) => s.userId === studentId);
    if (!targetStudent) {
      throw new Error('Student not found');
    }
    dispatch(
      setViewState({
        view: 'student-info',
        selectedCourseId: viewState.selectedCourseId,
        selectedSectionId: viewState.selectedSectionId,
        selectedAssignmentId: viewState.selectedAssignmentId,
        selectedActivityId: viewState.selectedActivityId,
        selectedStudentId: targetStudent.userId,
      })
    );
  }

  function haveICompletedActivity(assignmentId: string, activityId: string) {
    const studentData = myData as StudentData;
    if (!studentData.assignmentProgress) return false;

    const assignmentProgress = studentData.assignmentProgress.find(
      (progress: AssignmentProgress) => progress.assignmentId === assignmentId
    );

    if (!assignmentProgress || !assignmentProgress.activityCompletions)
      return false;

    const activityCompletion = assignmentProgress.activityCompletions.find(
      (completion: ActivityCompletion) => completion.activityId === activityId
    );

    return activityCompletion?.complete ?? false;
  }

  async function banStudentFromSection(sectionId: string, studentId: string) {
    const res = await dispatch(
      _banStudentFromSection({ sectionId, studentId })
    );
    return res.payload as Section;
  }

  async function unbanStudentFromSection(sectionId: string, studentId: string) {
    const res = await dispatch(
      _unbanStudentFromSection({ sectionId, studentId })
    );
    return res.payload as Section;
  }

  const hydratedViewState = useMemo(() => {
    const hydratedViewState = {
      ...viewState,
    };
    if (viewState.selectedCourseId) {
      hydratedViewState.selectedCourse = courses.find(
        (c) => c._id === viewState.selectedCourseId
      );
    }
    if (viewState.selectedSectionId) {
      hydratedViewState.selectedSection = sections.find(
        (s) => s._id === viewState.selectedSectionId
      );
    }
    if (viewState.selectedAssignmentId) {
      hydratedViewState.selectedAssignment = assignments.find(
        (a) => a._id === viewState.selectedAssignmentId
      );
    }
    if (viewState.selectedActivityId) {
      hydratedViewState.selectedActivity = activities.find(
        (a) => a._id === viewState.selectedActivityId
      );
    }
    if (viewState.selectedStudentId) {
      hydratedViewState.selectedStudent = students.find(
        (s) => s.userId === viewState.selectedStudentId
      );
    }
    return hydratedViewState;
  }, [viewState, courses, sections, assignments, activities, students]);

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
    studentActivityStarted,
    studentActivityCompleted,
    studentActivityNewDocCreated,
    studentActivityDocPrimaryStatusSet,
    studentActivityDocDeleted,
    loadInstructors,
    viewCourse,
    viewSection,
    viewAssignment,
    viewActivity,
    viewAssignmentDocumentTimelines,
    updateSelectedDocId,
    viewStudentInfo,
    viewDashboard,
    haveICompletedActivity,
    gradeStudentAssignment,
    courses,
    assignments,
    sections,
    students,
    instructors,
    myData,
    viewState: hydratedViewState,
    isLoading:
      coursesLoadingState === LoadStatus.LOADING ||
      assignmentsLoadingState === LoadStatus.LOADING ||
      sectionsLoadingState === LoadStatus.LOADING ||
      studentsLoadingState === LoadStatus.LOADING ||
      educationalDataLoadStatus === LoadStatus.LOADING,
    sectionsLoadState: sectionsLoadingState,
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
    banStudentFromSection,
    unbanStudentFromSection,
  };
}
