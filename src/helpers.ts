/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import axios from 'axios';
import {
  ActivityGQL,
  GQLPrompt,
  GQLTimelinePoint,
  AiGenerationStatus,
  PromptConfiguration,
  AiServiceModel,
  AiServiceNames,
  User,
} from './types';
import Validator, { Schema } from 'jsonschema';
import { ChatLog, Sender, UserInputType } from './store/slices/chat';
import {
  ActivityBuilder,
  ActivityBuilderVisibility,
} from './components/activity-builder/types';
import { UserRole } from './store/slices/login';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function extractErrorMessageFromError(err: any | unknown): string {
  if (err?.response?.data) {
    try {
      const error = JSON.stringify(err.response.data);
      return error;
    } catch (err) {
      console.error(err);
    }
  }
  if (err instanceof Error) {
    return err.message;
  } else if (axios.isAxiosError(err)) {
    return err.response?.data || err.message;
  } else {
    try {
      const error = JSON.stringify(err);
      return error;
    } catch (err) {
      return 'Cannot stringify error, unknown error structure';
    }
  }
}

export function addQueryParam(
  url: string,
  paramName: string,
  paramValue: string
): string {
  const urlObject = new URL(url);
  urlObject.searchParams.append(paramName, paramValue);
  return urlObject.toString();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function equals<T>(val1: T, val2: T): boolean {
  return JSON.stringify(val1) === JSON.stringify(val2);
}

export function formatISODateToReadable(isoDate: string): string {
  const inputDate = new Date(isoDate);
  const currentDate = new Date();

  if (
    inputDate.getDate() === currentDate.getDate() &&
    inputDate.getMonth() === currentDate.getMonth() &&
    inputDate.getFullYear() === currentDate.getFullYear()
  ) {
    // If the date is today, show the time of day with AM/PM
    const hours = inputDate.getHours() % 12 || 12;
    const minutes = inputDate.getMinutes().toString().padStart(2, '0');
    const period = inputDate.getHours() < 12 ? 'AM' : 'PM';
    return `${hours}:${minutes} ${period} (Today)`;
  } else {
    // If the date is not today, show the full date
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };
    return inputDate.toLocaleDateString('en-US', options);
  }
}

export function formatISODate(isoDate: string): string {
  const inputDate = new Date(isoDate);
  const currentDate = new Date();

  if (
    inputDate.getDate() === currentDate.getDate() &&
    inputDate.getMonth() === currentDate.getMonth() &&
    inputDate.getFullYear() === currentDate.getFullYear()
  ) {
    // If the date is today, show the time of day with AM/PM
    const hours = inputDate.getHours() % 12 || 12;
    const minutes = inputDate.getMinutes().toString().padStart(2, '0');
    const period = inputDate.getHours() < 12 ? 'AM' : 'PM';
    return `${hours}:${minutes} ${period} (Today)`;
  } else {
    // If the date is not today, show the full date with time
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };
    return inputDate.toLocaleString('en-US', options);
  }
}

export function isJsonString(str: string): boolean {
  try {
    JSON.parse(str);
  } catch (e) {
    console.log(`Error parsing string: ${str}`);
    return false;
  }
  return true;
}

export function validateJsonResponse<T>(response: string, schema: Schema): T {
  try {
    const v = new Validator.Validator();
    const responseJson: T = JSON.parse(response);
    const result = v.validate(responseJson, schema);
    if (result.errors.length > 0) {
      console.error(result.errors);
      throw new Error('invalid json response shape');
    }
    return responseJson;
  } catch (e) {
    console.error(e);
    throw new Error('failed to handle prompt response');
  }
}

export function getLastUserMessage(chatLog: ChatLog) {
  const reversedChatLog: ChatLog = [...chatLog].reverse();
  const lastUserMessage = reversedChatLog.find(
    (msg) =>
      msg.sender === Sender.USER &&
      msg.userInputType === UserInputType.FREE_INPUT
  );
  const message = lastUserMessage ? lastUserMessage.message : '';
  return message;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GenericObject = Record<string, any>;

export function removeDuplicatesByField<T extends GenericObject>(
  list: T[],
  fieldToCheck: keyof T
): T[] {
  const uniqueValues = new Set();

  return list.filter((item) => {
    const fieldValue = item[fieldToCheck];

    if (!uniqueValues.has(fieldValue)) {
      uniqueValues.add(fieldValue);
      return true;
    }

    return false;
  });
}

export function isPromptInActivity(
  prompt: GQLPrompt,
  activities: ActivityGQL[]
): boolean {
  return activities.some((activities) => {
    const prompts = activities.prompts;
    if (prompts) {
      return prompts.find((p) => p.promptId === prompt._id);
    }
    return false;
  });
}

export function isPromptOrphan(
  prompt: GQLPrompt,
  activities: ActivityGQL[]
): boolean {
  return (
    !activities.find((activity) => activity.prompt?._id === prompt._id) &&
    !activities.some((activities) => {
      const prompts = activities.prompts;
      if (prompts) {
        return prompts.find((p) => p.promptId === prompt._id);
      }
      return false;
    })
  );
}

export function addContextToPromptSteps(
  prompt: GQLPrompt,
  context: PromptConfiguration[]
) {
  return {
    ...prompt,
    aiPromptSteps: prompt.aiPromptSteps.map((step) => {
      return {
        ...step,
        prompts: [...context, ...step.prompts],
      };
    }),
  };
}

export function getPromptsByIds(
  promptIds: string[],
  prompts: GQLPrompt[]
): Record<string, GQLPrompt> {
  if (!prompts) {
    return {};
  }
  const promptsById: Record<string, GQLPrompt> = {};
  prompts.forEach((prompt) => {
    if (promptIds.includes(prompt._id)) {
      promptsById[prompt._id] = prompt;
    }
  });
  return promptsById;
}

export function hasHoursPassed(
  lastDateISOtime: string,
  nextDateISOtime: string,
  hours: number
): boolean {
  return (
    new Date(nextDateISOtime).getTime() - new Date(lastDateISOtime).getTime() >
    hours * 60 * 60 * 1000
  );
}

export function hasMinutesPassed(
  timeToCheck: string,
  minutes: number
): boolean {
  return (
    new Date().getTime() - new Date(timeToCheck).getTime() > minutes * 60 * 1000
  );
}

/**
 * This TypeScript function converts a given date string into a formatted date and time string in UTC
 * timezone.
 */
export const convertDateTimelinePointDate = (date: string): string => {
  if (!date) return '';
  const timestamp = new Date(date);

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
    timeZone: 'UTC',
  };

  return timestamp.toLocaleString('en-US', options);
};

/**
 * The function `convertDateTimelinePointTime` takes a date string as input and returns the time in
 * 12-hour format with hours and minutes.
 */
export const convertDateTimelinePointTime = (date: string): string => {
  if (!date) return '';
  const timestamp = new Date(date);

  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'UTC',
  };

  return timestamp.toLocaleString('en-US', options);
};

export const isTimelinePointFullyLoaded = (
  timelinePoint: GQLTimelinePoint
): boolean => {
  return (
    timelinePoint.changeSummaryStatus === AiGenerationStatus.COMPLETED &&
    timelinePoint.reverseOutlineStatus === AiGenerationStatus.COMPLETED
  );
};

export const aiServiceModelToString = (
  aiServiceModel: AiServiceModel,
  isDefault?: boolean
): string => {
  return `${isDefault ? '(DEFAULT) ' : ''}${aiServiceModel.serviceName} : ${
    aiServiceModel.model
  }`;
};

export const aiServiceModelStringParse = (
  aiServiceModelString: string
): AiServiceModel => {
  const [serviceName, model] = aiServiceModelString.split(' : ');
  return {
    serviceName: serviceName as AiServiceNames,
    model,
  };
};
export function chatLogToString(chatLog: ChatLog) {
  let chatLogString = '';
  for (let i = 0; i < chatLog.length; i++) {
    chatLogString += `${chatLog[i].sender}: ${chatLog[i].message}\n`;
  }
  return chatLogString;
}

export function isJsonMarkdown(jsonMarkdown: string): boolean {
  return jsonMarkdown.startsWith('```json\n');
}

export function convertMarkdownToJsonString(jsonMarkdown: string): string {
  const trimmedMarkdown = jsonMarkdown.trim();
  const withoutStart = trimmedMarkdown.startsWith('```json\n')
    ? trimmedMarkdown.slice(7) // Length of "```json\n"
    : trimmedMarkdown;
  const withoutEnd = withoutStart.endsWith('```')
    ? withoutStart.slice(0, -3) // Length of "```"
    : withoutStart;
  return withoutEnd.trim();
}

export function userCanEditActivity(
  activity: ActivityBuilder,
  user: User
): boolean {
  return (
    user.userRole === UserRole.ADMIN ||
    activity.user === user._id ||
    activity.visibility === ActivityBuilderVisibility.EDITABLE
  );
}
