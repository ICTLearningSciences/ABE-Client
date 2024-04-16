/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { useWithDocGoalsActivities } from '../store/slices/doc-goals-activities/use-with-doc-goals-activites';
import { DocGoal, ActivityGQL } from '../types';
import { useState } from 'react';

export interface CurrentGoalAndActivity {
  selectedGoal?: DocGoal;
  selectedActivity?: ActivityGQL;
}

export function useWithCurrentGoalActivity() {
  const { docGoals, addOrUpdateActivity, isLoading } =
    useWithDocGoalsActivities();

  const [goalActivityState, setGoalActivityState] =
    useState<CurrentGoalAndActivity>();

  function setGoal(goal?: DocGoal) {
    setGoalActivityState(() => {
      return {
        selectedGoal: goal,
        selectedActivity: undefined,
      };
    });
  }

  function setActivity(activity?: ActivityGQL) {
    setGoalActivityState((prevState) => {
      return {
        ...prevState,
        selectedActivity: activity,
      };
    });
  }

  function setGoalAndActivity(goal?: DocGoal, activity?: ActivityGQL) {
    setGoalActivityState(() => {
      return {
        selectedGoal: goal,
        selectedActivity: activity,
      };
    });
  }

  async function saveActivity(activity: ActivityGQL) {
    await addOrUpdateActivity(activity);
  }

  return {
    docGoals,
    goalActivityState,
    setGoalActivityState,
    setGoal,
    setActivity,
    setGoalAndActivity,
    saveActivity,
    isLoading,
  };
}
