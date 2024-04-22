import React, { RefObject, useEffect, useState } from 'react';
import { Box, Paper, styled, Typography } from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { useParams } from 'react-router-dom';

import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

import { GQLTimelinePoint, TimelinePointType } from '../../../types';
import { ColumnDiv } from '../../../styled-components';
import {
  convertDateTimelinePointDate,
  formatISODateToReadable,
  convertDateTimelinePointTime,
} from '../../../helpers';
import { useWithDocGoalsActivities } from '../../../store/slices/doc-goals-activities/use-with-doc-goals-activites';
import { UseWithGoogleDocs } from '../../../hooks/use-with-google-docs';

import '../../../styles/timeline.css';

import StepConnector, {
  stepConnectorClasses,
} from '@mui/material/StepConnector';
import { StepIconProps } from '@mui/material/StepIcon';
import { motion } from 'framer-motion';

const ColorlibConnector = styled(StepConnector)(() => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 10,
    border: 0,
    backgroundColor: '#fff',
    boxShadow: '0px 2px 15px 0px rgba(90, 82, 128, 0.2)',
    borderRadius: 5,
  },
}));

const QontoStepIconRoot = styled('div')<{ ownerState: { active?: boolean } }>(
  ({ theme, ownerState }) => ({
    color: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#eaeaf0',
    display: 'flex',
    height: 22,
    alignItems: 'center',
    ...(ownerState.active && {
      color: '#1b6a9c',
    }),
    '& .QontoStepIcon-completedIcon': {
      color: '#784af4',
      zIndex: 1,
      fontSize: 18,
    },
    '& .QontoStepIcon-circle': {
      width: 8,
      height: 8,
      borderRadius: '50%',
      backgroundColor: 'currentColor',
    },
  })
);

const StepperSx = {
  '& .MuiStepConnector-root': {
    left: 'calc(-50% + 40px)',
    right: 'calc(50% + 40px)',
  },
  '& .MuiStepConnector-line': {
    marginTop: '22px', // To position the line lower
  },
};

function QontoStepIcon(props: StepIconProps) {
  const { active, className } = props;

  const first = (
    <div className={`custom-timeline-dot ${className}`}>
      <Typography className="text-3-bold">Started</Typography>
    </div>
  );
  const last = (
    <div className="custom-timeline-dot">
      <Typography className="text-3-bold">last</Typography>
    </div>
  );

  const icons: { [index: string]: React.ReactElement } = {
    1: first,
    2: last,
  };

  return (
    <QontoStepIconRoot
      ownerState={{ active }}
      className={className}
      style={{ marginTop: 8 }}
    >
      {props.icon === 1 ? first : <FiberManualRecordIcon />}
    </QontoStepIconRoot>
  );
}
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
        {activity.title ? activity.title : title}
      </Typography>

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
          return (
            <Step key={i} active={isSelected}>
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
                    style={{ padding: '1rem' }}
                    className={
                      hoverIndex !== i
                        ? 'timeline-footer-item-card'
                        : 'timeline-footer-item-card-hover'
                    }
                    onMouseEnter={() => handleMouseEnter(i)}
                    onMouseLeave={handleMouseLeave}
                  >
                    {hoverIndex !== i ? (
                      <div className="timeline-footer-item-card-inner">
                        <Typography
                          className="text-2"
                          style={{ textAlign: 'center' }}
                        >
                          {formatISODateToReadable(timelinePoint.versionTime) ||
                            ''}
                        </Typography>
                        <Typography className="text-3">
                          {convertDateTimelinePointTime(
                            timelinePoint.versionTime
                          ) || ''}
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
