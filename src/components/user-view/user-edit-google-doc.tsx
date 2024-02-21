import { Button, CircularProgress } from '@mui/material';
import Chat from './chat/chat';
import { useWithDocGoals } from '../../hooks/use-with-doc-goals';
import DocGoalModal from './doc-goal-modal';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import { UserRole } from '../../store/slices/login';
import Buttonology from '../admin-view/buttonology';
import { useWithState } from '../../store/slices/state/use-with-state';
import { ActivityGQL, DocGoal } from '../../types';
import { useWithPrompts as _useWithPrompts } from '../../hooks/use-with-prompts';
import { DisplayIcons } from '../../helpers/display-icon-helper';
import { v4 as uuidv4 } from 'uuid';
import { removeDuplicatesByField } from '../../helpers';

export default function EditGoogleDoc(props: {
  googleDocId: string;
}): JSX.Element {
  const { googleDocId } = props;
  const {
    data: docGoals,
    setGoal,
    setActivity,
    setGoalAndActivity,
    goalActivityState,
    isLoading: goalsLoading,
  } = useWithDocGoals();
  const useWithPrompts = _useWithPrompts();
  const { prompts } = useWithPrompts;
  const navigate = useNavigate();
  const { updateViewingUserRole } = useWithState();
  const [docGoalModalOpen, setDocGoalModalOpen] = useState(false);
  const googleDocUrl = `https://docs.google.com/document/d/${googleDocId}/edit`;
  const viewingRole = useAppSelector((state) => state.state.viewingRole);
  const viewingAdmin = viewingRole === UserRole.ADMIN;
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const activityFromParams = queryParams.get('activityId');
  const goalFromParams = queryParams.get('goalId');
  const allActivities = getAllActivites(docGoals || []);
  const [previewingActivity, setPreviewingActivity] = useState<boolean>();

  function editDocGoal() {
    setDocGoalModalOpen(true);
    setPreviewingActivity(false);
  }

  function goToActivityPreview(activity: ActivityGQL) {
    setPreviewingActivity(true);
    setActivity(activity);
    updateViewingUserRole(UserRole.USER);
  }

  /**
   * Returns all activities from all goals, including orphaned prompts
   */
  function getAllActivites(docGoals: DocGoal[]): ActivityGQL[] {
    if (!docGoals.length) {
      return [];
    }
    const _activities = docGoals.flatMap((goal) => goal.activities || []);
    // Multiple
    const activities = removeDuplicatesByField<ActivityGQL>(_activities, '_id');
    if (!prompts.length) {
      return activities;
    }
    const promptsWithoutActivities = prompts.filter(
      (prompt) =>
        !activities.find((activity) => activity.prompt?._id === prompt._id)
    );
    const orphanPromptActivities: ActivityGQL[] = promptsWithoutActivities.map(
      (prompt) => {
        return {
          _id: uuidv4(),
          prompt,
          title: prompt.title,
          description: '',
          introduction: '',
          displayIcon: DisplayIcons.DEFAULT,
          responsePendingMessage: '',
          responseReadyMessage: '',
          disabled: false,
        };
      }
    );
    return [...activities, ...orphanPromptActivities];
  }

  useEffect(() => {
    if (goalsLoading || !docGoals) {
      return;
    }
    if (!goalFromParams && !activityFromParams) {
      setDocGoalModalOpen(true);
      return;
    }
    const goal = docGoals.find((goal) => goal._id === goalFromParams);
    const activity = allActivities?.find(
      (activity) => activity?._id === activityFromParams
    );
    setGoalAndActivity(goal, activity);
    const goalHasActivities = goal?.activities?.length;
    if (!activity && goalHasActivities) {
      setDocGoalModalOpen(true);
    }
  }, [goalFromParams, goalsLoading, docGoals, activityFromParams]);

  if (goalsLoading) {
    return (
      <>
        <CircularProgress />
      </>
    );
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexGrow: 1 }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          width: '100%',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}
      >
        <iframe width={'98%'} height={'98%'} src={googleDocUrl} />
        <Button
          variant="text"
          onClick={() => {
            navigate('/');
          }}
        >
          Return
        </Button>
      </div>

      {viewingAdmin ? (
        <Buttonology
          googleDocId={googleDocId}
          activities={allActivities}
          goToActivity={goToActivityPreview}
          useWithPrompts={useWithPrompts}
        />
      ) : (
        <div
          style={{
            width: '100%',
          }}
        >
          <Chat
            selectedActivity={goalActivityState?.selectedActivity}
            selectedGoal={goalActivityState?.selectedGoal}
            editDocGoal={editDocGoal}
            setSelectedActivity={setActivity}
            useWithPrompts={useWithPrompts}
          />
          <DocGoalModal
            docGoals={docGoals}
            setSelectedGoal={setGoal}
            setSelectedActivity={setActivity}
            selectedActivity={goalActivityState?.selectedActivity}
            selectedGoal={goalActivityState?.selectedGoal}
            open={
              docGoalModalOpen &&
              Boolean(docGoals?.length) &&
              !previewingActivity
            }
            close={() => {
              setDocGoalModalOpen(false);
            }}
          />
        </div>
      )}
    </div>
  );
}
