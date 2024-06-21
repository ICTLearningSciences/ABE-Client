import React, { useEffect } from 'react';
import { ActivityBuilder as ActivityBuilderType } from '../types';
import { ActivityFlowContainer } from './activity-flow-container';
import { ColumnDiv, RowDiv } from '../../../styled-components';
import { Button } from '@mui/material';
import { InputField } from '../shared/input-components';
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

  return (
    <ColumnDiv
      style={{
        width: '100%',
        height: '100%',
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
            onClick={async () => {
              await saveActivity(localActivityCopy);
            }}
          >
            Save
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
