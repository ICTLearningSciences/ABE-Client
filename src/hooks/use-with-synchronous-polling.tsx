/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { CancelToken } from 'axios';
import {
  JobStatus,
  MultistepPromptRes,
  OpenAiJobStatus,
  OpenAiPromptStep,
} from '../types';
import { asyncOpenAiJobStatus, asyncOpenAiRequest } from './api';
import { GptModels } from '../constants';

export async function asyncPromptExecute(
  googleDocId: string,
  openAiPromptSteps: OpenAiPromptStep[],
  userId: string,
  systemPrompt: string,
  overrideGptModel: GptModels,
  cancelToken?: CancelToken
): Promise<MultistepPromptRes> {
  const openAiJobId = await asyncOpenAiRequest(
    googleDocId,
    openAiPromptSteps,
    userId,
    systemPrompt,
    overrideGptModel,
    cancelToken
  );
  const pollFunction = () => {
    return asyncOpenAiJobStatus(openAiJobId, cancelToken);
  };
  const res = await pollUntilTrue<OpenAiJobStatus>(
    pollFunction,
    (res: OpenAiJobStatus) => {
      if (res.jobStatus === JobStatus.FAILED) {
        throw new Error('OpenAI job failed');
      }
      return res.jobStatus === JobStatus.COMPLETE;
    },
    1000,
    180 * 1000
  );
  return res.openAiResponse;
}

export function pollUntilTrue<T>(
  pollFunction: () => Promise<T>,
  endPollCondition: (res: T) => boolean,
  interval: number,
  timeout = 0
) {
  const startTime = Date.now();

  const pollEndpoint = async (): Promise<T> => {
    const data: T = await pollFunction();
    if (endPollCondition(data)) {
      return data;
    }

    if (timeout && Date.now() - startTime > timeout) {
      throw new Error('Polling timed out');
    }

    await new Promise((resolve) => setTimeout(resolve, interval));
    return pollEndpoint();
  };

  return pollEndpoint();
}
