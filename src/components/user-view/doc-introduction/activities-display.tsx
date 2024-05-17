import React from 'react';
import { DisplayIcon } from '../../../helpers/display-icon-helper';
import { ColumnDiv, RowDiv } from '../../../styled-components';
import { ActivityGQL } from '../../../types';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import './doc-goal-modal.css';

function ActivityDisplay(props: {
  activity: ActivityGQL;
  setSelectedActivity: (activity: ActivityGQL) => void;
  isSelected?: boolean;
  isNewGoogleDoc?: boolean;
}): JSX.Element {
  const { activity, setSelectedActivity, isSelected, isNewGoogleDoc } = props;
  return (
    <div
      className={`goal-display ${
        isNewGoogleDoc && activity.newDocRecommend ? 'goal-display-flash' : ''
      }`}
      data-cy={`activity-display-${activity._id}`}
      style={{
        border: isSelected ? '2px solid black' : '2px solid grey',
        opacity: activity.disabled ? 0.3 : 1,
      }}
      onClick={() => {
        if (activity.disabled) return;
        setSelectedActivity(activity);
      }}
      onDoubleClick={() => {
        setSelectedActivity(activity);
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: '20px',
          height: '20px',
          top: 10,
          right: 15,
        }}
      >
        {isSelected ? (
          <CheckCircleIcon
            style={{
              color: 'green',
            }}
          />
        ) : (
          <RadioButtonUncheckedIcon
            style={{
              color: 'grey',
            }}
          />
        )}
      </div>
      <DisplayIcon
        iconName={activity.displayIcon}
        style={{
          margin: 10,
        }}
      />
      <ColumnDiv
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          width: 'fit-content',
        }}
      >
        <h2 style={{ margin: 0, textAlign: 'center' }}>{activity.title}</h2>
        <span style={{ opacity: 0.5, fontWeight: 'bold', textAlign: 'center' }}>
          {activity.description}
        </span>
      </ColumnDiv>
    </div>
  );
}

export function ActivitiesDisplay(props: {
  activities: ActivityGQL[];
  setSelectedActivity: (activity: ActivityGQL) => void;
  selectedActivity?: ActivityGQL;
  isNewGoogleDoc?: boolean;
}): JSX.Element {
  const { activities, setSelectedActivity, selectedActivity, isNewGoogleDoc } =
    props;
  const activitiesCopy: ActivityGQL[] = [...activities];
  // const activitiesInOrder = activitiesCopy.sort((a, b) => {
  //   return activityOrder.indexOf(a._id) - activityOrder.indexOf(b._id);
  // });
  const activitiesSplitByThree = activitiesCopy.reduce(
    (acc: ActivityGQL[][], activity, i) => {
      if (i % 3 === 0) {
        acc.push([activity]);
      } else {
        acc[acc.length - 1].push(activity);
      }
      return acc;
    },
    []
  );
  return (
    <>
      <h1
        style={{
          borderRadius: '10px',
          padding: 10,
        }}
      >
        Please select an activity.
      </h1>
      <ColumnDiv
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        {activitiesSplitByThree.map((activities, i) => {
          return (
            <RowDiv
              key={i}
              style={{
                width: '100%',
                height: '100%',
                justifyContent: 'space-around',
              }}
            >
              {activities.map((activity, i) => {
                return (
                  <ActivityDisplay
                    key={i}
                    activity={activity}
                    setSelectedActivity={setSelectedActivity}
                    isSelected={selectedActivity?._id === activity._id}
                    isNewGoogleDoc={isNewGoogleDoc}
                  />
                );
              })}
            </RowDiv>
          );
        })}
      </ColumnDiv>
    </>
  );
}
