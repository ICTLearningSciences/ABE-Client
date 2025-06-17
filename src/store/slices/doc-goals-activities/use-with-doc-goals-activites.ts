import {
  fetchDocGoals as _fetchDocGoals,
  fetchActivities as _fetchActivities,
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
import {
  ActivityGQL,
  ActivityTypes,
  DocGoal,
  DocGoalGQl,
} from '../../../types';
import { useAppDispatch, useAppSelector } from '../../hooks';

export interface UseWithDocGoalsActivities {
  loadDocGoals: () => Promise<DocGoalGQl[]>;
  loadBuiltActivities: () => Promise<ActivityBuilder[]>;
  loadActivities: () => Promise<ActivityGQL[]>;
  addOrUpdateBuiltActivity: (
    activity: ActivityBuilder
  ) => Promise<ActivityBuilder>;
  addNewLocalBuiltActivity: () => ActivityBuilder;
  copyBuiltActivity: (activityId: string) => Promise<ActivityBuilder>;
  deleteBuiltActivity: (activityId: string) => Promise<void>;
  activities: ActivityGQL[];
  builtActivities: ActivityBuilder[];
  docGoals: DocGoal[];
  getActivityById: (id: string) => ActivityTypes | undefined;
  isLoading: boolean;
}

export function useWithDocGoalsActivities(): UseWithDocGoalsActivities {
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
  const builtActivitiesLoadingState = useAppSelector(
    (state) => state.docGoalsActivities.builtActivitiesLoadStatus
  );
  const docGoalsGql = useAppSelector(
    (state) => state.docGoalsActivities.docGoals
  );
  const config = useAppSelector((state) => state.config);
  const displayedGoalActivities = config.config?.displayedGoalActivities || [];

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
        [] as ActivityBuilder[]
      );
      return [...acc, { ...goal, builtActivities: builtActivities || [] }];
    },
    [] as DocGoal[]
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
    isLoading:
      docGoalsLoadingState === LoadStatus.LOADING ||
      builtActivitiesLoadingState === LoadStatus.LOADING ||
      activitiesLoadingState === LoadStatus.LOADING,
  };
}
