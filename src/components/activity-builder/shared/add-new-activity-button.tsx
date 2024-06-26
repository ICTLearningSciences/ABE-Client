import React from 'react';
import { IconButton, Button } from '@mui/material';
import { useState } from 'react';
import { RowDiv } from '../../../styled-components';
import { ActivityBuilderStepType } from '../types';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CloseIcon from '@mui/icons-material/Close';

export function AddNewActivityButton(props: {
  insertNewActivityStep: (stepType: ActivityBuilderStepType) => void;
}): JSX.Element {
  const options = Object.values(ActivityBuilderStepType);
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
                  props.insertNewActivityStep(option);
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
