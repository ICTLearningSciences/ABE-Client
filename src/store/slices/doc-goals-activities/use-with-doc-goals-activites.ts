import {
  fetchDocGoals as _fetchDocGoals,
  fetchActivities as _fetchActivities,
  addOrUpdateActivity as _addOrUpdateActivity,
  LoadStatus,
} from '.';
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
  const docGoalsGql = useAppSelector(
    (state) => state.docGoalsActivities.docGoals
  );
  const config = useAppSelector((state) => state.config);
  const displayedGoalActivities = config.config?.displayedGoalActivities || [];

  const getActivitById = (id: string): ActivityGQL => {
    return activities.find((a) => a._id === id) || ({} as ActivityGQL);
  };

  const docGoalsActivities: DocGoal[] = displayedGoalActivities.reduce(
    (acc, goalActivity) => {
      const goal = docGoalsGql.find((g) => g._id === goalActivity.goal);
      if (!goal) {
        return acc;
      }
      const activities: ActivityGQL[] = goalActivity.activities
        .map((activityId) => {
          const activity = getActivitById(activityId.activity);
          return {
            ...activity,
            disabled: activityId.disabled,
          };
        })
        .filter((a) => !!a);
      return [...acc, { ...goal, activities, builtActivities: [] }];
    },
    [] as DocGoal[]
  );

  async function loadDocGoals() {
    return await dispatch(_fetchDocGoals());
  }

  async function loadActivities() {
    return await dispatch(_fetchActivities());
  }

  async function addOrUpdateActivity(activity: ActivityGQL) {
    return await dispatch(_addOrUpdateActivity(activity));
  }

  return {
    getActivitById,
    loadDocGoals,
    loadActivities,
    addOrUpdateActivity,
    activities,
    docGoals: docGoalsActivities,
    isLoading:
      activitiesLoadingState === LoadStatus.LOADING ||
      docGoalsLoadingState === LoadStatus.LOADING,
  };
}
