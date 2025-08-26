/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';

interface DocumentSelectorProps {
  documentIds: string[];
  selectedDocId: string;
  onDocumentChange: (docId: string) => void;
}

export const DocumentSelector: React.FC<DocumentSelectorProps> = ({
  documentIds,
  selectedDocId,
  onDocumentChange,
}) => {
  if (documentIds.length <= 1) {
    return null;
  }

  return (
    <Box
      sx={{ mb: 3, width: '100%', display: 'flex', justifyContent: 'center' }}
    >
      <FormControl sx={{ minWidth: 300 }}>
        <InputLabel id="document-select-label">Document</InputLabel>
        <Select
          labelId="document-select-label"
          value={selectedDocId || ''}
          label="Document"
          onChange={(e) => onDocumentChange(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              '&.Mui-focused fieldset': {
                borderColor: '#1976d2',
              },
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: '#1976d2',
            },
          }}
        >
          {documentIds.map((docId) => (
            <MenuItem key={docId} value={docId}>
              Document {docId}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};
