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
import { DEFAULT_TARGET_AI_SERVICE_MODEL } from '../../../constants';
import { equals, extractErrorMessageFromError } from '../../../helpers';
import { ColumnDiv, RowDivSB } from '../../../styled-components';
import {
  PromptOutputTypes,
  GQLPrompt,
  ActivityGQL,
  AiServiceModel,
} from '../../../types';
import { ErrorDialog } from '../../dialog';
import ViewPreviousRunModal from '../view-previous-run-modal';
import ViewPreviousRunsModal from '../view-previous-runs-modal';
import { useState } from 'react';
import { emptyOpenAiPromptStep } from '../multi-prompt-buttonology';
import { useAppSelector } from '../../../store/hooks';
import { AiServicesResponseTypes } from '../../../ai-services/ai-service-types';
import { useWithExecutePrompt } from '../../../hooks/use-with-execute-prompts';

export function EditPrompt(props: {
  promptTemplate: GQLPrompt;
  getActivityForPrompt: (prompt: GQLPrompt) => ActivityGQL | undefined;
  goToActivity: (activity: ActivityGQL) => void;
  onReturnToTemplates: () => void;
  handleSavePrompt: (prompt: GQLPrompt) => void;
  promptsLoading: boolean;
}): JSX.Element {
  const user = useAppSelector((state) => state.login.user);
  const userId = user?._id;
  const availableAiServiceModels = useAppSelector(
    (state) => state.config.config?.availableAiServiceModels
  );
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
  const [focusedPromptIndex, setFocusedPromptIndex] = useState<number>(0);
  const [inProgress, setInProgress] = useState<boolean>(false);
  const [previousRuns, setPreviousRuns] = useState<AiServicesResponseTypes[]>(
    []
  );
  const [viewPrevRunResults, setViewPrevRunResults] = useState<boolean>(false);
  const [runToView, setRunToView] = useState<AiServicesResponseTypes>();
  const [promptTemplateCopy, setPromptTemplateCopy] = useState<GQLPrompt>(
    JSON.parse(JSON.stringify(promptTemplate))
  );
  const { executePrompt } = useWithExecutePrompt(false);

  useEffect(() => {
    setPromptTemplateCopy(JSON.parse(JSON.stringify(promptTemplate)));
  }, [promptTemplate]);

  const isEdited = !equals(promptTemplate, promptTemplateCopy);

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
        style={{
          height: '100%',
          overflow: 'auto',
          borderBottom: '1px solid black',
          padding: '10px',
        }}
      >
        {promptTemplateCopy.aiPromptSteps.map((openAiPromptStep, index) => (
          <ColumnDiv
            key={index}
            style={{
              minHeight: 'fit-content',
              border: '1px solid grey',
              padding: '10px',
              margin: '10px',
            }}
          >
            <Input
              fullWidth
              multiline
              onFocus={() => {
                setFocusedPromptIndex(index);
              }}
              key={index}
              rows={focusedPromptIndex !== index ? 3 : undefined}
              minRows={focusedPromptIndex === index ? 10 : 3}
              disabled={inProgress}
              value={openAiPromptStep.prompts[0].promptText}
              placeholder={`Prompt ${index + 1}`}
              onChange={(e) => {
                setPromptTemplateCopy({
                  ...promptTemplateCopy,
                  aiPromptSteps: promptTemplateCopy.aiPromptSteps.map(
                    (openAiPromptStep, openAiPromptStepIndex) => {
                      if (openAiPromptStepIndex === index) {
                        return {
                          ...openAiPromptStep,
                          prompts: [
                            {
                              ...openAiPromptStep.prompts[0],
                              promptText: e.target.value,
                            },
                          ],
                        };
                      } else {
                        return openAiPromptStep;
                      }
                    }
                  ),
                });
              }}
            />
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
                      setPromptTemplateCopy({
                        ...promptTemplateCopy,
                        aiPromptSteps: promptTemplateCopy.aiPromptSteps.map(
                          (openAiPromptStep, openAiPromptStepIndex) => {
                            if (openAiPromptStepIndex === index) {
                              return {
                                ...openAiPromptStep,
                                includeChatLogContext: e.target.checked,
                              };
                            } else {
                              return openAiPromptStep;
                            }
                          }
                        ),
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
                      setPromptTemplateCopy({
                        ...promptTemplateCopy,
                        aiPromptSteps: promptTemplateCopy.aiPromptSteps.map(
                          (openAiPromptStep, openAiPromptStepIndex) => {
                            if (openAiPromptStepIndex === index) {
                              return {
                                ...openAiPromptStep,
                                prompts: [
                                  {
                                    ...openAiPromptStep.prompts[0],
                                    includeEssay: e.target.checked,
                                  },
                                ],
                              };
                            } else {
                              return openAiPromptStep;
                            }
                          }
                        ),
                      });
                    }}
                  />
                }
              />
              <FormControlLabel
                label="Include user input?"
                style={{ height: 'fit-content', textAlign: 'center' }}
                control={
                  <Checkbox
                    checked={Boolean(
                      openAiPromptStep.prompts[0].includeUserInput
                    )}
                    indeterminate={false}
                    disabled={inProgress}
                    onChange={(e) => {
                      setPromptTemplateCopy({
                        ...promptTemplateCopy,
                        aiPromptSteps: promptTemplateCopy.aiPromptSteps.map(
                          (openAiPromptStep, openAiPromptStepIndex) => {
                            if (openAiPromptStepIndex === index) {
                              return {
                                ...openAiPromptStep,
                                prompts: [
                                  {
                                    ...openAiPromptStep.prompts[0],
                                    includeUserInput: e.target.checked,
                                  },
                                ],
                              };
                            } else {
                              return openAiPromptStep;
                            }
                          }
                        ),
                      });
                    }}
                  />
                }
              />
              <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="demo-simple-select-standard-label">
                  Custom System Role
                </InputLabel>
                <Input
                  value={openAiPromptStep.systemRole}
                  multiline
                  maxRows={4}
                  onChange={(e) => {
                    setPromptTemplateCopy({
                      ...promptTemplateCopy,
                      aiPromptSteps: promptTemplateCopy.aiPromptSteps.map(
                        (openAiPromptStep, openAiPromptStepIndex) => {
                          if (openAiPromptStepIndex === index) {
                            return {
                              ...openAiPromptStep,
                              systemRole: e.target.value,
                            };
                          } else {
                            return openAiPromptStep;
                          }
                        }
                      ),
                    });
                  }}
                  // label="Custom System Role"
                />
              </FormControl>

              <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="demo-simple-select-standard-label">
                  Output Data Type
                </InputLabel>
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  value={openAiPromptStep.outputDataType}
                  onChange={(e) => {
                    setPromptTemplateCopy({
                      ...promptTemplateCopy,
                      aiPromptSteps: promptTemplateCopy.aiPromptSteps.map(
                        (openAiPromptStep, openAiPromptStepIndex) => {
                          if (openAiPromptStepIndex === index) {
                            return {
                              ...openAiPromptStep,
                              outputDataType: e.target
                                .value as PromptOutputTypes,
                            };
                          } else {
                            return openAiPromptStep;
                          }
                        }
                      ),
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
                  value={openAiPromptStep.targetAiServiceModel.model}
                  onChange={(e) => {
                    const targetAiServiceModel: AiServiceModel = JSON.parse(
                      e.target.value
                    );
                    setPromptTemplateCopy({
                      ...promptTemplateCopy,
                      aiPromptSteps: promptTemplateCopy.aiPromptSteps.map(
                        (openAiPromptStep, openAiPromptStepIndex) => {
                          if (openAiPromptStepIndex === index) {
                            return {
                              ...openAiPromptStep,
                              targetAiServiceModel: targetAiServiceModel,
                            };
                          } else {
                            return openAiPromptStep;
                          }
                        }
                      ),
                    });
                  }}
                  label="Output Data Type"
                >
                  {availableAiServiceModels?.map((serviceAndModels) => {
                    return (
                      <>
                        {serviceAndModels.models.map((model, i) => {
                          return (
                            <MenuItem
                              key={i}
                              value={JSON.stringify({
                                serviceName: serviceAndModels.serviceName,
                                model: model,
                              } as AiServiceModel)}
                            >
                              {model}
                            </MenuItem>
                          );
                        })}
                      </>
                    );
                  })}
                  {/* <MenuItem value={GptModels.GPT_3_5}>GPT 3.5</MenuItem>
                  <MenuItem value={GptModels.GPT_4}>GPT 4</MenuItem>
                  <MenuItem value={GptModels.GPT_4_TURBO_PREVIEW}>
                    GPT 4 Turbo Preview (128k token context)
                  </MenuItem> */}
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
        ))}
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
                    emptyOpenAiPromptStep(
                      defaultAiModel || DEFAULT_TARGET_AI_SERVICE_MODEL
                    )
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
              onClick={async () => {
                if (!userId) {
                  return;
                }
                setInProgress(true);
                try {
                  const res = await executePrompt(() => promptTemplateCopy);
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
              }}
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
        previousRun={runToView}
        open={Boolean(runToView)}
        close={() => {
          setRunToView(undefined);
        }}
      />
      <ErrorDialog error={error} clearError={() => setError('')} />
    </ColumnDiv>
  );
}
