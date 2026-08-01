/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/

import { v4 as uuidv4 } from "uuid";
import type { DisplayIcons } from "../../helpers/display-icon-helper";
import type {
  ActivityGQL,
  PromptOutputTypes,
  RagStoreConfiguration,
} from "../../types";

export type ActivityBuilderStepType =
  "SYSTEM_MESSAGE" | "REQUEST_USER_INPUT" | "PROMPT" | "CONDITIONAL";
export type ActivityBuilderVisibility = "editable" | "read-only" | "private";
export type NumericOperations = ">" | "<" | "==" | "!=" | ">=" | "<=";
export type Checking = "LENGTH" | "VALUE" | "CONTAINS";
export type ButtonActionTypeEnum =
  "FILTER_TO_PANELIST" | "CLEAR_PANELIST_FILTERS";
export type RequestUserInputSpecialType = "END_ACTIVITY";
export type JsonResponseDataType = "string" | "object" | "array";
export type SubJsonResponseDataType = "string" | "array";

export function isActivityBuilder(
  activity: ActivityGQL | ActivityBuilder,
): activity is ActivityBuilder {
  return (activity as ActivityBuilder).activityType === "builder";
}

export interface IActivity {
  activityType: "builder" | "gql";
}

export interface FlowItem {
  clientId: string;
  name: string;
  steps: ActivityBuilderStepTypes[];
}

export function defaultActivityBuilder(userId: string): ActivityBuilder {
  return {
    _id: uuidv4(),
    clientId: uuidv4(),
    activityType: "builder",
    title: "New Activity",
    user: userId,
    visibility: "read-only",
    description: "",
    displayIcon: "DEFAULT",
    newDocRecommend: false,
    disabled: false,
    flowsList: [
      {
        clientId: uuidv4(),
        name: "Flow 1",
        steps: [],
      },
    ],
  };
}

export interface ActivityBuilder extends IActivity {
  _id: string;
  clientId: string;
  activityType: "builder";
  title: string;
  user: string;
  visibility: ActivityBuilderVisibility;
  description: string;
  displayIcon: DisplayIcons;
  newDocRecommend?: boolean;
  disabled?: boolean;
  flowsList: FlowItem[];
  attachedPanel?: string;
}

export interface ActivityBuilderStep {
  stepId: string;
  stepType: ActivityBuilderStepType;
  jumpToStepId?: string;
  setStudentActivityComplete?: boolean;
}

export type ActivityBuilderStepTypes =
  | SystemMessageActivityStep
  | RequestUserInputActivityStep
  | PromptActivityStep
  | ConditionalActivityStep;

// SystemMessage
export interface SystemMessageActivityStep extends ActivityBuilderStep {
  stepType: "SYSTEM_MESSAGE";
  message: string;
  systemCustomName: string;
  sendFromPanelistClientIds: string[];
}

// LogicOperation

export interface LogicStepConditional {
  stateDataKey: string;
  checking: Checking;
  operation: NumericOperations;
  expectedValue: string;
  targetStepId: string;
}

export interface ConditionalActivityStep extends ActivityBuilderStep {
  stepType: "CONDITIONAL";
  conditionals: LogicStepConditional[];
}

export interface ButtonAction {
  buttonActionType: ButtonActionTypeEnum;
  buttonActionValue: string[];
}

// RequestUserInput
export interface PredefinedResponse {
  clientId: string;
  isArray?: boolean;
  message: string;
  jumpToStepId?: string;
  responseWeight?: string;
  buttonAction?: ButtonAction;
}

export interface RequestUserInputActivityStep extends ActivityBuilderStep {
  stepType: "REQUEST_USER_INPUT";
  message: string;
  saveAsIntention: boolean;
  saveResponseVariableName: string;
  systemCustomName: string;
  specialType?: RequestUserInputSpecialType;
  disableFreeInput: boolean;
  predefinedResponses: PredefinedResponse[];
}

//Prompt

export interface JsonResponseDataGQL {
  clientId: string;
  stringifiedData: string;
}

export interface JsonResponseData {
  clientId: string;
  name: string;
  type: JsonResponseDataType;
  isRequired: boolean;
  additionalInfo?: string;
  subData?: JsonResponseData[];
}

export interface SinglePromptConfigurationGql {
  promptText: string;
  responseFormat: string;
  editDoc?: boolean;
  includeChatLogContext: boolean;
  systemCustomName: string;
  includeEssay: boolean;
  outputDataType: PromptOutputTypes;
  runForPanelistClientIds?: string[];
  jsonResponseData?: string;
  customSystemRole: string;
  webSearch?: boolean;
  ragConfiguration?: RagStoreConfiguration;
}

export interface SinglePromptConfiguration extends Omit<
  SinglePromptConfigurationGql,
  "jsonResponseData"
> {
  jsonResponseData?: JsonResponseData[];
}

export interface PromptActivityStepGql extends ActivityBuilderStep {
  stepType: "PROMPT";
  promptConfigurations: SinglePromptConfigurationGql[];
}

export interface PromptActivityStep extends Omit<
  PromptActivityStepGql,
  "promptConfigurations"
> {
  promptConfigurations: SinglePromptConfiguration[];
}

export interface BuiltActivityVersion {
  activity: ActivityBuilder;
  versionTime: string;
}
