/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from 'react';
import { v4 as uuid } from 'uuid';
import { IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { RoundedBorderDiv, TopLeftText } from '../../../../styled-components';
import { InputField } from '../../shared/input-components';
import { JumpToAlternateStep } from '../../shared/jump-to-alternate-step';
import {
  SystemMessageActivityStep,
  ActivityBuilderStepType,
  FlowItem,
} from '../../types';

export function getDefaultSystemMessage(): SystemMessageActivityStep {
  return {
    stepId: uuid(),
    stepType: ActivityBuilderStepType.SYSTEM_MESSAGE,
    message: '',
    jumpToStepId: '',
  };
}
export function SystemMessageStepBuilder(props: {
  step: SystemMessageActivityStep;
  updateStep: (step: SystemMessageActivityStep) => void;
  deleteStep: () => void;
  flowsList: FlowItem[];
  stepIndex: number;
  width?: string;
  height?: string;
}): JSX.Element {
  const { step, stepIndex } = props;

  function updateField(field: string, value: string) {
    props.updateStep({
      ...step,
      [field]: value,
    });
  }

  return (
    <RoundedBorderDiv
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
      <h4 style={{ alignSelf: 'center' }}>System Message</h4>
      <InputField
        label="Message"
        value={step.message}
        onChange={(e) => {
          updateField('message', e);
        }}
      />

      <JumpToAlternateStep
        step={step}
        flowsList={props.flowsList}
        onNewStepSelected={(stepId) => {
          updateField('jumpToStepId', stepId);
        }}
      />
    </RoundedBorderDiv>
  );
}
