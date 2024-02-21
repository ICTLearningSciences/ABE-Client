import React from 'react';
import { ColumnCenterDiv } from '../../styled-components';
import { Button, CircularProgress, IconButton, Input } from '@mui/material';
import { docTextAction } from '../../hooks/api';
import { Activity, ActivityGQL, GoogleDocTextModifyActions } from '../../types';
import { MultiPromptTesting } from './multi-prompt-buttonology';
import ButtonologyIcon from '@mui/icons-material/DriveFileRenameOutline';
import PromptIcon from '@mui/icons-material/EditNote';
import { UseWithPrompts } from '../../hooks/use-with-prompts';
function InputButtonAction(props: {
  googleDocId: string;
  action: GoogleDocTextModifyActions;
  buttonText: string;
  insertAfterInput: boolean;
}) {
  const { googleDocId, action, buttonText, insertAfterInput } = props;
  const [inProgress, setInProgress] = React.useState<boolean>(false);
  const [targetText, setTargetText] = React.useState<string>('');
  const [insertAfterText, setInsertAfterText] = React.useState<string>('');
  return (
    <div
      style={{
        width: '300px',
        display: 'flex',
        justifyContent: 'flex-end',
        margin: '10px',
        border: '1px solid black',
        borderRadius: '5px',
      }}
    >
      <ColumnCenterDiv>
        <Input
          value={targetText}
          placeholder="Target text"
          onChange={(e) => {
            setTargetText(e.target.value);
          }}
        />
        <br />
        {insertAfterInput && (
          <Input
            value={insertAfterText}
            placeholder="Insert after text"
            onChange={(e) => {
              setInsertAfterText(e.target.value);
            }}
          />
        )}
      </ColumnCenterDiv>
      {inProgress ? (
        <CircularProgress />
      ) : (
        <Button
          style={{ width: '100px' }}
          onClick={() => {
            if (!targetText || inProgress) return;
            setInProgress(true);
            setTargetText('');
            setInsertAfterText('');
            docTextAction(
              googleDocId,
              targetText,
              action,
              insertAfterText
            ).finally(() => {
              setInProgress(false);
            });
          }}
        >
          {buttonText}
        </Button>
      )}
    </div>
  );
}

export default function Buttonology(props: {
  googleDocId: string;
  activities: ActivityGQL[];
  goToActivity: (activity: ActivityGQL) => void;
  useWithPrompts: UseWithPrompts;
}): JSX.Element {
  const { googleDocId, activities, goToActivity, useWithPrompts } = props;
  const [multiPrompt, setMultiPrompt] = React.useState<boolean>(true);
  return (
    <ColumnCenterDiv
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      {multiPrompt ? (
        <MultiPromptTesting
          googleDocId={googleDocId}
          activities={activities}
          goToActivity={goToActivity}
          useWithPrompts={useWithPrompts}
        />
      ) : (
        <>
          <h4>Buttonology</h4>
          <InputButtonAction
            googleDocId={googleDocId}
            action={GoogleDocTextModifyActions.HIGHLIGHT}
            buttonText="Highlight"
            insertAfterInput={false}
          />
          <InputButtonAction
            googleDocId={googleDocId}
            action={GoogleDocTextModifyActions.REMOVE}
            buttonText="Remove"
            insertAfterInput={false}
          />
          <InputButtonAction
            googleDocId={googleDocId}
            action={GoogleDocTextModifyActions.INSERT}
            buttonText="Insert"
            insertAfterInput={true}
          />
        </>
      )}
      <IconButton
        onClick={() => {
          setMultiPrompt((prevValue) => !prevValue);
        }}
      >
        {multiPrompt ? <ButtonologyIcon /> : <PromptIcon />}
      </IconButton>
    </ColumnCenterDiv>
  );
}
