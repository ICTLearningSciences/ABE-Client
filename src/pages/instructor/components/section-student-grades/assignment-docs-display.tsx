import React from 'react';
import { AccordionDetails, Box, Chip, Typography } from '@mui/material';
import { RelevantGoogleDoc } from '../../../../store/slices/education-management/types';

export function AssignmentDocsDisplay(props: {
  assignmentDocs: RelevantGoogleDoc[];
}) {
  const { assignmentDocs } = props;

  function getDocLabel(doc: RelevantGoogleDoc): React.ReactNode {
    return (
      <span>
        <span style={{ fontWeight: doc.primaryDocument ? 600 : 400 }}>
          {doc.primaryDocument ? 'Main Document: ' : ''}
        </span>
        <span> </span>
        {doc.docData.title || 'Untitled'}
      </span>
    );
  }

  return (
    <AccordionDetails>
      <Box sx={{ pl: 2 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            mb: 2,
            color: 'primary.main',
            fontSize: '1.1rem',
          }}
        >
          Assignment Google Documents
        </Typography>
        {/* subheader: show the number of documents */}
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 400,
            mb: 2,
            color: 'text.secondary',
            fontSize: '0.9rem',
          }}
        >
          Selecting a google doc will open the document in a new tab.
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1,
            flexDirection: 'column',
            width: ' fit-content',
          }}
        >
          {assignmentDocs.length > 0 ? (
            assignmentDocs.map((doc) => (
              <Chip
                key={doc.docId}
                label={getDocLabel(doc)}
                variant="outlined"
                onClick={() => {
                  window.open(
                    `https://docs.google.com/document/d/${doc.docId}/edit`,
                    '_blank'
                  );
                }}
                color={doc.primaryDocument ? 'primary' : 'default'}
                sx={{
                  opacity: doc.primaryDocument ? 1 : 0.5,
                  fontWeight: doc.primaryDocument ? 600 : 400,
                  borderWidth: doc.primaryDocument ? 2 : 1,
                  '&:hover': {
                    opacity: 1,
                  },
                }}
              />
            ))
          ) : (
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 400,
                mb: 2,
                color: 'text.secondary',
                fontSize: '0.9rem',
              }}
            >
              No documents found
            </Typography>
          )}
        </Box>
      </Box>
    </AccordionDetails>
  );
}
