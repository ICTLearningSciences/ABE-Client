import {
  fetchDocGoals as _fetchDocGoals,
  fetchActivities as _fetchActivities,
  addOrUpdateActivity as _addOrUpdateActivity,
  fetchBuiltActivities as _fetchBuiltActivities,
  LoadStatus,
} from '.';
import { ActivityBuilder } from '../../../components/activity-builder/types';
import { ActivityGQL, ActivityTypes, DocGoal } from '../../../types';
import { useAppDispatch, useAppSelector } from '../../hooks';

export interface UseWithDocGoalsActivities {
  getActivitById: (id: string) => ActivityTypes;
  loadDocGoals: () => Promise<void>;
  loadActivities: () => Promise<void>;
  addOrUpdateActivity: (activity: ActivityTypes) => Promise<void>;
  activities: ActivityTypes[];
  docGoals: DocGoal[];
}

export function useWithDocGoalsActivities() {
  const dispatch = useAppDispatch();
  const activitiesLoadingState = useAppSelector(
    (state) => state.docGoalsActivities.activitiesLoadStatus
  );
  const docGoalsLoadingState = useAppSelector(
    (state) => state.docGoalsActivities.docGoalsLoadStatus
  );
  const activities = useAppSelector(
    (state) => state.docGoalsActivities.activities
  );
  const builtActivities = useAppSelector(
    (state) => state.docGoalsActivities.builtActivities
  );
  const docGoalsGql = useAppSelector(
    (state) => state.docGoalsActivities.docGoals
  );
  const config = useAppSelector((state) => state.config);
  const displayedGoalActivities = config.config?.displayedGoalActivities || [];

  const getActivitById = (id: string): ActivityGQL | undefined => {
    return activities.find((a) => a._id === id);
  };

  const getBuiltActivityById = (id: string): ActivityBuilder | undefined => {
    return builtActivities.find((a) => a._id === id);
  };

  const docGoalsActivities: DocGoal[] = displayedGoalActivities.reduce(
    (acc, goalActivity) => {
      const goal = docGoalsGql.find((g) => g._id === goalActivity.goal);
      if (!goal) {
        return acc;
      }
      const activities = goalActivity.activities.reduce((acc, activityId) => {
        const activity = getActivitById(activityId.activity);
        if (!activity) {
          return acc;
        }
        return [...acc, { ...activity, disabled: activityId.disabled }];
      }, [] as ActivityGQL[]);
      const builtActivities = goalActivity.builtActivities?.reduce(
        (acc, builtActivity) => {
          const activity = getBuiltActivityById(builtActivity.activity);
          if (!activity) {
            return acc;
          }
          return [...acc, { ...activity, disabled: builtActivity.disabled }];
        },
        [] as ActivityBuilder[]
      );
      return [
        ...acc,
        { ...goal, activities, builtActivities: builtActivities || [] },
      ];
    },
    [] as DocGoal[]
  );

  async function loadDocGoals() {
    return await dispatch(_fetchDocGoals());
  }

  async function loadActivities() {
    return await dispatch(_fetchActivities());
  }

  async function loadBuiltActivities() {
    return await dispatch(_fetchBuiltActivities());
  }

  async function addOrUpdateActivity(activity: ActivityGQL) {
    return await dispatch(_addOrUpdateActivity(activity));
  }

  return {
    getActivitById,
    loadDocGoals,
    loadActivities,
    loadBuiltActivities,
    addOrUpdateActivity,
    activities,
    docGoals: docGoalsActivities,
    isLoading:
      activitiesLoadingState === LoadStatus.LOADING ||
      docGoalsLoadingState === LoadStatus.LOADING,
  };
}
