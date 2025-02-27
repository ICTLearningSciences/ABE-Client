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
export function UserInfoSettings(): JSX.Element {
  const { state } = useWithLogin();
  const { state: configState } = useWithConfig();
  const userName = state.user?.name;
  const classroomCode = state.user?.classroomCode;
  const previousClassroomCodes = state.user?.previousClassroomCodes;
  const surveyUrl = configState.config?.surveyConfig?.surveyLink;
  const surveyUrlParam = configState.config?.surveyConfig?.surveyQueryParam;
  function takeSurvey() {
    if (surveyUrl && surveyUrlParam) {
      window.open(
        `${surveyUrl}?${surveyUrlParam}=${state.user?._id}`,
        '_blank'
      );
    }
  }

  return (
    <ColumnDiv
      data-cy="user-info-settings"
      style={{
        alignItems: 'center',
      }}
    >
      {userName && <p>{userName}</p>}
      {classroomCode && (
        <p data-cy="current-classroom-code">
          <b>Classroom Code:</b> {classroomCode}
        </p>
      )}
      {previousClassroomCodes && previousClassroomCodes.length > 0 && (
        <Tooltip
          data-cy="previous-classroom-codes-tooltip"
          title={previousClassroomCodes.map((code) => (
            <p key={code}>{code}</p>
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
