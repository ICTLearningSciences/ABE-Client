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
  PredefinedResponse,
  RequestUserInputActivityStep,
  RequestUserInputSpecialType,
} from '../../types';
import { RoundedBorderDiv, TopLeftText } from '../../../../styled-components';
import { CheckBoxInput, InputField } from '../../shared/input-components';
import { IconButton } from '@mui/material';
import { v4 as uuid } from 'uuid';
import { Delete } from '@mui/icons-material';
import Collapse from '@mui/material/Collapse';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { StepVersion } from '../activity-flow-container';
import { VersionsDropdown } from './versions-dropdown';
import { InfoTooltip } from '../../../info-tooltip';
import { GO_HOME_BUTTON_MESSAGE } from '../../../../classes/activity-builder-activity/built-activity-handler';

const goHomePredefinedResponse: PredefinedResponse = {
  clientId: 'go-home-predefined-response',
  message: GO_HOME_BUTTON_MESSAGE,
};

export function getDefaultEndActivityStepBuilder(): RequestUserInputActivityStep {
  return {
    stepId: uuid(),
    stepType: ActivityBuilderStepType.REQUEST_USER_INPUT,
    message: '',
    saveResponseVariableName: '',
    saveAsIntention: false,
    disableFreeInput: true,
    setStudentActivityComplete: true,
    predefinedResponses: [goHomePredefinedResponse],
    specialType: RequestUserInputSpecialType.END_ACTIVITY,
  };
}

export function EndActivityStepBuilder(props: {
  step: RequestUserInputActivityStep;
  updateLocalActivity: React.Dispatch<React.SetStateAction<ActivityBuilder>>;
  deleteStep: () => void;
  flowsList: FlowItem[];
  stepIndex: number;
  width?: string;
  height?: string;
  versions: StepVersion[];
}): JSX.Element {
  const { step, stepIndex, updateLocalActivity, versions } = props;
  const [collapsed, setCollapsed] = React.useState<boolean>(false);
  const hasGoHomeButton = Boolean(
    step.predefinedResponses.find(
      (step) => step.clientId === goHomePredefinedResponse.clientId
    )
  );

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

  function updateField<K extends keyof RequestUserInputActivityStep>(
    field: K,
    value: RequestUserInputActivityStep[K]
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
      <h4 style={{ alignSelf: 'center' }}>
        End Activity Message{' '}
        <InfoTooltip title="The activity will stop here. You may supply a final message to the user, and optionally enable a 'Return To Home' button." />
      </h4>
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
          label="Final message"
          value={step.message}
          onChange={(e) => {
            updateField('message', e);
          }}
        />
        <CheckBoxInput
          label="Provide extra 'Return To Home' button in Chat Log."
          value={hasGoHomeButton}
          onChange={(checked) => {
            updateField(
              'predefinedResponses',
              checked ? [goHomePredefinedResponse] : []
            );
          }}
        />
        <CheckBoxInput
          label="Set student assignment activity as complete."
          value={step.setStudentActivityComplete ?? false}
          disabled={true}
          onChange={(e) => {
            updateField('setStudentActivityComplete', e);
          }}
        />
      </Collapse>
    </RoundedBorderDiv>
  );
}
