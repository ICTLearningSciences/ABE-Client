/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from 'react';
import { CircularProgress } from '@mui/material';
import { ActivityGQL, ActivityPrompt, GQLPrompt } from '../../../types';
import './saved-prompts-view.css';
import SavePromptListItem from '../saved-prompt-list-item';

export interface ActivityPrompts {
  activity: ActivityGQL;
  savedPrompts: ActivityPrompt[];
}

export function SavedPromptsView(props: {
  savedPrompts: GQLPrompt[];
  promptsLoading: boolean;
  onImport: (prompt: GQLPrompt) => void;
  activities: ActivityGQL[];
  goToActivity: (activityId: ActivityGQL) => void;
}) {
  const { savedPrompts, onImport, promptsLoading, activities, goToActivity } =
    props;
  if (promptsLoading) {
    return <CircularProgress />;
  }

  function getActivity(prompt: GQLPrompt) {
    const activity = activities.find(
      (activity) => activity.prompt?._id === prompt._id
    );
    return activity;
  }
  return (
    <>
      {savedPrompts.map((prompt, index) => (
        <SavePromptListItem
          key={index}
          onImport={onImport}
          goToActivity={goToActivity}
          getActivity={getActivity}
          prompt={prompt}
          promptsLoading={promptsLoading}
          canDelete={true}
        />
      ))}
    </>
  );
}
