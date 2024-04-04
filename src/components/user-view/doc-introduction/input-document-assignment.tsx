import { TextField } from '@mui/material';
import React from 'react';

export function InputDocumentAssignment(props: {
  setDocumentAssignment: (assignment: string) => void;
  documentAssignment: string;
}): JSX.Element {
  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>
        If you have an assignment prompt or guidance, please paste it here as
        well.
      </h1>
      <TextField
        data-cy="input-document-assignment"
        fullWidth
        rows={4}
        multiline
        defaultValue={props.documentAssignment}
        onChange={(e) => props.setDocumentAssignment(e.target.value)}
      />
    </div>
  );
}
