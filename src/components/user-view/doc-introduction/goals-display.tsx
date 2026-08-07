/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/

import React from "react";
import { DisplayIcon } from "../../../helpers/display-icon-helper";
import { ColumnDiv } from "../../../styled-components";
import type { DocGoal } from "../../../types";
import {
  GoalDisplay as _GoalDisplay,
  ActivitiesContainer,
  ActivitiesGrid,
} from "./doc-goal-modal-styles";

export function GoalsDisplay(props: {
  docGoals: DocGoal[];
  setSelectedGoal: (goal: DocGoal) => void;
  isNewGoogleDoc?: boolean;
  selectedGoal?: DocGoal;
}): React.ReactNode {
  const { docGoals, setSelectedGoal, selectedGoal, isNewGoogleDoc } = props;
  return (
    <ActivitiesContainer>
      <h1
        style={{
          borderRadius: "10px",
          padding: 10,
          margin: "10px 0",
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
}): React.ReactNode {
  const { docGoal, setSelectedGoal, isSelected, isNewGoogleDoc } = props;
  return (
    <_GoalDisplay
      className={`${
        isNewGoogleDoc && docGoal.newDocRecommend ? "goal-display-flash" : ""
      }`}
      data-cy={`goal-display-${docGoal._id}`}
      style={{
        border: isSelected ? "2px solid black" : "2px solid grey",
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
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h2 style={{ margin: 0, textAlign: "center" }}>{docGoal.title}</h2>
        <span style={{ opacity: 0.5, fontWeight: "bold", textAlign: "center" }}>
          {docGoal.description}
        </span>
      </ColumnDiv>
    </_GoalDisplay>
  );
}
