import React from 'react';
import { DisplayIcon } from '../../../helpers/display-icon-helper';
import { ColumnDiv } from '../../../styled-components';
import { DocGoal } from '../../../types';
import {
  GoalDisplay as _GoalDisplay,
  ActivitiesContainer,
  ActivitiesGrid,
} from './doc-goal-modal-styles';

export function GoalsDisplay(props: {
  docGoals: DocGoal[];
  setSelectedGoal: (goal: DocGoal) => void;
  isNewGoogleDoc?: boolean;
  selectedGoal?: DocGoal;
}): JSX.Element {
  const { docGoals, setSelectedGoal, selectedGoal, isNewGoogleDoc } = props;
  return (
    <ActivitiesContainer>
      <h1
        style={{
          borderRadius: '10px',
          padding: 10,
          margin: '10px 0',
        }}
      >
        What is your current goal?
      </h1>
      <ActivitiesGrid>
        {docGoals.map((docGoal, i) => (
          <GoalDisplay
            key={i}
            docGoal={docGoal}
            setSelectedGoal={setSelectedGoal}
            isSelected={selectedGoal?._id === docGoal._id}
            isNewGoogleDoc={isNewGoogleDoc}
          />
        ))}
      </ActivitiesGrid>
    </ActivitiesContainer>
  );
}

function GoalDisplay(props: {
  docGoal: DocGoal;
  setSelectedGoal: (goal: DocGoal) => void;
  isSelected?: boolean;
  isNewGoogleDoc?: boolean;
}): JSX.Element {
  const { docGoal, setSelectedGoal, isSelected, isNewGoogleDoc } = props;
  return (
    <_GoalDisplay
      className={`${
        isNewGoogleDoc && docGoal.newDocRecommend ? 'goal-display-flash' : ''
      }`}
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
    </_GoalDisplay>
  );
}
