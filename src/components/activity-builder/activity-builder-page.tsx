/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from 'react';
import { useWithDocGoalsActivities } from '../../store/slices/doc-goals-activities/use-with-doc-goals-activites';
import { SelectCreateActivity } from './select-create-activity';
import { EditActivity } from './edit-activity/edit-activity';
import { ActivityBuilder } from './types';

export function ActivityBuilderPage(props: {
  goToActivity: (activity: ActivityBuilder) => void;
  curActivity?: ActivityBuilder;
  goToOldActivityEditor: () => void;
}): JSX.Element {
  const { goToActivity, curActivity, goToOldActivityEditor } = props;
  const {
    builtActivities,
    addOrUpdateBuiltActivity,
    addNewLocalBuiltActivity,
    copyBuiltActivity,
  } = useWithDocGoalsActivities();
  const [selectedActivityClientId, setSelectedActivityClientId] =
    React.useState<string>(curActivity?.clientId || '');
  const selectedActivity = builtActivities.find(
    (activity) => activity.clientId === selectedActivityClientId
  );

  if (!selectedActivity) {
    return (
      <SelectCreateActivity
        copyActivity={copyBuiltActivity}
        goToOldActivityEditor={goToOldActivityEditor}
        goToActivity={goToActivity}
        builtActivities={builtActivities}
        onEditActivity={(activity) => {
          setSelectedActivityClientId(activity.clientId);
        }}
        onCreateActivity={() => {
          const newActivity = addNewLocalBuiltActivity();
          setSelectedActivityClientId(newActivity.clientId);
        }}
      />
    );
  } else {
    return (
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
    );
  }
}
