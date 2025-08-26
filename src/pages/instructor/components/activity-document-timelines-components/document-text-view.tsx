/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React, { useState } from 'react';
import { Box, Typography, Paper, Divider, Button } from '@mui/material';
import { DehydratedGQLTimelinePoint } from '../../../../types';
import { TextDiffResult } from '../activity-document-timelines';
import { RowDiv } from '../../../../styled-components';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

interface DocumentTextViewProps {
  timelinePoint: DehydratedGQLTimelinePoint | null;
  diffContent?: TextDiffResult;
}

const getWordCount = (text: string | undefined): number => {
  if (!text) return 0;
  return text.split(' ').filter((word) => word.trim().length > 0).length;
};

export const DocumentTextView: React.FC<DocumentTextViewProps> = ({
  timelinePoint,
  diffContent,
}) => {
  const [viewChanges, setViewChanges] = useState(false);
  const currentText =
    timelinePoint?.version?.markdownText ||
    timelinePoint?.version?.plainText ||
    '';
  if (!timelinePoint) {
    return (
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography color="text.secondary">
          No timeline point selected
        </Typography>
      </Box>
    );
  }

  const wordCount = getWordCount(timelinePoint.version?.plainText);

  return (
    <Paper
      sx={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto',
        height: '100%',
      }}
    >
      <Box
        sx={{
          flex: 1,
          p: 2,
        }}
      >
        <RowDiv
          style={{
            justifyContent: 'space-between',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {wordCount} words
          </Typography>
          <Button onClick={() => setViewChanges(!viewChanges)}>
            {viewChanges ? <VisibilityOffIcon /> : <VisibilityIcon />}{' '}
            {viewChanges ? 'View Original' : 'View Changes'}
          </Button>
        </RowDiv>

        <Divider sx={{ mb: 2 }} />

        <Box
          sx={{
            '& h1, & h2, & h3, & h4, & h5, & h6': {
              mt: 2,
              mb: 1,
              fontWeight: 600,
            },
            '& p': {
              mb: 1,
              lineHeight: 1.6,
            },
            '& ul, & ol': {
              pl: 2,
              mb: 1,
            },
            '& li': {
              mb: 0.5,
            },
            '& blockquote': {
              pl: 2,
              borderLeft: '4px solid',
              borderColor: 'primary.main',
              bgcolor: 'grey.50',
              py: 1,
              mb: 1,
            },
            '& code': {
              bgcolor: 'grey.100',
              px: 1,
              borderRadius: 1,
              fontFamily: 'monospace',
            },
            '& pre': {
              bgcolor: 'grey.100',
              p: 1,
              borderRadius: 1,
              overflow: 'auto',
              mb: 1,
            },
          }}
        >
          {(() => {
            if (!currentText) {
              return (
                <Typography color="text.secondary" sx={{ fontStyle: 'italic' }}>
                  No document content available
                </Typography>
              );
            }

            if (viewChanges && diffContent) {
              return (
                <Typography
                  component="pre"
                  sx={{
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'inherit',
                    fontSize: 'inherit',
                    m: 0,
                    '& span': { fontSize: 'inherit', fontFamily: 'inherit' },
                  }}
                >
                  {diffContent.diffContent}
                </Typography>
              );
            }
            return (
              <Typography
                component="pre"
                sx={{
                  whiteSpace: 'pre-wrap',
                  fontFamily: 'inherit',
                  fontSize: 'inherit',
                  m: 0,
                }}
              >
                {currentText}
              </Typography>
            );
          })()}
        </Box>
      </Box>
    </Paper>
  );
};
