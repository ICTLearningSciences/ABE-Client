/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from 'react';
import {
  ActivityBuilderStepType,
  ButtonAction,
  ButtonActionTypeEnum,
  FlowItem,
  PredefinedResponse,
  RequestUserInputActivityStep,
} from '../../types';
import { useEditActivityContext } from '../../activity-builder-context';
import {
  ColumnCenterDiv,
  ColumnDiv,
  RoundedBorderDiv,
  RowDiv,
  TopLeftText,
} from '../../../../styled-components';
import { CheckBoxInput, InputField } from '../../shared/input-components';
import { FlowStepSelector } from '../../shared/flow-step-selector';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  IconButton,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { v4 as uuid } from 'uuid';
import { Delete } from '@mui/icons-material';
import { JumpToAlternateStep } from '../../shared/jump-to-alternate-step';
import Collapse from '@mui/material/Collapse';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { StepVersion } from '../activity-flow-container';
import { VersionsDropdown } from './versions-dropdown';
import { isContextDataString } from '../../helpers';
import DropdownDisplay from '../../../dropdown-display';
import { InfoTooltip } from '../../../info-tooltip';
import { useWithPanels } from '../../../../store/slices/panels/use-with-panels';
import { Panelist } from '../../../../store/slices/panels/types';
export function getDefaultRequestUserInputBuilder(): RequestUserInputActivityStep {
  return {
    stepId: uuid(),
    stepType: ActivityBuilderStepType.REQUEST_USER_INPUT,
    message: '',
    saveResponseVariableName: '',
    systemCustomName: '',
    saveAsIntention: false,
    disableFreeInput: false,
    predefinedResponses: [],
  };
}

function ButtonActionUpdater(props: {
  buttonAction?: ButtonAction;
  panelists: Panelist[];
  onChange: (buttonAction: ButtonAction | undefined) => void;
}): JSX.Element {
  const { buttonAction, panelists, onChange } = props;
  const selectedType = buttonAction?.buttonActionType ?? '';
  const selectedPanelistIds = buttonAction?.buttonActionValue ?? [];

  return (
    <ColumnDiv
      style={{ width: '100%', alignItems: 'center', gap: 8, marginTop: 8 }}
    >
      <FormControl size="small" style={{ width: '60%' }}>
        <InputLabel>Button Action</InputLabel>
        <Select
          label="Button Action"
          value={selectedType}
          onChange={(e) => {
            const val = e.target.value as ButtonActionTypeEnum | '';
            if (!val) {
              onChange(undefined);
            } else {
              onChange({ buttonActionType: val, buttonActionValue: [] });
            }
          }}
        >
          <MenuItem value="">None</MenuItem>
          <MenuItem value={ButtonActionTypeEnum.FILTER_TO_PANELIST}>
            Filter to Panelist
          </MenuItem>
          <MenuItem value={ButtonActionTypeEnum.CLEAR_PANELIST_FILTERS}>
            Clear Panelist Filters
          </MenuItem>
        </Select>
      </FormControl>
      {buttonAction?.buttonActionType ===
        ButtonActionTypeEnum.FILTER_TO_PANELIST && (
        <FormControl size="small" style={{ width: '60%' }}>
          <InputLabel>Panelists</InputLabel>
          <Select
            multiple
            label="Panelists"
            value={selectedPanelistIds}
            onChange={(e) => {
              const val = e.target.value;
              onChange({
                ...buttonAction,
                buttonActionValue:
                  typeof val === 'string' ? val.split(',') : val,
              });
            }}
            renderValue={(selected) =>
              (selected as string[])
                .map(
                  (id) =>
                    panelists.find((p) => p.clientId === id)?.panelistName ?? id
                )
                .join(', ')
            }
          >
            {panelists.map((p) => (
              <MenuItem key={p.clientId} value={p.clientId}>
                <Checkbox checked={selectedPanelistIds.includes(p.clientId)} />
                <ListItemText primary={p.panelistName} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    </ColumnDiv>
  );
}

function PredefinedResponseUpdater(props: {
  predefinedResponse: PredefinedResponse;
  updateResponse: (
    updatedResponse: Partial<PredefinedResponse>,
    clientId: string
  ) => void;
  deleteResponse: () => void;
  flowsList: FlowItem[];
  panelists: Panelist[];
  hasAttachedPanel: boolean;
}): JSX.Element {
  const { predefinedResponse, updateResponse, deleteResponse } = props;
  return (
    <Box
      sx={{
        mt: 2,
        borderRadius: 2,
        boxShadow: 1,
        backgroundColor: 'white',
        border: '1px solid #e0e0e0',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
      }}
    >
      <ColumnDiv
        style={{
          // alignItems: 'center',
          width: '100%',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        <IconButton
          data-cy="delete-predefined-response"
          onClick={deleteResponse}
          color="primary"
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
          }}
        >
          <DeleteIcon />
        </IconButton>

        <RowDiv
          style={{
            width: '60%',
          }}
        >
          <InputField
            label="Message"
            width="100%"
            value={predefinedResponse.message}
            onChange={(e) => {
              props.updateResponse(
                {
                  message: e,
                },
                predefinedResponse.clientId
              );
            }}
          />
        </RowDiv>
        <DropdownDisplay
          buttonLabelOpen="Settings"
          buttonLabelClose="Close Settings"
          content={
            <ColumnDiv
              style={{
                width: '100%',
                alignItems: 'center',
              }}
            >
              {isContextDataString(predefinedResponse.message) ? (
                <CheckBoxInput
                  label="Is Array Data?"
                  value={predefinedResponse.isArray ?? false}
                  onChange={(e) => {
                    props.updateResponse(
                      {
                        isArray: e,
                      },
                      predefinedResponse.clientId
                    );
                  }}
                />
              ) : undefined}

              <FlowStepSelector
                flowsList={props.flowsList}
                title="Jump to Step"
                width="150px"
                currentJumpToStepId={predefinedResponse.jumpToStepId}
                rowOrColumn="column"
                onStepSelected={(stepId) => {
                  updateResponse(
                    {
                      ...predefinedResponse,
                      jumpToStepId: stepId,
                    },
                    predefinedResponse.clientId
                  );
                }}
              />
              <InputField
                label="Response Weight"
                width="60%"
                value={predefinedResponse.responseWeight || ''}
                onChange={(e) => {
                  props.updateResponse(
                    {
                      responseWeight: e,
                    },
                    predefinedResponse.clientId
                  );
                }}
              />
              {props.hasAttachedPanel && (
                <ButtonActionUpdater
                  buttonAction={predefinedResponse.buttonAction}
                  panelists={props.panelists}
                  onChange={(buttonAction) => {
                    props.updateResponse(
                      { buttonAction },
                      predefinedResponse.clientId
                    );
                  }}
                />
              )}
            </ColumnDiv>
          }
        />
      </ColumnDiv>
    </Box>
  );
}

function PredefinedResponsesUpdater(props: {
  step: RequestUserInputActivityStep;
  updatePredefinedResponse: (
    updatedResponse: Partial<PredefinedResponse>,
    clientId: string
  ) => void;
  addNewPredefinedResponse: () => void;
  deletePredefinedResponse: (clientId: string) => void;
  flowsList: FlowItem[];
  panelists: Panelist[];
  hasAttachedPanel: boolean;
  width?: string;
}): JSX.Element {
  const {
    step,
    updatePredefinedResponse,
    addNewPredefinedResponse,
    deletePredefinedResponse,
  } = props;
  return (
    <ColumnCenterDiv
      style={{
        width: props.width || '100%',
        alignSelf: 'center',
        justifyContent: 'center',
      }}
    >
      <RowDiv>
        <span style={{ fontWeight: 'bold' }}>Predefined Responses</span>
        <InfoTooltip title="Predefined responses are a list of responses the user can choose from." />
      </RowDiv>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            lg: 'repeat(3, 1fr)',
          },
          width: '100%',
          gap: 1,
        }}
      >
        {Boolean(step.predefinedResponses?.length) &&
          step.predefinedResponses.map((response) => (
            <PredefinedResponseUpdater
              key={response.clientId}
              predefinedResponse={response}
              updateResponse={(updatedResponse, clientId) => {
                updatePredefinedResponse(updatedResponse, clientId);
              }}
              deleteResponse={() => {
                deletePredefinedResponse(response.clientId);
              }}
              flowsList={props.flowsList}
              panelists={props.panelists}
              hasAttachedPanel={props.hasAttachedPanel}
            />
          ))}
      </Box>
      <Button variant="outlined" onClick={addNewPredefinedResponse}>
        + Add Response
      </Button>
    </ColumnCenterDiv>
  );
}

export function RequestUserInputStepBuilder(props: {
  stepId: string;
  deleteStep: () => void;
  flowsList: FlowItem[];
  stepIndex: number;
  width?: string;
  height?: string;
  versions: StepVersion[];
  errors?: string[];
}): JSX.Element {
  const { stepId, stepIndex, versions, errors } = props;
  const { activity, getStep, getFlowByStepId, updateStep, updateStepField } =
    useEditActivityContext();
  const { panels, panelists } = useWithPanels();
  const hasAttachedPanel = Boolean(activity.attachedPanel);
  const attachedPanel = panels.find(
    (p) => p.clientId === activity.attachedPanel
  );
  const attachedPanelists = panelists.filter(
    (p) => attachedPanel?.panelists.includes(p.clientId)
  );
  const [collapsed, setCollapsed] = React.useState<boolean>(false);

  const step = getStep(stepId) as RequestUserInputActivityStep;
  const flow = getFlowByStepId(stepId);

  if (!step || !flow) {
    return <div>Step not found</div>;
  }

  const [rerender, setRerender] = React.useState(0);
  function replacePromptStepWithVersion(version: StepVersion) {
    if (flow) {
      updateStep(flow.clientId, version.step);
    }
    setRerender(rerender + 1);
  }

  function updateField<K extends keyof RequestUserInputActivityStep>(
    field: K,
    value: RequestUserInputActivityStep[K]
  ) {
    updateStepField(stepId, field, value);
  }

  function updatePredefinedResponse(
    updatedResponse: Partial<PredefinedResponse>,
    clientId: string
  ) {
    const updatedResponses = step.predefinedResponses.map((r) => {
      if (r.clientId === clientId) {
        return {
          ...r,
          ...updatedResponse,
        };
      }
      return r;
    });
    updateStepField(stepId, 'predefinedResponses', updatedResponses);
  }

  function addNewPredefinedResponse() {
    updateField('predefinedResponses', [
      ...step.predefinedResponses,
      {
        clientId: uuid(),
        message: '',
        responseWeight: '0',
      },
    ]);
  }

  function deletePredefinedResponse(clientId: string) {
    updateField(
      'predefinedResponses',
      step.predefinedResponses.filter((r) => r.clientId !== clientId)
    );
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
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
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
        {collapsed ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </IconButton>
      <h4 style={{ alignSelf: 'center' }}>Request User Input</h4>
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
        <InputField
          label="Request Message (Optional)"
          value={step.message}
          onChange={(e) => {
            updateField('message', e);
          }}
        />
        <InputField
          label="Save Response As (Optional)"
          value={step.saveResponseVariableName}
          onChange={(e) => {
            updateField('saveResponseVariableName', e);
          }}
        />
        <RowDiv>
          <CheckBoxInput
            label="Input is session intention."
            value={step.saveAsIntention}
            onChange={(e) => {
              updateField('saveAsIntention', e);
            }}
          />
          <InfoTooltip title="If checked, the user's input will be saved as a session intention." />
        </RowDiv>
        <CheckBoxInput
          label="Disable Text Input? (requires predefined responses)"
          value={step.disableFreeInput}
          onChange={(e) => {
            updateField('disableFreeInput', e);
          }}
        />
        <CheckBoxInput
          label="Set Student Activity Complete?"
          value={step.setStudentActivityComplete ?? false}
          onChange={(e) => {
            updateField('setStudentActivityComplete', e);
          }}
        />
        <PredefinedResponsesUpdater
          width="100%"
          step={step}
          updatePredefinedResponse={updatePredefinedResponse}
          addNewPredefinedResponse={addNewPredefinedResponse}
          deletePredefinedResponse={deletePredefinedResponse}
          flowsList={props.flowsList}
          panelists={attachedPanelists}
          hasAttachedPanel={hasAttachedPanel}
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
