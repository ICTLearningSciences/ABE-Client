/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from 'react';
import { useWithDocGoalsActivities } from '../../store/slices/doc-goals-activities/use-with-doc-goals-activites';
import { ColumnDiv, RowDiv } from '../../styled-components';
import { ActivityBuilder as ActivityBuilderType } from './types';
import { Button } from '@mui/material';

export function ExistingActivityItem(props: {
  activity: ActivityBuilderType;
  editActivity: () => void;
}) {
  const { activity, editActivity } = props;
  return (
    <RowDiv>
      <ColumnDiv>
        <h2>{activity.title}</h2>
        <p>{activity.description}</p>
      </ColumnDiv>
      <Button onClick={editActivity}>Edit</Button>
    </RowDiv>
  );
}

export function ExistingActivities(props: {
  activities: ActivityBuilderType[];
  editActivity: (activity: ActivityBuilderType) => void;
}): JSX.Element {
  const { activities, editActivity } = props;
  if (!activities.length) {
    return <></>;
  }

  return (
    <ColumnDiv>
      {activities.map((activity) => {
        return (
          <ExistingActivityItem
            key={activity._id}
            activity={activity}
            editActivity={() => {
              editActivity(activity);
            }}
          />
        );
      })}
    </ColumnDiv>
  );
}

export function SelectCreateActivity(props: {
  builtActivities: ActivityBuilderType[];
  onEditActivity: (activity: ActivityBuilderType) => void;
  onCreateActivity: () => void;
}): JSX.Element {
  const { builtActivities, onEditActivity, onCreateActivity } = props;
  return (
    <ColumnDiv
      style={{
        width: '100%',
        height: '100%',
        alignItems: 'center',
      }}
    >
      <h1>Activity Builder</h1>
      <ExistingActivities
        activities={builtActivities}
        editActivity={onEditActivity}
      />
      <Button onClick={onCreateActivity}>+ Create New Activity</Button>
    </ColumnDiv>
  );
}
