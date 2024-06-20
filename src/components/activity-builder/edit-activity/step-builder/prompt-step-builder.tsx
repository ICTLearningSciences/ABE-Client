/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from 'react';
import {
  ActivityBuilderStepType,
  FlowItem,
  JsonResponseData,
  JsonResponseDataType,
  PromptActivityStep,
} from '../../types';
import {
  ColumnCenterDiv,
  ColumnDiv,
  RoundedBorderDiv,
  TopLeftText,
} from '../../../../styled-components';
import {
  CheckBoxInput,
  InputField,
  SelectInputField,
} from '../../shared/input-components';
import { PromptOutputTypes } from '../../../../types';
import { Button, IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { v4 as uuid } from 'uuid';
import { JumpToAlternateStep } from '../../shared/jump-to-alternate-step';

export const emptyJsonResponseData: JsonResponseData = {
  name: '',
  type: JsonResponseDataType.STRING,
  isRequired: false,
  additionalInfo: '',
};

export function defaultPromptBuilder(): PromptActivityStep {
  return {
    stepId: uuid(),
    stepType: ActivityBuilderStepType.PROMPT,
    promptText: '',
    responseFormat: '',
    outputDataType: PromptOutputTypes.TEXT,
    jsonResponseData: [],
    includeChatLogContext: false,
    includeEssay: false,
    customSystemRole: '',
    jumpToStepId: '',
  };
}

export function PromptStepBuilder(props: {
  step: PromptActivityStep;
  updateStep: (step: PromptActivityStep) => void;
  deleteStep: () => void;
  flowsList: FlowItem[];
  stepIndex: number;
  width?: string;
  height?: string;
}): JSX.Element {
  const { step, stepIndex } = props;

  function updateField(
    field: string,
    value: string | boolean | JsonResponseData[]
  ) {
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
      <h4 style={{ alignSelf: 'center' }}>Prompt</h4>
      <InputField
        label="Prompt Text"
        value={step.promptText}
        onChange={(e) => {
          updateField('promptText', e);
        }}
        width="100%"
      />
      <InputField
        label="Response Format"
        value={step.responseFormat}
        onChange={(e) => {
          updateField('responseFormat', e);
        }}
        width="100%"
      />

      <SelectInputField
        label="Output Data Type"
        value={step.outputDataType}
        options={[...Object.values(PromptOutputTypes)]}
        onChange={(e) => {
          updateField('outputDataType', e);
        }}
      />

      {step.outputDataType === PromptOutputTypes.JSON && (
        <JsonResponseDataUpdater
          jsonResponseData={step.jsonResponseData || []}
          updateJsonResponseData={(jsonResponseData) => {
            updateField('jsonResponseData', jsonResponseData);
          }}
        />
      )}

      <CheckBoxInput
        label="Include Chat History"
        value={step.includeChatLogContext}
        onChange={(e) => {
          updateField('includeChatLogContext', e);
        }}
      />

      <CheckBoxInput
        label="Include Essay"
        value={step.includeEssay}
        onChange={(e) => {
          updateField('includeEssay', e);
        }}
      />

      <InputField
        label="Custom System Role"
        value={step.customSystemRole}
        onChange={(e) => {
          updateField('customSystemRole', e);
        }}
        width="100%"
      />

      <JumpToAlternateStep
        step={step}
        flowsList={props.flowsList}
        onNewStepSelected={(stepId) => {
          updateField('jumpToStepId', stepId);
        }}
      />
    </RoundedBorderDiv>
  );
}

function JsonResponseDataUpdater(props: {
  jsonResponseData: JsonResponseData[];
  updateJsonResponseData: (jsonResponseData: JsonResponseData[]) => void;
}): JSX.Element {
  return (
    <ColumnCenterDiv
      style={{
        border: '1px dotted grey',
        marginBottom: '10px',
        marginTop: '10px',
      }}
    >
      <h3>Json Response Data</h3>
      {props.jsonResponseData.map((jsonResponseData, index) => {
        return (
          <ColumnDiv
            key={index}
            style={{
              border: '1px solid black',
              position: 'relative',
              width: '95%',
            }}
          >
            <InputField
              label="Variable Name"
              value={jsonResponseData.name}
              onChange={(e) => {
                const updatedJsonResponseData = [...props.jsonResponseData];
                updatedJsonResponseData[index].name = e;
                props.updateJsonResponseData(updatedJsonResponseData);
              }}
            />
            <SelectInputField
              label="Type"
              value={jsonResponseData.type}
              options={[...Object.values(JsonResponseDataType)]}
              onChange={(e) => {
                const updatedJsonResponseData = [...props.jsonResponseData];
                updatedJsonResponseData[index].type = e as JsonResponseDataType;
                props.updateJsonResponseData(updatedJsonResponseData);
              }}
            />
            <CheckBoxInput
              label="Is Required"
              value={jsonResponseData.isRequired}
              onChange={(e) => {
                const updatedJsonResponseData = [...props.jsonResponseData];
                updatedJsonResponseData[index].isRequired = e;
                props.updateJsonResponseData(updatedJsonResponseData);
              }}
            />
            <InputField
              label="Additional Info"
              maxRows={4}
              value={jsonResponseData.additionalInfo || ''}
              onChange={(e) => {
                const updatedJsonResponseData = [...props.jsonResponseData];
                updatedJsonResponseData[index].additionalInfo = e;
                props.updateJsonResponseData(updatedJsonResponseData);
              }}
            />
            <IconButton
              style={{
                position: 'absolute',
                top: 10,
                right: 10,
              }}
              onClick={() => {
                const updatedJsonResponseData = [...props.jsonResponseData];
                updatedJsonResponseData.splice(index, 1);
                props.updateJsonResponseData(updatedJsonResponseData);
              }}
            >
              <Delete />
            </IconButton>
          </ColumnDiv>
        );
      })}
      <Button
        onClick={() => {
          const updatedJsonResponseData = [...props.jsonResponseData];
          updatedJsonResponseData.push(emptyJsonResponseData);
          props.updateJsonResponseData(updatedJsonResponseData);
        }}
      >
        + Add Data Field
      </Button>
    </ColumnCenterDiv>
  );
}
