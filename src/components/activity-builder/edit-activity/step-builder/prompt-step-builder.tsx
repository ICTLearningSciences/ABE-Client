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
  RoundedBorderDiv,
  RowDiv,
  TopLeftText,
} from '../../../../styled-components';
import {
  CheckBoxInput,
  InputField,
  SelectInputField,
} from '../../shared/input-components';
import {
  AiPromptStep,
  PromptConfiguration,
  PromptOutputTypes,
  PromptRoles,
} from '../../../../types';
import { Button, CircularProgress, IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { v4 as uuid } from 'uuid';
import { JumpToAlternateStep } from '../../shared/jump-to-alternate-step';
import { AiServicesResponseTypes } from '../../../../ai-services/ai-service-types';
import ViewPreviousRunModal from '../../../admin-view/view-previous-run-modal';
import { recursivelyConvertExpectedDataToAiPromptString } from '../../helpers';
import { useWithExecutePrompt } from '../../../../hooks/use-with-execute-prompts';
import { TextDialog } from '../../../dialog';
import ViewPreviousRunsModal from '../../../admin-view/view-previous-runs-modal';
import { JsonResponseDataUpdater } from './json-response-data-builder';
import Collapse from '@mui/material/Collapse';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { StepVersion } from '../activity-flow-container';
import { VersionsDropdown } from './versions-dropdown';
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

export enum ViewingInputType {
  PROMPT_TEXT = 'PROMPT_TEXT',
  RESPONSE_FORMAT = 'RESPONSE_FORMAT',
  NONE = 'NONE',
}

export function PromptStepBuilder(props: {
  step: PromptActivityStep;
  updateLocalActivity: React.Dispatch<React.SetStateAction<ActivityBuilder>>;
  deleteStep: (stepId: string, flowClientId: string) => void;
  flowsList: FlowItem[];
  stepIndex: number;
  previewed: boolean;
  startPreview: () => void;
  stopPreview: () => void;
  width?: string;
  height?: string;
  versions: StepVersion[];
}): JSX.Element {
  const {
    step,
    stepIndex,
    updateLocalActivity,
    previewed,
    stopPreview,
    startPreview,
    deleteStep,
    flowsList,
    versions,
  } = props;
  const currentFLow = flowsList.find((f) => {
    return f.steps.find((s) => s.stepId === step.stepId);
  });
  const { executePromptSteps } = useWithExecutePrompt();
  const [viewRunResults, setViewRunResults] =
    React.useState<AiServicesResponseTypes>();
  const [previousRunResults, setPreviousRunResults] = React.useState<
    AiServicesResponseTypes[]
  >([]);
  const [viewingPreviousRuns, setViewingPreviousRuns] =
    React.useState<boolean>(false);
  const [executeError, setExecuteError] = React.useState<string>('');
  const [executeInProgress, setExecuteInProgress] =
    React.useState<boolean>(false);
  const [collapsed, setCollapsed] = React.useState<boolean>(false);
  const [viewingInputType, setViewingInputType] =
    React.useState<ViewingInputType>(ViewingInputType.PROMPT_TEXT);

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

  function recursiveUpdateNestedJsonResponseData(
    clientId: string,
    field: string,
    value: string | boolean,
    baseJsonResponseDatas: JsonResponseData[],
    parentJsonResponseDataIds: string[]
  ): JsonResponseData[] {
    if (!parentJsonResponseDataIds?.length) {
      return baseJsonResponseDatas.map((jrd) => {
        if (jrd.clientId === clientId) {
          return {
            ...jrd,
            [field]: value,
          };
        }
        return jrd;
      });
    } else {
      return baseJsonResponseDatas.map((jrd) => {
        if (jrd.clientId === parentJsonResponseDataIds[0]) {
          return {
            ...jrd,
            subData: recursiveUpdateNestedJsonResponseData(
              clientId,
              field,
              value,
              jrd.subData || [],
              parentJsonResponseDataIds.slice(1)
            ),
          };
        }
        return jrd;
      });
    }
  }

  function recursiveAddNewJsonResponseData(
    parentJsonResponseDataIds: string[],
    baseJsonResponseDatas: JsonResponseData[]
  ): JsonResponseData[] {
    if (!parentJsonResponseDataIds?.length) {
      return [...baseJsonResponseDatas, getEmptyJsonResponseData()];
    } else {
      return baseJsonResponseDatas.map((jrd) => {
        if (jrd.clientId === parentJsonResponseDataIds[0]) {
          return {
            ...jrd,
            subData: recursiveAddNewJsonResponseData(
              parentJsonResponseDataIds.slice(1),
              jrd.subData || []
            ),
          };
        }
        return jrd;
      });
    }
  }

  function recursiveDeleteJsonResponseData(
    clientId: string,
    baseJsonResponseDatas: JsonResponseData[],
    parentJsonResponseDataIds: string[]
  ): JsonResponseData[] {
    // for all json response data, if the clientId matches, remove it
    if (!parentJsonResponseDataIds?.length) {
      return baseJsonResponseDatas.filter((jrd) => jrd.clientId !== clientId);
    } else {
      return baseJsonResponseDatas.map((jrd) => {
        if (jrd.clientId === parentJsonResponseDataIds[0]) {
          return {
            ...jrd,
            subData: recursiveDeleteJsonResponseData(
              clientId,
              jrd.subData || [],
              parentJsonResponseDataIds.slice(1)
            ),
          };
        }
        return jrd;
      });
    }
  }

  function editJsonResponseData(
    clientId: string,
    field: string,
    value: string | boolean,
    parentJsonResponseDataIds: string[]
  ) {
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
                // if no parentJsonResponseData is provided, then just update the steps base json response data (look for or add to list)
                if (!parentJsonResponseDataIds?.length) {
                  const index = responseData.findIndex(
                    (jrd) => jrd.clientId === clientId
                  );
                  if (index >= 0) {
                    return {
                      ...s,
                      jsonResponseData: responseData.map((jrd) => {
                        if (jrd.clientId === clientId) {
                          return {
                            ...jrd,
                            [field]: value,
                          };
                        }
                        return jrd;
                      }),
                    };
                  } else {
                    throw new Error('JsonResponseData not found');
                  }
                } else {
                  // if there is a parentJsonResponseData, recursives update fields by looking for objects, and looking into their subData to update
                  return {
                    ...s,
                    jsonResponseData: recursiveUpdateNestedJsonResponseData(
                      clientId,
                      field,
                      value,
                      responseData,
                      parentJsonResponseDataIds
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

  function addNewJsonResponseData(parentJsonResponseDataIds: string[]) {
    updateLocalActivity((prevValue) => {
      return {
        ...prevValue,
        flowsList: prevValue.flowsList.map((f) => {
          return {
            ...f,
            steps: f.steps.map((s) => {
              if (s.stepId === step.stepId) {
                if (!parentJsonResponseDataIds?.length) {
                  return {
                    ...s,
                    jsonResponseData: [
                      ...((s as PromptActivityStep).jsonResponseData || []),
                      getEmptyJsonResponseData(),
                    ],
                  };
                } else {
                  return {
                    ...s,
                    jsonResponseData: recursiveAddNewJsonResponseData(
                      parentJsonResponseDataIds,
                      (s as PromptActivityStep).jsonResponseData || []
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

  function deleteJsonResponseData(
    clientId: string,
    parentJsonResponseDataIds: string[]
  ) {
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
                if (!parentJsonResponseDataIds?.length) {
                  return {
                    ...s,
                    jsonResponseData: responseData.filter(
                      (jrd) => jrd.clientId !== clientId
                    ),
                  };
                } else {
                  return {
                    ...s,
                    jsonResponseData: recursiveDeleteJsonResponseData(
                      clientId,
                      responseData,
                      parentJsonResponseDataIds
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

  async function executePromptTest() {
    setExecuteInProgress(true);
    const aiPromptSteps: AiPromptStep[] = [];
    aiPromptSteps.push({
      prompts: [],
      outputDataType: step.outputDataType,
      responseFormat: step.responseFormat,
      systemRole: step.customSystemRole,
    });
    const promptConfig: PromptConfiguration = {
      promptText: step.promptText,
      includeEssay: step.includeEssay, // handled by server
      promptRole: PromptRoles.USER,
    };
    aiPromptSteps[0].prompts.push(promptConfig);
    if (step.jsonResponseData?.length) {
      aiPromptSteps[0].responseFormat +=
        recursivelyConvertExpectedDataToAiPromptString(step.jsonResponseData);
    }
    try {
      const _response = await executePromptSteps(aiPromptSteps);
      setViewRunResults(_response);
      setPreviousRunResults([...previousRunResults, _response]);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setExecuteError(e.message);
    } finally {
      setExecuteInProgress(false);
    }
  }

  return (
    <RoundedBorderDiv
      key={rerender}
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
      <RowDiv
        data-cy="run-prompt-buttons"
        style={{
          width: 'fit-content',
          alignSelf: 'center',
        }}
      >
        {previewed && (
          <>
            {!executeInProgress ? (
              <Button
                style={{
                  marginRight: 10,
                }}
                onClick={() => {
                  executePromptTest();
                }}
              >
                Run
              </Button>
            ) : (
              <CircularProgress
                style={{
                  marginRight: 10,
                }}
              />
            )}
            <Button
              style={{
                marginRight: 10,
              }}
              disabled={executeInProgress || !previousRunResults.length}
              onClick={() => {
                setViewingPreviousRuns(true);
              }}
            >
              View Previous Runs
            </Button>
            <ViewPreviousRunModal
              previousRunStepData={viewRunResults?.aiAllStepsData}
              open={Boolean(viewRunResults)}
              close={() => {
                setViewRunResults(undefined);
              }}
            />
            <ViewPreviousRunsModal
              previousRuns={previousRunResults}
              open={viewingPreviousRuns}
              close={() => {
                setViewingPreviousRuns(false);
              }}
              setRunToView={(run) => {
                setViewRunResults(run);
              }}
            />
            <TextDialog
              title="Error"
              body={executeError}
              open={Boolean(executeError)}
              close={() => {
                setExecuteError('');
              }}
            />
          </>
        )}
        <Button
          variant={previewed ? 'contained' : 'outlined'}
          style={{
            width: 'fit-content',
            alignSelf: 'center',
          }}
          onClick={() => {
            if (previewed) {
              stopPreview();
            } else {
              startPreview();
            }
          }}
        >
          {previewed ? 'Return' : 'Preview'}
        </Button>
      </RowDiv>
      <IconButton
        style={{
          position: 'absolute',
          right: 10,
          top: 10,
        }}
        onClick={() => {
          deleteStep(step.stepId, currentFLow?.clientId || '');
        }}
      >
        <Delete />
      </IconButton>
      <h4 style={{ alignSelf: 'center' }}>Prompt</h4>
      <Collapse in={!collapsed}>
        <InputField
          label="Prompt Text"
          value={step.promptText}
          onFocus={() => {
            setViewingInputType(ViewingInputType.PROMPT_TEXT);
          }}
          maxRows={viewingInputType === ViewingInputType.PROMPT_TEXT ? 20 : 3}
          onChange={(e) => {
            updateField('promptText', e);
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
        {step.outputDataType === PromptOutputTypes.TEXT ? (
          <InputField
            label="Response Format"
            value={step.responseFormat}
            onFocus={() => {
              setViewingInputType(ViewingInputType.RESPONSE_FORMAT);
            }}
            maxRows={
              viewingInputType === ViewingInputType.RESPONSE_FORMAT ? 20 : 3
            }
            onChange={(e) => {
              updateField('responseFormat', e);
            }}
            width="100%"
          />
        ) : undefined}

        {step.outputDataType === PromptOutputTypes.JSON && (
          <JsonResponseDataUpdater
            jsonResponseData={step.jsonResponseData || []}
            editDataField={editJsonResponseData}
            addNewJsonResponseData={addNewJsonResponseData}
            deleteJsonResponseData={deleteJsonResponseData}
            parentJsonResponseDataIds={[]}
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
      </Collapse>
    </RoundedBorderDiv>
  );
}
