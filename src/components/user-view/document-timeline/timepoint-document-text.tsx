import React from 'react';
import { GQLTimelinePoint } from '../../../types';
import { Box, Typography } from '@mui/material';

export default function TimepointDocumentText(props: {
  timelinePoint: GQLTimelinePoint;
}): JSX.Element {
  const { timelinePoint } = props;
  return (
    <Box className="content-revision-container">
      <Typography className="text-2">{timelinePoint.version.title}</Typography>
      <Typography className="text-3-no-indent">
        {timelinePoint.version.plainText}
      </Typography>
    </Box>
  );
}
