import React, { useEffect } from 'react';
import { ActivityBuilder as ActivityBuilderType, FlowItem } from '../types';
import { ActivityFlowContainer } from './activity-flow-container';
import { ColumnDiv, RowDiv } from '../../../styled-components';
import { Button } from '@mui/material';
import { InputField } from '../shared/input-components';
import { equals } from '../../../helpers';
import { v4 as uuidv4 } from 'uuid';
export function EditActivity(props: {
  activity: ActivityBuilderType;
  saveActivity: (activity: ActivityBuilderType) => Promise<ActivityBuilderType>;
}): JSX.Element {
  const { activity, saveActivity } = props;

  const [localActivityCopy, setLocalActivityCopy] =
    React.useState<ActivityBuilderType>(JSON.parse(JSON.stringify(activity)));

  useEffect(() => {
    setLocalActivityCopy(JSON.parse(JSON.stringify(activity)));
  }, [activity]);

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
      }}
    >
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
            setLocalActivityCopy({
              ...localActivityCopy,
              title: v,
            });
          }}
        />
        <RowDiv>
          <Button
            style={{
              marginRight: '10px',
            }}
            variant="outlined"
            disabled={equals(localActivityCopy, activity)}
            onClick={async () => {
              await saveActivity(localActivityCopy);
            }}
          >
            Save
          </Button>
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
