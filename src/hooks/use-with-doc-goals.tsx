import { DocGoal, Activity, ActivityGQL } from '../types';
import { fetchDocGoals } from './api';
import { useWithData } from './use-with-data';
import { useState } from 'react';

export interface CurrentGoalAndActivity {
  selectedGoal?: DocGoal;
  selectedActivity?: ActivityGQL;
}

export function useWithDocGoals() {
  const {
    data,
    editedData,
    isEdited,
    isLoading,
    isSaving,
    editData,
    saveAndReturnData,
    reloadData,
  } = useWithData<DocGoal[]>(fetch);
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

  function fetch() {
    return fetchDocGoals();
  }

  return {
    data,
    editedData,
    isLoading,
    isSaving,
    editData,
    reloadData,
    saveAndReturnData,
    isEdited,
    goalActivityState,
    setGoalActivityState,
    setGoal,
    setActivity,
    setGoalAndActivity,
  };
}
