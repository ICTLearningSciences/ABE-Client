/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import OpenAI from 'openai';
import { AiServiceStepDataTypes } from '../../src/ai-services/ai-service-types';
export enum GptModels {
  GPT_3_5 = 'gpt-3.5-turbo-16k',
  GPT_4 = 'gpt-4',
  GPT_4_TURBO_PREVIEW = 'gpt-4-turbo-preview',
  NONE = '',
}



export enum DisplayIcons {
  LIGHT_BULB = 'LIGHT_BULB',
  PENCIL = 'PENCIL',
  PENCIL_OUTLINE = 'PENCIL_OUTLINE',
  DEFAULT = 'DEFAULT',
}
export interface StepData {
  executePrompt: (
    prompt: (messages: ChatMessageTypes[]) => GQLPrompt,
    callback: (response: AiServiceResponse) => void
  ) => void;
  openSelectActivityModal: () => void;
}
export enum UserInputType {
  FREE_INPUT = 'FREE_INPUT',
  MCQ = 'MCQ',
  NONE = 'NONE',
}
export enum Sender {
  USER = 'USER',
  SYSTEM = 'SYSTEM',
}

export enum MessageDisplayType {
  TEXT = 'TEXT',
  PENDING_MESSAGE = 'PENDING_MESSAGE',
}

export interface ActiveActivityStep {
  text: string;
  stepType: ActivityStepTypes;
  mcqChoices?: string[];
  handleResponse?: (response: string, userInputType: UserInputType) => void;
}

export interface StepMessage {
  _id: string;
  text: string;
}

export interface ActivityStepGQL {
  messages: StepMessage[];
  stepName: string;
  stepType?: ActivityStepTypes;
  mcqChoices?: string[];
  prompts?: string[];
}

export interface ChatMessage {
  id: string;
  sender: Sender;
  displayType: MessageDisplayType;
  aiServiceStepData?: AiServiceStepDataTypes[];
  mcqChoices?: string[];
  selectActivities?: Activity[];
  activityStep?: ActiveActivityStep;
  selectedGoal?: DocGoal;
  userInputType?: UserInputType;
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
export enum UserRole {
  NONE = 'NONE',
  ADMIN = 'ADMIN',
  USER = 'USER',
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
  user: string;
  documentIntention?: Intention;
  currentDayIntention?: Intention;
  assignmentDescription?: string;
  createdAt: string;
  admin: boolean;
}

export interface Intention {
  description: string;
  createdAt?: string;
}

export interface DocVersion {
  docId: string;
  plainText: string;
  lastChangedId: string;
  sessionId: string;
  sessionIntention?: Intention;
  documentIntention?: Intention;
  dayIntention?: Intention;
  chatLog: ChatMessageTypes[];
  activity: string;
  intent: string;
  title: string;
  lastModifyingUser: string;
  modifiedTime: string;
}

export interface AiStepData {
  aiServiceRequestParams: OpenAI.Chat.Completions.ChatCompletionCreateParams;
  aiServiceResponse: OpenAI.Chat.Completions.ChatCompletion.Choice[];
  originalRequestPrompt?: AiPromptStep;
}

export enum UserActions {
  ASK_QUESTION = 'ASK_QUESTION',
  MULTISTEP_PROMPTS = 'MULTISTEP_PROMPTS',
  SINGLE_PROMPT = 'SINGLE_PROMPT',
}

export interface StoreGoogleDoc {
  googleDocId: string;
  user: string;
  admin?: boolean;
  currentDayIntention?: Intention;
  documentIntention?: Intention;
  assignmentDescription?: string;
  title?: string;
}

export interface GQLPrompt {
  _id: string;
  clientId: string;
  aiPromptSteps: AiPromptStep[];
  title: string;
  userInputIsIntention?: boolean;
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
  includeUserInput?: boolean;
}

export enum AiServiceNames {
  AZURE = 'AZURE_OPEN_AI',
  OPEN_AI = 'OPEN_AI',
  GEMINI = 'GEMINI',
}

export interface AiServiceModel {
  serviceName: AiServiceNames;
  model: string;
}

export interface AiPromptStep {
  prompts: PromptConfiguration[];
  targetAiServiceModel?: AiServiceModel;
  outputDataType: PromptOutputTypes;
  includeChatLogContext?: boolean;
}

export interface AiServiceResponse {
  aiAllStepsData: AiStepData[];
  answer: string;
}

export enum PromptOutputTypes {
  TEXT = 'TEXT',
  JSON = 'JSON',
}

export interface AvailableAiServiceModels {
  serviceName: AiServiceNames;
  models: string[];
}

export interface IGoalActivites{
  goal:string;
  activities:string[];
}

export interface ColorThemeConfig {
  headerColor: string;
  headerButtonsColor: string;
  chatSystemBubbleColor: string;
  chatUserBubbleColor: string;
}

export interface Config {
  aiSystemPrompt: string[];
  colorTheme?: ColorThemeConfig;
  displayedGoalActivities?: IGoalActivites[];
  exampleGoogleDocs?: string[];
  overrideAiModel?: AiServiceModel;
  defaultAiModel?: AiServiceModel;
  availableAiServiceModels?: AvailableAiServiceModels[];
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
  handleResponse?: (response: string, userInputType: UserInputType) => void;
}

export interface Activity extends ActivityGQL {
  steps: ActivityStepGQL[];
  // introStep: ActivityStep;
  getStep: (stepData: StepData) => ActiveActivityStep;
  stepName: string;
  resetActivity: () => void;
  isReady: boolean;
}

export interface ActivityPromptGQL {
  _id: string;
  promptId: string;
  order: number;
}

export interface ActivityPrompt {
  _id: string;
  order: number;
  prompt: GQLPrompt;
}

export interface ActivityGQL {
  _id: string;
  title: string;
  introduction: string;
  description: string;
  displayIcon: DisplayIcons;
  responsePendingMessage: string;
  newDocRecommend?: boolean;
  responseReadyMessage: string;
  disabled: boolean;
  prompt?: GQLPrompt;
  prompts?: ActivityPromptGQL[];
}

export interface DocGoal {
  _id: string;
  title: string;
  description: string;
  displayIcon: DisplayIcons;
  introduction: string;
  newDocRecommend?: boolean;
}

export interface UserActivityState {
  userId: string;
  activityId: string;
  googleDocId: string;
  metadata: string;
}

export enum JobStatus {
  QUEUED = 'QUEUED',
  FAILED = 'FAILED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETE = 'COMPLETE',
}

export interface AiJobStatusApiRes {
  response: OpenAiJobStatus;
}

export interface OpenAiJobStatus {
  jobStatus: JobStatus;
  aiServiceResponse: AiServiceResponse;
}

export interface DocumentTimelineJobStatus {
  jobStatus: JobStatus;
  documentTimeline: GQLDocumentTimeline;
}

export enum TimelinePointType {
  START = 'START',
  MOST_RECENT = 'MOST_RECENT',
  NEW_ACTIVITY = 'NEW_ACTIVITY',
  TIME_DIFFERENCE = 'TIME_DIFFERENCE',
  NONE = '',
}

export enum AiGenerationStatus {
  NONE = 'NONE',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export interface GQLTimelinePoint {
  type: TimelinePointType;
  versionTime: string;
  version: IGDocVersion;
  intent: string;
  changeSummary: string;
  changeSummaryStatus: AiGenerationStatus;
  reverseOutline: string;
  reverseOutlineStatus: AiGenerationStatus;
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
  sessionId: string;
  sessionIntention?: Intention;
  documentIntention?: Intention;
  dayIntention?: Intention;
  chatLog: ChatItem[];
  activity: string;
  intent: string;
  title: string;
  lastModifyingUser: string;
  modifiedTime: string;
  createdAt: string;
  updatedAt: string;
}

export interface GQLDocumentTimeline {
  docId: string;
  user: string;
  timelinePoints: GQLTimelinePoint[];
}

export enum MockDefaultType {
  VERSION = 'VERSION',
  REVERSE_OUTLINE = 'REVERSE_OUTLINE',
  CUSTOM_FILE_DATA = 'CUSTOM_FILE_DATA',
  ALL = 'ALL',
}

export interface IGDocVersion {
  docId: string;
  plainText: string;
  lastChangedId: string;
  sessionId: string;
  sessionIntention?: Intention;
  documentIntention?: Intention;
  dayIntention?: Intention;
  chatLog: ChatItem[];
  activity: string;
  intent: string;
  title: string;
  lastModifyingUser: string;
  modifiedTime: string;
  createdAt: string;
  updatedAt: string;
}

export interface Intention {
  description: string;
  createdAt?: string;
}

export interface ChatItem {
  sender: string;
  message: string;
}
