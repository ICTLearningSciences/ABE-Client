import React from 'react';
import { IconButton, Button } from '@mui/material';
import { useState } from 'react';
import { RowDiv } from '../../../styled-components';
import { ActivityBuilderStepType } from '../types';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CloseIcon from '@mui/icons-material/Close';

export type AddNewActivityStepType =
  | ActivityBuilderStepType
  | 'EDIT_DOC_PROMPT';

export function AddNewActivityButton(props: {
  insertNewActivityStep: (stepType: AddNewActivityStepType) => void;
}): JSX.Element {
  const options = [
    ...Object.values(ActivityBuilderStepType),
    'EDIT_DOC_PROMPT',
  ];
  const [displayOptions, setDisplayOptions] = useState<boolean>(false);
  return (
    <div
      style={{
        width: 'fit-content',
      }}
    >
      {!displayOptions && (
        <IconButton onClick={() => setDisplayOptions(true)}>
          <AddCircleIcon />
        </IconButton>
      )}

      {displayOptions && (
        <RowDiv>
          {options.map((option, i) => {
            return (
              <Button
                key={i}
                variant="outlined"
                style={{
                  fontSize: 10,
                  marginRight: 5,
                }}
                onClick={() => {
                  props.insertNewActivityStep(option as AddNewActivityStepType);
                  setDisplayOptions(false);
                }}
              >
                {option}
              </Button>
            );
          })}
          <IconButton onClick={() => setDisplayOptions(false)}>
            <CloseIcon />
          </IconButton>
        </RowDiv>
      )}
    </div>
  );
}
