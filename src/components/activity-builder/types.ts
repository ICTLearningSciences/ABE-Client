/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { PromptOutputTypes } from '../../types';

export interface ActivityBuilder {
  _id: string;
  title: string;
  steps: ActivityBuilderStep[];
}

export enum ActivityBuilderStepType {
  SYSTEM_MESSAGE = 'SystemMessage',
  USER_MESSAGE = 'UserMessage',
  PROMPT = 'Prompt',
}

export interface ActivityBuilderStep {
  stepId: string;
  stepType: ActivityBuilderStepType;
}

// SystemMessage
export interface SystemMessageActivityStep extends ActivityBuilderStep {
  stepType: ActivityBuilderStepType.SYSTEM_MESSAGE;
  message: string;
  jumpToStepId?: string;
}

// UserMessage
export interface PredefinedResponse {
  message: string;
}

export interface UserMessageActivityStep extends ActivityBuilderStep {
  stepType: ActivityBuilderStepType.USER_MESSAGE;
  message: string;
  jumpToStepId?: string;
  saveAsIntention: boolean;
  saveResponseVariableName: string;
  disableFreeInput: boolean;
  predefinedResponses: PredefinedResponse[];
}

//Prompt
export interface PromptActivityStep extends ActivityBuilderStep {
  stepType: ActivityBuilderStepType.PROMPT;
  jumpToStepId?: string;
  promptText: string;
  responseFormat: string;
  includeChatLogContext: boolean;
  outputDataType: PromptOutputTypes;
  jsonResponseSchema?: string;
  customSystemRole: string;
}
