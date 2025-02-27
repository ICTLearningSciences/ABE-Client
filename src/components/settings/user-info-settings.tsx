/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from 'react';
import { ColumnDiv } from '../../styled-components';
import { useWithLogin } from '../../store/slices/login/use-with-login';
import { Button } from '@mui/material';
import { useWithConfig } from '../../exported-files';

export function UserInfoSettings(): JSX.Element {
  const { state } = useWithLogin();
  const { state: configState } = useWithConfig();
  function takeSurvey() {
    const url = configState.config?.surveyConfig?.surveyLink;
    const urlParam = configState.config?.surveyConfig?.surveyQueryParam;
    if (url) {
      window.open(`${url}?${urlParam}=${state.user?._id}`, '_blank');
    }
  }

  return (
    <ColumnDiv data-cy="user-info-settings">
      <p>Name: {state.user?.name}</p>
      <p data-cy="current-classroom-code">
        Classroom Code: {state.user?.classroomCode}
      </p>
      <Button variant="contained" color="primary" onClick={takeSurvey}>
        Take Survey
      </Button>
    </ColumnDiv>
  );
}
