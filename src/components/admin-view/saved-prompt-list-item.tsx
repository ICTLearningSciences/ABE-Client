/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from 'react';
import { Button, CardHeader, IconButton } from '@mui/material';
import { RowDiv } from '../../styled-components';
import { Delete } from '@mui/icons-material';
import { ActivityGQL, GQLPrompt } from '../../types';

export default function SavePromptListItem(props: {
  prompt: GQLPrompt;
  promptsLoading: boolean;
  onImport: (prompt: GQLPrompt) => void;
  goToActivity: (activityId: ActivityGQL) => void;
  getActivity: (prompt: GQLPrompt) => ActivityGQL | undefined;
  canDelete: boolean;
}): JSX.Element {
  const { onImport, goToActivity, getActivity, prompt, canDelete } = props;
  return (
    <RowDiv style={{ width: '100%' }}>
      <div
        className="prompt-item"
        data-cy={`prompt-item-${prompt.title.replaceAll(' ', '-')}`}
      >
        <CardHeader
          onClick={() => {
            onImport(prompt);
          }}
          title={prompt.title}
          style={{ cursor: 'pointer' }}
        />
      </div>
      <Button
        data-cy={`preview-button-${prompt.title.replaceAll(' ', '-')}`}
        disabled={!getActivity(prompt)}
        onClick={() => {
          const activity = getActivity(prompt);
          if (activity) {
            goToActivity(activity);
          }
        }}
      >
        Preview
      </Button>
      <IconButton disabled={!canDelete}>
        <Delete />
      </IconButton>
    </RowDiv>
  );
}
