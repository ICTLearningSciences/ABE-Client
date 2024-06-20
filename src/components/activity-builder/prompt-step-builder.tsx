/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from 'react';
import {
  FlowItem,
  JsonResponseData,
  JsonResponseDataType,
  PromptActivityStep,
} from './types';
import {
  ColumnCenterDiv,
  ColumnDiv,
  RoundedBorderDiv,
  TopLeftText,
} from '../../styled-components';
import {
  CheckBoxInput,
  InputField,
  SelectInputField,
} from './shared/input-components';
import { FlowStepSelector } from './shared/flow-step-selector';
import { PromptOutputTypes } from '../../types';
import { Button } from '@mui/material';

export const emptyJsonResponseData: JsonResponseData = {
  name: '',
  type: JsonResponseDataType.STRING,
  isRequired: false,
  additionalInfo: '',
};

export function PromptStepBuilder(props: {
  step: PromptActivityStep;
  updateStep: (step: PromptActivityStep) => void;
  flowsList: FlowItem[];
  width?: string;
  height?: string;
}): JSX.Element {
  const { step } = props;

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
        flexDirection: 'column',
        padding: 10,
      }}
    >
      <TopLeftText>{step.stepId}</TopLeftText>
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

      <JsonResponseDataUpdater
        jsonResponseData={step.jsonResponseData || []}
        updateJsonResponseData={(jsonResponseData) => {
          updateField('jsonResponseData', jsonResponseData);
        }}
      />

      <ColumnCenterDiv
        style={{
          width: '50%',
          border: '1px solid black',
          padding: 10,
          alignSelf: 'center',
        }}
      >
        <span style={{ fontWeight: 'bold' }}>Custom Step Jump</span>
        <FlowStepSelector
          flowsList={props.flowsList || []}
          onStepSelected={(stepId) => {
            updateField('jumpToStepId', stepId);
          }}
        />
      </ColumnCenterDiv>
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
