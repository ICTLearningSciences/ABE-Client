/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from 'react';
import {
  ActivityBuilder,
  ActivityBuilderStep,
  ActivityBuilderStepType,
  FlowItem,
  PromptActivityStep,
  RequestUserInputActivityStep,
  SystemMessageActivityStep,
} from './types';
import { ColumnDiv } from '../../styled-components';
import {
  SystemMessageStepBuilder,
  getDefaultSystemMessage,
} from './system-message-step-builder';
import {
  RequestUserInputStepBuilder,
  getDefaultRequestUserInputBuilder,
} from './request-user-input-step-builder';
import { PromptStepBuilder, defaultPromptBuilder } from './prompt-step-builder';
import { InputField } from './shared/input-components';
import { AddNewActivityButton } from './shared/add-new-activity-button';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { IconButton } from '@mui/material';
export function FlowStepsBuilderTab(props: {
  flow: FlowItem;
  flowsList: FlowItem[];
  updateLocalActivity: React.Dispatch<React.SetStateAction<ActivityBuilder>>;
}) {
  const { flow, flowsList, updateLocalActivity } = props;

  function setLocalFlowCopy(flow: FlowItem) {
    updateLocalActivity((prevValue) => {
      return {
        ...prevValue,
        flowsList: prevValue.flowsList.map((f) => {
          if (f._id === flow._id) {
            return flow;
          }
          return f;
        }),
      };
    });
  }

  function updateStep(step: ActivityBuilderStep) {
    const updatedSteps = flow.steps.map((s) => {
      if (s.stepId === step.stepId) {
        return step;
      }
      return s;
    });
    setLocalFlowCopy({
      ...flow,
      steps: updatedSteps,
    });
  }

  function deleteStep(stepId: string) {
    const updatedSteps = flow.steps.filter((s) => s.stepId !== stepId);
    setLocalFlowCopy({
      ...flow,
      steps: updatedSteps,
    });
  }

  function renderActivityStep(step: ActivityBuilderStep, i: number) {
    switch (step.stepType) {
      case ActivityBuilderStepType.SYSTEM_MESSAGE:
        return (
          <SystemMessageStepBuilder
            key={i}
            stepIndex={i}
            step={step as SystemMessageActivityStep}
            updateStep={updateStep}
            deleteStep={() => deleteStep(step.stepId)}
            flowsList={flowsList}
          />
        );
      case ActivityBuilderStepType.REQUEST_USER_INPUT:
        return (
          <RequestUserInputStepBuilder
            key={i}
            stepIndex={i}
            step={step as RequestUserInputActivityStep}
            deleteStep={() => deleteStep(step.stepId)}
            updateStep={updateStep}
            flowsList={flowsList}
          />
        );
      case ActivityBuilderStepType.PROMPT:
        return (
          <PromptStepBuilder
            key={i}
            stepIndex={i}
            step={step as PromptActivityStep}
            deleteStep={() => deleteStep(step.stepId)}
            updateStep={updateStep}
            flowsList={flowsList}
          />
        );
      default:
        throw new Error(`Unknown step type: ${step.stepType}`);
    }
  }

  function insertNewActivityStep(stepType: ActivityBuilderStepType, i: number) {
    const newStep: ActivityBuilderStep =
      stepType === ActivityBuilderStepType.SYSTEM_MESSAGE
        ? getDefaultSystemMessage()
        : stepType === ActivityBuilderStepType.REQUEST_USER_INPUT
        ? getDefaultRequestUserInputBuilder()
        : defaultPromptBuilder();
    setLocalFlowCopy({
      ...flow,
      steps: [
        ...flow.steps.slice(0, i + 1),
        newStep,
        ...flow.steps.slice(i + 1),
      ],
    });
  }

  function moveStepUp(i: number) {
    if (i === 0) {
      return;
    }
    const newSteps = [...flow.steps];
    const temp = newSteps[i];
    newSteps[i] = newSteps[i - 1];
    newSteps[i - 1] = temp;
    setLocalFlowCopy({
      ...flow,
      steps: newSteps,
    });
  }

  function moveStepDown(i: number) {
    if (i === flow.steps.length - 1) {
      return;
    }
    const newSteps = [...flow.steps];
    const temp = newSteps[i];
    newSteps[i] = newSteps[i + 1];
    newSteps[i + 1] = temp;
    setLocalFlowCopy({
      ...flow,
      steps: newSteps,
    });
  }

  function MoveStepArrows(props: {
    i: number;
    disableUp: boolean;
    disableDown: boolean;
  }): JSX.Element {
    const { i, disableDown, disableUp } = props;
    return (
      <ColumnDiv
        style={{
          position: 'absolute',
          right: '0',
          top: '40%',
          transform: 'translateY(-40%)',
        }}
      >
        <IconButton
          onClick={() => {
            moveStepUp(i);
          }}
          disabled={disableUp}
        >
          <ArrowUpwardIcon />
        </IconButton>
        <IconButton
          disabled={disableDown}
          onClick={() => {
            moveStepDown(i);
          }}
        >
          <ArrowDownwardIcon />
        </IconButton>
      </ColumnDiv>
    );
  }

  return (
    <ColumnDiv
      style={{
        alignItems: 'center',
      }}
    >
      <div
        style={{
          alignSelf: 'center',
        }}
      >
        <InputField
          label="Flow Title"
          value={flow.name}
          onChange={(e) => {
            setLocalFlowCopy({
              ...flow,
              name: e,
            });
          }}
        />
      </div>
      {
        <AddNewActivityButton
          insertNewActivityStep={(stepType) =>
            insertNewActivityStep(stepType, -1)
          }
        />
      }
      {flow.steps.map((step, i) => {
        return (
          <ColumnDiv
            key={i}
            style={{
              alignItems: 'center',
              width: '100%',
              maxWidth: '900px',
              position: 'relative',
            }}
          >
            {renderActivityStep(step, i)}
            <AddNewActivityButton
              insertNewActivityStep={(stepType) =>
                insertNewActivityStep(stepType, i)
              }
            />
            <MoveStepArrows
              i={i}
              disableUp={i === 0}
              disableDown={i === flow.steps.length - 1}
            />
          </ColumnDiv>
        );
      })}
    </ColumnDiv>
  );
}
