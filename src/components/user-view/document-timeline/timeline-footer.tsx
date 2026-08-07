/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/

import React, { type RefObject, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Box, Step, StepLabel } from "@mui/material";
import { AssistantPhoto, DoubleArrow } from "@mui/icons-material";

import type { GQLTimelinePoint } from "../../../types";
import {
  formatISODateToReadable,
  convertDateTimelinePointTime,
  isTimelinePointFullyLoaded,
} from "../../../helpers";
import { useWithDocGoalsActivities } from "../../../store/slices/doc-goals-activities/use-with-doc-goals-activites";
import { useWithUsersDocs } from "../../../hooks/use-with-users-docs";
import { ColorlibConnector, StepperSx } from "./ColorlibConnector";
import {
  Text2Typography,
  Text3,
  Text3NoIndent,
} from "../../../styles/content-revision-styles";
import {
  GlobalStyles,
  TimelineBar,
  TimelineFooterItemCard,
  TimelineItemTest,
  TimelineTestContainer,
} from "../../../styles/timeline-styles";
import { useAppSelector } from "../../../store/hooks";

/* The `TimeLineCard` component is a functional component that takes in a prop `timelinePoint` of type
`GQLTimelinePoint`. Inside the component, it retrieves the `getActivitById` function from the
`useWithDocGoalsActivities` hook. It then uses this function to get the activity associated with the
timeline point's version. */
const TimeLineCard = (props: { timelinePoint: GQLTimelinePoint }) => {
  const { timelinePoint } = props;
  const user = useAppSelector((state) => state.login.user);
  const config = useAppSelector((state) => state.config).config;
  const { getActivityById } = useWithDocGoalsActivities(
    user?._id || "",
    config,
  );
  const { getCurrentDoc } = useWithUsersDocs();
  const { docId } = useParams<Record<string, string>>();

  const activity = getActivityById(timelinePoint.version.activity || "");
  const googleDoc = getCurrentDoc(docId);
  const title = activity?.title || googleDoc?.title || "";

  return (
    <Box>
      <Text2Typography>{title}</Text2Typography>

      <Text3NoIndent style={{ textAlign: "right" }}>
        {convertDateTimelinePointTime(timelinePoint.versionTime) || ""}
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
}): React.ReactNode {
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
        footerTimelineElement.scrollWidth > footerTimelineElement.clientWidth,
      );
    }
  }, [footerTimelineRef]);

  const currentVersionIndex = timelinePoints.length - 1;
  const innerWidth = typeof window === "undefined" ? 0 : window.innerWidth;

  return (
    <TimelineTestContainer
      data-cy="timeline-footer-wrapper"
      ref={footerTimelineRef}
      // eslint-disable-next-line react-hooks/refs
      style={{
        // eslint-disable-next-line react-hooks/refs
        width: footerTimelineRef.current?.scrollWidth || innerWidth,
      }}
    >
      <GlobalStyles />
      <TimelineBar
        alternativeLabel
        connector={<ColorlibConnector />}
        sx={StepperSx}
        // eslint-disable-next-line react-hooks/refs
        style={{
          // eslint-disable-next-line react-hooks/refs
          width: footerTimelineRef.current?.scrollWidth || innerWidth || "100%",
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
                      padding: "1rem",
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
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Text2Typography
                          style={{
                            textAlign: "center",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          {formatISODateToReadable(timelinePoint.versionTime)}
                          {i === 0 ? (
                            <DoubleArrow
                              style={{ marginLeft: 5, fontSize: 18 }}
                            />
                          ) : i === currentVersionIndex ? (
                            <AssistantPhoto
                              style={{ marginLeft: 5, fontSize: 18 }}
                            />
                          ) : null}
                        </Text2Typography>
                        <Text3>
                          {convertDateTimelinePointTime(
                            timelinePoint.versionTime,
                          )}
                        </Text3>
                      </div>
                    ) : (
                      <TimeLineCard timelinePoint={timelinePoints[i]} />
                    )}
                  </TimelineFooterItemCard>
                </motion.div>
              </TimelineItemTest>
              <StepLabel />
            </Step>
          );
        })}
      </TimelineBar>
    </TimelineTestContainer>
  );
}
