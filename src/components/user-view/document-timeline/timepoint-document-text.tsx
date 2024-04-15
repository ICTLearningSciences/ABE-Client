import React from 'react';
import { Box, Typography } from '@mui/material';
import { GQLTimelinePoint } from '../../../types';

import '../../../styles/content-revision.css';

export default function TimepointDocumentText(props: {
  timelinePoint: GQLTimelinePoint;
  hasOverflowX: boolean;
}): JSX.Element {
  const { timelinePoint, hasOverflowX } = props;
  return (
    <Box
      className={
        !hasOverflowX
          ? 'content-revision-container-left-scroll'
          : 'content-revision-container-left'
      }
    >
      <Typography className="revision-time-header text-2">
        {timelinePoint.version.title}
      </Typography>
      <Box className="left-content-container" data-cy="left-content-container">
        <Typography className="text-3-no-indent" style={{ marginRight: 10 }}>
          {timelinePoint.version.plainText}
        </Typography>
      </Box>
    </Box>
  );
}
