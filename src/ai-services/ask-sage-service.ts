/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/

import {
  AiResponseType,
  AiJobStatusType,
  AiStepData,
  AiServiceStepDataTypes,
} from './ai-service-types';

interface ApiRequestData {
  model: string;
  system_prompt: string;
  persona: string;
  message: string;
  temperature?: number;
}

interface SageRes {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  added_obj: any;
  emdedding_down: boolean;
  message: string;
  references: string;
  response: string;
  status: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tool_calls: any;
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  usage: any;
  uuid: string;
  vectors_down: boolean;
}

export type SageReqType = ApiRequestData;
export type SageResType = SageRes;
export type SageStepDataType = AiStepData<SageReqType, SageResType>;
export type SagePromptResponse = AiResponseType<SageStepDataType>;

export type SageServiceJobStatusResponseType =
  AiJobStatusType<SagePromptResponse>;

export function isSageData(
  stepData: AiServiceStepDataTypes
): stepData is SageStepDataType {
  return 'message' in stepData.aiServiceResponse;
}
