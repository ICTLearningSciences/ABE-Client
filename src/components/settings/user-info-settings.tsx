/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from 'react';
import { ColumnDiv } from '../../styled-components';
import { useWithLogin } from '../../store/slices/login/use-with-login';
import { Button, Tooltip } from '@mui/material';
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
    <ColumnDiv
      data-cy="user-info-settings"
      style={{
        alignItems: 'space-around',
        height: '100%',
        justifyContent: 'space-around',
      }}
    >
      {userName && <p>{userName}</p>}
      <div>
        {classroomCode && (
          <div data-cy="current-classroom-code">
            <b>Classroom Code:</b>{' '}
            <EditableText
              text={classroomCode.code}
              onSave={async (newText) => {
                await updateUserInfo({
                  classroomCode: newText,
                });
              }}
            />
            <br />
            <b>Created At:</b>{' '}
            {formatISODateToReadable(classroomCode.createdAt)}
          </div>
        )}
        {previousClassroomCodes && previousClassroomCodes.length > 0 && (
          <Tooltip
            data-cy="previous-classroom-codes-tooltip"
            title={previousClassroomCodes.map((code) => (
              <p key={code.code}>
                <b>Classroom Code:</b> {code.code}
                <br />
                <b>Created At:</b> {formatISODateToReadable(code.createdAt)}
              </p>
            ))}
          >
            <p
              data-cy="previous-classroom-codes"
              style={{
                opacity: 0.5,
                cursor: 'pointer',
              }}
            >
              Previous Classroom Codes
            </p>
          </Tooltip>
        )}
      </div>
      {educationalRole && (
          <GoToEducationDashboardButton educationalRole={educationalRole} />
        )}
        {/* For testing purposes */}
        {educationalRole && educationalRole === EducationalRole.INSTRUCTOR && (
          <GoToEducationDashboardButton educationalRole={EducationalRole.STUDENT} />
        )}
      <AdminControls />

      {surveyUrl && surveyUrlParam && (
        <Button
          variant="contained"
          color="primary"
          onClick={takeSurvey}
          style={{
            marginTop: 10,
          }}
        >
          Take Survey <AssignmentIcon style={{ marginLeft: 10 }} />
        </Button>
      )}
    </ColumnDiv>
  );
}
