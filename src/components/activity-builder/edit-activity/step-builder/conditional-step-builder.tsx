/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from 'react';
import { v4 as uuid } from 'uuid';
import { Button, IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';
import {
  ColumnCenterDiv,
  RoundedBorderDiv,
  RowDiv,
  TopLeftText,
} from '../../../../styled-components';
import { InputField, SelectInputField } from '../../shared/input-components';
import { JumpToAlternateStep } from '../../shared/jump-to-alternate-step';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import {
  SystemMessageActivityStep,
  ActivityBuilderStepType,
  FlowItem,
  ActivityBuilder,
  LogicStepConditional,
  ConditionalActivityStep,
  Checking,
  NumericOperations,
} from '../../types';
import Collapse from '@mui/material/Collapse';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { StepVersion } from '../activity-flow-container';
import { VersionsDropdown } from './versions-dropdown';
import { FlowStepSelector } from '../../shared/flow-step-selector';
import { InfoTooltip } from '../../../info-tooltip';

export function getDefaultConditionalStep(): ConditionalActivityStep {
  return {
    stepId: uuid(),
    stepType: ActivityBuilderStepType.CONDITIONAL,
    jumpToStepId: '',
    conditionals: [],
  };
}

export function ConditionalStepBuilder(props: {
  globalStateKeys: string[];
  step: ConditionalActivityStep;
  updateLocalActivity: React.Dispatch<React.SetStateAction<ActivityBuilder>>;
  updateStep: (step: SystemMessageActivityStep) => void;
  deleteStep: () => void;
  flowsList: FlowItem[];
  stepIndex: number;
  width?: string;
  height?: string;
  versions: StepVersion[];
  errors?: string[];
}): JSX.Element {
  const {
    step,
    stepIndex,
    updateLocalActivity,
    versions,
    globalStateKeys,
    errors,
  } = props;
  const [collapsed, setCollapsed] = React.useState<boolean>(false);

  const [rerender, setRerender] = React.useState(0);
  function replacePromptStepWithVersion(version: StepVersion) {
    updateLocalActivity((prevValue) => {
      return {
        ...prevValue,
        flowsList: prevValue.flowsList.map((f) => {
          return {
            ...f,
            steps: f.steps.map((s) => {
              if (s.stepId === step.stepId) {
                return version.step;
              }
              return s;
            }),
          };
        }),
      };
    });
    setRerender(rerender + 1);
  }

  function updateField(
    field: string,
    value: string | boolean | LogicStepConditional[]
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

  function updateConditionalField(
    index: number,
    field: string,
    value: string | boolean
  ) {
    updateLocalActivity((prevValue) => {
      return {
        ...prevValue,
        flowsList: prevValue.flowsList.map((f) => {
          return {
            ...f,
            steps: f.steps.map((s) => {
              if (s.stepId === step.stepId) {
                const step = s as ConditionalActivityStep;
                return {
                  ...step,
                  conditionals: step.conditionals.map((c, i) => {
                    if (i === index) {
                      return {
                        ...c,
                        [field]: value,
                      };
                    }
                    return c;
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

  return (
    <RoundedBorderDiv
      key={rerender}
      style={{
        width: props.width || '100%',
        height: props.height || '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
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
        {collapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />}
      </IconButton>

      <h4
        style={{ alignSelf: 'center', display: 'flex', alignItems: 'center' }}
      >
        Conditionals{' '}
        <InfoTooltip title="Define conditions that will trigger the flow to jump to a specific step." />
      </h4>
      {errors && errors.length > 0 && (
        <span style={{ color: 'red', textAlign: 'center' }}>
          {errors.join(', ')}
        </span>
      )}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 60,
        }}
      >
        <VersionsDropdown
          versions={versions}
          onSelect={replacePromptStepWithVersion}
        />
      </div>
      <Collapse in={!collapsed}>
        <ColumnCenterDiv>
          {step.conditionals.map((conditional, index) => {
            return (
              <ColumnCenterDiv
                key={`${conditional.stateDataKey}-${index}-${conditional.checking}-${conditional.expectedValue}-${conditional.targetStepId}`}
                style={{
                  border: '1px solid black',
                  position: 'relative',
                  borderRadius: '10px',
                  width: '90%',
                  marginTop: 5,
                  marginBottom: 5,
                }}
              >
                <RowDiv>
                  <SelectInputField
                    label="Data Key"
                    value={conditional.stateDataKey}
                    options={globalStateKeys}
                    onChange={(v) => {
                      const newConditionals = [...step.conditionals];
                      newConditionals[index].stateDataKey = v;
                      updateConditionalField(index, 'stateDataKey', v);
                    }}
                  />
                  <SelectInputField
                    label="Checking"
                    value={conditional.checking}
                    options={Object.values(Checking)}
                    onChange={(v) => {
                      const newConditionals = [...step.conditionals];
                      newConditionals[index].checking = v as Checking;
                      updateConditionalField(index, 'checking', v);
                    }}
                  />
                  {conditional.checking !== Checking.CONTAINS && (
                    <SelectInputField
                      label="Operation"
                      value={conditional.operation}
                      options={Object.values(NumericOperations)}
                      onChange={(v) => {
                        const newConditionals = [...step.conditionals];
                        newConditionals[index].operation =
                          v as NumericOperations;
                        updateConditionalField(index, 'operation', v);
                      }}
                    />
                  )}
                  <InputField
                    label="Expected Value"
                    value={conditional.expectedValue}
                    onChange={(v) => {
                      const newConditionals = [...step.conditionals];
                      newConditionals[index].expectedValue = v;
                      updateConditionalField(index, 'expectedValue', v);
                    }}
                  />
                  <IconButton
                    onClick={() => {
                      updateLocalActivity((prevValue) => {
                        return {
                          ...prevValue,
                          flowsList: prevValue.flowsList.map((f) => {
                            return {
                              ...f,
                              steps: f.steps.map((s) => {
                                if (s.stepId === step.stepId) {
                                  const step = s as ConditionalActivityStep;
                                  return {
                                    ...step,
                                    conditionals: step.conditionals.filter(
                                      (c, i) => i !== index
                                    ),
                                  };
                                }
                                return s;
                              }),
                            };
                          }),
                        };
                      });
                    }}
                  >
                    <Delete />
                  </IconButton>
                </RowDiv>
                <FlowStepSelector
                  title="Target Step"
                  flowsList={props.flowsList}
                  width="100%"
                  currentJumpToStepId={conditional.targetStepId}
                  rowOrColumn="column"
                  onStepSelected={(stepId) => {
                    const newConditionals = [...step.conditionals];
                    newConditionals[index].targetStepId = stepId;
                    updateField('conditionals', newConditionals);
                  }}
                />
              </ColumnCenterDiv>
            );
          })}

          <Button
            variant="outlined"
            onClick={() => {
              updateField('conditionals', [
                ...step.conditionals,
                {
                  stateDataKey: '',
                  operation: NumericOperations.EQUALS,
                  checking: Checking.VALUE,
                  expectedValue: '',
                  targetStepId: '',
                } as LogicStepConditional,
              ]);
            }}
            startIcon={<AddCircleIcon />}
          >
            New Conditional
          </Button>
        </ColumnCenterDiv>

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
