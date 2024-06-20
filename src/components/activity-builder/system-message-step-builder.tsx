/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from 'react';
import { FlowItem, SystemMessageActivityStep } from './types';
import {
  ColumnCenterDiv,
  RoundedBorderDiv,
  TopLeftText,
} from '../../styled-components';
import { InputField } from './shared/input-components';
import { FlowStepSelector } from './shared/flow-step-selector';

export function SystemMessageStepBuilder(props: {
  step: SystemMessageActivityStep;
  updateStep: (step: SystemMessageActivityStep) => void;
  flowsList: FlowItem[];
  width?: string;
  height?: string;
}): JSX.Element {
  const { step } = props;

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
        padding: 10,
      }}
    >
      <TopLeftText>{step.stepId}</TopLeftText>
      <h4 style={{ alignSelf: 'center' }}>System Message</h4>
      <InputField
        label="Message"
        value={step.message}
        onChange={(e) => {
          updateField('message', e);
        }}
      />
      <ColumnCenterDiv
        style={{
          width: '80%',
          border: '1px solid black',
          padding: 10,
          alignSelf: 'center',
        }}
      >
        <span style={{ fontWeight: 'bold' }}>Custom Step Jump</span>
        <FlowStepSelector
          flowsList={props.flowsList || []}
          rowOrColumn="row"
          currentJumpToStepId={step.jumpToStepId}
          width="fit-content"
          onStepSelected={(stepId) => {
            updateField('jumpToStepId', stepId);
          }}
        />
      </ColumnCenterDiv>
    </RoundedBorderDiv>
  );
}
