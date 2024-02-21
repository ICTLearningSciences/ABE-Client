import { CancelToken } from 'axios';
import {
  JobStatus,
  MultistepPromptRes,
  OpenAiJobStatus,
  OpenAiPromptStep,
} from '../types';
import { asyncOpenAiJobStatus, asyncOpenAiRequest } from './api';

export async function asyncPromptExecute(
  googleDocId: string,
  openAiPromptSteps: OpenAiPromptStep[],
  userId: string,
  systemPrompt: string,
  useGpt4: boolean,
  cancelToken?: CancelToken
): Promise<MultistepPromptRes> {
  const openAiJobId = await asyncOpenAiRequest(
    googleDocId,
    openAiPromptSteps,
    userId,
    systemPrompt,
    useGpt4,
    cancelToken
  );
  const pollFunction = () => {
    return asyncOpenAiJobStatus(openAiJobId, cancelToken);
  };
  const res = await pollUntilTrue<OpenAiJobStatus>(
    pollFunction,
    (res: OpenAiJobStatus) => {
      return res.jobStatus === JobStatus.COMPLETE;
    },
    1000,
    60000
  );
  return res.openAiResponse;
}

export function pollUntilTrue<T>(
  pollFunction: () => Promise<T>,
  endPollCondition: (res: T) => boolean,
  interval: number,
  timeout: number = 0
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
