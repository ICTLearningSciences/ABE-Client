/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { v4 as uuidv4 } from 'uuid';
import { ActivityGQL, PromptOutputTypes } from './types';

export enum DisplayIcons {
    LIGHT_BULB = 'LIGHT_BULB',
    PENCIL = 'PENCIL',
    PENCIL_OUTLINE = 'PENCIL_OUTLINE',
    DEFAULT = 'DEFAULT',
  }
export function isActivityBuilder(
  activity: ActivityGQL | ActivityBuilder
): activity is ActivityBuilder {
  return (activity as ActivityBuilder).activityType === 'builder';
}

export interface IActivity {
  activityType: 'builder' | 'gql';
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
    activityType: 'builder',
    title: 'New Activity',
    user: userId,
    visibility: ActivityBuilderVisibility.READ_ONLY,
    description: '',
    displayIcon: DisplayIcons.DEFAULT,
    newDocRecommend: false,
    disabled: false,
    flowsList: [
      {
        clientId: uuidv4(),
        name: 'Flow 1',
        steps: [],
      },
    ],
  };
}

export enum ActivityBuilderVisibility {
  EDITABLE = 'editable',
  READ_ONLY = 'read-only',
  PRIVATE = 'private',
}

export interface ActivityBuilder extends IActivity {
  _id: string;
  clientId: string;
  activityType: 'builder';
  title: string;
  user: string;
  visibility: ActivityBuilderVisibility;
  description: string;
  displayIcon: DisplayIcons;
  newDocRecommend?: boolean;
  disabled?: boolean;
  flowsList: FlowItem[];
}

export enum ActivityBuilderStepType {
  SYSTEM_MESSAGE = 'SYSTEM_MESSAGE',
  REQUEST_USER_INPUT = 'REQUEST_USER_INPUT',
  PROMPT = 'PROMPT',
  CONDITIONAL = 'CONDITIONAL',
}

export interface ActivityBuilderStep {
  stepId: string;
  stepType: ActivityBuilderStepType;
  jumpToStepId?: string;
}

export type ActivityBuilderStepTypes =
  | SystemMessageActivityStep
  | RequestUserInputActivityStep
  | PromptActivityStep
  | ConditionalActivityStep;

// SystemMessage
export interface SystemMessageActivityStep extends ActivityBuilderStep {
  stepType: ActivityBuilderStepType.SYSTEM_MESSAGE;
  message: string;
}

// LogicOperation
export enum NumericOperations {
  GREATER_THAN = '>',
  LESS_THAN = '<',
  EQUALS = '==',
  NOT_EQUALS = '!=',
  GREATER_THAN_EQUALS = '>=',
  LESS_THAN_EQUALS = '<=',
}

export enum Checking {
  // array or string
  LENGTH = 'LENGTH',
  // string, boolean, number
  VALUE = 'VALUE',
  // array or string
  CONTAINS = 'CONTAINS',
}

export interface LogicStepConditional {
  stateDataKey: string;
  checking: Checking;
  operation: NumericOperations;
  expectedValue: string;
  targetStepId: string;
}

export interface ConditionalActivityStep extends ActivityBuilderStep {
  stepType: ActivityBuilderStepType.CONDITIONAL;
  conditionals: LogicStepConditional[];
}

// RequestUserInput
export interface PredefinedResponse {
  clientId: string;
  isArray?: boolean;
  message: string;
  jumpToStepId?: string;
  responseWeight?: string;
}

export enum RequestUserInputSpecialType {
  END_ACTIVITY = 'END_ACTIVITY',
}

export interface RequestUserInputActivityStep extends ActivityBuilderStep {
  stepType: ActivityBuilderStepType.REQUEST_USER_INPUT;
  message: string;
  saveAsIntention: boolean;
  specialType?: RequestUserInputSpecialType;
  saveResponseVariableName: string;
  disableFreeInput: boolean;
  predefinedResponses: PredefinedResponse[];
}

//Prompt
export enum JsonResponseDataType {
  STRING = 'string',
  OBJECT = 'object',
  ARRAY = 'array',
}

export enum SubJsonResponseDataType {
  STRING = 'string',
  ARRAY = 'array',
}

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

export interface PromptActivityStepGql extends ActivityBuilderStep {
  stepType: ActivityBuilderStepType.PROMPT;
  promptText: string;
  responseFormat: string;
  editDoc?: boolean;
  includeChatLogContext: boolean;
  includeEssay: boolean;
  outputDataType: PromptOutputTypes;
  jsonResponseData?: string;
  customSystemRole: string;
  webSearch?: boolean;
}

export interface PromptActivityStep
  extends Omit<PromptActivityStepGql, 'jsonResponseData'> {
  jsonResponseData?: JsonResponseData[];
}

export interface BuiltActivityVersion {
  activity: ActivityBuilder;
  versionTime: string;
}
