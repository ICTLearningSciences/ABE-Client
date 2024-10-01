import React from 'react';
import { GQLTimelinePoint } from '../../../types';

import { AnimatePresence, motion } from 'framer-motion';
import {
  ContentContainer,
  ContentRevisionContainerLeft,
  RevisionTimeHeaderTypography,
  Text2Styles,
  Text3NoIndent,
} from '../../../styles/content-revision-styles';

export default function TimepointDocumentText(props: {
  timelinePoint: GQLTimelinePoint;
  hasOverflowX: boolean;
}): JSX.Element {
  const { timelinePoint, hasOverflowX } = props;
  return (
    <ContentRevisionContainerLeft hasOverflowX={hasOverflowX}>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
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
          transition={{ duration: 0.3, ease: 'easeInOut' }}
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
                  wordBreak: 'break-word',
                  whiteSpace: 'pre-wrap',
                  fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
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
