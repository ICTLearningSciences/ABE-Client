import React, { RefObject, useEffect, useState } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { useParams } from 'react-router-dom';

import { GQLTimelinePoint, TimelinePointType } from '../../../types';
import { ColumnDiv } from '../../../styled-components';
import { formatISODateToReadable } from '../../../helpers';
import { useWithDocGoalsActivities } from '../../../store/slices/doc-goals-activities/use-with-doc-goals-activites';
import { UseWithGoogleDocs } from '../../../hooks/use-with-google-docs';

import '../../../styles/timeline.css';

/* The `TimeLineCard` component is a functional component that takes in a prop `timelinePoint` of type
`GQLTimelinePoint`. Inside the component, it retrieves the `getActivitById` function from the
`useWithDocGoalsActivities` hook. It then uses this function to get the activity associated with the
timeline point's version. */
const TimeLineCard = (props: { timelinePoint: GQLTimelinePoint }) => {
  const { timelinePoint } = props;
  const { getActivitById } = useWithDocGoalsActivities();
  const { getCurrentGoogleDoc } = UseWithGoogleDocs();
  const { docId } = useParams<Record<string, string>>();

  const activity = getActivitById(timelinePoint.version.activity || '');
  const googleDoc = getCurrentGoogleDoc(docId);
  const title = activity?.title || googleDoc?.title;

  return (
    <Box>
      <Typography className="text-2">
        {/* Conditional rendering that determines the text content to display
        in the `Typography` component based on the `timelinePoint.type` and the availability of
        `activity.title` and `googleDoc?.title`. */}
        {timelinePoint.type === TimelinePointType.NEW_ACTIVITY
          ? `${googleDoc?.title}`
          : activity.title
          ? activity.title
          : title}
      </Typography>

      <Typography className="text-3-no-indent" style={{ textAlign: 'right' }}>
        {formatISODateToReadable(timelinePoint.versionTime || '')}
      </Typography>
    </Box>
  );
};

export default function TimelineFooter2(props: {
  timelinePoints: GQLTimelinePoint[];
  onSelectTimepoint: (timepoint: GQLTimelinePoint) => void;
  footerTimelineRef: RefObject<HTMLElement>;
  setHasOverflowX: (hasOverflow: boolean) => void;
  currentTimelinePoint?: GQLTimelinePoint;
}): JSX.Element {
  const {
    timelinePoints,
    currentTimelinePoint,
    footerTimelineRef,
    setHasOverflowX,
  } = props;
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

  /* The `useEffect` hook in the provided code snippet is responsible for checking if the
 `footerTimelineRef` element has been rendered in the DOM. If the `footerTimelineRef` element
 exists, it calculates whether the content inside the element overflows horizontally. */
  useEffect(() => {
    if (footerTimelineRef.current === null) return;
    const footerTimelineElement = footerTimelineRef?.current;
    if (footerTimelineElement) {
      setHasOverflowX(
        footerTimelineElement.scrollWidth > footerTimelineElement.clientWidth
      );
    }
  }, [footerTimelineRef]);

  return (
    <Box
      className="timeline-test-container"
      data-cy="timeline-footer-wrapper"
      ref={footerTimelineRef}
      style={{
        width:
          footerTimelineRef.current?.scrollWidth ||
          footerTimelineRef.current?.clientWidth,
      }}
    >
      <div
        className="timeline-bar"
        style={{
          width:
            footerTimelineRef.current?.scrollWidth ||
            footerTimelineRef.current?.clientWidth,
        }}
      >
        {timelinePoints.map((timelinePoint, i) => {
          const isSelected =
            currentTimelinePoint?.versionTime === timelinePoint.versionTime;
          return (
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
          );
        })}
      </div>

      {timelinePoints.map((timelinePoint, i) => {
        return (
          <ColumnDiv key={i} className="timeline-item-test">
            <Paper
              onClick={() => props.onSelectTimepoint(timelinePoint)}
              elevation={1}
              style={{ padding: '1rem' }}
              className={
                hoverIndex !== i
                  ? 'timeline-footer-item-card'
                  : 'timeline-footer-item-card-hover'
              }
              onMouseEnter={() => handleMouseEnter(i)}
              onMouseLeave={handleMouseLeave}
            >
              {/* This part of the code is a conditional rendering within the `map` function of the
              `timelinePoints` array. */}
              {hoverIndex !== i ? (
                <Typography className="text-2" style={{ textAlign: 'center' }}>
                  {formatISODateToReadable(timelinePoint.versionTime || '')}
                </Typography>
              ) : (
                <TimeLineCard timelinePoint={timelinePoints[i]} />
              )}
            </Paper>
          </ColumnDiv>
        );
      })}
    </Box>
  );
}
