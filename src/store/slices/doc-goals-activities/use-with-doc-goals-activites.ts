import {
  fetchDocGoals as _fetchDocGoals,
  fetchActivities as _fetchActivities,
  addOrUpdateActivity as _addOrUpdateActivity,
  LoadStatus,
} from '.';
import { ActivityGQL, DocGoal } from '../../../types';
import { useAppDispatch, useAppSelector } from '../../hooks';

export interface UseWithDocGoalsActivities {
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
  const docGoals: DocGoal[] = docGoalsGql.map((dg) => {
    return {
      ...dg,
      activities: (dg.activities || []).reduce((acc, aId) => {
        const act = activities.find((a) => a._id === aId);
        if (act) {
          acc.push(act);
        }
        return acc;
      }, [] as ActivityGQL[]),
    };
  });

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
    loadDocGoals,
    loadActivities,
    addOrUpdateActivity,
    activities,
    docGoals,
    isLoading:
      activitiesLoadingState === LoadStatus.LOADING ||
      docGoalsLoadingState === LoadStatus.LOADING,
  };
}
