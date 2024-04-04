import { TextField } from '@mui/material';
import React from 'react';

export function InputDayIntention(props: {
  setDayIntention: (intention: string) => void;
  dayIntention: string;
}): JSX.Element {
  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>
        What are you hoping to get done today?
      </h1>
      <TextField
        data-cy="input-day-intention"
        fullWidth
        rows={4}
        multiline
        defaultValue={props.dayIntention}
        onChange={(e) => props.setDayIntention(e.target.value)}
      />
    </div>
  );
}
