/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from 'react';
import { Button, CircularProgress } from '@mui/material';
import { useWithCurrentGoalActivity } from '../../hooks/use-with-current-goal-activity';
import { useState } from 'react';
import { useAppSelector } from '../../store/hooks';
import { UserRole } from '../../store/slices/login';
import ActivityGqlButtonology from '../admin-view/buttonology';
import { useWithState } from '../../store/slices/state/use-with-state';
import { ActivityGQL, ActivityTypes, DocGoal } from '../../types';
import { DisplayIcons } from '../../helpers/display-icon-helper';
import { v4 as uuidv4 } from 'uuid';
import { removeDuplicatesByField } from '../../helpers';
import { useWithWindowSize } from '../../hooks/use-with-window-size';
import { ActivityBuilder } from '../activity-builder/types';
import { UseWithPrompts } from '../../hooks/use-with-prompts';
import { ChatActivity } from './chat-activity';
import { getDocData } from '../../hooks/api';
import { SingleNotificationDialog } from '../dialog';

export function EditGoogleDoc(props: {
  docId: string;
  docUrl: string;
  activityFromParams: string;
  goalFromParams: string;
  returnToDocs: () => void;
  isNewDoc: boolean;
  useWithPrompts: UseWithPrompts;
}): JSX.Element {
  const {
    docId,
    docUrl,
    activityFromParams,
    goalFromParams,
    returnToDocs,
    isNewDoc,
    useWithPrompts,
  } = props;
  const useCurrentGoalActivity = useWithCurrentGoalActivity();
  const {
    docGoals,
    goalActivityState,
    setGoalAndActivity,
    isLoading: goalsLoading,
  } = useCurrentGoalActivity;

  const { prompts } = useWithPrompts;
  const { width: windowWidth } = useWithWindowSize();
  const { updateViewingUserRole, state } = useWithState();
  const viewingRole = useAppSelector((state) => state.state.viewingRole);
  const viewingAdmin =
    viewingRole === UserRole.ADMIN || viewingRole === UserRole.CONTENT_MANAGER;
  const allActivities = getAllActivites(docGoals || []);
  const [previewingActivity, setPreviewingActivity] = useState<boolean>(false);

  function goToActivityPreview(activity: ActivityTypes) {
    setPreviewingActivity(true);
    setGoalAndActivity(undefined, activity);
    updateViewingUserRole(UserRole.USER);
  }

  /**
   * Returns all activities from all goals, including orphaned prompts
   */
  function getAllActivites(docGoals: DocGoal[]): ActivityGQL[] {
    if (!docGoals.length) {
      return [];
    }
    const _activities = docGoals.flatMap((goal) => goal.activities || []);
    // Multiple
    const activities = removeDuplicatesByField<ActivityGQL>(_activities, '_id');
    if (!prompts.length) {
      return activities;
    }
    const promptsWithoutActivities = prompts.filter(
      (prompt) =>
        !activities.find((activity) => activity.prompt?._id === prompt._id)
    );
    const orphanPromptActivities: ActivityGQL[] = promptsWithoutActivities.map(
      (prompt) => {
        return {
          _id: uuidv4(),
          activityType: 'gql',
          prompt,
          steps: [],
          title: prompt.title,
          description: '',
          introduction: '',
          displayIcon: DisplayIcons.DEFAULT,
          disabled: false,
        };
      }
    );
    return [...activities, ...orphanPromptActivities];
  }

  function getAllBuiltActivities(docGoals: DocGoal[]): ActivityBuilder[] {
    if (!docGoals.length) {
      return [];
    }
    return docGoals.flatMap((goal) => goal.builtActivities || []);
  }

  if (goalsLoading) {
    return (
      <>
        <CircularProgress />
      </>
    );
  }

  const smallWindowWidth = windowWidth < 1200;
  const googleDocWidth = smallWindowWidth ? '60%' : '55%';
  const chatButtonologyWidth = viewingAdmin
    ? '100%'
    : smallWindowWidth
    ? '40%'
    : '45%';
  return (
    <div style={{ height: '100%', display: 'flex', flexGrow: 1 }}>
      <div
        style={{
          display: viewingAdmin ? 'none' : 'flex',
          flexDirection: 'column',
          height: '100%',
          justifyContent: 'space-around',
          alignItems: 'center',
          width: googleDocWidth,
        }}
      >
        <iframe
          width={'98%'}
          height={'98%'}
          src={docUrl}
          data-cy="google-doc-iframe"
        />
        <Button variant="text" onClick={returnToDocs}>
          Return
        </Button>
      </div>

      <div
        style={{
          width: chatButtonologyWidth,
          maxWidth: chatButtonologyWidth,
        }}
      >
        {viewingAdmin ? (
          <ActivityGqlButtonology
            googleDocId={docId}
            activities={allActivities}
            builtActivities={getAllBuiltActivities(docGoals || [])}
            goToActivity={goToActivityPreview}
            useWithPrompts={useWithPrompts}
            curActivity={
              previewingActivity && goalActivityState?.selectedActivity
                ? goalActivityState?.selectedActivity
                : undefined
            }
          />
        ) : (
          <ChatActivity
            getDocData={getDocData}
            activityFromParams={activityFromParams}
            goalFromParams={goalFromParams}
            isNewDoc={isNewDoc}
            useWithPrompts={useWithPrompts}
            useCurrentGoalActivity={useCurrentGoalActivity}
            previewingActivity={previewingActivity}
            setPreviewingActivity={setPreviewingActivity}
          />
        )}
      </div>
      <SingleNotificationDialog
        open={state.warnExpiredAccessToken}
        title="Access Token Expired"
        notification="Your access token has expired. Please refresh the page or log in again."
      />
    </div>
  );
}
