import React, { RefObject, useEffect, useState } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import AssistantPhotoIcon from '@mui/icons-material/AssistantPhoto';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';

import { motion } from 'framer-motion';

import { GQLTimelinePoint } from '../../../types';
import { ColumnDiv } from '../../../styled-components';
import {
  formatISODateToReadable,
  convertDateTimelinePointTime,
  isTimelinePointFullyLoaded,
} from '../../../helpers';
import { useWithDocGoalsActivities } from '../../../store/slices/doc-goals-activities/use-with-doc-goals-activites';
import { useWithGoogleDocs } from '../../../hooks/use-with-google-docs';
import '../../../styles/timeline.css';
import {
  ColorlibConnector,
  QontoStepIcon,
  StepperSx,
} from './ColorlibConnector';

/* The `TimeLineCard` component is a functional component that takes in a prop `timelinePoint` of type
`GQLTimelinePoint`. Inside the component, it retrieves the `getActivitById` function from the
`useWithDocGoalsActivities` hook. It then uses this function to get the activity associated with the
timeline point's version. */
const TimeLineCard = (props: { timelinePoint: GQLTimelinePoint }) => {
  const { timelinePoint } = props;
  const { getActivitById } = useWithDocGoalsActivities();
  const { getCurrentGoogleDoc } = useWithGoogleDocs();
  const { docId } = useParams<Record<string, string>>();

  const activity = getActivitById(timelinePoint.version.activity || '');
  const googleDoc = getCurrentGoogleDoc(docId);
  const title = activity?.title || googleDoc?.title || '';

  return (
    <Box>
      <Typography className="text-2">{title}</Typography>

      <Typography className="text-3-no-indent" style={{ textAlign: 'right' }}>
        {convertDateTimelinePointTime(timelinePoint.versionTime) || ''}
      </Typography>
    </Box>
  );
};

export default function TimelineFooter(props: {
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

  const currentVersionIndex = timelinePoints.length - 1;

  return (
    <Box
      className="timeline-test-container"
      data-cy="timeline-footer-wrapper"
      ref={footerTimelineRef}
      style={{
        width: footerTimelineRef.current?.scrollWidth || window.innerWidth,
      }}
    >
      <Stepper
        alternativeLabel
        connector={<ColorlibConnector />}
        sx={StepperSx}
        className="timeline-bar"
        style={{
          width:
            footerTimelineRef.current?.scrollWidth ||
            window.innerWidth ||
            '100%',
        }}
      >
        {timelinePoints.map((timelinePoint, i) => {
          const isSelected =
            currentTimelinePoint?.versionTime === timelinePoint.versionTime;
          const isFullyLoaded = isTimelinePointFullyLoaded(timelinePoint);
          return (
            <Step
              key={i}
              active={isSelected}
              onClick={() => props.onSelectTimepoint(timelinePoint)}
              data-cy={`timeline-footer-item-${i}`}
              // style={i === 0 || i === currentVersionIndex ? { bottom: 25 } : {}}
            >
              <ColumnDiv key={i} className="timeline-item-test">
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  key={i}
                >
                  <Paper
                    onClick={() => props.onSelectTimepoint(timelinePoint)}
                    elevation={1}
                    style={{
                      padding: '1rem',
                      opacity: isFullyLoaded ? 1 : 0.5,
                    }}
                    className={
                      hoverIndex !== i
                        ? 'timeline-footer-item-card'
                        : 'timeline-footer-item-card-hover'
                    }
                    data-cy={`timeline-footer-item-card-${i}`}
                    onMouseEnter={() => handleMouseEnter(i)}
                    onMouseLeave={handleMouseLeave}
                  >
                    {hoverIndex !== i ? (
                      <div className="timeline-footer-item-card-inner">
                        <Typography
                          className="text-2"
                          style={{
                            textAlign: 'center',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          {formatISODateToReadable(timelinePoint.versionTime)}
                          {i === 0 ? (
                            <DoubleArrowIcon
                              style={{ marginLeft: 5, fontSize: 18 }}
                            />
                          ) : i === currentVersionIndex ? (
                            <AssistantPhotoIcon
                              style={{ marginLeft: 5, fontSize: 18 }}
                            />
                          ) : null}
                        </Typography>
                        <Typography className="text-3">
                          {convertDateTimelinePointTime(
                            timelinePoint.versionTime
                          )}
                        </Typography>
                      </div>
                    ) : (
                      <TimeLineCard timelinePoint={timelinePoints[i]} />
                    )}
                  </Paper>
                </motion.div>
              </ColumnDiv>
              <StepLabel StepIconComponent={QontoStepIcon} />
            </Step>
          );
        })}
      </Stepper>
    </Box>
  );
}
