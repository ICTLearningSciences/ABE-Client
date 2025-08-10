/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from 'react';
import { useWithLogin } from '../../store/slices/login/use-with-login';
import { 
  Button, 
  Tooltip, 
  Box, 
  Typography, 
  Paper, 
  Stack, 
  Divider,
  Card,
  CardContent
} from '@mui/material';
import { useWithConfig } from '../../exported-files';
import { AdminControls } from './admin-controls';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { formatISODateToReadable } from '../../helpers';
import { EditableText } from '../activity-builder/shared/input-components';
import GoToEducationDashboardButton from './go-to-education-dashboard-button';
import { EducationalRole } from '../../types';

export function UserInfoSettings(): JSX.Element {
  const { state, updateUserInfo } = useWithLogin();
  const { state: configState } = useWithConfig();
  const userName = state.user?.name;
  const classroomCode = state.user?.classroomCode;
  const educationalRole = state.user?.educationalRole;
  const previousClassroomCodes = state.user?.previousClassroomCodes;
  const surveyUrl = configState.config?.surveyConfig?.surveyLink;
  const surveyUrlParam = configState.config?.surveyConfig?.surveyQueryParam;
  const surveyClassroomParam =
    configState.config?.surveyConfig?.surveyClassroomParam;

  function takeSurvey() {
    if (surveyUrl) {
      const url = new URL(surveyUrl);
      if (state.user?._id && surveyUrlParam) {
        url.searchParams.set(surveyUrlParam, state.user?._id);
      }
      if (classroomCode?.code && surveyClassroomParam) {
        url.searchParams.set(surveyClassroomParam, classroomCode?.code);
      }
      window.open(url.toString(), '_blank');
    }
  }

  return (
    <Box
      data-cy="user-info-settings"
      sx={{
        height: '90%',
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        overflowY: 'auto'
      }}
    >
      {/* User Profile Section */}
      {userName && (
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Profile
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {userName}
          </Typography>
        </Paper>
      )}

      {/* Education Dashboard Section */}
      {(educationalRole || (educationalRole === EducationalRole.INSTRUCTOR)) && (
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Education Dashboard
          </Typography>
          <Stack spacing={2}>
            {educationalRole && (
              <GoToEducationDashboardButton educationalRole={educationalRole} />
            )}
            {/* For testing purposes */}
            {educationalRole && educationalRole === EducationalRole.INSTRUCTOR && (
              <GoToEducationDashboardButton
                educationalRole={EducationalRole.STUDENT}
              />
            )}
          </Stack>
        </Paper>
      )}

      {/* Admin Controls Section */}
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Admin Settings
        </Typography>
        <AdminControls />
      </Paper>

      {/* Survey Section */}
      {surveyUrl && surveyUrlParam && (
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Feedback
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={takeSurvey}
            startIcon={<AssignmentIcon />}
            fullWidth
          >
            Take Survey
          </Button>
        </Paper>
      )}
    </Box>
  );
}
