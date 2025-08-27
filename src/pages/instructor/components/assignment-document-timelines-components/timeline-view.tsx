/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import { DehydratedGQLTimelinePoint } from '../../../../types';
import { applyTextDiff } from '../assignment-document-timelines';
import { useAppSelector } from '../../../../store/hooks';

interface TimelineViewProps {
  timelinePoints: DehydratedGQLTimelinePoint[];
  selectedTimelineIndex: number;
  onTimelinePointSelect: (index: number) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  timelinePoints,
  selectedTimelineIndex,
  onTimelinePointSelect,
}) => {
  if (!timelinePoints.length) {
    return null;
  }
  const activities = useAppSelector(
    (state) => state.docGoalsActivities.builtActivities
  );

  function getActivityTitle(activityId: string) {
    const activity = activities.find((a) => a._id === activityId);
    return activity?.title || 'Unknown Activity';
  }

  return (
    <Box
      sx={{
        mb: 2,
        width: '100%',
        border: '1px solid',
        borderColor: 'grey.200',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        backgroundColor: 'background.paper',
        padding: 2,
        pb: 1,
        boxSizing: 'border-box',
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 600 }}>
        Timeline
      </Typography>

      <Box
        sx={{
          display: 'flex',
          gap: 2,
          overflowX: 'auto',
          width: '75vw',
          '&::-webkit-scrollbar': {
            height: 8,
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'grey.100',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'grey.400',
            borderRadius: 4,
          },
        }}
      >
        {timelinePoints.map((point, index) => {
          const previousPoint = timelinePoints[index - 1];
          const diffContent = applyTextDiff(
            previousPoint?.version?.plainText || '',
            point.version?.plainText || ''
          );
          const charactersRemoved = diffContent.charactersRemoved;
          const charactersAdded = diffContent.charactersAdded;
          const activityTitle = getActivityTitle(point.version?.activity || '');
          return (
            <Box
              key={point.versionId}
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  minWidth: 200,
                  cursor: 'pointer',
                  p: 1,
                  borderRadius: 2,
                  backgroundColor:
                    index === selectedTimelineIndex
                      ? 'primary.50'
                      : 'transparent',
                  '&:hover': {
                    backgroundColor:
                      index === selectedTimelineIndex
                        ? 'primary.50'
                        : 'grey.50',
                  },
                }}
                onClick={() => onTimelinePointSelect(index)}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    backgroundColor:
                      index === selectedTimelineIndex
                        ? 'primary.main'
                        : 'primary.light',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 1,
                    transition: 'all 0.2s ease',
                  }}
                >
                  <CheckCircleIcon
                    sx={{
                      color: 'white',
                      fontSize: 20,
                    }}
                  />
                </Box>

                <Chip
                  label={activityTitle}
                  size="small"
                  sx={{
                    mb: 1,
                    backgroundColor:
                      index === selectedTimelineIndex
                        ? 'primary.main'
                        : 'primary.light',
                    color: 'white',
                    fontSize: '0.75rem',
                    maxWidth: 180,
                    '& .MuiChip-label': {
                      px: 1,
                    },
                  }}
                />

                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <Chip
                    label={`+${charactersAdded}`}
                    size="small"
                    sx={{
                      backgroundColor: 'success.light',
                      color: 'white',
                      fontSize: '0.7rem',
                      height: 20,
                    }}
                  />
                  <Chip
                    label={`-${charactersRemoved}`}
                    size="small"
                    sx={{
                      backgroundColor: 'error.light',
                      color: 'white',
                      fontSize: '0.7rem',
                      height: 20,
                    }}
                  />
                </Box>

                <Typography
                  variant="caption"
                  sx={{
                    mt: 0.5,
                    color: 'text.secondary',
                    textAlign: 'center',
                    fontSize: '0.7rem',
                  }}
                >
                  {new Date(point.versionTime).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Typography>
              </Box>

              {index < timelinePoints.length - 1 && (
                <Box
                  sx={{
                    width: 40,
                    height: 2,
                    backgroundColor: 'primary.light',
                    mx: 1,
                  }}
                />
              )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};
