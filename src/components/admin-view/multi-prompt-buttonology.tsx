/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { Button } from '@mui/material';
import { ColumnDiv } from '../../styled-components';
import React, { useState } from 'react';
import {
  ActivityGQL,
  ActivityPrompt,
  GQLPrompt,
  AiPromptStep,
  PromptOutputTypes,
  PromptRoles,
  ActivityTypes,
} from '../../types';
import { UseWithPrompts } from '../../hooks/use-with-prompts';
import { v4 as uuidv4 } from 'uuid';
import {
  ActivityPrompts,
  SavedPromptsView,
} from './prompt-editing/saved-prompts-view';
import { SavedActivityPromptsView } from './prompt-editing/saved-activity-prompts-view';
import { isPromptInActivity, userCanEditActivity } from '../../helpers';
import { EditPrompt } from './prompt-editing/edit-prompt';
import { ActivityBuilderPage } from '../activity-builder/activity-builder-page';
import { isActivityBuilder } from '../activity-builder/types';
import { useWithDocGoalsActivities } from '../../store/slices/doc-goals-activities/use-with-doc-goals-activites';
import { useAppSelector } from '../../store/hooks';
import { UserRole } from '../../store/slices/login';
import { useWithActivityVersions } from '../../hooks/use-with-activity-versions';
import { useWithExecutePrompt } from '../../hooks/use-with-execute-prompts';
export const emptyOpenAiPromptStep = (): AiPromptStep => {
  return {
    prompts: [
      {
        promptText: '',
        includeEssay: true,
        promptRole: PromptRoles.USER,
      },
    ],
    outputDataType: PromptOutputTypes.TEXT,
  };
};

export function MultiPromptTesting(props: {
  googleDocId: string;
  activities: ActivityGQL[];
  goToActivity: (activityId: ActivityTypes) => void;
  useWithPrompts: UseWithPrompts;
  curActivity?: ActivityTypes;
}): JSX.Element {
  const { activities, goToActivity, useWithPrompts, curActivity } = props;
  const [targetPromptId, setTargetPromptId] = useState<string>();
  const { prompts, handleSavePrompt, editOrAddPrompt, isLoading } =
    useWithPrompts;
  const {
    builtActivities,
    addOrUpdateBuiltActivity,
    addNewLocalBuiltActivity,
    copyBuiltActivity,
    deleteBuiltActivity,
  } = useWithDocGoalsActivities();
  const { activityVersions, loadActivityVersions } = useWithActivityVersions();
  const { executePromptSteps } = useWithExecutePrompt();
  const [viewActivityBuilder, setViewActivityBuilder] = useState<boolean>(true);
  const user = useAppSelector((state) => state.login.user);
  const activitiesWithPrompts = activities.filter(
    (activity) => (activity.prompts?.length || 0) > 0
  );
  const activityPrompts = getPromptsForActivities(
    activitiesWithPrompts,
    prompts
  );
  const promptTemplate = targetPromptId
    ? (prompts || []).find(
        (prompt) =>
          prompt.clientId === targetPromptId || prompt._id === targetPromptId
      )
    : undefined;
  const orphanPrompts = prompts?.filter((prompt) => {
    return !isPromptInActivity(prompt, activities);
  });

  function getPromptsForActivities(
    activitiesWithPrompts: ActivityGQL[],
    prompts: GQLPrompt[]
  ) {
    const r = activitiesWithPrompts.reduce((acc, activity) => {
      const activityPrompts = getActivityPrompts(activity, prompts);
      if (activityPrompts.savedPrompts.length > 0) {
        acc.push(activityPrompts);
      }
      return acc;
    }, [] as ActivityPrompts[]);
    return r;
  }

  function getActivityPrompts(
    activity: ActivityGQL,
    savedPrompts: GQLPrompt[]
  ): ActivityPrompts {
    const activityPromptsGql = activity.prompts;
    if (!activityPromptsGql || !activityPromptsGql.length) {
      return {
        activity,
        savedPrompts: [],
      };
    }
    // reduce activityPrompts to ActivityPrompt[] only if a savedPrompt is found
    const savedActivityPrompts: ActivityPrompt[] = activityPromptsGql.reduce(
      (acc, activityPrompt) => {
        const savedPrompt = savedPrompts.find(
          (sp) => sp._id === activityPrompt.promptId
        );
        if (savedPrompt) {
          acc.push({
            ...activityPrompt,
            prompt: savedPrompt,
          });
        }
        return acc;
      },
      [] as ActivityPrompt[]
    );

    return {
      activity,
      savedPrompts: savedActivityPrompts.sort((a, b) => {
        return a.order - b.order;
      }),
    };
  }

  function handleStartEditPrompt(prompt: GQLPrompt) {
    setTargetPromptId(prompt.clientId || prompt._id);
  }

  function getActivity(prompt: GQLPrompt) {
    const activity = activities.find(
      (activity) => activity.prompt?._id === prompt._id
    );
    return activity;
  }

  if (viewActivityBuilder) {
    return (
      <ColumnDiv
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <ActivityBuilderPage
          userId={user?._id || ''}
          userCanEditActivity={(activity) =>
            user ? userCanEditActivity(activity, user) : false
          }
          onCreateNewActivity={async () => {
            const newActivity = addNewLocalBuiltActivity();
            return newActivity;
          }}
          onCopyActivity={copyBuiltActivity}
          onSaveActivity={addOrUpdateBuiltActivity}
          builtActivities={builtActivities}
          deleteBuiltActivity={deleteBuiltActivity}
          overrideCurActivity={
            curActivity && isActivityBuilder(curActivity)
              ? curActivity
              : undefined
          }
          previewActivity={goToActivity}
          goToOldActivityEditor={() => {
            setViewActivityBuilder(false);
          }}
          userCanDeleteActivity={() => user?.userRole === UserRole.ADMIN}
          activityVersions={activityVersions}
          loadActivityVersions={loadActivityVersions}
          executePromptSteps={executePromptSteps}
        />
      </ColumnDiv>
    );
  }

  // Selecting prompt template
  if (!promptTemplate) {
    return (
      <ColumnDiv
        style={{
          width: '100%',
          maxHeight: '90%',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        <div
          style={{
            overflow: 'auto',
            padding: '10px',
            width: '95%',
            position: 'relative',
          }}
        >
          <h2 style={{ textAlign: 'center' }}>Activities</h2>
          <SavedActivityPromptsView
            activitiesWithPrompts={activityPrompts}
            promptsLoading={isLoading}
            startEditPrompt={(prompt: GQLPrompt) => {
              handleStartEditPrompt(prompt);
            }}
            goToActivity={goToActivity}
            activities={activities}
            getActivity={getActivity}
          />
          <h2 style={{ textAlign: 'center' }}>Prompt Templates</h2>
          <SavedPromptsView
            savedPrompts={orphanPrompts}
            promptsLoading={isLoading}
            startEditPrompt={(prompt: GQLPrompt) => {
              handleStartEditPrompt(prompt);
            }}
            goToActivity={goToActivity}
            activities={activities}
          />
          <Button
            variant="contained"
            style={{
              position: 'absolute',
              top: 10,
              right: 40,
            }}
            onClick={() => {
              setViewActivityBuilder(true);
            }}
          >
            New Activity Builder
          </Button>
        </div>
        <Button
          style={{
            alignSelf: 'center',
            justifySelf: 'center',
          }}
          variant="outlined"
          disabled={prompts?.length === 0}
          onClick={() => {
            const newId = uuidv4();
            editOrAddPrompt({
              _id: newId,
              title: '',
              clientId: newId,
              aiPromptSteps: [emptyOpenAiPromptStep()],
            });
            setTargetPromptId(newId);
          }}
        >
          + New Prompt Template
        </Button>
      </ColumnDiv>
    );
  }

  return (
    <EditPrompt
      promptTemplate={promptTemplate}
      getActivityForPrompt={getActivity}
      goToActivity={goToActivity}
      onReturnToTemplates={() => {
        setTargetPromptId('');
      }}
      promptsLoading={isLoading}
      handleSavePrompt={handleSavePrompt}
    />
  );
}
