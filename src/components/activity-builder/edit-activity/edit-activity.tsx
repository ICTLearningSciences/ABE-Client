import React, { useEffect } from 'react';
import { ActivityBuilder as ActivityBuilderType } from '../types';
import { ActivityFlowContainer } from './activity-flow-container';
import { ColumnDiv, RowDiv } from '../../../styled-components';
import { Button } from '@mui/material';
export function EditActivity(props: {
  activity: ActivityBuilderType;
  saveActivity: (activity: ActivityBuilderType) => Promise<ActivityBuilderType>;
}): JSX.Element {
  const { activity, saveActivity } = props;
  console.log(`Selected Activity: ${JSON.stringify(activity)}`);

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
        }}
      >
        <h3>{activity.title}</h3>
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
