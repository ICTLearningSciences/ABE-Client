import { Button, CardHeader, IconButton } from '@mui/material';
import { RowDiv } from '../../styled-components';
import { Delete } from '@mui/icons-material';
import { ActivityGQL, GQLPrompt } from '../../types';

export default function SavePromptListItem(props: {
  prompt: GQLPrompt;
  promptsLoading: boolean;
  onImport: (prompt: GQLPrompt) => void;
  goToActivity: (activityId: ActivityGQL) => void;
  getActivity: (prompt: GQLPrompt) => ActivityGQL | undefined;
  canDelete: boolean;
}): JSX.Element {
  const { onImport, goToActivity, getActivity, prompt, canDelete } = props;
  return (
    <RowDiv style={{ width: '100%' }}>
      <div
        className="prompt-item"
        data-cy={`prompt-item-${prompt.title.replaceAll(' ', '-')}`}
      >
        <CardHeader
          onClick={() => {
            onImport(prompt);
          }}
          title={prompt.title}
          style={{ cursor: 'pointer' }}
        />
      </div>
      <Button
        data-cy={`preview-button-${prompt.title.replaceAll(' ', '-')}`}
        disabled={!getActivity(prompt)}
        onClick={() => {
          const activity = getActivity(prompt);
          if (activity) {
            goToActivity(activity);
          }
        }}
      >
        Preview
      </Button>
      <IconButton disabled={!canDelete}>
        <Delete />
      </IconButton>
    </RowDiv>
  );
}
