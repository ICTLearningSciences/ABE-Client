/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React, { useState } from 'react';
import { ColumnDiv, RowDiv } from '../../styled-components';
import { ActivityBuilder as ActivityBuilderType } from './types';
import { Button, CircularProgress, IconButton } from '@mui/material';
import { isActivityRunnable } from './helpers';
import PreviewIcon from '@mui/icons-material/Preview';
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useAppSelector } from '../../store/hooks';
import DeleteIcon from '@mui/icons-material/Delete';
import { UserRole } from '../../store/slices/login';
export function ExistingActivityItem(props: {
  activity: ActivityBuilderType;
  goToActivity: () => void;
  editActivity: () => void;
  copyActivity: (activityId: string) => Promise<ActivityBuilderType>;
  deleteBuiltActivity: (activityId: string) => Promise<void>;
  canDeleteActivity: boolean;
}) {
  const {
    activity,
    editActivity,
    goToActivity,
    copyActivity,
    deleteBuiltActivity,
    canDeleteActivity,
  } = props;
  const [copying, setCopying] = useState(false);
  const [deleting, setDeleting] = useState(false);
  return (
    <RowDiv
      data-cy={`activity-item-${activity._id}`}
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
          startIcon={<PreviewIcon />}
          variant="outlined"
        >
          Preview
        </Button>
        <Button
          style={{ marginRight: 10 }}
          disabled={copying}
          onClick={() => {
            setCopying(true);
            copyActivity(activity._id).finally(() => {
              setCopying(false);
            });
          }}
          variant="outlined"
          startIcon={
            copying ? <CircularProgress size={20} /> : <ContentCopyIcon />
          }
          data-cy={`activity-item-copy-${activity._id}`}
        >
          {copying ? 'Copying...' : 'Copy'}
        </Button>
        <Button
          onClick={editActivity}
          variant="contained"
          startIcon={<EditIcon />}
          data-cy={`activity-item-edit-${activity._id}`}
        >
          Edit
        </Button>
        <IconButton
          disabled={deleting || !canDeleteActivity}
          onClick={() => {
            setDeleting(true);
            deleteBuiltActivity(activity._id).finally(() => {
              setDeleting(false);
            });
          }}
          data-cy={`activity-item-delete-${activity._id}`}
        >
          {deleting ? <CircularProgress size={20} /> : <DeleteIcon />}
        </IconButton>
      </RowDiv>
    </RowDiv>
  );
}

export function ExistingActivities(props: {
  goToActivity: (activity: ActivityBuilderType) => void;
  activities: ActivityBuilderType[];
  editActivity: (activity: ActivityBuilderType) => void;
  copyActivity: (activityId: string) => Promise<ActivityBuilderType>;
  deleteBuiltActivity: (activityId: string) => Promise<void>;
  onCreateActivity: () => void;
}): JSX.Element {
  const {
    activities,
    editActivity,
    copyActivity,
    onCreateActivity,
    deleteBuiltActivity,
  } = props;
  const user = useAppSelector((state) => state.login.user);
  if (!activities.length) {
    return <></>;
  }
  const myActivities = activities.filter(
    (activity) => activity.user === user?._id
  );
  const otherActivities = activities.filter(
    (activity) => activity.user !== user?._id
  );

  return (
    <ColumnDiv
      style={{
        width: '95%',
      }}
    >
      <h2
        style={{
          fontStyle: 'italic',
        }}
      >
        My Activities
      </h2>
      {myActivities.length === 0 && <p>No activities found</p>}
      {myActivities.map((activity) => {
        return (
          <ExistingActivityItem
            key={activity._id}
            activity={activity}
            copyActivity={copyActivity}
            editActivity={() => {
              editActivity(activity);
            }}
            goToActivity={() => {
              props.goToActivity(activity);
            }}
            deleteBuiltActivity={deleteBuiltActivity}
            canDeleteActivity={true}
          />
        );
      })}
      <Button
        variant="outlined"
        style={{
          marginTop: 10,
          width: 'fit-content',
          alignSelf: 'center',
        }}
        onClick={onCreateActivity}
      >
        + Create New Activity
      </Button>

      <h2
        style={{
          fontStyle: 'italic',
        }}
      >
        Other Activities
      </h2>
      {otherActivities.length === 0 && <p>No activities found</p>}
      {otherActivities.map((activity) => {
        return (
          <ExistingActivityItem
            key={activity._id}
            activity={activity}
            copyActivity={copyActivity}
            editActivity={() => {
              editActivity(activity);
            }}
            goToActivity={() => {
              props.goToActivity(activity);
            }}
            deleteBuiltActivity={deleteBuiltActivity}
            canDeleteActivity={user?.userRole === UserRole.ADMIN}
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
  copyActivity: (activityId: string) => Promise<ActivityBuilderType>;
  deleteBuiltActivity: (activityId: string) => Promise<void>;
}): JSX.Element {
  const {
    builtActivities,
    onEditActivity,
    onCreateActivity,
    goToActivity,
    goToOldActivityEditor,
    copyActivity,
    deleteBuiltActivity,
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
        data-cy="go-to-old-activity-editor"
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
        copyActivity={copyActivity}
        deleteBuiltActivity={deleteBuiltActivity}
        onCreateActivity={onCreateActivity}
      />
    </ColumnDiv>
  );
}
