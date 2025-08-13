import React from 'react';
import { Box, Typography } from '@mui/material';
import { CheckCircle, RadioButtonUnchecked } from '@mui/icons-material';

export function AssignmentCompleteStatus({
  isAssignmentComplete,
}: {
  isAssignmentComplete: boolean;
}) {
  return (
    <Box
      sx={{
        ml: 'auto',
        display: 'flex',
        alignItems: 'center',
        gap: 1,
      }}
    >
      {isAssignmentComplete ? (
        <>
          <CheckCircle
            sx={{
              color: 'green',
              fontSize: '28px',
            }}
          />
          <Typography
            variant="body2"
            sx={{
              color: 'green',
              fontWeight: 500,
            }}
          >
            All Activities Complete
          </Typography>
        </>
      ) : (
        <>
          <RadioButtonUnchecked
            sx={{
              color: 'grey.400',
              fontSize: '28px',
            }}
          />
          <Typography
            variant="body2"
            sx={{
              color: 'grey.400',
              fontWeight: 500,
            }}
          >
            Complete All Activities
          </Typography>
        </>
      )}
    </Box>
  );
}
