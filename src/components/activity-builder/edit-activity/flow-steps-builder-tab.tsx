/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from 'react';
import {
  ActivityBuilder,
  ActivityBuilderStepType,
  ActivityBuilderStepTypes,
  ConditionalActivityStep,
  FlowItem,
  PromptActivityStep,
  RequestUserInputActivityStep,
  RequestUserInputSpecialType,
  SystemMessageActivityStep,
} from '../types';
import { ColumnDiv } from '../../../styled-components';
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
  updateLocalActivity: React.Dispatch<React.SetStateAction<ActivityBuilder>>;
  updateStep: (step: ActivityBuilderStepTypes, flowClientId: string) => void;
  deleteStep: (stepId: string, flowClientId: string) => void;
  setPreviewPromptId: (id: string) => void;
  getVersionsForStep: (stepId: string) => StepVersion[];
  disabled?: boolean;
}) {
  const {
    flow,
    flowsList,
    updateLocalActivity,
    setPreviewPromptId,
    globalStateKeys,
    disabled,
    stepsErrors,
  } = props;

  function renderActivityStep(step: ActivityBuilderStepTypes, i: number) {
    const errors = stepsErrors?.[step.stepId];
    switch (step.stepType) {
      case ActivityBuilderStepType.SYSTEM_MESSAGE:
        return (
          <SystemMessageStepBuilder
            key={i}
            stepIndex={i}
            step={step as SystemMessageActivityStep}
            updateLocalActivity={updateLocalActivity}
            updateStep={(step) => props.updateStep(step, flow.clientId)}
            deleteStep={() => props.deleteStep(step.stepId, flow.clientId)}
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
              step={step as RequestUserInputActivityStep}
              updateLocalActivity={updateLocalActivity}
              deleteStep={() => props.deleteStep(step.stepId, flow.clientId)}
              flowsList={flowsList}
              versions={props.getVersionsForStep(step.stepId)}
            />
          );
        } else {
          return (
            <RequestUserInputStepBuilder
              key={i}
              stepIndex={i}
              step={step as RequestUserInputActivityStep}
              updateLocalActivity={updateLocalActivity}
              deleteStep={() => props.deleteStep(step.stepId, flow.clientId)}
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
            step={step as PromptActivityStep}
            deleteStep={() => props.deleteStep(step.stepId, flow.clientId)}
            updateLocalActivity={updateLocalActivity}
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
            step={step as ConditionalActivityStep}
            updateLocalActivity={updateLocalActivity}
            updateStep={(step) => props.updateStep(step, flow.clientId)}
            deleteStep={() => props.deleteStep(step.stepId, flow.clientId)}
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

  function deleteFlow() {
    updateLocalActivity((prevValue) => {
      return {
        ...prevValue,
        flowsList: prevValue.flowsList.filter(
          (f) => f.clientId !== flow.clientId
        ),
      };
    });
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
        : // : stepType === 'END_ACTIVITY_MESSAGE'
          getDefaultEndActivityStepBuilder();
    updateLocalActivity((prevValue) => {
      return {
        ...prevValue,
        flowsList: prevValue.flowsList.map((f) => {
          if (f.clientId === flow.clientId) {
            return {
              ...f,
              steps: [
                ...f.steps.slice(0, i + 1),
                newStep,
                ...f.steps.slice(i + 1),
              ],
            };
          }
          return f;
        }),
      };
    });
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
        onClick={deleteFlow}
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
          onChange={(e) => {
            updateLocalActivity((prevValue) => {
              return {
                ...prevValue,
                flowsList: prevValue.flowsList.map((f) => {
                  if (f.clientId === flow.clientId) {
                    return {
                      ...f,
                      name: e,
                    };
                  }
                  return f;
                }),
              };
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
