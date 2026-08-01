/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/

import React from "react";
import { RadioButtonUnchecked, CheckCircle } from "@mui/icons-material";

import { ColumnDiv } from "../../../styled-components";
import type { ActivityTypes } from "../../../types";
import {
  GoalDisplay,
  ActivitiesGrid,
  ActivitiesContainer,
} from "./doc-goal-modal-styles";

function ActivityDisplay(props: {
  activity: ActivityTypes;
  setSelectedActivity: (activity: ActivityTypes) => void;
  isSelected?: boolean;
  isNewGoogleDoc?: boolean;
}): React.ReactNode {
  const { activity, setSelectedActivity, isSelected, isNewGoogleDoc } = props;
  return (
    <GoalDisplay
      className={`${
        isNewGoogleDoc && activity.newDocRecommend ? "goal-display-flash" : ""
      }`}
      data-cy={`activity-display-${activity._id}`}
      style={{
        border: isSelected ? "2px solid black" : "2px solid grey",
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
          position: "absolute",
          width: "20px",
          height: "20px",
          top: 10,
          right: 15,
        }}
      >
        {isSelected ? (
          <CheckCircle
            style={{
              color: "green",
            }}
          />
        ) : (
          <RadioButtonUnchecked
            style={{
              color: "grey",
            }}
          />
        )}
      </div>
      <ColumnDiv
        style={{
          alignItems: "center",
          justifyContent: "center",
          width: "fit-content",
        }}
      >
        <h2 style={{ margin: 0, textAlign: "center" }}>{activity.title}</h2>
        <span style={{ opacity: 0.5, fontWeight: "bold", textAlign: "center" }}>
          {activity.description}
        </span>
      </ColumnDiv>
    </GoalDisplay>
  );
}

export function ActivitiesDisplay(props: {
  activities: ActivityTypes[];
  setSelectedActivity: (activity: ActivityTypes) => void;
  selectedActivity?: ActivityTypes;
  isNewGoogleDoc?: boolean;
}): React.ReactNode {
  const { activities, setSelectedActivity, selectedActivity, isNewGoogleDoc } =
    props;

  return (
    <ActivitiesContainer>
      <h1
        style={{
          borderRadius: "10px",
          padding: 10,
          margin: "10px 0",
          textAlign: "center",
        }}
      >
        Please select an activity.
      </h1>
      <ActivitiesGrid>
        {activities.map((activity, i) => (
          <ActivityDisplay
            key={i}
            activity={activity}
            setSelectedActivity={setSelectedActivity}
            isSelected={selectedActivity?._id === activity._id}
            isNewGoogleDoc={isNewGoogleDoc}
          />
        ))}
      </ActivitiesGrid>
    </ActivitiesContainer>
  );
}
