/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from 'react';
import {
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import { ReverseOutline } from '../../../../types';

interface AiOutlineTabProps {
  reverseOutline: string;
}

export const AiOutlineTab: React.FC<AiOutlineTabProps> = ({
  reverseOutline,
}) => {
  if (!reverseOutline) {
    return (
      <Typography color="text.secondary" sx={{ fontStyle: 'italic' }}>
        No AI outline available
      </Typography>
    );
  }

  let parsedReverseOutline: ReverseOutline;
  try {
    parsedReverseOutline = JSON.parse(reverseOutline);
  } catch (error) {
    return (
      <Typography color="error" sx={{ fontStyle: 'italic' }}>
        Error parsing AI outline data
      </Typography>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      {/* Thesis Statement Section */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 'bold', mb: 1, color: 'primary.main' }}
        >
          Thesis Statement
        </Typography>
        <Typography
          variant="body1"
          sx={{
            backgroundColor: 'grey.50',
            p: 2,
            borderRadius: 1,
            borderLeft: '4px solid',
            borderColor: 'primary.main',
          }}
        >
          {parsedReverseOutline['Thesis Statement']}
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Supporting Claims Section */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main' }}
        >
          Supporting Claims
        </Typography>
        <List sx={{ pl: 0 }}>
          {parsedReverseOutline['Supporting Claims'].map((claim, index) => (
            <ListItem
              key={index}
              sx={{
                backgroundColor: 'grey.50',
                mb: 1,
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'grey.300',
              }}
            >
              <ListItemText
                primary={
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {claim}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Evidence Given for Each Claim Section */}
      <Box>
        <Typography
          variant="h6"
          sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main' }}
        >
          Evidence Given for Each Claim
        </Typography>
        {parsedReverseOutline['Evidence Given for Each Claim'].map(
          (evidenceGroup, groupIndex) => (
            <Box
              key={groupIndex}
              sx={{ mb: 3, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}
            >
              {Object.entries(evidenceGroup).map(([key, value], claimIndex) => {
                // Skip evidence arrays, we'll handle them with their corresponding claims
                if (key.includes('Evidence')) return null;

                const evidenceKey = `${key} Evidence`;
                const evidence = evidenceGroup[evidenceKey] || [];

                return (
                  <Box
                    key={claimIndex}
                    sx={{
                      mb:
                        claimIndex < Object.keys(evidenceGroup).length / 2 - 1
                          ? 2
                          : 0,
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 'bold',
                        mb: 1,
                        color: 'secondary.main',
                      }}
                    >
                      {key}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ mb: 1, fontStyle: 'italic' }}
                    >
                      {typeof value === 'string' ? value : ''}
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 'bold',
                        mb: 1,
                        color: 'text.secondary',
                      }}
                    >
                      Evidence:
                    </Typography>
                    <List dense sx={{ pl: 2 }}>
                      {evidence.map(
                        (evidenceItem: string, evidenceIndex: number) => (
                          <ListItem key={evidenceIndex} sx={{ py: 0.5 }}>
                            <ListItemText
                              primary={
                                <Typography variant="body2">
                                  • {evidenceItem}
                                </Typography>
                              }
                            />
                          </ListItem>
                        )
                      )}
                    </List>
                    {claimIndex < Object.keys(evidenceGroup).length / 2 - 1 && (
                      <Divider sx={{ my: 2 }} />
                    )}
                  </Box>
                );
              })}
            </Box>
          )
        )}
      </Box>
    </Box>
  );
};
