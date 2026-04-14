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
  SinglePromptConfiguration,
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
  RagStoreConfiguration,
} from '../../../../types';
import {
  Button,
  CircularProgress,
  IconButton,
  Tabs,
  Tab,
  Box,
} from '@mui/material';
import { Delete, Add } from '@mui/icons-material';
import { v4 as uuid } from 'uuid';
import { JumpToAlternateStep } from '../../shared/jump-to-alternate-step';
import { AiServicesResponseTypes } from '../../../../ai-services/ai-service-types';
import ViewPreviousRunModal from '../../../admin-view/view-previous-run-modal';
import { recursivelyConvertExpectedDataToAiPromptString } from '../../helpers';
import { TextDialog } from '../../../dialog';
import ViewPreviousRunsModal from '../../../admin-view/view-previous-runs-modal';
import { JsonResponseDataUpdater } from './json-response-data-builder';
import Collapse from '@mui/material/Collapse';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { StepVersion } from '../activity-flow-container';
import { VersionsDropdown } from './versions-dropdown';
import { useActivityBuilderContext } from '../../activity-builder-context';
import { RagStoreConfigurationEditor } from './rag-store-configuration-editor';
export function getEmptyJsonResponseData(): JsonResponseData {
  return {
    clientId: uuid(),
    name: '',
    type: JsonResponseDataType.STRING,
    isRequired: true,
    additionalInfo: '',
  };
}

export function getDefaultSinglePromptConfiguration(): SinglePromptConfiguration {
  return {
    promptText: '',
    responseFormat: '',
    editDoc: false,
    outputDataType: PromptOutputTypes.TEXT,
    jsonResponseData: [],
    includeChatLogContext: false,
    systemCustomName: '',
    includeEssay: false,
    customSystemRole: '',
    webSearch: false,
    ragConfiguration: undefined,
  };
}

export function defaultEditDocPromptBuilder(): PromptActivityStep {
  return {
    stepId: uuid(),
    stepType: ActivityBuilderStepType.PROMPT,
    promptConfigurations: [
      {
        ...getDefaultSinglePromptConfiguration(),
        editDoc: false, // editDoc is deprecated, always false
        includeEssay: true,
      },
    ],
    jumpToStepId: '',
  };
}

export function defaultPromptBuilder(editDoc?: boolean): PromptActivityStep {
  if (editDoc) {
    return defaultEditDocPromptBuilder();
  }
  return {
    stepId: uuid(),
    stepType: ActivityBuilderStepType.PROMPT,
    promptConfigurations: [getDefaultSinglePromptConfiguration()],
    jumpToStepId: '',
  };
}

export enum ViewingInputType {
  PROMPT_TEXT = 'PROMPT_TEXT',
  RESPONSE_FORMAT = 'RESPONSE_FORMAT',
  NONE = 'NONE',
}

interface SinglePromptConfigurationEditorProps {
  configuration: SinglePromptConfiguration;
  configIndex: number;
  updateConfigField: (
    configIndex: number,
    field: string,
    value:
      | string
      | boolean
      | JsonResponseData[]
      | RagStoreConfiguration
      | undefined
  ) => void;
  editJsonResponseData: (
    configIndex: number,
    clientId: string,
    field: string,
    value: string | boolean,
    parentJsonResponseDataIds: string[]
  ) => void;
  addNewJsonResponseData: (
    configIndex: number,
    parentJsonResponseDataIds: string[]
  ) => void;
  deleteJsonResponseData: (
    configIndex: number,
    clientId: string,
    parentJsonResponseDataIds: string[]
  ) => void;
}

function SinglePromptConfigurationEditor(
  props: SinglePromptConfigurationEditorProps
): JSX.Element {
  const {
    configuration,
    configIndex,
    updateConfigField,
    editJsonResponseData,
    addNewJsonResponseData,
    deleteJsonResponseData,
  } = props;
  const [viewingInputType, setViewingInputType] =
    React.useState<ViewingInputType>(ViewingInputType.PROMPT_TEXT);

  return (
    <div
      key={configIndex}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        padding: '10px 0',
      }}
    >
      <InputField
        label="System Custom Name"
        value={configuration.systemCustomName}
        onChange={(e) => {
          updateConfigField(configIndex, 'systemCustomName', e);
        }}
        width="100%"
      />

      <InputField
        label="Prompt Text"
        value={configuration.promptText}
        onFocus={() => {
          setViewingInputType(ViewingInputType.PROMPT_TEXT);
        }}
        maxRows={viewingInputType === ViewingInputType.PROMPT_TEXT ? 20 : 3}
        onChange={(e) => {
          updateConfigField(configIndex, 'promptText', e);
        }}
        width="100%"
      />

      <SelectInputField
        label="Output Data Type"
        value={configuration.outputDataType}
        options={[...Object.values(PromptOutputTypes)]}
        onChange={(e) => {
          updateConfigField(configIndex, 'outputDataType', e);
        }}
      />

      {configuration.outputDataType === PromptOutputTypes.TEXT && (
        <InputField
          label="Text Response Format"
          value={configuration.responseFormat}
          onFocus={() => {
            setViewingInputType(ViewingInputType.RESPONSE_FORMAT);
          }}
          maxRows={
            viewingInputType === ViewingInputType.RESPONSE_FORMAT ? 20 : 3
          }
          onChange={(e) => {
            updateConfigField(configIndex, 'responseFormat', e);
          }}
          width="100%"
        />
      )}

      {configuration.outputDataType === PromptOutputTypes.JSON && (
        <JsonResponseDataUpdater
          jsonResponseData={configuration.jsonResponseData || []}
          editDataField={(clientId, field, value, parentIds) => {
            editJsonResponseData(
              configIndex,
              clientId,
              field,
              value,
              parentIds
            );
          }}
          addNewJsonResponseData={(parentIds) => {
            addNewJsonResponseData(configIndex, parentIds);
          }}
          deleteJsonResponseData={(clientId, parentIds) => {
            deleteJsonResponseData(configIndex, clientId, parentIds);
          }}
          parentJsonResponseDataIds={[]}
        />
      )}

      <CheckBoxInput
        label="Include Chat History"
        value={configuration.includeChatLogContext}
        onChange={(e) => {
          updateConfigField(configIndex, 'includeChatLogContext', e);
        }}
      />

      <CheckBoxInput
        label="Include Essay"
        value={configuration.includeEssay}
        onChange={(e) => {
          updateConfigField(configIndex, 'includeEssay', e);
        }}
      />

      <CheckBoxInput
        label="Enable Web Search"
        value={configuration.webSearch || false}
        onChange={(e) => {
          updateConfigField(configIndex, 'webSearch', e);
        }}
      />

      <RagStoreConfigurationEditor
        ragConfiguration={configuration.ragConfiguration}
        updateRagConfiguration={(ragConfiguration) => {
          updateConfigField(configIndex, 'ragConfiguration', ragConfiguration);
        }}
      />

      <InputField
        label="Custom System Role"
        value={configuration.customSystemRole}
        onChange={(e) => {
          updateConfigField(configIndex, 'customSystemRole', e);
        }}
        width="100%"
      />
    </div>
  );
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
  errors?: string[];
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
    errors,
  } = props;
  const currentFLow = flowsList.find((f) => {
    return f.steps.find((s) => s.stepId === step.stepId);
  });
  const { executePromptSteps } = useActivityBuilderContext();
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
  const [selectedConfigIndex, setSelectedConfigIndex] =
    React.useState<number>(0);

  // Ensure selectedConfigIndex stays valid
  React.useEffect(() => {
    if (selectedConfigIndex >= step.promptConfigurations.length) {
      setSelectedConfigIndex(Math.max(0, step.promptConfigurations.length - 1));
    }
  }, [step.promptConfigurations.length, selectedConfigIndex]);

  function updateField(
    field: string,
    value:
      | string
      | boolean
      | JsonResponseData[]
      | RagStoreConfiguration
      | undefined
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

  function updateConfigField(
    configIndex: number,
    field: string,
    value:
      | string
      | boolean
      | JsonResponseData[]
      | RagStoreConfiguration
      | undefined
  ) {
    updateLocalActivity((prevValue) => {
      return {
        ...prevValue,
        flowsList: prevValue.flowsList.map((f) => {
          return {
            ...f,
            steps: f.steps.map((s) => {
              if (s.stepId === step.stepId) {
                const promptStep = s as PromptActivityStep;
                const updatedConfigurations = [
                  ...promptStep.promptConfigurations,
                ];
                updatedConfigurations[configIndex] = {
                  ...updatedConfigurations[configIndex],
                  [field]: value,
                };
                return {
                  ...s,
                  promptConfigurations: updatedConfigurations,
                };
              }
              return s;
            }),
          };
        }),
      };
    });
  }

  function addNewPromptConfiguration() {
    updateLocalActivity((prevValue) => {
      return {
        ...prevValue,
        flowsList: prevValue.flowsList.map((f) => {
          return {
            ...f,
            steps: f.steps.map((s) => {
              if (s.stepId === step.stepId) {
                const promptStep = s as PromptActivityStep;
                return {
                  ...s,
                  promptConfigurations: [
                    ...promptStep.promptConfigurations,
                    getDefaultSinglePromptConfiguration(),
                  ],
                };
              }
              return s;
            }),
          };
        }),
      };
    });
    // Switch to the newly added tab
    setSelectedConfigIndex(step.promptConfigurations.length);
  }

  function removePromptConfiguration(configIndex: number) {
    if (step.promptConfigurations.length <= 1) {
      return; // Can't remove the last configuration
    }
    updateLocalActivity((prevValue) => {
      return {
        ...prevValue,
        flowsList: prevValue.flowsList.map((f) => {
          return {
            ...f,
            steps: f.steps.map((s) => {
              if (s.stepId === step.stepId) {
                const promptStep = s as PromptActivityStep;
                return {
                  ...s,
                  promptConfigurations: promptStep.promptConfigurations.filter(
                    (_, index) => index !== configIndex
                  ),
                };
              }
              return s;
            }),
          };
        }),
      };
    });
    // Adjust selected tab if needed
    if (selectedConfigIndex >= configIndex && selectedConfigIndex > 0) {
      setSelectedConfigIndex(selectedConfigIndex - 1);
    }
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
    configIndex: number,
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
                const promptStep = s as PromptActivityStep;
                const config = promptStep.promptConfigurations[configIndex];
                const responseData = config.jsonResponseData || [];

                const updatedResponseData = !parentJsonResponseDataIds?.length
                  ? responseData.map((jrd) => {
                      if (jrd.clientId === clientId) {
                        return {
                          ...jrd,
                          [field]: value,
                        };
                      }
                      return jrd;
                    })
                  : recursiveUpdateNestedJsonResponseData(
                      clientId,
                      field,
                      value,
                      responseData,
                      parentJsonResponseDataIds
                    );

                const updatedConfigurations = [
                  ...promptStep.promptConfigurations,
                ];
                updatedConfigurations[configIndex] = {
                  ...updatedConfigurations[configIndex],
                  jsonResponseData: updatedResponseData,
                };

                return {
                  ...s,
                  promptConfigurations: updatedConfigurations,
                };
              }
              return s;
            }),
          };
        }),
      };
    });
  }

  function addNewJsonResponseData(
    configIndex: number,
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
                const promptStep = s as PromptActivityStep;
                const config = promptStep.promptConfigurations[configIndex];
                const responseData = config.jsonResponseData || [];

                const updatedResponseData = !parentJsonResponseDataIds?.length
                  ? [...responseData, getEmptyJsonResponseData()]
                  : recursiveAddNewJsonResponseData(
                      parentJsonResponseDataIds,
                      responseData
                    );

                const updatedConfigurations = [
                  ...promptStep.promptConfigurations,
                ];
                updatedConfigurations[configIndex] = {
                  ...updatedConfigurations[configIndex],
                  jsonResponseData: updatedResponseData,
                };

                return {
                  ...s,
                  promptConfigurations: updatedConfigurations,
                };
              }
              return s;
            }),
          };
        }),
      };
    });
  }

  function deleteJsonResponseData(
    configIndex: number,
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
                const promptStep = s as PromptActivityStep;
                const config = promptStep.promptConfigurations[configIndex];
                const responseData = config.jsonResponseData || [];

                const updatedResponseData = !parentJsonResponseDataIds?.length
                  ? responseData.filter((jrd) => jrd.clientId !== clientId)
                  : recursiveDeleteJsonResponseData(
                      clientId,
                      responseData,
                      parentJsonResponseDataIds
                    );

                const updatedConfigurations = [
                  ...promptStep.promptConfigurations,
                ];
                updatedConfigurations[configIndex] = {
                  ...updatedConfigurations[configIndex],
                  jsonResponseData: updatedResponseData,
                };

                return {
                  ...s,
                  promptConfigurations: updatedConfigurations,
                };
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
    const config = step.promptConfigurations[selectedConfigIndex];
    const aiPromptSteps: AiPromptStep[] = [];
    aiPromptSteps.push({
      prompts: [],
      outputDataType: config.outputDataType,
      responseFormat: config.responseFormat,
      editDoc: config.editDoc || false,
      systemRole: config.customSystemRole,
      webSearch: config.webSearch || false,
      ragConfiguration: config.ragConfiguration,
    });
    const promptConfig: PromptConfiguration = {
      promptText: config.promptText,
      includeEssay: config.includeEssay,
      promptRole: PromptRoles.USER,
    };
    aiPromptSteps[0].prompts.push(promptConfig);
    if (config.jsonResponseData?.length) {
      aiPromptSteps[0].responseFormat +=
        recursivelyConvertExpectedDataToAiPromptString(config.jsonResponseData);
    }
    try {
      if (!executePromptSteps) {
        throw new Error('Execute prompt steps function is not available');
      }
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
      data-cy="prompt-step-builder"
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
                data-cy="run-prompt-button"
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
          data-cy="preview-prompt-button"
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
      <h4 style={{ alignSelf: 'center' }}>Prompt Step</h4>
      {errors && errors.length > 0 && (
        <span style={{ color: 'red', textAlign: 'center' }}>
          {errors.join(', ')}
        </span>
      )}
      <Collapse in={!collapsed}>
        {/* Tabs for multiple prompt configurations */}
        <Box
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Tabs
            value={selectedConfigIndex}
            onChange={(_, newValue) => setSelectedConfigIndex(newValue)}
            variant="scrollable"
            scrollButtons="auto"
          >
            {step.promptConfigurations.map((_, index) => (
              <Tab
                key={index}
                label={`Prompt ${index + 1}`}
                data-cy={`prompt-config-tab-${index}`}
              />
            ))}
          </Tabs>
          <IconButton
            onClick={addNewPromptConfiguration}
            size="small"
            style={{ marginLeft: 'auto' }}
            data-cy="add-prompt-config-button"
          >
            <Add />
          </IconButton>
          {step.promptConfigurations.length > 1 && (
            <IconButton
              onClick={() => removePromptConfiguration(selectedConfigIndex)}
              size="small"
              color="error"
              data-cy="remove-prompt-config-button"
            >
              <Delete />
            </IconButton>
          )}
        </Box>

        {/* Current configuration editor */}
        {step.promptConfigurations[selectedConfigIndex] && (
          <SinglePromptConfigurationEditor
            configuration={step.promptConfigurations[selectedConfigIndex]}
            configIndex={selectedConfigIndex}
            updateConfigField={updateConfigField}
            editJsonResponseData={editJsonResponseData}
            addNewJsonResponseData={addNewJsonResponseData}
            deleteJsonResponseData={deleteJsonResponseData}
          />
        )}

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
