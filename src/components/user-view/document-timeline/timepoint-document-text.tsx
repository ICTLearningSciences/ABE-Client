import React from 'react';
import { Box, Typography } from '@mui/material';
import { GQLTimelinePoint } from '../../../types';

import '../../../styles/content-revision.css';
import { AnimatePresence, motion } from 'framer-motion';

export default function TimepointDocumentText(props: {
  timelinePoint: GQLTimelinePoint;
  hasOverflowX: boolean;
}): JSX.Element {
  const { timelinePoint, hasOverflowX } = props;
  return (
    <Box
      className={
        hasOverflowX
          ? 'content-revision-container-left-scroll'
          : 'content-revision-container-left'
      }
    >
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          <Typography className="revision-time-header text-2">
            {timelinePoint.version.title}
          </Typography>
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <Box
            data-cy="left-content-container"
            className={
              hasOverflowX
                ? 'left-content-container-scroll'
                : 'left-content-container'
            }
          >
            <Typography
              className="text-3-no-indent"
              style={{ marginRight: 10 }}
            >
              <pre>{timelinePoint.version.plainText}</pre>
            </Typography>
          </Box>
        </motion.div>
      </AnimatePresence>
    </Box>
  );
}
