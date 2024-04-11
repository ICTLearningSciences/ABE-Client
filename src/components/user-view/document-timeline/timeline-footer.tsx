import React, { useState } from 'react';
import { GQLTimelinePoint } from '../../../types';
import { ColumnDiv, RowDiv } from '../../../styled-components';
import { formatISODateToReadable } from '../../../helpers';
import { Box, Paper, Typography } from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { useWithDocGoalsActivities } from '../../../store/slices/doc-goals-activities/use-with-doc-goals-activites';

const TimeLineCard = (props: { timelinePoint: GQLTimelinePoint }) => {
  const { timelinePoint } = props;
  const { getActivitById } = useWithDocGoalsActivities();

  const activity = getActivitById(timelinePoint.version.activity || '');

  return (
    <Box
      style={{ padding: '1rem' }}
      className="timeline-footer-item-card-hover"
    >
      <Typography className="text-2">{activity.title}</Typography>
      <Typography className="text-3-no-indent">
        {activity.description}
      </Typography>
      <Typography className="text-3-no-indent" style={{ textAlign: 'right' }}>
        {formatISODateToReadable(timelinePoint.versionTime || '')}
      </Typography>
    </Box>
  );
};

export default function TimelineFooter(props: {
  timelinePoints: GQLTimelinePoint[];
  onSelectTimepoint: (timepoint: GQLTimelinePoint) => void;
  currentTimelinePoint?: GQLTimelinePoint;
}): JSX.Element {
  const { timelinePoints, currentTimelinePoint } = props;
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const handleMouseEnter = (index: number) => {
    setHoverIndex(index);
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
  };

  return (
    <RowDiv className="timeline-footer-wrapper">
      {timelinePoints.map((timelinePoint, i) => {
        const isSelected =
          currentTimelinePoint?.versionTime === timelinePoint.versionTime;
        return (
          <ColumnDiv
            key={i}
            className={
              hoverIndex !== i
                ? 'timeline-footer-item'
                : 'timeline-footer-item-hover'
            }
          >
            <Paper
              onClick={() => props.onSelectTimepoint(timelinePoint)}
              elevation={1}
              style={{ padding: '1rem' }}
              className="timeline-footer-item-card"
              onMouseEnter={() => handleMouseEnter(i)}
              onMouseLeave={handleMouseLeave}
            >
              {hoverIndex !== i ? (
                <Typography className="text-2">
                  {formatISODateToReadable(timelinePoint.versionTime || '')}
                </Typography>
              ) : (
                <TimeLineCard timelinePoint={timelinePoint} />
              )}
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
