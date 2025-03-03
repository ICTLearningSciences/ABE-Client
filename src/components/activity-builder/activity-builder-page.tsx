/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from 'react';
import { SelectCreateActivity } from './select-create-activity';
import { EditActivity } from './edit-activity/edit-activity';
import { ActivityBuilder } from './types';

/**
 * This component is the main component for the activity builder page.
 * It is used to create and edit activities.
 * It is also used to select an existing activity to edit.
 * @param previewActivity: called when an activitied "Preview" button is clicked
 * @param overrideCurActivity: allows you to override the current activity to edit
 * @param goToOldActivityEditor: an optional function, if provided, will show the old activity editor button
 * @param deleteBuiltActivity: function called when the delete activity button is clicked
 * @param onSaveActivity: function called when the save activity button is clicked
 * @param onCreateNewActivity: function called when the + CREATE NEW ACTIVITY button is clicked. MUST return the clientId of the new activity
 * @returns
 */
export function ActivityBuilderPage(props: {
  previewActivity: (activity: ActivityBuilder) => void;
  overrideCurActivity?: ActivityBuilder;
  goToOldActivityEditor?: () => void;
  builtActivities: ActivityBuilder[];
  deleteBuiltActivity: (activityId: string) => Promise<void>;
  onSaveActivity: (activity: ActivityBuilder) => Promise<ActivityBuilder>;
  onCreateNewActivity: () => Promise<ActivityBuilder>;
  onCopyActivity: (activityId: string) => Promise<ActivityBuilder>;
  userCanEditActivity: (activity: ActivityBuilder) => boolean;
  userCanDeleteActivity: () => boolean;
  userId: string;
}): JSX.Element {
  const {
    previewActivity,
    overrideCurActivity,
    goToOldActivityEditor,
    deleteBuiltActivity,
    builtActivities,
    onSaveActivity,
    onCreateNewActivity,
    onCopyActivity,
    userCanEditActivity,
    userCanDeleteActivity,
    userId,
  } = props;
  const [selectedActivityClientId, setSelectedActivityClientId] =
    React.useState<string>(overrideCurActivity?.clientId || '');
  const selectedActivity = builtActivities.find(
    (activity) => activity.clientId === selectedActivityClientId
  );

  if (!selectedActivity) {
    return (
      <SelectCreateActivity
        userId={userId}
        copyActivity={onCopyActivity}
        goToOldActivityEditor={goToOldActivityEditor}
        goToActivity={previewActivity}
        builtActivities={builtActivities}
        onEditActivity={(activity) => {
          setSelectedActivityClientId(activity.clientId);
        }}
        onCreateActivity={async () => {
          const newActivity = await onCreateNewActivity();
          setSelectedActivityClientId(newActivity.clientId);
        }}
        deleteBuiltActivity={deleteBuiltActivity}
        userCanDeleteActivity={userCanDeleteActivity}
        userCanEditActivity={userCanEditActivity}
      />
    );
  } else {
    return (
      <EditActivity
        returnTo={() => {
          setSelectedActivityClientId('');
        }}
        goToActivity={previewActivity}
        activity={selectedActivity}
        saveActivity={async (activity) => {
          return await onSaveActivity(activity);
        }}
        userCanEditActivity={userCanEditActivity}
      />
    );
  }
}
