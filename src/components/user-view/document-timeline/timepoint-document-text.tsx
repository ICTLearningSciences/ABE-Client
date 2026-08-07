/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { GQLTimelinePoint } from "../../../types";
import {
  ContentContainer,
  ContentRevisionContainerLeft,
  RevisionTimeHeaderTypography,
  Text2Styles,
  Text3NoIndent,
} from "../../../styles/content-revision-styles";

export default function TimepointDocumentText(props: {
  timelinePoint: GQLTimelinePoint;
  hasOverflowX: boolean;
}): React.ReactNode {
  const { timelinePoint, hasOverflowX } = props;
  return (
    <ContentRevisionContainerLeft hasOverflowX={hasOverflowX}>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <RevisionTimeHeaderTypography
            style={{
              ...Text2Styles,
            }}
          >
            {timelinePoint.version.title}
          </RevisionTimeHeaderTypography>
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <ContentContainer
            data-cy="left-content-container"
            hasOverflowX={hasOverflowX}
            sx={{
              marginRight: 10,
            }}
          >
            <Text3NoIndent
              style={{
                marginRight: 10,
              }}
            >
              <pre
                style={{
                  wordBreak: "break-word",
                  whiteSpace: "pre-wrap",
                  fontFamily: "Roboto, Helvetica, Arial, sans-serif",
                }}
              >
                {timelinePoint.version.plainText}
              </pre>
            </Text3NoIndent>
          </ContentContainer>
        </motion.div>
      </AnimatePresence>
    </ContentRevisionContainerLeft>
  );
}
