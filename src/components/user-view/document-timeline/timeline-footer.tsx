import React, { RefObject, useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { useParams } from 'react-router-dom';

import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import AssistantPhotoIcon from '@mui/icons-material/AssistantPhoto';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';

import { motion } from 'framer-motion';

import { GQLTimelinePoint } from '../../../types';
import {
  formatISODateToReadable,
  convertDateTimelinePointTime,
  isTimelinePointFullyLoaded,
} from '../../../helpers';
import { useWithDocGoalsActivities } from '../../../store/slices/doc-goals-activities/use-with-doc-goals-activites';
import { useWithUsersDocs } from '../../../hooks/use-with-users-docs';
import {
  ColorlibConnector,
  QontoStepIcon,
  StepperSx,
} from './ColorlibConnector';
import {
  Text2Typography,
  Text3,
  Text3NoIndent,
} from '../../../styles/content-revision-styles';
import {
  GlobalStyles,
  TimelineBar,
  TimelineFooterItemCard,
  TimelineItemTest,
  TimelineTestContainer,
} from '../../../styles/timeline-styles';

/* The `TimeLineCard` component is a functional component that takes in a prop `timelinePoint` of type
`GQLTimelinePoint`. Inside the component, it retrieves the `getActivitById` function from the
`useWithDocGoalsActivities` hook. It then uses this function to get the activity associated with the
timeline point's version. */
const TimeLineCard = (props: { timelinePoint: GQLTimelinePoint }) => {
  const { timelinePoint } = props;
  const { getActivitById } = useWithDocGoalsActivities();
  const { getCurrentDoc } = useWithUsersDocs();
  const { docId } = useParams<Record<string, string>>();

  const activity = getActivitById(timelinePoint.version.activity || '');
  const googleDoc = getCurrentDoc(docId);
  const title = activity?.title || googleDoc?.title || '';

  return (
    <Box>
      <Text2Typography>{title}</Text2Typography>

      <Text3NoIndent style={{ textAlign: 'right' }}>
        {convertDateTimelinePointTime(timelinePoint.versionTime) || ''}
      </Text3NoIndent>
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
    <TimelineTestContainer
      data-cy="timeline-footer-wrapper"
      ref={footerTimelineRef}
      style={{
        width: footerTimelineRef.current?.scrollWidth || window.innerWidth,
      }}
    >
      <GlobalStyles />
      <TimelineBar
        alternativeLabel
        connector={<ColorlibConnector />}
        sx={StepperSx}
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
              <TimelineItemTest key={i}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  key={i}
                >
                  <TimelineFooterItemCard
                    onClick={() => props.onSelectTimepoint(timelinePoint)}
                    elevation={1}
                    style={{
                      padding: '1rem',
                      opacity: isFullyLoaded ? 1 : 0.5,
                    }}
                    hovered={hoverIndex === i}
                    data-cy={`timeline-footer-item-card-${i}`}
                    onMouseEnter={() => handleMouseEnter(i)}
                    onMouseLeave={handleMouseLeave}
                  >
                    {hoverIndex !== i ? (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <Text2Typography
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
                        </Text2Typography>
                        <Text3>
                          {convertDateTimelinePointTime(
                            timelinePoint.versionTime
                          )}
                        </Text3>
                      </div>
                    ) : (
                      <TimeLineCard timelinePoint={timelinePoints[i]} />
                    )}
                  </TimelineFooterItemCard>
                </motion.div>
              </TimelineItemTest>
              <StepLabel StepIconComponent={QontoStepIcon} />
            </Step>
          );
        })}
      </TimelineBar>
    </TimelineTestContainer>
  );
}
