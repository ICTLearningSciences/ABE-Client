import React from 'react';
import { GQLTimelinePoint } from '../../../types';
import { Box, Typography } from '@mui/material';

export default function TimepointDocumentText(props: {
  timelinePoint: GQLTimelinePoint;
}): JSX.Element {
  const { timelinePoint } = props;
  return (
    <Box className="content-revision-container-left">
      <Typography className="revision-time-header text-2">
        {timelinePoint.version.title}
      </Typography>
      <Box className="left-content-container">
        <Typography className="text-3-no-indent" style={{ marginRight: 10 }}>
          {timelinePoint.version.plainText}
        </Typography>
      </Box>
    </Box>
  );
}
