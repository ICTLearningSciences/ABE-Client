/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/

import { useMemo } from "react";
import {
  fetchDocGoals as _fetchDocGoals,
  fetchActivities as _fetchActivities,
  fetchBuiltActivities as _fetchBuiltActivities,
  addOrUpdateBuiltActivity as _addOrUpdateBuiltActivity,
  addNewLocalBuiltActivity as _addNewLocalBuiltActivity,
  storeActivityVersionForActivity,
  copyBuiltActivity as _copyBuiltActivity,
  deleteBuiltActivity as _deleteBuiltActivity,
} from ".";
import {
  type ActivityBuilder,
  defaultActivityBuilder,
} from "../../../components/activity-builder/types";
import type {
  ActivityGQL,
  ActivityTypes,
  Config,
  DocGoal,
  DocGoalGQl,
} from "../../../types";
import { useAppDispatch, useAppSelector } from "../../hooks";

export interface UseWithDocGoalsActivities {
  loadDocGoals: () => Promise<DocGoalGQl[]>;
  loadBuiltActivities: () => Promise<ActivityBuilder[]>;
  loadActivities: () => Promise<ActivityGQL[]>;
  addOrUpdateBuiltActivity: (
    activity: ActivityBuilder,
  ) => Promise<ActivityBuilder>;
  addNewLocalBuiltActivity: () => ActivityBuilder;
  copyBuiltActivity: (activityId: string) => Promise<ActivityBuilder>;
  deleteBuiltActivity: (activityId: string) => Promise<void>;
  activities: ActivityGQL[];
  builtActivities: ActivityBuilder[];
  docGoals: DocGoal[];
  frontPageActivities: ActivityBuilder[];
  getActivityById: (id: string) => ActivityTypes | undefined;
  isLoading: boolean;
  educationReadyActivities: ActivityBuilder[];
}

export function useWithDocGoalsActivities(
  userId: string,
  config?: Config,
  storeVersion = true,
): UseWithDocGoalsActivities {
  const dispatch = useAppDispatch();
  const activitiesLoadingState = useAppSelector(
    (state) => state.docGoalsActivities.activitiesLoadStatus,
  );
  const docGoalsLoadingState = useAppSelector(
    (state) => state.docGoalsActivities.docGoalsLoadStatus,
  );
  const activities: ActivityGQL[] = useAppSelector(
    (state) => state.docGoalsActivities.activities,
  );
  const builtActivities: ActivityBuilder[] = useAppSelector(
    (state) => state.docGoalsActivities.builtActivities,
  );
  const builtActivitiesLoadingState = useAppSelector(
    (state) => state.docGoalsActivities.builtActivitiesLoadStatus,
  );
  const docGoalsGql: DocGoalGQl[] = useAppSelector(
    (state) => state.docGoalsActivities.docGoals,
  );
  const displayedGoalActivities = config?.displayedGoalActivities || [];

  const getBuiltActivityById = (id: string): ActivityBuilder | undefined => {
    return builtActivities.find((a) => a._id === id);
  };

  const docGoalsActivities: DocGoal[] = displayedGoalActivities.reduce(
    (acc, goalActivity) => {
      const goal = docGoalsGql.find((g) => g._id === goalActivity.goal);
      if (!goal) {
        return acc;
      }

      const builtActivities = goalActivity.builtActivities?.reduce(
        (acc, builtActivity) => {
          const activity = getBuiltActivityById(builtActivity.activity);
          if (!activity) {
            return acc;
          }
          return [...acc, { ...activity, disabled: builtActivity.disabled }];
        },
        [] as ActivityBuilder[],
      );
      return [...acc, { ...goal, builtActivities: builtActivities || [] }];
    },
    [] as DocGoal[],
  );

  const getActivityById = (id: string): ActivityTypes | undefined => {
    return (
      builtActivities.find((a) => a._id === id) ||
      activities.find((a) => a._id === id)
    );
  };

  async function loadDocGoals() {
    return await dispatch(_fetchDocGoals()).unwrap();
  }

  async function loadActivities() {
    return await dispatch(_fetchActivities()).unwrap();
  }

  async function loadBuiltActivities(): Promise<ActivityBuilder[]> {
    return await dispatch(_fetchBuiltActivities()).unwrap();
  }

  function addNewLocalBuiltActivity(): ActivityBuilder {
    const newActivity = defaultActivityBuilder(userId);
    dispatch(_addNewLocalBuiltActivity(newActivity));
    return newActivity;
  }

  async function addOrUpdateBuiltActivity(
    activity: ActivityBuilder,
  ): Promise<ActivityBuilder> {
    if (storeVersion) {
      dispatch(storeActivityVersionForActivity(activity));
    }
    const res = await dispatch(_addOrUpdateBuiltActivity(activity));
    return res.payload as ActivityBuilder;
  }

  async function copyBuiltActivity(activityId: string) {
    const res = await dispatch(_copyBuiltActivity(activityId));
    return res.payload as ActivityBuilder;
  }

  async function deleteBuiltActivity(activityId: string) {
    await dispatch(_deleteBuiltActivity(activityId));
  }

  const frontPageActivities = useMemo(() => {
    return docGoalsActivities
      .flatMap((g) => g.builtActivities)
      .reduce((acc, activity) => {
        if (!acc.some((a) => a._id === activity._id)) {
          acc.push(activity);
        }
        return acc;
      }, [] as ActivityBuilder[]);
  }, [docGoalsActivities]);

  return {
    loadDocGoals,
    loadBuiltActivities,
    addOrUpdateBuiltActivity,
    addNewLocalBuiltActivity,
    copyBuiltActivity,
    deleteBuiltActivity,
    getActivityById,
    loadActivities,
    builtActivities,
    activities,
    docGoals: docGoalsActivities,
    frontPageActivities,
    isLoading:
      docGoalsLoadingState === 1 ||
      builtActivitiesLoadingState === 1 ||
      activitiesLoadingState === 1,
    educationReadyActivities: builtActivities.filter((a) =>
      a.flowsList.some((f) =>
        f.steps.some((s) => s.setStudentActivityComplete),
      ),
    ),
  };
}
