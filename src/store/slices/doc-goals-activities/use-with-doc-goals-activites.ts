import {
  fetchDocGoals as _fetchDocGoals,
  fetchActivities as _fetchActivities,
  addOrUpdateActivity as _addOrUpdateActivity,
  LoadStatus,
} from '.';
import { ActivityGQL, DocGoal } from '../../../types';
import { useAppDispatch, useAppSelector } from '../../hooks';

export interface UseWithDocGoalsActivities {
  getActivitById: (id: string) => ActivityGQL;
  loadDocGoals: () => Promise<void>;
  loadActivities: () => Promise<void>;
  addOrUpdateActivity: (activity: ActivityGQL) => Promise<void>;
  activities: ActivityGQL[];
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

  /**
   * The function `getActivityById` retrieves an activity object by its ID from an array of activities.
   * @param {string} id - The `id` parameter is a string representing the unique identifier of an
   * activity.
   * @returns The function `getActivitById` is returning an object of type `ActivityGQL` that matches
   * the provided `id` from the `activities` array. If no matching object is found, it returns an empty
   * object of type `ActivityGQL`.
   */
  const getActivitById = (id: string): ActivityGQL => {
    return activities.find((a) => a._id === id) || ({} as ActivityGQL);
  };

  const docGoalsActivities: DocGoal[] = displayedGoalActivities.reduce(
    (acc, goalActivity) => {
      const goal = docGoalsGql.find((g) => g._id === goalActivity.goal);
      if (!goal) {
        return acc;
      }
      const activities = goalActivity.activities
        .map((activityId) => getActivitById(activityId))
        .filter((a) => !!a);
      return [...acc, { ...goal, activities }];
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
