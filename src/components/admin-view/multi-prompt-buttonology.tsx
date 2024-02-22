/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import {
  Button,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  Input,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { ColumnDiv, RowDivSB } from '../../styled-components';
import React, { useState } from 'react';
import {
  ActivityGQL,
  ActivityPrompt,
  GQLPrompt,
  MultistepPromptRes,
  OpenAiPromptStep,
  PromptOutputTypes,
  PromptRoles,
} from '../../types';
import ViewPreviousRunsModal from './view-previous-runs-modal';
import ViewPreviousRunModal from './view-previous-run-modal';
import { useAppSelector } from '../../store/hooks';
import { UseWithPrompts } from '../../hooks/use-with-prompts';
import { v4 as uuidv4 } from 'uuid';
import { ActivityPrompts, SavedPromptsView } from './saved-prompts-view';
import { SavedActivityPromptsView } from './saved-activity-prompts-view';
import {
  extractErrorMessageFromError,
  isPromptInActivity,
} from '../../helpers';
import { ErrorDialog } from '../dialog';
import { asyncPromptExecute } from '../../hooks/use-with-synchronous-polling';

const emptyOpenAiPromptStep: OpenAiPromptStep = {
  prompts: [
    {
      promptText: '',
      includeEssay: true,
      promptRole: PromptRoles.USER,
    },
  ],
  outputDataType: PromptOutputTypes.TEXT,
};

export function MultiPromptTesting(props: {
  googleDocId: string;
  activities: ActivityGQL[];
  goToActivity: (activityId: ActivityGQL) => void;
  useWithPrompts: UseWithPrompts;
}): JSX.Element {
  const { googleDocId, activities, goToActivity, useWithPrompts } = props;
  const userId: string | undefined = useAppSelector(
    (state) => state.login.user?._id
  );
  const systemPrompt: string = useAppSelector(
    (state) => state.chat.systemPrompt
  );
  const [targetPromptId, setTargetPromptId] = useState<string>();
  const { prompts, handleSavePrompts, editOrAddPrompt, isEdited, isLoading } =
    useWithPrompts;
  const activitiesWithPrompts = activities.filter(
    (activity) => (activity.prompts?.length || 0) > 0
  );
  const activityPrompts = getPromptsForActivities(
    activitiesWithPrompts,
    prompts
  );
  const promptTemplate = targetPromptId
    ? (prompts || []).find(
        (prompt) =>
          prompt._id === targetPromptId || prompt.clientId === targetPromptId
      )
    : undefined;
  const orphanPrompts = prompts?.filter((prompt) => {
    return !isPromptInActivity(prompt, activities);
  });
  const useGpt4 = useAppSelector((state) => state.state.useGpt4);
  const [previousRuns, setPreviousRuns] = useState<MultistepPromptRes[]>([]);
  const [viewPrevRunResults, setViewPrevRunResults] = useState<boolean>(false);
  const [runToView, setRunToView] = useState<MultistepPromptRes>();
  const [inProgress, setInProgress] = useState<boolean>(false);
  const [focusedPromptIndex, setFocusedPromptIndex] = useState<number>(0);
  const [error, setError] = useState<string>('');

  function getPromptsForActivities(
    activitiesWithPrompts: ActivityGQL[],
    prompts: GQLPrompt[]
  ) {
    const r = activitiesWithPrompts.reduce((acc, activity) => {
      const activityPrompts = getActivityPrompts(activity, prompts);
      if (activityPrompts.savedPrompts.length > 0) {
        acc.push(activityPrompts);
      }
      return acc;
    }, [] as ActivityPrompts[]);
    return r;
  }

  function getActivityPrompts(
    activity: ActivityGQL,
    savedPrompts: GQLPrompt[]
  ): ActivityPrompts {
    const activityPromptsGql = activity.prompts;
    if (!activityPromptsGql || !activityPromptsGql.length) {
      return {
        activity,
        savedPrompts: [],
      };
    }
    // reduce activityPrompts to ActivityPrompt[] only if a savedPrompt is found
    const savedActivityPrompts: ActivityPrompt[] = activityPromptsGql.reduce(
      (acc, activityPrompt) => {
        const savedPrompt = savedPrompts.find(
          (sp) => sp._id === activityPrompt.promptId
        );
        if (savedPrompt) {
          acc.push({
            ...activityPrompt,
            prompt: savedPrompt,
          });
        }
        return acc;
      },
      [] as ActivityPrompt[]
    );

    return {
      activity,
      savedPrompts: savedActivityPrompts.sort((a, b) => {
        return a.order - b.order;
      }),
    };
  }

  function handleImportStoredPrompt(prompt: GQLPrompt) {
    setTargetPromptId(prompt.clientId || prompt._id);
  }

  function getActivity(prompt: GQLPrompt) {
    const activity = activities.find(
      (activity) => activity.prompt?._id === prompt._id
    );
    return activity;
  }

  // Selecting prompt template
  if (!promptTemplate) {
    return (
      <ColumnDiv
        style={{ width: '100%', maxHeight: '90%', alignItems: 'center' }}
      >
        <div style={{ overflow: 'auto', padding: '10px', width: '95%' }}>
          <h2 style={{ textAlign: 'center' }}>Activities</h2>
          <SavedActivityPromptsView
            activitiesWithPrompts={activityPrompts}
            promptsLoading={isLoading}
            onImport={(prompt: GQLPrompt) => {
              handleImportStoredPrompt(prompt);
            }}
            goToActivity={goToActivity}
            activities={activities}
            getActivity={getActivity}
          />
          <h2 style={{ textAlign: 'center' }}>Prompt Templates</h2>
          <SavedPromptsView
            savedPrompts={orphanPrompts}
            promptsLoading={isLoading}
            onImport={(prompt: GQLPrompt) => {
              handleImportStoredPrompt(prompt);
            }}
            goToActivity={goToActivity}
            activities={activities}
          />
        </div>
        <Button
          disabled={prompts?.length === 0}
          onClick={() => {
            const newId = uuidv4();
            editOrAddPrompt({
              _id: newId,
              title: '',
              clientId: newId,
              openAiPromptSteps: [emptyOpenAiPromptStep],
            });
            setTargetPromptId(newId);
          }}
        >
          New Prompt Template
        </Button>
      </ColumnDiv>
    );
  }

  // Editing selected prompt template
  return (
    <ColumnDiv style={{ width: '95%', maxHeight: '95%' }}>
      <TextField
        id="standard-basic"
        label="Template Title"
        variant="standard"
        value={promptTemplate.title}
        style={{
          width: 'fit-content',
          alignSelf: 'center',
          margin: 10,
          marginTop: 15,
        }}
        onChange={(e) => {
          editOrAddPrompt({
            ...promptTemplate,
            title: e.target.value,
          });
        }}
      />
      <div
        style={{
          height: '100%',
          overflow: 'auto',
          borderBottom: '1px solid black',
          padding: '10px',
        }}
      >
        {promptTemplate.openAiPromptSteps.map((openAiPromptStep, index) => (
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
                editOrAddPrompt({
                  ...promptTemplate,
                  openAiPromptSteps: promptTemplate.openAiPromptSteps.map(
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
                      editOrAddPrompt({
                        ...promptTemplate,
                        openAiPromptSteps: promptTemplate.openAiPromptSteps.map(
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
                      editOrAddPrompt({
                        ...promptTemplate,
                        openAiPromptSteps: promptTemplate.openAiPromptSteps.map(
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
                  Output Data Type
                </InputLabel>
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  value={openAiPromptStep.outputDataType}
                  onChange={(e) => {
                    editOrAddPrompt({
                      ...promptTemplate,
                      openAiPromptSteps: promptTemplate.openAiPromptSteps.map(
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
            </ColumnDiv>
            <Button
              disabled={inProgress}
              onClick={() => {
                editOrAddPrompt({
                  ...promptTemplate,
                  openAiPromptSteps: promptTemplate.openAiPromptSteps.filter(
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
                editOrAddPrompt({
                  ...promptTemplate,
                  openAiPromptSteps: promptTemplate.openAiPromptSteps.concat(
                    emptyOpenAiPromptStep
                  ),
                });
              }}
            >
              Add Prompt
            </Button>
            <Button
              disabled={!isEdited}
              onClick={() => {
                handleSavePrompts();
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
                    promptTemplate.openAiPromptSteps,
                    userId,
                    systemPrompt,
                    useGpt4
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
              disabled={prompts?.length === 0}
              onClick={() => {
                setTargetPromptId('');
              }}
            >
              View Prompt Templates
            </Button>
            <Button
              disabled={!getActivity(promptTemplate)}
              onClick={() => {
                const activity = getActivity(promptTemplate);
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
