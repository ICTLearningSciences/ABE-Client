import {
  fetchDocGoals as _fetchDocGoals,
  fetchActivities as _fetchActivities,
  addOrUpdateActivity as _addOrUpdateActivity,
  fetchBuiltActivities as _fetchBuiltActivities,
  addOrUpdateBuiltActivity as _addOrUpdateBuiltActivity,
  LoadStatus,
  addNewLocalBuiltActivity as _addNewLocalBuiltActivity,
  storeActivityVersionForActivity,
  copyBuiltActivity as _copyBuiltActivity,
  deleteBuiltActivity as _deleteBuiltActivity,
} from '.';
import {
  ActivityBuilder,
  defaultActivityBuilder,
} from '../../../components/activity-builder/types';
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
  const userId = useAppSelector((state) => state.login.user?._id) || '';
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

  async function addOrUpdateActivity(activity: ActivityGQL) {
    return await dispatch(_addOrUpdateActivity(activity));
  }

  async function loadBuiltActivities() {
    return await dispatch(_fetchBuiltActivities());
  }

  function addNewLocalBuiltActivity(): ActivityBuilder {
    const newActivity = defaultActivityBuilder(userId);
    dispatch(_addNewLocalBuiltActivity(newActivity));
    return newActivity;
  }

  async function addOrUpdateBuiltActivity(
    activity: ActivityBuilder
  ): Promise<ActivityBuilder> {
    dispatch(storeActivityVersionForActivity(activity));
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

  return {
    getActivitById,
    loadDocGoals,
    loadActivities,
    loadBuiltActivities,
    addOrUpdateActivity,
    addOrUpdateBuiltActivity,
    addNewLocalBuiltActivity,
    copyBuiltActivity,
    deleteBuiltActivity,
    builtActivities,
    activities,
    docGoals: docGoalsActivities,
    isLoading:
      activitiesLoadingState === LoadStatus.LOADING ||
      docGoalsLoadingState === LoadStatus.LOADING,
  };
}
