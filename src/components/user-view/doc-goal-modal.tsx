/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from 'react';
import { Box, Button, IconButton, Modal } from '@mui/material';
import { ActivityGQL, DocGoal } from '../../types';
import { ColumnDiv, RowDiv } from '../../styled-components';
import { DisplayIcon } from '../../helpers/display-icon-helper';
import './doc-goal-modal.css';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useState } from 'react';
import ChangeIcon from '@mui/icons-material/Construction';

function GoalDisplay(props: {
  docGoal: DocGoal;
  setSelectedGoal: (goal: DocGoal) => void;
  isSelected?: boolean;
}): JSX.Element {
  const { docGoal, setSelectedGoal, isSelected } = props;
  return (
    <div
      className="goal-display"
      data-cy={`goal-display-${docGoal._id}`}
      style={{
        border: isSelected ? '2px solid black' : '2px solid grey',
      }}
      onClick={() => {
        setSelectedGoal(docGoal);
      }}
    >
      <DisplayIcon
        iconName={docGoal.displayIcon}
        style={{
          margin: 10,
        }}
      />
      <ColumnDiv
        style={{
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <h2 style={{ margin: 0, textAlign: 'center' }}>{docGoal.title}</h2>
        <span style={{ opacity: 0.5, fontWeight: 'bold', textAlign: 'center' }}>
          {docGoal.description}
        </span>
      </ColumnDiv>
    </div>
  );
}

function ActivityDisplay(props: {
  activity: ActivityGQL;
  setSelectedActivity: (activity: ActivityGQL) => void;
  isSelected?: boolean;
}): JSX.Element {
  const { activity, setSelectedActivity, isSelected } = props;
  return (
    <div
      className="goal-display"
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

function GoalsDisplay(props: {
  docGoals: DocGoal[];
  setSelectedGoal: (goal: DocGoal) => void;
  selectedGoal?: DocGoal;
}): JSX.Element {
  const { docGoals, setSelectedGoal, selectedGoal } = props;
  return (
    <>
      <h1
        style={{
          borderRadius: '10px',
          padding: 10,
        }}
      >
        What is your current goal?
      </h1>
      <RowDiv
        style={{
          width: '100%',
          height: '100%',
          justifyContent: 'space-around',
        }}
      >
        {docGoals.map((docGoal, i) => {
          return (
            <GoalDisplay
              key={i}
              docGoal={docGoal}
              setSelectedGoal={setSelectedGoal}
              isSelected={selectedGoal?._id === docGoal._id}
            />
          );
        })}
      </RowDiv>
    </>
  );
}

function ActivitiesDisplay(props: {
  activities: ActivityGQL[];
  activityOrder: string[];
  setSelectedActivity: (activity: ActivityGQL) => void;
  selectedActivity?: ActivityGQL;
}): JSX.Element {
  const { activities, setSelectedActivity, selectedActivity, activityOrder } =
    props;
  const activitiesCopy: ActivityGQL[] = [...activities];
  const activitiesInOrder = activitiesCopy.sort((a, b) => {
    return activityOrder.indexOf(a._id) - activityOrder.indexOf(b._id);
  });
  const activitiesSplitByThree = activitiesInOrder.reduce(
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

export default function DocGoalModal(props: {
  open: boolean;
  close: () => void;
  setSelectedGoal: (goal?: DocGoal) => void;
  setSelectedActivity: (activity?: ActivityGQL) => void;
  selectedActivity?: ActivityGQL;
  selectedGoal?: DocGoal;
  docGoals?: DocGoal[];
}): JSX.Element {
  const {
    open,
    close,
    docGoals,
    setSelectedGoal: beginGoal,
    setSelectedActivity: beginActivity,
  } = props;

  const enum SelectingStage {
    GOAL,
    ACTIVITY,
  }

  const [_stage, _setStage] = useState<SelectingStage>(SelectingStage.GOAL);
  const [_selectedActivity, _setSelectedActivity] = useState<ActivityGQL>();
  const [_selectedGoal, _setSelectedGoal] = useState<DocGoal>();

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    height: '80%',
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: '20px',
    border: '5px solid black',
  };

  function closeModal() {
    _setSelectedGoal(undefined);
    _setSelectedActivity(undefined);
    _setStage(SelectingStage.GOAL);
    close();
  }

  function goalHasActivities(goal: DocGoal) {
    return goal.activities && goal.activities.length;
  }

  function completeModal(goal: DocGoal) {
    beginGoal(goal);
    beginActivity(_selectedActivity);
    closeModal();
  }

  function resetSelections() {
    _setSelectedGoal(undefined);
    _setSelectedActivity(undefined);
    _setStage(SelectingStage.GOAL);
  }

  if (!docGoals) return <></>;

  return (
    <div>
      <Modal open={Boolean(open)}>
        <Box sx={style} data-cy="doc-goal-modal">
          <div
            data-cy="selected-goal-display"
            style={{
              position: 'absolute',
              top: 30,
              left: 30,
            }}
          >
            {_selectedGoal && (
              <>
                <span
                  style={{
                    fontWeight: 'bold',
                    cursor: 'pointer',
                  }}
                  onClick={resetSelections}
                >
                  {_selectedGoal.title}
                </span>
                <IconButton onClick={resetSelections}>
                  <ChangeIcon />
                </IconButton>
              </>
            )}
          </div>
          <ColumnDiv
            style={{
              height: '100%',
              width: '100%',
              alignItems: 'center',
              justifyContent: 'space-around',
            }}
          >
            {_stage === SelectingStage.GOAL ? (
              <GoalsDisplay
                docGoals={[...docGoals].reverse()}
                setSelectedGoal={(goal) => {
                  _setSelectedGoal(goal);
                  if (!goalHasActivities(goal)) {
                    completeModal(goal);
                    return;
                  } else {
                    _setStage(SelectingStage.ACTIVITY);
                  }
                }}
                selectedGoal={_selectedGoal}
              />
            ) : (
              _selectedGoal?.activities && (
                <ActivitiesDisplay
                  activities={_selectedGoal.activities}
                  activityOrder={_selectedGoal.activityOrder}
                  setSelectedActivity={_setSelectedActivity}
                  selectedActivity={_selectedActivity}
                />
              )
            )}

            <RowDiv
              style={{
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <Button
                data-cy="doc-goal-cancel-button"
                variant="text"
                style={{
                  marginRight: '40px',
                  color: 'black',
                  position: 'absolute',
                  top: 20,
                  right: 0,
                }}
                onClick={() => {
                  closeModal();
                }}
              >
                Cancel
              </Button>
              <div>
                <Button
                  variant="text"
                  style={{
                    borderRadius: '20px',
                    marginRight: '40px',
                  }}
                  onClick={() => {
                    _setSelectedGoal(undefined);
                    _setSelectedActivity(undefined);
                    _setStage(SelectingStage.GOAL);
                  }}
                  disabled={_stage === SelectingStage.GOAL}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  data-cy="activity-select-start-button"
                  style={{
                    borderRadius: '20px',
                  }}
                  disabled={!_selectedActivity}
                  onClick={() => {
                    if (!_selectedGoal) return;
                    completeModal(_selectedGoal);
                  }}
                >
                  Start
                </Button>
              </div>
            </RowDiv>
          </ColumnDiv>
        </Box>
      </Modal>
    </div>
  );
}
