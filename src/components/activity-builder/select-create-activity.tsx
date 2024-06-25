/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from 'react';
import { ColumnDiv, RowDiv } from '../../styled-components';
import { ActivityBuilder as ActivityBuilderType } from './types';
import { Button } from '@mui/material';
import { isActivityRunnable } from './helpers';

export function ExistingActivityItem(props: {
  activity: ActivityBuilderType;
  goToActivity: () => void;
  editActivity: () => void;
}) {
  const { activity, editActivity, goToActivity } = props;
  return (
    <RowDiv
      style={{
        width: '100%',
        justifyContent: 'space-between',
        borderBottom: '1px solid black',
      }}
    >
      <h3>{activity.title}</h3>
      <RowDiv>
        <Button
          style={{ marginRight: 10 }}
          disabled={!isActivityRunnable(activity)}
          onClick={goToActivity}
        >
          Preview
        </Button>
        <Button onClick={editActivity}>Edit</Button>
      </RowDiv>
    </RowDiv>
  );
}

export function ExistingActivities(props: {
  goToActivity: (activity: ActivityBuilderType) => void;
  activities: ActivityBuilderType[];
  editActivity: (activity: ActivityBuilderType) => void;
}): JSX.Element {
  const { activities, editActivity } = props;
  if (!activities.length) {
    return <></>;
  }

  return (
    <ColumnDiv
      style={{
        width: '95%',
      }}
    >
      {activities.map((activity) => {
        return (
          <ExistingActivityItem
            key={activity._id}
            activity={activity}
            editActivity={() => {
              editActivity(activity);
            }}
            goToActivity={() => {
              props.goToActivity(activity);
            }}
          />
        );
      })}
    </ColumnDiv>
  );
}

export function SelectCreateActivity(props: {
  goToOldActivityEditor: () => void;
  goToActivity: (activity: ActivityBuilderType) => void;
  builtActivities: ActivityBuilderType[];
  onEditActivity: (activity: ActivityBuilderType) => void;
  onCreateActivity: () => void;
}): JSX.Element {
  const {
    builtActivities,
    onEditActivity,
    onCreateActivity,
    goToActivity,
    goToOldActivityEditor,
  } = props;
  return (
    <ColumnDiv
      style={{
        width: '100%',
        height: '100%',
        alignItems: 'center',
        overflow: 'auto',
        position: 'relative',
      }}
    >
      <Button
        onClick={goToOldActivityEditor}
        style={{
          position: 'absolute',
          top: 10,
          right: 10,
        }}
      >
        Old Activity Editor
      </Button>
      <h1>Activity Builder</h1>
      <ExistingActivities
        goToActivity={goToActivity}
        activities={builtActivities}
        editActivity={onEditActivity}
      />
      <Button onClick={onCreateActivity}>+ Create New Activity</Button>
    </ColumnDiv>
  );
}
