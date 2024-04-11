import React from 'react';
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
import { GptModels } from '../../../constants';
import { equals, extractErrorMessageFromError } from '../../../helpers';
import { asyncPromptExecute } from '../../../hooks/use-with-synchronous-polling';
import { ColumnDiv, RowDivSB } from '../../../styled-components';
import {
  PromptOutputTypes,
  MultistepPromptRes,
  GQLPrompt,
  ActivityGQL,
} from '../../../types';
import { ErrorDialog } from '../../dialog';
import ViewPreviousRunModal from '../view-previous-run-modal';
import ViewPreviousRunsModal from '../view-previous-runs-modal';
import { useState } from 'react';
import { emptyOpenAiPromptStep } from '../multi-prompt-buttonology';
import { useAppSelector } from '../../../store/hooks';

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
  const googleDocId = useAppSelector((state) => state.state.googleDocId);
  const systemPrompt: string = useAppSelector(
    (state) => state.chat.systemPrompt
  );
  const overrideGptModel = useAppSelector(
    (state) => state.state.overideGptModel
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
  const [previousRuns, setPreviousRuns] = useState<MultistepPromptRes[]>([]);
  const [viewPrevRunResults, setViewPrevRunResults] = useState<boolean>(false);
  const [runToView, setRunToView] = useState<MultistepPromptRes>();
  const [promptTemplateCopy, setPromptTemplateCopy] = useState<GQLPrompt>(
    JSON.parse(JSON.stringify(promptTemplate))
  );
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
        {promptTemplateCopy.openAiPromptSteps.map((openAiPromptStep, index) => (
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
                  openAiPromptSteps: promptTemplateCopy.openAiPromptSteps.map(
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
                        openAiPromptSteps:
                          promptTemplateCopy.openAiPromptSteps.map(
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
                        openAiPromptSteps:
                          promptTemplateCopy.openAiPromptSteps.map(
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
                  value={openAiPromptStep.customSystemRole}
                  multiline
                  maxRows={4}
                  onChange={(e) => {
                    setPromptTemplateCopy({
                      ...promptTemplateCopy,
                      openAiPromptSteps:
                        promptTemplateCopy.openAiPromptSteps.map(
                          (openAiPromptStep, openAiPromptStepIndex) => {
                            if (openAiPromptStepIndex === index) {
                              return {
                                ...openAiPromptStep,
                                customSystemRole: e.target.value,
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
                      openAiPromptSteps:
                        promptTemplateCopy.openAiPromptSteps.map(
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
                  value={openAiPromptStep.targetGptModel}
                  onChange={(e) => {
                    setPromptTemplateCopy({
                      ...promptTemplateCopy,
                      openAiPromptSteps:
                        promptTemplateCopy.openAiPromptSteps.map(
                          (openAiPromptStep, openAiPromptStepIndex) => {
                            if (openAiPromptStepIndex === index) {
                              return {
                                ...openAiPromptStep,
                                targetGptModel: e.target.value as GptModels,
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
                  <MenuItem value={GptModels.GPT_3_5}>GPT 3.5</MenuItem>
                  <MenuItem value={GptModels.GPT_4}>GPT 4</MenuItem>
                  <MenuItem value={GptModels.GPT_4_TURBO_PREVIEW}>
                    GPT 4 Turbo Preview (128k token context)
                  </MenuItem>
                </Select>
              </FormControl>
            </ColumnDiv>
            <Button
              disabled={inProgress}
              onClick={() => {
                setPromptTemplateCopy({
                  ...promptTemplateCopy,
                  openAiPromptSteps:
                    promptTemplateCopy.openAiPromptSteps.filter(
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
                  openAiPromptSteps:
                    promptTemplateCopy.openAiPromptSteps.concat(
                      emptyOpenAiPromptStep
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
                  const res = await asyncPromptExecute(
                    googleDocId,
                    promptTemplateCopy.openAiPromptSteps,
                    userId,
                    systemPrompt,
                    overrideGptModel
                  );
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
        setRunToView={(run?: MultistepPromptRes) => {
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
