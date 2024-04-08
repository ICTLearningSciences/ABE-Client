import React from 'react';
import { formatISODateToReadable } from '../../../helpers';
import { GQLTimelinePoint, TimelinePointType } from '../../../types';
import { Box, Paper, Typography } from '@mui/material';

export default function TimepointOutline(props: {
  timelinePoint: GQLTimelinePoint;
}): JSX.Element {
  const { timelinePoint } = props;

  function RevisionTimeHeader(props: { revisionTime: string }): JSX.Element {
    const { revisionTime } = props;
    return (
      <Box>
        <Typography className={`text-2`}>Last Revision</Typography>
        <Typography className={`text-3`}>
          {formatISODateToReadable(revisionTime)}
        </Typography>
      </Box>
    );
  }

  function IntentionDisplay(props: { intention: string }): JSX.Element {
    const { intention } = props;
    return (
      <Box>
        <Typography className={`text-2`}>Intention</Typography>
        {intention ? (
          <Typography className={`text-3`}>{intention}</Typography>
        ) : (
          <Typography className={`text-3-disable`}>
            {'No intention provided'}
          </Typography>
        )}
      </Box>
    );
  }

  function SummaryDisplay(props: {
    timelinePoint: GQLTimelinePoint;
  }): JSX.Element {
    const { timelinePoint } = props;
    return (
      <Box>
        {timelinePoint.type !== TimelinePointType.START ? (
          <span>
            <Typography className="text-2"> Summary </Typography>
            <Typography className="text-3">
              {timelinePoint.changeSummary}
            </Typography>
          </span>
        ) : undefined}
      </Box>
    );
  }

  function AIOutlineDisplay(props: { reverseOutline: string }): JSX.Element {
    const { reverseOutline } = props;
    const outline = JSON.parse(reverseOutline);
    console.log(outline);

    return (
      <Paper className={`paper-style ai-outline-container`}>
        <Typography className="text-2">AI Outline</Typography>
        <div>
          <Typography className="text-2">Thesis Statement</Typography>
          <Typography className="text-3">
            {outline['Thesis Statement']}
          </Typography>
        </div>

        <div>
          <Typography className="text-2">Supporting Claims</Typography>
          <Typography className="text-3">
            {outline['Supporting Claims']}
          </Typography>
        </div>

        <pre
          style={{
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word',
          }}
        >
          {reverseOutline}
        </pre>
      </Paper>
    );
  }

  return (
    <Paper className="content-revision-container">
      <RevisionTimeHeader revisionTime={timelinePoint.versionTime} />
      <IntentionDisplay intention={timelinePoint.intent} />
      <SummaryDisplay timelinePoint={timelinePoint} />
      <AIOutlineDisplay reverseOutline={timelinePoint.reverseOutline} />
    </Paper>
  );
}
