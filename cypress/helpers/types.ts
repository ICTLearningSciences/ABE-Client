/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import OpenAI from 'openai';
import { GptModels } from '../../src/constants';
export enum UserRole {
    NONE = 'NONE',
    ADMIN = 'ADMIN',
    USER = 'USER',
  }
  
export enum Sender {
    USER = 'USER',
    SYSTEM = 'SYSTEM',
  }
  
  export enum MessageDisplayType {
    TEXT = 'TEXT',
    PENDING_MESSAGE = 'PENDING_MESSAGE',
  }
export interface ChatMessage {
    sender: Sender;
    displayType: MessageDisplayType;
    openAiInfo?: OpenAiReqRes;
    mcqChoices?: string[];
    selectActivities?: Activity[];
    activityStep?: ActivityStep;
    selectedActivity?: Activity;
    selectedGoal?: DocGoal;
  }

export type ChatMessageTypes =
  | TextMessage
  | BulletPointMessage
  | PendingMessage;

export interface PendingMessage extends ChatMessage {
  message: string;
}

export interface TextMessage extends ChatMessage {
  message: string;
}

export interface BulletPointMessage extends ChatMessage {
  message: string;
  bulletPoints: string[];
}

export enum DisplayIcons {
    LIGHT_BULB = 'LIGHT_BULB',
    PENCIL = 'PENCIL',
    PENCIL_OUTLINE = 'PENCIL_OUTLINE',
    DEFAULT = 'DEFAULT',
  }

export interface Connection<T> {
  edges: Edge<T>[];
  pageInfo: PageInfo;
}

export interface Edge<T> {
  cursor: string;
  node: T;
}

export interface PageInfo {
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  startCursor: string;
  endCursor: string;
}

export interface User {
  _id: string;
  googleId: string;
  name: string;
  email: string;
  userRole: UserRole;
  lastLoginAt: Date;
}

export interface UserAccessToken {
  user: User;
  accessToken: string;
  expirationDate: string;
}

export interface CreateGoogleDocResponse {
  data: NewDocData;
}

export interface NewDocData {
  docId: string;
  docUrl: string;
}

export enum GoogleDocTextModifyActions {
  HIGHLIGHT = 'HIGHLIGHT',
  INSERT = 'INSERT',
  REMOVE = 'REMOVE',
}

export interface DocData {
  plainText: string;
  lastChangedId: string;
  title: string;
  lastModifyingUser: string;
  modifiedTime: string;
}

export interface GoogleDoc {
  googleDocId: string;
  title: string;
  createdAt: string;
  admin: boolean;
}

export interface DocRevision {
  docId: string;
  plainText: string;
  lastChangedId: string;
  chatLog: ChatMessageTypes[];
  title: string;
  lastModifyingUser: string;
  modifiedTime: string;
}

export interface OpenAiReqRes {
  openAiPrompt: OpenAI.Chat.Completions.ChatCompletionCreateParams;
  openAiResponse: OpenAI.Chat.Completions.ChatCompletion.Choice[];
  originalRequestPrompt?: OpenAiPromptStep;
}

export enum UserActions {
  ASK_QUESTION = 'ASK_QUESTION',
  MULTISTEP_PROMPTS = 'MULTISTEP_PROMPTS',
  SINGLE_PROMPT = 'SINGLE_PROMPT',
}

export interface GQLPrompt {
  _id: string;
  clientId: string;
  openAiPromptSteps: OpenAiPromptStep[];
  title: string;
  includeChatLog?: boolean;
}

export interface GQLResPrompts {
  prompts: GQLPrompt[];
}

export enum PromptRoles {
  SYSTEM = 'system',
  USER = 'user',
  ASSISSANT = 'assistant',
  FUNCTION = 'function',
}

export interface PromptConfiguration {
  promptText: string;
  includeEssay: boolean;
  promptRole?: PromptRoles;
}

export interface OpenAiPromptStep {
  prompts: PromptConfiguration[];
  targetGptModel: GptModels;
  outputDataType: PromptOutputTypes;
}

export interface MultistepPromptRes {
  openAiData: OpenAiReqRes[];
  answer: string;
}

export enum PromptOutputTypes {
  TEXT = 'TEXT',
  JSON = 'JSON',
}

export interface Config {
  openaiSystemPrompt: string[];
}

export enum ActivityStepTypes {
  FREE_RESPONSE_QUESTION = 'FREE_RESPONSE_QUESTION',
  MULTIPLE_CHOICE_QUESTIONS = 'MULTIPLE_CHOICE_QUESTIONS',
  MESSAGE = 'MESSAGE',
  SHOULD_INCLUDE_ESSAY = 'SHOULD_INCLUDE_ESSAY',
}

export interface ActivityStep {
  text: string;
  stepType: ActivityStepTypes;
  mcqChoices?: string[];
  handleResponse?: (response: string) => void;
  /**
   * Should also handle sending a message to the user
   * If this is not define, openAi text response will be displayed to user
   */
  handlePromptResponse?: (response: string) => void;
  prompt?: GQLPrompt;
}

export interface Activity extends ActivityGQL {
  steps: ActivityStep[];
  prompt: GQLPrompt;
  introStep: ActivityStep;
}

export interface ActivityGQL {
  _id: string;
  title: string;
  introduction: string;
  description: string;
  displayIcon: DisplayIcons;
  responsePendingMessage: string;
  responseReadyMessage: string;
}

export interface DocGoal {
  _id: string;
  title: string;
  description: string;
  displayIcon: DisplayIcons;
  activities?: ActivityGQL[];
  introduction: string;
}

export interface UserActivityState {
  userId: string;
  activityId: string;
  googleDocId: string;
  metadata: string;
}

export enum JobStatus {
  QUEUED = 'QUEUED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETE = 'COMPLETE',
}

export interface OpenAiJobStatus {
  jobStatus: JobStatus;
  openAiResponse: MultistepPromptRes;
}

export interface OpenAiJobStatusApiRes{
  response: OpenAiJobStatus;
}

export enum TimelinePointType {
  START = 'START',
  MOST_RECENT = 'MOST_RECENT',
  NEW_ACTIVITY = 'NEW_ACTIVITY',
  TIME_DIFFERENCE = 'TIME_DIFFERENCE',
  NONE = ''
}

export interface GQLTimelinePoint{
  type: TimelinePointType;
  versionTime: string;
  version: IGDocVersion;
  intent: string;
  changeSummary: string;
  reverseOutline: string;
  relatedFeedback: string;
}

export interface ChatItem {
  sender: string;
  message: string;
}

export interface IGDocVersion {
  docId: string;
  plainText: string;
  lastChangedId: string;
  chatLog: ChatItem[];
  activity: string;
  intent: string;
  title: string;
  lastModifyingUser: string;
}

export interface GQLDocumentTimeline{
  docId: string;
  user: string;
  timelinePoints: GQLTimelinePoint[];
}
