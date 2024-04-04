import React from 'react';
import { DisplayIcon } from '../../../helpers/display-icon-helper';
import { RowDiv, ColumnDiv } from '../../../styled-components';
import { DocGoal } from '../../../types';
import './doc-goal-modal.css';

export function GoalsDisplay(props: {
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
