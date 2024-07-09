import React, { useEffect } from 'react';
import { ActivityBuilder as ActivityBuilderType, FlowItem } from '../types';
import { ActivityFlowContainer } from './activity-flow-container';
import { ColumnDiv, RowDiv } from '../../../styled-components';
import { Button, CircularProgress, IconButton } from '@mui/material';
import { InputField } from '../shared/input-components';
import { equals } from '../../../helpers';
import { v4 as uuidv4 } from 'uuid';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { isActivityRunnable } from '../helpers';
export function EditActivity(props: {
  goToActivity: (activity: ActivityBuilderType) => void;
  activity: ActivityBuilderType;
  saveActivity: (activity: ActivityBuilderType) => Promise<ActivityBuilderType>;
  returnTo: () => void;
}): JSX.Element {
  const {
    activity,
    saveActivity: _saveActivity,
    goToActivity,
    returnTo,
  } = props;

  const [localActivityCopy, setLocalActivityCopy] =
    React.useState<ActivityBuilderType>(JSON.parse(JSON.stringify(activity)));
  const [saveInProgress, setSaveInProgress] = React.useState<boolean>(false);

  useEffect(() => {
    setLocalActivityCopy(JSON.parse(JSON.stringify(activity)));
  }, [activity]);

  async function saveActivity() {
    setSaveInProgress(true);
    try {
      await _saveActivity(localActivityCopy);
    } catch (e) {
      console.error(e);
    } finally {
      setSaveInProgress(false);
    }
  }

  function addNewFlow() {
    const emptyFlow: FlowItem = {
      clientId: uuidv4(),
      name: '',
      steps: [],
    };
    setLocalActivityCopy((prevValue) => {
      return {
        ...prevValue,
        flowsList: [...prevValue.flowsList, emptyFlow],
      };
    });
  }

  return (
    <ColumnDiv
      style={{
        width: '100%',
        height: '100%',
        overflowY: 'auto',
        position: 'relative',
      }}
    >
      <IconButton
        onClick={returnTo}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 100,
          color: '#1976d2',
        }}
      >
        <ArrowBackIcon />
      </IconButton>
      <ColumnDiv
        data-cy="edit-activity-header"
        style={{
          alignSelf: 'center',
          alignItems: 'center',
        }}
      >
        <InputField
          label="Activity Name"
          value={localActivityCopy.title}
          width="fit-content"
          onChange={(v) => {
            setLocalActivityCopy((prevValue) => {
              return {
                ...prevValue,
                title: v,
              };
            });
          }}
        />
        <RowDiv>
          <Button
            style={{
              marginRight: '10px',
            }}
            disabled={saveInProgress || !isActivityRunnable(localActivityCopy)}
            variant="outlined"
            onClick={async () => {
              saveActivity().then(() => {
                goToActivity(localActivityCopy);
              });
            }}
          >
            Preview
          </Button>
          {!saveInProgress ? (
            <Button
              style={{
                marginRight: '10px',
              }}
              variant="outlined"
              disabled={equals(localActivityCopy, activity)}
              onClick={saveActivity}
            >
              Save
            </Button>
          ) : (
            <CircularProgress
              style={{
                marginRight: 10,
              }}
            />
          )}
          <Button onClick={addNewFlow} variant="outlined">
            + Add Flow
          </Button>
        </RowDiv>
      </ColumnDiv>
      <ActivityFlowContainer
        localActivity={localActivityCopy}
        updateLocalActivity={setLocalActivityCopy}
      />
    </ColumnDiv>
  );
}
