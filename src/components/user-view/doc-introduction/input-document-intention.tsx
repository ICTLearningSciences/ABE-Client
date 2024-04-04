import { TextField } from '@mui/material';
import React from 'react';

export function InputDocumentIntention(props: {
  setDocumentIntention: (intention: string) => void;
  documentIntention: string;
}): JSX.Element {
  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>
        What kind of paper are you trying to write?
      </h1>
      <TextField
        data-cy="input-document-intention"
        fullWidth
        rows={4}
        multiline
        defaultValue={props.documentIntention}
        onChange={(e) => props.setDocumentIntention(e.target.value)}
      />
    </div>
  );
}
