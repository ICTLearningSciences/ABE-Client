import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@mui/material';
import React, { useEffect } from 'react';
import { FlowItem } from '../types';
import { getFlowForStepId } from '../helpers';

export function FlowStepSelector(props: {
  flowsList: FlowItem[];
  currentJumpToStepId?: string;
  onStepSelected: (stepId: string) => void;
  rowOrColumn?: 'row' | 'column';
  disableStepsList?: string[];
  width?: string;
  title?: string;
}): JSX.Element {
  const { flowsList, onStepSelected, currentJumpToStepId } = props;
  const [selectedFlowId, setSelectedFlowId] = React.useState<string>('');
  const [selectedStepId, setSelectedStepId] = React.useState<string>('');
  useEffect(() => {
    if (currentJumpToStepId) {
      const flow = getFlowForStepId(flowsList, currentJumpToStepId);
      if (!flow) {
        return;
      }
      setSelectedFlowId(flow.clientId);
      setSelectedStepId(currentJumpToStepId);
    }
  }, [currentJumpToStepId]);

  return (
    <div
      style={{
        display: 'flex',
        flex: 1,
        width: props.width || '100%',
        maxWidth: props.width || '100%',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {props.title && (
        <span
          style={{
            alignSelf: 'center',
            margin: 0,
            padding: 0,
          }}
        >
          {props.title}
        </span>
      )}
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: props.rowOrColumn || 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <FormControl variant="standard" sx={{ minWidth: 120 }}>
          <InputLabel id="select-flow-label">Select Flow</InputLabel>
          <Select
            labelId="select-flow-label"
            value={selectedFlowId}
            onChange={(e) => {
              if (selectedFlowId !== e.target.value) {
                setSelectedFlowId(e.target.value);
                setSelectedStepId('');
              }
            }}
            label="Output Data Type"
          >
            {flowsList.map((flow, i) => {
              return (
                <MenuItem key={flow.clientId} value={flow.clientId}>
                  {flow.name || `Flow ${i + 1}`}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>

        {selectedFlowId && (
          <FormControl variant="standard" sx={{ minWidth: 120 }}>
            <InputLabel id="select-step-label">Flow step</InputLabel>
            <Select
              disabled={!selectedFlowId}
              labelId="select-step-label"
              value={selectedStepId}
              onChange={(e) => {
                setSelectedStepId(e.target.value);
                onStepSelected(e.target.value);
              }}
              label="Output Data Type"
            >
              {flowsList
                .find((flow) => flow.clientId === selectedFlowId)
                ?.steps.map((step, i) => {
                  return (
                    <MenuItem
                      key={step.stepId}
                      value={step.stepId}
                      disabled={props.disableStepsList?.includes(step.stepId)}
                    >
                      {`Step ${i + 1}`}
                    </MenuItem>
                  );
                })}
            </Select>
          </FormControl>
        )}
        <Button
          style={{
            margin: 0,
            padding: 0,
          }}
          disabled={!selectedFlowId && !selectedStepId}
          onClick={() => {
            setSelectedFlowId('');
            setSelectedStepId('');
            onStepSelected('');
          }}
        >
          Clear
        </Button>
      </div>
    </div>
  );
}
