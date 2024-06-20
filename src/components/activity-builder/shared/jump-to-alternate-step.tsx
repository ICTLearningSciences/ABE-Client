import React from 'react';
import { Button, IconButton } from '@mui/material';
import { ColumnCenterDiv, ColumnDiv, RowDiv } from '../../../styled-components';
import { ActivityBuilderStep, FlowItem } from '../types';
import { FlowStepSelector } from './flow-step-selector';
import { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
export function JumpToAlternateStep(props: {
  step: ActivityBuilderStep;
  flowsList: FlowItem[];
  onNewStepSelected: (stepId: string) => void;
}): JSX.Element {
  const { step, flowsList, onNewStepSelected } = props;
  const [displayStepSelector, setDisplayStepSelector] = useState<boolean>(
    Boolean(step.jumpToStepId) && step.jumpToStepId !== ''
  );
  return (
    <ColumnDiv>
      {!displayStepSelector && (
        <RowDiv>
          <span style={{ color: 'grey' }}>Jump to alternate step?</span>
          <Button
            onClick={() => {
              setDisplayStepSelector(true);
            }}
          >
            Yes
          </Button>
        </RowDiv>
      )}

      {displayStepSelector && (
        <ColumnCenterDiv
          style={{
            width: '80%',
            border: '1px solid black',
            padding: 10,
            alignSelf: 'center',
            position: 'relative',
          }}
        >
          <IconButton
            style={{
              position: 'absolute',
              right: 10,
              top: 10,
            }}
            onClick={() => {
              setDisplayStepSelector(false);
              onNewStepSelected('');
            }}
          >
            <CloseIcon />
          </IconButton>
          <span style={{ fontWeight: 'bold' }}>Custom Step Jump</span>
          <FlowStepSelector
            flowsList={flowsList}
            rowOrColumn="row"
            disableStepsList={[step.stepId]}
            currentJumpToStepId={step.jumpToStepId}
            width="fit-content"
            onStepSelected={(stepId) => {
              onNewStepSelected(stepId);
            }}
          />
        </ColumnCenterDiv>
      )}
    </ColumnDiv>
  );
}
