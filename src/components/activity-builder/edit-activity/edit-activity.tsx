import React, { useEffect, useMemo } from 'react';
import {
  ActivityBuilderStepType,
  ActivityBuilder as ActivityBuilderType,
  ActivityBuilderVisibility,
} from '../types';
import { ActivityFlowContainer } from './activity-flow-container';
import { ColumnDiv, RowDiv } from '../../../styled-components';
import { Button, CircularProgress, IconButton } from '@mui/material';
import { InputField, SelectInputField } from '../shared/input-components';
import { equals } from '../../../helpers';
import { v4 as uuidv4 } from 'uuid';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { isActivityRunnable } from '../helpers';
import {
  DOC_NUM_WORDS_KEY,
  DOC_TEXT_KEY,
} from '../../../classes/activity-builder-activity/built-activity-handler';
import { useWithCheckActivityErrors } from '../../../hooks/use-with-check-activity-errors';
import {
  useActivityBuilderContext,
  EditActivityProvider,
  useEditActivityContext,
} from '../activity-builder-context';
import { useWithPanels } from '../../../store/slices/panels/use-with-panels';
// Inner component that uses the context
function EditActivityContent(props: {
  goToActivity: (activity: ActivityBuilderType) => void;
  originalActivity: ActivityBuilderType;
  saveActivity: (activity: ActivityBuilderType) => Promise<ActivityBuilderType>;
  returnTo: () => void;
}): JSX.Element {
  const {
    originalActivity,
    saveActivity: _saveActivity,
    goToActivity,
    returnTo,
  } = props;

  const {
    activity,
    addFlow,
    updateTitle,
    updateDescription,
    updateVisibility,
    updateAttachedPanel,
  } = useEditActivityContext();
  const [saveInProgress, setSaveInProgress] = React.useState<boolean>(false);
  const { activityVersions, loadActivityVersions, canEditActivity } =
    useActivityBuilderContext();
  const { panels } = useWithPanels();

  const globalStateKeys: string[] = useMemo(() => {
    return activity.flowsList.reduce(
      (acc, flow) => {
        const stateKeysForFlow = flow.steps.reduce((acc, step) => {
          if (step.stepType === ActivityBuilderStepType.REQUEST_USER_INPUT) {
            if (step.saveResponseVariableName) {
              acc.push(step.saveResponseVariableName);
            }
          }
          if (step.stepType === ActivityBuilderStepType.PROMPT) {
            const jsonKeys = step.promptConfigurations.flatMap(
              (d) => d.jsonResponseData?.map((d) => d.name) || []
            );
            acc.push(...jsonKeys);
          }
          return acc;
        }, [] as string[]);
        acc.push(...stateKeysForFlow);
        return acc;
      },
      [DOC_TEXT_KEY, DOC_NUM_WORDS_KEY] as string[]
    );
  }, [activity.flowsList]);

  const { errors } = useWithCheckActivityErrors(globalStateKeys, activity);

  useEffect(() => {
    const alreadyLoaded = Boolean(
      originalActivity.clientId in activityVersions
    );
    if (originalActivity.clientId && !alreadyLoaded) {
      loadActivityVersions(originalActivity.clientId);
    }
  }, [originalActivity.clientId, activityVersions, loadActivityVersions]);

  async function saveActivity() {
    setSaveInProgress(true);
    try {
      await _saveActivity(activity);
    } catch (e) {
      console.error(e);
    } finally {
      setSaveInProgress(false);
    }
  }

  function addNewFlow() {
    addFlow(uuidv4(), '');
  }

  return (
    <ColumnDiv
      style={{
        width: '100%',
        height: '100%',
        overflowY: 'auto',
        position: 'relative',
      }}
    >
      <IconButton
        data-cy="return-to-activity-list"
        onClick={returnTo}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 100,
          color: '#1976d2',
        }}
      >
        <ArrowBackIcon />
      </IconButton>
      <ColumnDiv
        data-cy="edit-activity-header"
        style={{
          width: '50%',
          alignSelf: 'center',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <InputField
          label="Activity Name"
          value={activity.title}
          width="100%"
          disabled={!canEditActivity(activity)}
          key={activity.clientId}
          onChange={updateTitle}
        />
        <InputField
          label="Activity Description"
          width="100%"
          value={activity.description}
          onChange={updateDescription}
        />
        <SelectInputField
          label="Visibility"
          value={activity.visibility}
          options={Object.values(ActivityBuilderVisibility)}
          disabled={!canEditActivity(activity)}
          onChange={(v) => updateVisibility(v as ActivityBuilderVisibility)}
        />
        <SelectInputField
          label="Attached Panel"
          value={activity.attachedPanel || ''}
          options={['', ...panels.map((panel) => panel.clientId)]}
          optionLabels={['None', ...panels.map((panel) => panel.panelName)]}
          disabled={!canEditActivity(activity)}
          onChange={(v) => updateAttachedPanel(v || undefined)}
        />

        <RowDiv>
          <Button
            style={{
              marginRight: '10px',
            }}
            disabled={saveInProgress || !isActivityRunnable(activity)}
            variant="outlined"
            onClick={async () => {
              saveActivity().then(() => {
                goToActivity(activity);
              });
            }}
          >
            Preview
          </Button>
          {!saveInProgress ? (
            <Button
              data-cy="save-activity"
              style={{
                marginRight: '10px',
              }}
              variant="outlined"
              disabled={
                !canEditActivity(activity) || equals(activity, originalActivity)
              }
              onClick={saveActivity}
            >
              Save
            </Button>
          ) : (
            <CircularProgress
              style={{
                marginRight: 10,
              }}
            />
          )}
          <Button
            data-cy="add-flow"
            onClick={addNewFlow}
            variant="outlined"
            disabled={!canEditActivity(activity)}
          >
            + Add Flow
          </Button>
        </RowDiv>
      </ColumnDiv>
      <ActivityFlowContainer
        globalStateKeys={globalStateKeys}
        versions={activityVersions[activity.clientId] || []}
        disabled={!canEditActivity(activity)}
        stepErrors={errors}
      />
    </ColumnDiv>
  );
}

// Wrapper component that provides the context
export function EditActivity(props: {
  goToActivity: (activity: ActivityBuilderType) => void;
  activity: ActivityBuilderType;
  saveActivity: (activity: ActivityBuilderType) => Promise<ActivityBuilderType>;
  returnTo: () => void;
}): JSX.Element {
  return (
    <EditActivityProvider initialActivity={props.activity}>
      <EditActivityContent {...props} originalActivity={props.activity} />
    </EditActivityProvider>
  );
}
