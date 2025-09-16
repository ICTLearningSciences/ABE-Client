/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { useWithDocGoalsActivities } from '../store/slices/doc-goals-activities/use-with-doc-goals-activites';
import { DocGoal, ActivityTypes } from '../types';
import { useState } from 'react';
import { useAppSelector } from '../store/hooks';

export interface CurrentGoalAndActivity {
  selectedGoal?: DocGoal;
  selectedActivity?: ActivityTypes;
}

export interface UseWithCurrentGoalActivity {
  docGoals: DocGoal[] | undefined;
  goalActivityState: CurrentGoalAndActivity | undefined;
  setGoalActivityState: React.Dispatch<
    React.SetStateAction<CurrentGoalAndActivity | undefined>
  >;
  setGoal: (goal?: DocGoal) => void;
  setActivity: (activity?: ActivityTypes) => void;
  setGoalAndActivity: (goal?: DocGoal, activity?: ActivityTypes) => void;
  isLoading: boolean;
}

export function useWithCurrentGoalActivity(): UseWithCurrentGoalActivity {
  const user = useAppSelector((state) => state.login.user);
  const config = useAppSelector((state) => state.config).config;
  const { docGoals, isLoading } = useWithDocGoalsActivities(
    user?._id || '',
    config
  );

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

  function setActivity(activity?: ActivityTypes) {
    setGoalActivityState((prevState) => {
      return {
        ...prevState,
        selectedActivity: activity,
      };
    });
  }

  function setGoalAndActivity(goal?: DocGoal, activity?: ActivityTypes) {
    setGoalActivityState(() => {
      return {
        selectedGoal: goal,
        selectedActivity: activity,
      };
    });
  }

  return {
    docGoals,
    goalActivityState,
    setGoalActivityState,
    setGoal,
    setActivity,
    setGoalAndActivity,
    isLoading,
  };
}
