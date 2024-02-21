import { CircularProgress } from '@mui/material';
import { ActivityGQL, ActivityPrompt, GQLPrompt } from '../../types';
import './saved-prompts-view.css';
import SavePromptListItem from './saved-prompt-list-item';

export interface ActivityPrompts {
  activity: ActivityGQL;
  savedPrompts: ActivityPrompt[];
}

export function SavedPromptsView(props: {
  savedPrompts: GQLPrompt[];
  promptsLoading: boolean;
  onImport: (prompt: GQLPrompt) => void;
  activities: ActivityGQL[];
  goToActivity: (activityId: ActivityGQL) => void;
}) {
  const { savedPrompts, onImport, promptsLoading, activities, goToActivity } =
    props;
  if (promptsLoading) {
    return <CircularProgress />;
  }

  function getActivity(prompt: GQLPrompt) {
    const activity = activities.find(
      (activity) => activity.prompt?._id === prompt._id
    );
    return activity;
  }
  return (
    <>
      {savedPrompts.map((prompt, index) => (
        <SavePromptListItem
          onImport={onImport}
          goToActivity={goToActivity}
          getActivity={getActivity}
          prompt={prompt}
          promptsLoading={promptsLoading}
          canDelete={true}
        />
      ))}
    </>
  );
}
