/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React, { useEffect, useState } from 'react';
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
import { SystemMessageStepBuilder } from './system-message-step-builder';
import { RequestUserInputStepBuilder } from './request-user-input-step-builder';
import { PromptStepBuilder } from './prompt-step-builder';
import { InputField } from './shared/input-components';

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

  function renderActivityStep(step: ActivityBuilderStep, i: number) {
    switch (step.stepType) {
      case ActivityBuilderStepType.SYSTEM_MESSAGE:
        return (
          <SystemMessageStepBuilder
            key={i}
            step={step as SystemMessageActivityStep}
            updateStep={updateStep}
            flowsList={flowsList}
          />
        );
      case ActivityBuilderStepType.REQUEST_USER_INPUT:
        return (
          <RequestUserInputStepBuilder
            key={i}
            step={step as RequestUserInputActivityStep}
            updateStep={updateStep}
            flowsList={flowsList}
          />
        );
      case ActivityBuilderStepType.PROMPT:
        return (
          <PromptStepBuilder
            key={i}
            step={step as PromptActivityStep}
            updateStep={updateStep}
            flowsList={flowsList}
          />
        );
      default:
        throw new Error(`Unknown step type: ${step.stepType}`);
    }
  }

  return (
    <ColumnDiv>
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
      {flow.steps.map((step, i) => {
        return renderActivityStep(step, i);
      })}
    </ColumnDiv>
  );
}
