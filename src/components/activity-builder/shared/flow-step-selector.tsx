import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import React, { useEffect } from 'react';
import { ColumnDiv, RowDiv } from '../../../styled-components';
import { FlowItem } from '../types';
import { getFlowForStepId } from '../helpers';

export function FlowStepSelector(props: {
  flowsList: FlowItem[];
  currentJumpToStepId?: string;
  onStepSelected: (stepId: string) => void;
  rowOrColumn?: 'row' | 'column';
  width?: string;
  title?: string;
}): JSX.Element {
  const { flowsList, onStepSelected, currentJumpToStepId } = props;
  const [selectedFlowId, setSelectedFlowId] = React.useState<string>('');
  const [selectedStepId, setSelectedStepId] = React.useState<string>('');
  console.log(currentJumpToStepId);
  useEffect(() => {
    if (currentJumpToStepId) {
      const flow = getFlowForStepId(flowsList, currentJumpToStepId);
      if (!flow) {
        return;
      }
      setSelectedFlowId(flow._id);
      setSelectedStepId(currentJumpToStepId);
    }
  }, [currentJumpToStepId]);

  return (
    <div
      style={{
        display: 'flex',
        flex: 1,
        width: props.width || '100%',
        flexDirection: 'column',
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
        }}
      >
        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="select-flow-label">Select flow</InputLabel>
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
            {flowsList.map((flow) => {
              return (
                <MenuItem key={flow._id} value={flow._id}>
                  {flow.name}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>

        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="select-step-label">Select flow step</InputLabel>
          {/* when flow selected, select step */}
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
              .find((flow) => flow._id === selectedFlowId)
              ?.steps.map((step) => {
                return (
                  <MenuItem key={step.stepId} value={step.stepId}>
                    {step.stepId}
                  </MenuItem>
                );
              })}
          </Select>
        </FormControl>
      </div>
    </div>
  );
}
