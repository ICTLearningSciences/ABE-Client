/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from 'react';
import {
  FlowItem,
  PredefinedResponse,
  RequestUserInputActivityStep,
} from './types';
import {
  ColumnCenterDiv,
  RoundedBorderDiv,
  RowDiv,
  TopLeftText,
} from '../../styled-components';
import { CheckBoxInput, InputField } from './shared/input-components';
import { FlowStepSelector } from './shared/flow-step-selector';
import { Button, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

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
        alignItems: 'flex-end',
      }}
    >
      <InputField
        label="Custom User Message"
        value={predefinedResponse.message}
        onChange={(e) => {
          props.updateResponse({
            ...predefinedResponse,
            message: e,
          });
        }}
      />
      <FlowStepSelector
        title="Jump to Step (OPTIONAL)"
        flowsList={flowsList}
        rowOrColumn="row"
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
  );
}

function PredefinedResponsesUpdater(props: {
  step: RequestUserInputActivityStep;
  updateStep: (step: RequestUserInputActivityStep) => void;
  flowsList: FlowItem[];
}): JSX.Element {
  const { step, updateStep } = props;
  if (!step.predefinedResponses?.length) {
    return <></>;
  }
  return (
    <ColumnCenterDiv
      style={{
        width: '100%',
        border: '1px solid black',
        alignSelf: 'center',
      }}
    >
      <span style={{ fontWeight: 'bold' }}>Custom Response Buttons</span>

      {step.predefinedResponses.map((response, index) => (
        <PredefinedResponseUpdater
          predefinedResponse={response}
          updateResponse={(updatedResponse) => {
            const updatedResponses = [...step.predefinedResponses];
            updatedResponses[index] = updatedResponse;
            updateStep({
              ...step,
              predefinedResponses: updatedResponses,
            });
          }}
          deleteResponse={() => {
            const updatedResponses = [...step.predefinedResponses];
            updatedResponses.splice(index, 1);
            updateStep({
              ...step,
              predefinedResponses: updatedResponses,
            });
          }}
          flowsList={props.flowsList}
        />
      ))}
      <Button
        onClick={() => {
          updateStep({
            ...step,
            predefinedResponses: [
              ...step.predefinedResponses,
              {
                message: '',
              },
            ],
          });
        }}
      >
        + Add Response
      </Button>
    </ColumnCenterDiv>
  );
}

export function RequestUserInputStepBuilder(props: {
  step: RequestUserInputActivityStep;
  updateStep: (step: RequestUserInputActivityStep) => void;
  flowsList: FlowItem[];
  width?: string;
  height?: string;
}): JSX.Element {
  const { step, updateStep } = props;

  function updateField(field: string, value: string | boolean) {
    props.updateStep({
      ...step,
      [field]: value,
    });
  }

  return (
    <RoundedBorderDiv
      style={{
        width: props.width || '100%',
        height: props.height || '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: 10,
      }}
    >
      <TopLeftText>{step.stepId}</TopLeftText>
      <h4 style={{ alignSelf: 'center' }}>Request User Input</h4>
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
        step={step}
        updateStep={updateStep}
        flowsList={props.flowsList}
      />
    </RoundedBorderDiv>
  );
}
