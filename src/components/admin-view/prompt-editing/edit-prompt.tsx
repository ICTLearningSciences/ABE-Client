import React, { useEffect } from 'react';
import {
  TextField,
  FormControlLabel,
  Checkbox,
  Input,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
} from '@mui/material';
import {
  aiServiceModelStringParse,
  aiServiceModelToString,
  equals,
  extractErrorMessageFromError,
} from '../../../helpers';
import { ColumnDiv, RowDiv, RowDivSB } from '../../../styled-components';
import {
  PromptOutputTypes,
  GQLPrompt,
  ActivityGQL,
  AiServiceModel,
  AiPromptStep,
} from '../../../types';
import { ErrorDialog } from '../../dialog';
import ViewPreviousRunModal from '../view-previous-run-modal';
import ViewPreviousRunsModal from '../view-previous-runs-modal';
import { useState } from 'react';
import { emptyOpenAiPromptStep } from '../multi-prompt-buttonology';
import { useAppSelector } from '../../../store/hooks';
import { AiServicesResponseTypes } from '../../../ai-services/ai-service-types';
import { useWithExecutePrompt } from '../../../hooks/use-with-execute-prompts';
import { MyTooltip } from '../../tooltip';
import { useWithConfig } from '../../../store/slices/config/use-with-config';

enum PromptFields {
  PROMPT_TEXT = 'promptText',
  SYSTEM_ROLE = 'systemRole',
  RESPONSE_FORMAT = 'responseFormat',
}

interface FocusedPromptField {
  promptIndex: number;
  focusedField: PromptFields;
}

export function EditPrompt(props: {
  promptTemplate: GQLPrompt;
  getActivityForPrompt: (prompt: GQLPrompt) => ActivityGQL | undefined;
  goToActivity: (activity: ActivityGQL) => void;
  onReturnToTemplates: () => void;
  handleSavePrompt: (prompt: GQLPrompt) => void;
  promptsLoading: boolean;
}): JSX.Element {
  const { availableAiServiceModels } = useWithConfig();
  const user = useAppSelector((state) => state.login.user);
  const userId = user?._id;
  const defaultAiModel = useAppSelector(
    (state) => state.config.config?.defaultAiModel
  );
  const {
    promptTemplate,
    handleSavePrompt,
    promptsLoading,
    getActivityForPrompt,
    goToActivity,
    onReturnToTemplates,
  } = props;
  const [error, setError] = useState<string>('');

  const [focusedPromptField, setFocusedPromptField] =
    useState<FocusedPromptField>({
      promptIndex: 0,
      focusedField: PromptFields.PROMPT_TEXT,
    });
  const [inProgress, setInProgress] = useState<boolean>(false);
  const [previousRuns, setPreviousRuns] = useState<AiServicesResponseTypes[]>(
    []
  );
  const [viewPrevRunResults, setViewPrevRunResults] = useState<boolean>(false);
  const [runToView, setRunToView] = useState<AiServicesResponseTypes>();
  const [promptTemplateCopy, setPromptTemplateCopy] = useState<GQLPrompt>(
    JSON.parse(JSON.stringify(promptTemplate))
  );
  const { executePromptSteps } = useWithExecutePrompt();

  useEffect(() => {
    setPromptTemplateCopy(JSON.parse(JSON.stringify(promptTemplate)));
  }, [promptTemplate]);

  const isEdited = !equals(promptTemplate, promptTemplateCopy);

  function updateAiPromptStep(
    stepIndex: number,
    changes: Partial<AiPromptStep>
  ) {
    setPromptTemplateCopy({
      ...promptTemplateCopy,
      aiPromptSteps: promptTemplateCopy.aiPromptSteps.map(
        (openAiPromptStep, openAiPromptStepIndex) => {
          if (openAiPromptStepIndex === stepIndex) {
            return {
              ...openAiPromptStep,
              ...changes,
            };
          } else {
            return openAiPromptStep;
          }
        }
      ),
    });
  }

  async function runPrompt() {
    if (!userId) {
      return;
    }
    setInProgress(true);
    try {
      const res = await executePromptSteps(promptTemplateCopy.aiPromptSteps);
      if (!res) {
        throw new Error('No response from AI service');
      }
      setPreviousRuns((prevRuns) => {
        return [...prevRuns, res];
      });
      setRunToView(res);
    } catch (err) {
      const error = extractErrorMessageFromError(err);
      setError(error);
    } finally {
      setInProgress(false);
    }
  }

  if (!defaultAiModel) {
    return <div>Default AI Model not set</div>;
  }

  return (
    <ColumnDiv style={{ width: '95%', maxHeight: '95%' }}>
      <TextField
        id="standard-basic"
        label="Template Title"
        variant="standard"
        value={promptTemplateCopy.title}
        style={{
          width: 'fit-content',
          alignSelf: 'center',
          margin: 10,
          marginTop: 15,
        }}
        onChange={(e) => {
          setPromptTemplateCopy({
            ...promptTemplateCopy,
            title: e.target.value,
          });
        }}
      />
      <FormControlLabel
        label="User input is intention?"
        style={{
          height: 'fit-content',
          textAlign: 'center',
          alignSelf: 'center',
        }}
        control={
          <Checkbox
            checked={Boolean(promptTemplateCopy.userInputIsIntention)}
            indeterminate={false}
            disabled={inProgress}
            onChange={(e) => {
              setPromptTemplateCopy({
                ...promptTemplateCopy,
                userInputIsIntention: e.target.checked,
              });
            }}
          />
        }
      />
      <div
        data-cy={'individual-prompt-container'}
        style={{
          height: '100%',
          overflow: 'auto',
          borderBottom: '1px solid black',
          padding: '10px',
        }}
      >
        {promptTemplateCopy.aiPromptSteps.map((openAiPromptStep, index) => {
          const modelDisplay = openAiPromptStep.targetAiServiceModel
            ? aiServiceModelToString(openAiPromptStep.targetAiServiceModel)
            : aiServiceModelToString(defaultAiModel, true);
          const isFocused = (promptIndex: number, field: PromptFields) => {
            return (
              focusedPromptField.promptIndex === promptIndex &&
              focusedPromptField.focusedField === field
            );
          };

          return (
            <ColumnDiv
              key={index}
              style={{
                minHeight: 'fit-content',
                border: '1px solid grey',
                padding: '10px',
                margin: '10px',
              }}
            >
              <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                <RowDiv>
                  <h5 style={{ margin: 5, padding: 0 }}>Prompt Text</h5>
                  <MyTooltip title="The main text that the AI will utilize to generate a response. This should encompass the primary task, question, and/or any relevant information necessary for the AI to formulate an appropriate response." />
                </RowDiv>
                <TextField
                  fullWidth
                  multiline
                  variant="outlined"
                  onFocus={() => {
                    setFocusedPromptField({
                      promptIndex: index,
                      focusedField: PromptFields.PROMPT_TEXT,
                    });
                  }}
                  key={index}
                  rows={
                    !isFocused(index, PromptFields.PROMPT_TEXT) ? 3 : undefined
                  }
                  minRows={!isFocused(index, PromptFields.PROMPT_TEXT) ? 3 : 10}
                  disabled={inProgress}
                  value={openAiPromptStep.prompts[0].promptText}
                  onChange={(e) => {
                    updateAiPromptStep(index, {
                      prompts: [
                        {
                          ...openAiPromptStep.prompts[0],
                          promptText: e.target.value,
                        },
                      ],
                    });
                  }}
                />
              </FormControl>

              <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                <RowDiv>
                  <h5 style={{ margin: 5, padding: 0 }}>Response Format</h5>
                  <MyTooltip title="Specific guidelines for formatting the AI's responses. For instance, if the output should be in JSON format, specify the keys that need to be included in the JSON object." />
                </RowDiv>
                <TextField
                  fullWidth
                  multiline
                  variant="outlined"
                  onFocus={() => {
                    setFocusedPromptField({
                      promptIndex: index,
                      focusedField: PromptFields.RESPONSE_FORMAT,
                    });
                  }}
                  key={index}
                  rows={
                    !isFocused(index, PromptFields.RESPONSE_FORMAT)
                      ? 3
                      : undefined
                  }
                  minRows={
                    !isFocused(index, PromptFields.RESPONSE_FORMAT) ? 3 : 10
                  }
                  disabled={inProgress}
                  value={openAiPromptStep.responseFormat}
                  onChange={(e) => {
                    updateAiPromptStep(index, {
                      responseFormat: e.target.value,
                    });
                  }}
                />
              </FormControl>

              <ColumnDiv>
                <FormControlLabel
                  label="Include Chat Log as context?"
                  style={{ height: 'fit-content', textAlign: 'center' }}
                  control={
                    <Checkbox
                      checked={openAiPromptStep.includeChatLogContext}
                      indeterminate={false}
                      disabled={inProgress}
                      onChange={(e) => {
                        updateAiPromptStep(index, {
                          includeChatLogContext: e.target.checked,
                        });
                      }}
                    />
                  }
                />
                <FormControlLabel
                  label="Include Essay?"
                  style={{ height: 'fit-content', textAlign: 'center' }}
                  control={
                    <Checkbox
                      checked={openAiPromptStep.prompts[0].includeEssay}
                      indeterminate={false}
                      disabled={inProgress}
                      onChange={(e) => {
                        updateAiPromptStep(index, {
                          prompts: [
                            {
                              ...openAiPromptStep.prompts[0],
                              includeEssay: e.target.checked,
                            },
                          ],
                        });
                      }}
                    />
                  }
                />
                <RowDiv>
                  <FormControlLabel
                    label="Include user response input?"
                    style={{ height: 'fit-content', textAlign: 'center' }}
                    control={
                      <Checkbox
                        checked={Boolean(
                          openAiPromptStep.prompts[0].includeUserInput
                        )}
                        indeterminate={false}
                        disabled={inProgress}
                        onChange={(e) => {
                          updateAiPromptStep(index, {
                            prompts: [
                              {
                                ...openAiPromptStep.prompts[0],
                                includeUserInput: e.target.checked,
                              },
                            ],
                          });
                        }}
                      />
                    }
                  />
                  <MyTooltip title="Most prompts are paired with a question in an activity. If this is checked, the users response to that question will be used." />
                </RowDiv>
                <RowDiv
                  style={{
                    width: '100%',
                  }}
                >
                  <FormControl
                    variant="standard"
                    sx={{ m: 1, minWidth: 120, width: '100%' }}
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      Custom System Role
                    </InputLabel>
                    <Input
                      value={openAiPromptStep.systemRole}
                      multiline
                      maxRows={4}
                      onChange={(e) => {
                        updateAiPromptStep(index, {
                          systemRole: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                  <MyTooltip title="A persona or role for the AI to take on when generating a response. This custom system role will only affect this step of the prompt." />
                </RowDiv>

                <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                  <InputLabel id="demo-simple-select-standard-label">
                    Output Data Type
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={openAiPromptStep.outputDataType}
                    onChange={(e) => {
                      updateAiPromptStep(index, {
                        outputDataType: e.target.value as PromptOutputTypes,
                      });
                    }}
                    label="Output Data Type"
                  >
                    <MenuItem value={PromptOutputTypes.TEXT}>TEXT</MenuItem>
                    <MenuItem value={PromptOutputTypes.JSON}>JSON</MenuItem>
                  </Select>
                </FormControl>
                <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                  <InputLabel id="select-gpt-model">GPT Model</InputLabel>
                  <Select
                    labelId="select-gpt-model"
                    id="gpt-model-select"
                    value={modelDisplay}
                    onChange={(e) => {
                      const targetAiServiceModel: AiServiceModel | undefined = e
                        .target.value
                        ? aiServiceModelStringParse(e.target.value)
                        : undefined;
                      updateAiPromptStep(index, {
                        targetAiServiceModel: targetAiServiceModel,
                      });
                    }}
                  >
                    <MenuItem
                      value={aiServiceModelToString(defaultAiModel, true)}
                    >
                      {aiServiceModelToString(defaultAiModel, true)}
                    </MenuItem>
                    {availableAiServiceModels?.map((serviceAndModels) => {
                      return serviceAndModels.models.map((model, j) => {
                        return (
                          <MenuItem
                            key={j}
                            value={aiServiceModelToString({
                              serviceName: serviceAndModels.serviceName,
                              model: model,
                            })}
                          >
                            {aiServiceModelToString({
                              serviceName: serviceAndModels.serviceName,
                              model: model,
                            })}
                          </MenuItem>
                        );
                      });
                    })}
                  </Select>
                </FormControl>
              </ColumnDiv>
              <Button
                disabled={inProgress}
                onClick={() => {
                  setPromptTemplateCopy({
                    ...promptTemplateCopy,
                    aiPromptSteps: promptTemplateCopy.aiPromptSteps.filter(
                      (step, stepIndex) => {
                        return stepIndex !== index;
                      }
                    ),
                  });
                }}
                style={{ height: 'fit-content' }}
              >
                Delete
              </Button>
            </ColumnDiv>
          );
        })}
      </div>
      {inProgress ? (
        <CircularProgress style={{ alignSelf: 'center' }} />
      ) : (
        <>
          <RowDivSB style={{ justifyContent: 'space-around' }}>
            <Button
              onClick={() => {
                setPromptTemplateCopy({
                  ...promptTemplateCopy,
                  aiPromptSteps: promptTemplateCopy.aiPromptSteps.concat(
                    emptyOpenAiPromptStep()
                  ),
                });
              }}
            >
              Add Prompt
            </Button>
            <Button
              disabled={!isEdited || inProgress || promptsLoading}
              onClick={() => {
                handleSavePrompt(promptTemplateCopy);
              }}
            >
              Save
            </Button>
            <Button
              data-cy="run-prompt-button"
              onClick={runPrompt}
              size={'large'}
            >
              Run
            </Button>
          </RowDivSB>
          <RowDivSB style={{ justifyContent: 'space-around' }}>
            <Button
              onClick={() => {
                onReturnToTemplates();
              }}
            >
              View Prompt Templates
            </Button>
            <Button
              disabled={!getActivityForPrompt(promptTemplateCopy)}
              onClick={() => {
                const activity = getActivityForPrompt(promptTemplateCopy);
                if (activity) {
                  goToActivity(activity);
                }
              }}
              size={'large'}
            >
              Preview
            </Button>
            <Button
              disabled={previousRuns.length === 0}
              onClick={() => {
                setViewPrevRunResults((prev) => !prev);
              }}
            >
              View Run Results
            </Button>
          </RowDivSB>
        </>
      )}
      <br />
      <ViewPreviousRunsModal
        open={viewPrevRunResults}
        close={() => {
          setViewPrevRunResults(false);
        }}
        previousRuns={previousRuns}
        setRunToView={(run?: AiServicesResponseTypes) => {
          setRunToView(run);
        }}
      />
      <ViewPreviousRunModal
        previousRunStepData={runToView?.aiAllStepsData}
        open={Boolean(runToView)}
        close={() => {
          setRunToView(undefined);
        }}
      />
      <ErrorDialog error={error} clearError={() => setError('')} />
    </ColumnDiv>
  );
}
