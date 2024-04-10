import React from 'react';
import { GQLTimelinePoint } from '../../../types';
import { ColumnDiv, RowDiv } from '../../../styled-components';
import { formatISODateToReadable } from '../../../helpers';
import { Box, Paper, Typography } from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

export default function TimelineFooter(props: {
  timelinePoints: GQLTimelinePoint[];
  onSelectTimepoint: (timepoint: GQLTimelinePoint) => void;
  currentTimelinePoint?: GQLTimelinePoint;
}): JSX.Element {
  console.log('TimelineFooter', props);
  const { timelinePoints, currentTimelinePoint } = props;
  return (
    <RowDiv className="timeline-footer-wrapper">
      {/* <Chrono cardLess={true} disableToolbar={true}  /> */}
      {timelinePoints.map((timelinePoint, i) => {
        const isSelected =
          currentTimelinePoint?.versionTime === timelinePoint.versionTime;
        return (
          <ColumnDiv key={i} className="timeline-footer-item">
            <Paper
              onClick={() => props.onSelectTimepoint(timelinePoint)}
              elevation={1}
              style={{ padding: '1rem' }}
              className="timeline-footer-item-card"
            >
              <Typography className="text-2">
                {formatISODateToReadable(timelinePoint.versionTime || '')}
              </Typography>
            </Paper>

            <Box key={i}>
              <FiberManualRecordIcon
                onClick={() => props.onSelectTimepoint(timelinePoint)}
                style={{
                  cursor: isSelected ? 'default' : 'pointer',
                  border: isSelected
                    ? '4px solid lightblue'
                    : '4px solid white',
                  borderRadius: '50%',
                  fontSize: '1.5rem',
                }}
              />
            </Box>
          </ColumnDiv>
        );
      })}
    </RowDiv>
  );
}
