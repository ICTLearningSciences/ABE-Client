import React, { useState } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

import { GQLTimelinePoint } from '../../../types';
import { ColumnDiv, RowDiv } from '../../../styled-components';
import { formatISODateToReadable } from '../../../helpers';
import { useWithDocGoalsActivities } from '../../../store/slices/doc-goals-activities/use-with-doc-goals-activites';

/* The `TimeLineCard` component is a functional component that takes in a prop `timelinePoint` of type
`GQLTimelinePoint`. Inside the component, it retrieves the `getActivitById` function from the
`useWithDocGoalsActivities` hook. It then uses this function to get the activity associated with the
timeline point's version. */
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

  /**
   * The handleMouseEnter function sets the hover index based on the provided index parameter.
   * @param {number} index - The `index` parameter in the `handleMouseEnter` function is a number that
   * represents the index of an item or element.
   */
  const handleMouseEnter = (index: number) => {
    setHoverIndex(index);
  };

  /**
   * The `handleMouseLeave` function sets the `hoverIndex` state to `null` when called.
   */
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
              {/* This part of the code is a conditional rendering within the `map` function of the
              `timelinePoints` array. */}
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
