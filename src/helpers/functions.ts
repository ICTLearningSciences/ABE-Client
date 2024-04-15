/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { GQLTimelinePoint, TimelinePointType } from '../types';

/**
 * The function `convertTimeLinePointToDocVersion` converts a TimelinePointType enum value to a
 * corresponding string representation.
 * @param {TimelinePointType} type - TimelinePointType
 * @returns An empty string is being returned if the `type` parameter does not match any of the cases
 * in the switch statement.
 */
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
/**
 * The function `formatTimeDifference` calculates the time difference between the current time and a
 * specified time in seconds, minutes, hours, days, weeks, and months.
 * @param {string} specifiedTime - The `formatTimeDifference` function you provided calculates the time
 * difference between the current time and a specified time in various units like seconds, minutes,
 * hours, days, weeks, and months.
 * @returns The function `formatTimeDifference` returns an object containing the time difference
 * between the current time and the specified time in seconds, minutes, hours, days, weeks, and months.
 */
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

/**
 * The function `formatTimeDifferenceToReadable` takes a time difference as input and returns a
 * human-readable format of the time elapsed in months, weeks, days, hours, minutes, or seconds ago.
 * @param {string} timeDifference - The `formatTimeDifferenceToReadable` function takes a
 * `timeDifference` parameter as input, which is expected to be a string representing the time
 * difference between two timestamps. The function then formats this time difference into a
 * human-readable format such as "X months ago", "X weeks ago", "X
 * @returns The `formatTimeDifferenceToReadable` function returns a formatted string indicating the
 * time difference based on the input `timeDifference`. It checks the time difference in months, weeks,
 * days, hours, minutes, and seconds, and returns the appropriate time unit with the corresponding
 * value followed by "ago".
 */
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

/**
 * This function `getIntentionText` takes a `timelinePoint` object as input and returns the description
 * of the session intention, day intention, or document intention from the object, or 'No Intention
 * text' if none are found.
 * @param {GQLTimelinePoint} timelinePoint - The `timelinePoint` parameter is of type
 * `GQLTimelinePoint`, which likely contains information about a specific point in a timeline. The
 * function `getIntentionText` is designed to extract intention text from this `timelinePoint` object
 * based on certain conditions related to different types of intentions (session,
 * @returns The `getIntentionText` function takes a `timelinePoint` object as input and returns the
 * intention text based on the priority of session intention, day intention, and document intention. If
 * none of these intentions have a description, it returns 'No Intention text'.
 */
export const getIntentionText = (timelinePoint: GQLTimelinePoint): string => {
  if (timelinePoint.version?.sessionIntention?.description) {
    return timelinePoint.version?.sessionIntention?.description || '';
  } else if (timelinePoint.version?.dayIntention?.description) {
    return timelinePoint.version?.dayIntention?.description || '';
  } else if (timelinePoint.version?.documentIntention?.description) {
    return timelinePoint.version?.documentIntention?.description || '';
  }
  return 'No Intention text';
};
