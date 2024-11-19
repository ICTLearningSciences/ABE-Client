import React from 'react';
import { Box, Button, IconButton } from '@mui/material';
import { ColumnDiv, RowDiv } from '../../../styled-components';
import { ActivityBuilderStep, FlowItem } from '../types';
import { FlowStepSelector } from './flow-step-selector';
import { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { InfoTooltip } from '../../info-tooltip';
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
          <InfoTooltip title="Configure this step to jump to a step out of order." />
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
        <Box
          sx={{
            mt: 2,
            borderRadius: 2,
            boxShadow: 1,
            backgroundColor: 'white',
            border: '1px solid #e0e0e0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            alignSelf: 'center',
            width: '50%',
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
        </Box>
      )}
    </ColumnDiv>
  );
}
