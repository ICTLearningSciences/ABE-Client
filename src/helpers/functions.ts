/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { TimelinePointType } from '../types';

export const convertTimeLinePointToDocVersion = (
  type: TimelinePointType
): string => {
  switch (type) {
    case TimelinePointType.START:
      return 'Start';
    case TimelinePointType.MOST_RECENT:
      return 'Most Recent';
    case TimelinePointType.NEW_ACTIVITY:
      return 'New Activity';
    case TimelinePointType.TIME_DIFFERENCE:
      return 'Time Difference';
    default:
      return '';
  }
};

// Function to format time difference in ISO 8601 format
export function formatTimeDifference(specifiedTime: string) {
  const currentTime = new Date();
  const specifiedTimeFormatted = new Date(specifiedTime);

  const diffTime = Math.abs(
    currentTime.getTime() - specifiedTimeFormatted.getTime()
  );
  const diffSeconds = Math.floor(diffTime / 1000);
  const diffMinutes = Math.floor(diffTime / (1000 * 60));
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);

  return {
    seconds: diffSeconds,
    minutes: diffMinutes,
    hours: diffHours,
    days: diffDays,
    weeks: diffWeeks,
    months: diffMonths,
  };
}

export const formatTimeDifferenceToReadable = (timeDifference: string) => {
  const { seconds, minutes, hours, days, weeks, months } =
    formatTimeDifference(timeDifference);

  if (months > 0) {
    return `${months} months ago`;
  } else if (weeks > 0) {
    return `${weeks} weeks ago`;
  } else if (days > 0) {
    return `${days} days ago`;
  } else if (hours > 0) {
    return `${hours} hours ago`;
  } else if (minutes > 0) {
    return `${minutes} minutes ago`;
  } else {
    return `${seconds} seconds ago`;
  }
};
