/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from 'react';
import {
  ActivityBuilder,
  ActivityBuilderStepType,
  FlowItem,
  PredefinedResponse,
  RequestUserInputActivityStep,
} from '../../types';
import {
  ColumnCenterDiv,
  ColumnDiv,
  RoundedBorderDiv,
  RowDiv,
  TopLeftText,
} from '../../../../styled-components';
import { CheckBoxInput, InputField } from '../../shared/input-components';
import { FlowStepSelector } from '../../shared/flow-step-selector';
import { Button, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { v4 as uuid } from 'uuid';
import { Delete } from '@mui/icons-material';
import { JumpToAlternateStep } from '../../shared/jump-to-alternate-step';
import Collapse from '@mui/material/Collapse';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
export function getDefaultRequestUserInputBuilder(): RequestUserInputActivityStep {
  return {
    stepId: uuid(),
    stepType: ActivityBuilderStepType.REQUEST_USER_INPUT,
    message: '',
    saveResponseVariableName: '',
    saveAsIntention: false,
    disableFreeInput: false,
    predefinedResponses: [],
  };
}

function PredefinedResponseUpdater(props: {
  predefinedResponse: PredefinedResponse;
  updateResponse: (updatedResponse: PredefinedResponse) => void;
  deleteResponse: () => void;
  flowsList: FlowItem[];
}): JSX.Element {
  const { predefinedResponse, updateResponse, flowsList, deleteResponse } =
    props;
  return (
    <RowDiv
      style={{
        // alignItems: 'center',
        borderTop: '1px dotted black',
        width: '100%',
        justifyContent: 'space-between',
      }}
    >
      <ColumnDiv
        style={{
          width: '60%',
        }}
      >
        <InputField
          label="Custom User Message"
          width="100%"
          value={predefinedResponse.message}
          onChange={(e) => {
            props.updateResponse({
              ...predefinedResponse,
              message: e,
            });
          }}
        />
        <InputField
          label="Response Weight (Optional)"
          width="100%"
          value={predefinedResponse.responseWeight || ''}
          onChange={(e) => {
            props.updateResponse({
              ...predefinedResponse,
              responseWeight: e,
            });
          }}
        />
        <CheckBoxInput
          label="Is Array Data?"
          value={predefinedResponse.isArray || false}
          onChange={(e) => {
            props.updateResponse({
              ...predefinedResponse,
              isArray: e,
            });
          }}
        />
      </ColumnDiv>
      <RowDiv>
        <FlowStepSelector
          title="Jump to Step (OPTIONAL)"
          flowsList={flowsList}
          width="150px"
          currentJumpToStepId={predefinedResponse.jumpToStepId}
          rowOrColumn="column"
          onStepSelected={(stepId) => {
            updateResponse({
              ...predefinedResponse,
              jumpToStepId: stepId,
            });
          }}
        />
        <IconButton
          data-cy="delete-predefined-response"
          onClick={deleteResponse}
          color="primary"
        >
          <DeleteIcon />
        </IconButton>
      </RowDiv>
    </RowDiv>
  );
}

function PredefinedResponsesUpdater(props: {
  step: RequestUserInputActivityStep;
  updatePredefinedResponse: (updatedResponse: PredefinedResponse) => void;
  addNewPredefinedResponse: () => void;
  deletePredefinedResponse: (clientId: string) => void;
  flowsList: FlowItem[];
  width?: string;
}): JSX.Element {
  const {
    step,
    updatePredefinedResponse,
    addNewPredefinedResponse,
    deletePredefinedResponse,
  } = props;
  return (
    <ColumnCenterDiv
      style={{
        width: props.width || '100%',
        border: '1px solid black',
        alignSelf: 'center',
        justifyContent: 'center',
        padding: 10,
      }}
    >
      <span style={{ fontWeight: 'bold' }}>Custom Response Buttons</span>

      {step.predefinedResponses?.length &&
        step.predefinedResponses.map((response, index) => (
          <PredefinedResponseUpdater
            key={index}
            predefinedResponse={response}
            updateResponse={(updatedResponse) => {
              updatePredefinedResponse(updatedResponse);
            }}
            deleteResponse={() => {
              deletePredefinedResponse(response.clientId);
            }}
            flowsList={props.flowsList}
          />
        ))}
      <Button onClick={addNewPredefinedResponse}>+ Add Response</Button>
    </ColumnCenterDiv>
  );
}

export function RequestUserInputStepBuilder(props: {
  step: RequestUserInputActivityStep;
  updateLocalActivity: React.Dispatch<React.SetStateAction<ActivityBuilder>>;
  deleteStep: () => void;
  flowsList: FlowItem[];
  stepIndex: number;
  width?: string;
  height?: string;
}): JSX.Element {
  const { step, stepIndex, updateLocalActivity } = props;
  const [collapsed, setCollapsed] = React.useState<boolean>(false);
  function updateField(
    field: string,
    value: string | boolean | PredefinedResponse[]
  ) {
    updateLocalActivity((prevValue) => {
      return {
        ...prevValue,
        flowsList: prevValue.flowsList.map((f) => {
          return {
            ...f,
            steps: f.steps.map((s) => {
              if (s.stepId === step.stepId) {
                return {
                  ...s,
                  [field]: value,
                };
              }
              return s;
            }),
          };
        }),
      };
    });
  }

  function updatePredefinedResponse(updatedResponse: PredefinedResponse) {
    updateLocalActivity((prevValue) => {
      return {
        ...prevValue,
        flowsList: prevValue.flowsList.map((f) => {
          return {
            ...f,
            steps: f.steps.map((s) => {
              if (s.stepId === step.stepId) {
                return {
                  ...s,
                  predefinedResponses: (
                    s as RequestUserInputActivityStep
                  ).predefinedResponses.map((r) => {
                    if (r.clientId === updatedResponse.clientId) {
                      return updatedResponse;
                    }
                    return r;
                  }),
                };
              }
              return s;
            }),
          };
        }),
      };
    });
  }

  function addNewPredefinedResponse() {
    updateField('predefinedResponses', [
      ...step.predefinedResponses,
      {
        clientId: uuid(),
        message: '',
        responseWeight: '0',
      },
    ]);
  }

  function deletePredefinedResponse(clientId: string) {
    updateField(
      'predefinedResponses',
      step.predefinedResponses.filter((r) => r.clientId !== clientId)
    );
  }

  return (
    <RoundedBorderDiv
      style={{
        width: props.width || '100%',
        height: props.height || '100%',
        display: 'flex',
        position: 'relative',
        flexDirection: 'column',
        padding: 10,
      }}
    >
      <TopLeftText>{`Step ${stepIndex + 1}`}</TopLeftText>
      <IconButton
        style={{
          position: 'absolute',
          right: 10,
          top: 10,
        }}
        onClick={props.deleteStep}
      >
        <Delete />
      </IconButton>
      <IconButton
        style={{
          width: 'fit-content',
          position: 'absolute',
          left: 10,
          top: 40,
        }}
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </IconButton>
      <h4 style={{ alignSelf: 'center' }}>Request User Input</h4>
      <Collapse in={!collapsed}>
        <InputField
          label="Request Message (Optional)"
          value={step.message}
          onChange={(e) => {
            updateField('message', e);
          }}
        />
        <InputField
          label="Save Response As"
          value={step.saveResponseVariableName}
          onChange={(e) => {
            updateField('saveResponseVariableName', e);
          }}
        />
        <CheckBoxInput
          label="Input is session intention."
          value={step.saveAsIntention}
          onChange={(e) => {
            updateField('saveAsIntention', e);
          }}
        />
        <CheckBoxInput
          label="Disable Text Input? (requires predefined responses)"
          value={step.disableFreeInput}
          onChange={(e) => {
            updateField('disableFreeInput', e);
          }}
        />
        <PredefinedResponsesUpdater
          width="90%"
          step={step}
          updatePredefinedResponse={updatePredefinedResponse}
          addNewPredefinedResponse={addNewPredefinedResponse}
          deletePredefinedResponse={deletePredefinedResponse}
          flowsList={props.flowsList}
        />

        <JumpToAlternateStep
          step={step}
          flowsList={props.flowsList}
          onNewStepSelected={(stepId) => {
            updateField('jumpToStepId', stepId);
          }}
        />
      </Collapse>
    </RoundedBorderDiv>
  );
}
