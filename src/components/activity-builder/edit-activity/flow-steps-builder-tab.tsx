/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from 'react';
import {
  ActivityBuilderStepType,
  ActivityBuilderStepTypes,
  FlowItem,
  RequestUserInputSpecialType,
} from '../types';
import { ColumnDiv } from '../../../styled-components';
import { useEditActivityContext } from '../activity-builder-context';
import {
  RequestUserInputStepBuilder,
  getDefaultRequestUserInputBuilder,
} from './step-builder/request-user-input-step-builder';
import {
  PromptStepBuilder,
  defaultPromptBuilder,
} from './step-builder/prompt-step-builder';
import { InputField } from '../shared/input-components';
import { AddNewActivityButton } from '../shared/add-new-activity-button';
import { Button, Tooltip } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import {
  SystemMessageStepBuilder,
  getDefaultSystemMessage,
} from './step-builder/system-message-step-builder';
import { StepVersion } from './activity-flow-container';
import {
  ConditionalStepBuilder,
  getDefaultConditionalStep,
} from './step-builder/conditional-step-builder';
import { StepErrors } from '../../../classes/activity-builder-activity/activity-step-error-checker';
import { AddNewActivityStepType } from '../shared/add-new-activity-button';
import {
  EndActivityStepBuilder,
  getDefaultEndActivityStepBuilder,
} from './step-builder/end-activity-step-builder';

export function FlowStepsBuilderTab(props: {
  stepsErrors?: StepErrors;
  globalStateKeys: string[];
  flow: FlowItem;
  flowsList: FlowItem[];
  updateStep: (flowClientId: string, step: ActivityBuilderStepTypes) => void;
  deleteStep: (flowClientId: string, stepId: string) => void;
  setPreviewPromptId: (id: string) => void;
  getVersionsForStep: (stepId: string) => StepVersion[];
  disabled?: boolean;
}) {
  const {
    flow,
    flowsList,
    setPreviewPromptId,
    globalStateKeys,
    disabled,
    stepsErrors,
  } = props;
  const { updateFlowName, addStep, deleteFlow } = useEditActivityContext();

  function renderActivityStep(step: ActivityBuilderStepTypes, i: number) {
    const errors = stepsErrors?.[step.stepId];
    switch (step.stepType) {
      case ActivityBuilderStepType.SYSTEM_MESSAGE:
        return (
          <SystemMessageStepBuilder
            key={i}
            stepIndex={i}
            stepId={step.stepId}
            updateStep={props.updateStep}
            deleteStep={() => props.deleteStep(flow.clientId, step.stepId)}
            flowsList={flowsList}
            versions={props.getVersionsForStep(step.stepId)}
            errors={errors}
          />
        );
      case ActivityBuilderStepType.REQUEST_USER_INPUT:
        if (step.specialType === RequestUserInputSpecialType.END_ACTIVITY) {
          return (
            <EndActivityStepBuilder
              key={i}
              stepIndex={i}
              stepId={step.stepId}
              deleteStep={() => props.deleteStep(flow.clientId, step.stepId)}
              flowsList={flowsList}
              versions={props.getVersionsForStep(step.stepId)}
            />
          );
        } else {
          return (
            <RequestUserInputStepBuilder
              key={i}
              stepIndex={i}
              stepId={step.stepId}
              deleteStep={() => props.deleteStep(flow.clientId, step.stepId)}
              flowsList={flowsList}
              versions={props.getVersionsForStep(step.stepId)}
              errors={errors}
            />
          );
        }
      case ActivityBuilderStepType.PROMPT:
        return (
          <PromptStepBuilder
            key={i}
            stepIndex={i}
            stepId={step.stepId}
            deleteStep={props.deleteStep}
            flowsList={flowsList}
            previewed={false}
            startPreview={() => setPreviewPromptId(step.stepId)}
            stopPreview={() => setPreviewPromptId('')}
            versions={props.getVersionsForStep(step.stepId)}
            errors={errors}
          />
        );
      case ActivityBuilderStepType.CONDITIONAL:
        return (
          <ConditionalStepBuilder
            globalStateKeys={globalStateKeys}
            key={i}
            stepId={step.stepId}
            updateStep={props.updateStep}
            deleteStep={() => props.deleteStep(flow.clientId, step.stepId)}
            flowsList={flowsList}
            stepIndex={i}
            versions={props.getVersionsForStep(step.stepId)}
            errors={errors}
          />
        );
      default:
        throw new Error(`Unknown step type: ${step}`);
    }
  }

  function handleDeleteFlow() {
    deleteFlow(flow.clientId);
  }

  function insertNewActivityStep(stepType: AddNewActivityStepType, i: number) {
    const newStep: ActivityBuilderStepTypes =
      stepType === ActivityBuilderStepType.SYSTEM_MESSAGE
        ? getDefaultSystemMessage()
        : stepType === ActivityBuilderStepType.REQUEST_USER_INPUT
        ? getDefaultRequestUserInputBuilder()
        : stepType === ActivityBuilderStepType.CONDITIONAL
        ? getDefaultConditionalStep()
        : stepType === 'EDIT_DOC_PROMPT'
        ? defaultPromptBuilder(stepType === 'EDIT_DOC_PROMPT')
        : stepType === 'END_ACTIVITY_MESSAGE'
        ? getDefaultEndActivityStepBuilder()
        : defaultPromptBuilder(false);
    addStep(flow.clientId, newStep, i);
  }

  return (
    <ColumnDiv
      style={{
        alignItems: 'center',
        position: 'relative',
        pointerEvents: disabled ? 'none' : 'auto',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <Tooltip
        title={
          <div>
            {globalStateKeys.map((key) => (
              <div key={key}>{key}</div>
            ))}
          </div>
        }
      >
        <div
          style={{
            position: 'sticky',
            left: 10,
            top: 10,
            alignSelf: 'flex-start',
            color: 'gray',
            cursor: 'pointer',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            height: 0,
            overflow: 'visible',
            paddingTop: 20,
          }}
        >
          <InfoIcon />
          Variables
        </div>
      </Tooltip>
      <Button
        style={{
          position: 'absolute',
          right: '0',
          top: '0',
        }}
        color="error"
        variant="outlined"
        onClick={handleDeleteFlow}
      >
        Delete Flow
      </Button>
      <div
        style={{
          alignSelf: 'center',
        }}
      >
        <InputField
          label="Flow Title"
          value={flow.name}
          onChange={(name) => updateFlowName(flow.clientId, name)}
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
            key={`${flow.clientId}-${step.stepId}`}
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
          </ColumnDiv>
        );
      })}
    </ColumnDiv>
  );
}
