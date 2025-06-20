/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from 'react';
import { CircularProgress } from '@mui/material';
import { Chat } from './chat/chat';
import { UseWithCurrentGoalActivity } from '../../hooks/use-with-current-goal-activity';
import { DocGoalModal } from './doc-introduction/doc-goal-modal';
import { useEffect, useState } from 'react';
import { DocGoal } from '../../types';
import { removeDuplicatesByField } from '../../helpers';
import { ActivityBuilder } from '../activity-builder/types';

export function ChatActivity(props: {
  activityFromParams: string;
  goalFromParams: string;
  isNewDoc: boolean;
  useCurrentGoalActivity: UseWithCurrentGoalActivity;
  previewingActivity: boolean;
  setPreviewingActivity: (previewingActivity: boolean) => void;
}): JSX.Element {
  const {
    activityFromParams,
    goalFromParams,
    isNewDoc,
    useCurrentGoalActivity,
    previewingActivity,
    setPreviewingActivity,
  } = props;
  const {
    docGoals,
    setGoal,
    setActivity,
    setGoalAndActivity,
    goalActivityState,
    isLoading: goalsLoading,
  } = useCurrentGoalActivity;

  const [docGoalModalOpen, setDocGoalModalOpen] = useState(false);
  const allActivities = getAllActivites(docGoals || []);
  const [checkedUrlParams, setCheckedUrlParams] = useState<boolean>(false);
  function editDocGoal() {
    setDocGoalModalOpen(true);
    setPreviewingActivity(false);
  }

  /**
   * Returns all activities from all goals, including orphaned prompts
   */
  function getAllActivites(docGoals: DocGoal[]): ActivityBuilder[] {
    if (!docGoals.length) {
      return [];
    }
    const _activities = docGoals.flatMap((goal) => goal.builtActivities || []);
    const activities = removeDuplicatesByField<ActivityBuilder>(
      _activities,
      '_id'
    );
    return activities;
  }

  useEffect(() => {
    if (goalsLoading || !docGoals || checkedUrlParams) {
      return;
    }

    if (!goalFromParams && !activityFromParams) {
      setDocGoalModalOpen(true);
      setCheckedUrlParams(true);
      return;
    }
    const goal = docGoals.find((goal) => goal._id === goalFromParams);
    const activity = allActivities?.find(
      (activity) => activity?._id === activityFromParams
    );
    setGoalAndActivity(goal, activity);
    const goalHasActivities = goal?.builtActivities?.length;
    if (!activity && goalHasActivities) {
      setDocGoalModalOpen(true);
    }
  }, [goalFromParams, goalsLoading, activityFromParams, checkedUrlParams]);

  if (goalsLoading) {
    return (
      <>
        <CircularProgress />
      </>
    );
  }

  return (
    <>
      <>
        <Chat
          selectedActivity={goalActivityState?.selectedActivity}
          selectedGoal={goalActivityState?.selectedGoal}
          editDocGoal={editDocGoal}
          setSelectedActivity={setActivity}
        />
        <DocGoalModal
          isNewDoc={isNewDoc}
          docGoals={docGoals}
          setSelectedGoal={setGoal}
          setSelectedActivity={setActivity}
          selectedActivity={goalActivityState?.selectedActivity}
          selectedGoal={goalActivityState?.selectedGoal}
          open={
            docGoalModalOpen && Boolean(docGoals?.length) && !previewingActivity
          }
          close={() => {
            setDocGoalModalOpen(false);
          }}
        />
      </>
    </>
  );
}
