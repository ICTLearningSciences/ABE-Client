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

export function getEmptyJsonResponseData(): JsonResponseData {
  return {
    clientId: uuid(),
    name: '',
    type: JsonResponseDataType.STRING,
    isRequired: false,
    additionalInfo: '',
  };
}

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
  updateLocalActivity: React.Dispatch<React.SetStateAction<ActivityBuilder>>;
  deleteStep: () => void;
  flowsList: FlowItem[];
  stepIndex: number;
  width?: string;
  height?: string;
}): JSX.Element {
  const { step, stepIndex, updateLocalActivity } = props;

  function updateField(
    field: string,
    value: string | boolean | JsonResponseData[]
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

  function addOrEditJsonResponseData(jsonResponseData: JsonResponseData) {
    updateLocalActivity((prevValue) => {
      return {
        ...prevValue,
        flowsList: prevValue.flowsList.map((f) => {
          return {
            ...f,
            steps: f.steps.map((s) => {
              if (s.stepId === step.stepId) {
                const responseData =
                  (s as PromptActivityStep).jsonResponseData || [];
                const index = responseData.findIndex(
                  (jrd) => jrd.clientId === jsonResponseData.clientId
                );
                if (index >= 0) {
                  return {
                    ...s,
                    jsonResponseData: responseData.map((jrd) => {
                      if (jrd.clientId === jsonResponseData.clientId) {
                        return jsonResponseData;
                      }
                      return jrd;
                    }),
                  };
                } else {
                  return {
                    ...s,
                    jsonResponseData: [...responseData, jsonResponseData],
                  };
                }
              }
              return s;
            }),
          };
        }),
      };
    });
  }

  function deleteJsonResponseData(jsonResponseData: JsonResponseData) {
    updateLocalActivity((prevValue) => {
      return {
        ...prevValue,
        flowsList: prevValue.flowsList.map((f) => {
          return {
            ...f,
            steps: f.steps.map((s) => {
              if (s.stepId === step.stepId) {
                const responseData =
                  (s as PromptActivityStep).jsonResponseData || [];
                const index = responseData.findIndex(
                  (jrd) => jrd.clientId === jsonResponseData.clientId
                );
                if (index >= 0) {
                  return {
                    ...s,
                    jsonResponseData: responseData.filter(
                      (jrd) => jrd.clientId !== jsonResponseData.clientId
                    ),
                  };
                }
              }
              return s;
            }),
          };
        }),
      };
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
          addOrEdit={addOrEditJsonResponseData}
          deleteJsonResponseData={deleteJsonResponseData}
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
  addOrEdit: (jsonResponseData: JsonResponseData) => void;
  deleteJsonResponseData: (jsonResponseData: JsonResponseData) => void;
}): JSX.Element {
  const { jsonResponseData, addOrEdit, deleteJsonResponseData } = props;
  return (
    <ColumnCenterDiv
      style={{
        border: '1px dotted grey',
        marginBottom: '10px',
        marginTop: '10px',
      }}
    >
      <h3>Json Response Data</h3>
      {jsonResponseData.map((jsonResponseData, index) => {
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
                addOrEdit({
                  ...jsonResponseData,
                  name: e,
                });
              }}
            />
            <SelectInputField
              label="Type"
              value={jsonResponseData.type}
              options={[...Object.values(JsonResponseDataType)]}
              onChange={(e) => {
                addOrEdit({
                  ...jsonResponseData,
                  type: e as JsonResponseDataType,
                });
              }}
            />
            <CheckBoxInput
              label="Is Required"
              value={jsonResponseData.isRequired}
              onChange={(e) => {
                addOrEdit({
                  ...jsonResponseData,
                  isRequired: e,
                });
              }}
            />
            <InputField
              label="Additional Info"
              maxRows={4}
              value={jsonResponseData.additionalInfo || ''}
              onChange={(e) => {
                addOrEdit({
                  ...jsonResponseData,
                  additionalInfo: e,
                });
              }}
            />
            <IconButton
              style={{
                position: 'absolute',
                top: 10,
                right: 10,
              }}
              onClick={() => {
                deleteJsonResponseData(jsonResponseData);
              }}
            >
              <Delete />
            </IconButton>
          </ColumnDiv>
        );
      })}
      <Button
        onClick={() => {
          addOrEdit(getEmptyJsonResponseData());
        }}
      >
        + Add Data Field
      </Button>
    </ColumnCenterDiv>
  );
}
