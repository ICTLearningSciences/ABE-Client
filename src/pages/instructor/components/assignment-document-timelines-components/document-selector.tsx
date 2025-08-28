/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from 'react';
import { FormControl, Select, MenuItem, Box, Typography } from '@mui/material';
import { RelevantGoogleDoc } from '../../../../store/slices/education-management/types';

interface DocumentSelectorProps {
  docData: RelevantGoogleDoc[];
  selectedDocId: string;
  onDocumentChange: (docId: string) => void;
}

export const DocumentSelector: React.FC<DocumentSelectorProps> = ({
  docData,
  selectedDocId,
  onDocumentChange,
}) => {
  if (docData.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        mt: 1,
        display: 'flex',
        flexDirection: 'row',
        textAlign: 'center',
        alignItems: 'center',
        height: 'fit-content',
      }}
    >
      <Typography
        style={{
          fontWeight: 600,
          color: '#1976d2',
          textAlign: 'center',
          height: 'fit-content',
        }}
      >
        Document:
      </Typography>
      <FormControl
        sx={{ minWidth: 300, padding: 0, height: 'fit-content' }}
        style={{
          padding: 0,
        }}
      >
        <Select
          data-cy="document-select"
          labelId="document-select-label"
          value={selectedDocId || ''}
          onChange={(e) => onDocumentChange(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              '&.Mui-focused fieldset': {
                borderColor: '#1976d2',
              },
            },
            '& .MuiSelect-select': {
              padding: 0,
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: '#1976d2',
            },
            padding: 0,
          }}
        >
          {docData.map((doc) => (
            <MenuItem key={doc.docId} value={doc.docId}>
              {doc.primaryDocument ? (
                <span style={{ fontWeight: 600 }}>Main Document: </span>
              ) : null}{' '}
              <span> </span> {doc.docData.title || 'Untitled'}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};
