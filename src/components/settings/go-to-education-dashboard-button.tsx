/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from 'react';
import { Button } from '@mui/material';
import {
  courseManagementUrl,
  studentCoursesUrl,
} from '../../pages/instructor/course-management';
import { EducationalRole } from '../../types';
import { useNavigateWithParams } from '../../hooks/use-navigate-with-params';

export default function GoToEducationDashboardButton(props: {
  educationalRole: EducationalRole;
}) {
  const navigate = useNavigateWithParams();

  const currentPath = window.location.pathname;
  const isOnEducationDashboard =
    currentPath.includes(studentCoursesUrl) ||
    currentPath.includes(courseManagementUrl);

  if (isOnEducationDashboard) {
    return (
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          navigate('/docs');
        }}
      >
        Free Doc Editing
      </Button>
    );
  }

  if (props.educationalRole === EducationalRole.INSTRUCTOR) {
    return (
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          navigate(courseManagementUrl);
        }}
      >
        Instructor Dashboard
      </Button>
    );
  } else if (props.educationalRole === EducationalRole.STUDENT) {
    return (
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          navigate(studentCoursesUrl);
        }}
      >
        Student Dashboard
      </Button>
    );
  } else {
    return null;
  }
}
