/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from 'react';
import { SelectCreateActivity } from './select-create-activity';
import { EditActivity } from './edit-activity/edit-activity';
import { ActivityBuilder } from './types';
import { ActivityBuilderProvider } from './activity-builder-context';
import { BuiltActivityVersion } from './types';
import { AiPromptStep } from '../../types';
import { AiServicesResponseTypes } from '../../ai-services/ai-service-types';

export function ActivityBuilderPage(props: {
  goToActivity: (activity: ActivityBuilder) => void;
  curActivity?: ActivityBuilder;
  builtActivities: ActivityBuilder[];
  addOrUpdateBuiltActivity: (
    activity: ActivityBuilder
  ) => Promise<ActivityBuilder>;
  addNewLocalBuiltActivity: () => ActivityBuilder;
  copyBuiltActivity: (activityId: string) => Promise<ActivityBuilder>;
  deleteBuiltActivity: (activityId: string) => Promise<void>;
  userId?: string;
  canEditActivity: (activity: ActivityBuilder) => boolean;
  canDeleteActivity: (activity: ActivityBuilder) => boolean;
  activityVersions: Record<string, BuiltActivityVersion[]>;
  loadActivityVersions: (
    activityClientId: string
  ) => Promise<BuiltActivityVersion[]>;
  executePromptSteps: (
    aiPromptSteps: AiPromptStep[],
    callback?: (response: AiServicesResponseTypes) => void
  ) => Promise<AiServicesResponseTypes>;
}): JSX.Element {
  const {
    goToActivity,
    curActivity,
    builtActivities,
    addOrUpdateBuiltActivity,
    addNewLocalBuiltActivity,
    copyBuiltActivity,
    deleteBuiltActivity,
    activityVersions,
    loadActivityVersions,
    executePromptSteps,
  } = props;
  const [selectedActivityClientId, setSelectedActivityClientId] =
    React.useState<string>(curActivity?.clientId || '');
  const selectedActivity = builtActivities.find(
    (activity) => activity.clientId === selectedActivityClientId
  );

  if (!selectedActivity) {
    return (
      <ActivityBuilderProvider
        userId={props.userId}
        canEditActivity={props.canEditActivity}
        canDeleteActivity={props.canDeleteActivity}
        activityVersions={activityVersions}
        loadActivityVersions={loadActivityVersions}
        executePromptSteps={executePromptSteps}
      >
        <SelectCreateActivity
          copyActivity={copyBuiltActivity}
          goToActivity={goToActivity}
          builtActivities={builtActivities}
          onEditActivity={(activity) => {
            setSelectedActivityClientId(activity.clientId);
          }}
          onCreateActivity={() => {
            const newActivity = addNewLocalBuiltActivity();
            setSelectedActivityClientId(newActivity.clientId);
          }}
          deleteBuiltActivity={deleteBuiltActivity}
        />
      </ActivityBuilderProvider>
    );
  } else {
    return (
      <ActivityBuilderProvider
        userId={props.userId}
        canEditActivity={props.canEditActivity}
        canDeleteActivity={props.canDeleteActivity}
        activityVersions={activityVersions}
        loadActivityVersions={loadActivityVersions}
        executePromptSteps={executePromptSteps}
      >
        <EditActivity
          returnTo={() => {
            setSelectedActivityClientId('');
          }}
          goToActivity={goToActivity}
          activity={selectedActivity}
          saveActivity={async (activity) => {
            return await addOrUpdateBuiltActivity(activity);
          }}
        />
      </ActivityBuilderProvider>
    );
  }
}
