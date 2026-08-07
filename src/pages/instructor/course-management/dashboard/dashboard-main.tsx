/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/

import type { Course } from "../../../../store/slices/education-management/types";
import { CoursesListDisplay } from "./courses-list-display";

export function DashboardMain(props: {
  courses: Course[];
  isStudent: boolean;
  onCourseSelect: (courseId: string) => void;
  handleOpenCourseModal: () => void;
  handleOpenJoinSectionModal: () => void;
}) {
  const {
    courses,
    isStudent,
    onCourseSelect,
    handleOpenCourseModal,
    handleOpenJoinSectionModal,
  } = props;
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        marginLeft: "20px",
        alignItems: "center",
      }}
    >
      <CoursesListDisplay
        courses={courses}
        isStudent={isStudent}
        onCourseSelect={onCourseSelect}
        handleOpenCourseModal={handleOpenCourseModal}
        handleOpenJoinSectionModal={handleOpenJoinSectionModal}
      />
    </div>
  );
}
