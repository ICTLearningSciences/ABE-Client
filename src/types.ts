/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { DisplayIcons } from './helpers/display-icon-helper';
import { StepData } from './hooks/use-with-stronger-hook-activity';
import { ChatMessageTypes, UserInputType } from './store/slices/chat';
import { UserRole } from './store/slices/login';

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

// export interface AiStepData {
//   aiServiceRequestParams: OpenAI.Chat.Completions.ChatCompletionCreateParams;
//   aiServiceResponse: OpenAI.Chat.Completions.ChatCompletion.Choice[];
//   originalRequestPrompt?: AiPromptStep;
// }

// export interface AiServiceResponse {
//   aiStepData: AiStepData[];
//   answer: string;
// }

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
  userInputIsIntention?: boolean;
  aiPromptSteps: AiPromptStep[];
  title: string;
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

export interface AiPromptStep {
  prompts: PromptConfiguration[];
  targetAiServiceModel?: AiServiceModel;
  systemRole?: string;
  outputDataType: PromptOutputTypes;
  includeChatLogContext?: boolean;
}

export enum PromptOutputTypes {
  TEXT = 'TEXT',
  JSON = 'JSON',
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

export interface AvailableAiServiceModels {
  serviceName: AiServiceNames;
  models: string[];
}

export interface IActivityConfig {
  activity: string;
  disabled: boolean;
}

export interface IGoalActivites {
  goal: string;
  activities: IActivityConfig[];
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

  headerTitle?: string; // first word will be golden
}

export enum ActivityStepTypes {
  FREE_RESPONSE_QUESTION = 'FREE_RESPONSE_QUESTION',
  MULTIPLE_CHOICE_QUESTIONS = 'MULTIPLE_CHOICE_QUESTIONS',
  MESSAGE = 'MESSAGE',
  SHOULD_INCLUDE_ESSAY = 'SHOULD_INCLUDE_ESSAY',
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

export interface Activity extends ActivityGQL {
  steps: ActivityStepGQL[];
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
  steps?: ActivityStepGQL[];
  displayIcon: DisplayIcons;
  responsePendingMessage: string;
  responseReadyMessage: string;
  disabled: boolean;
  prompt?: GQLPrompt;
  prompts?: ActivityPromptGQL[];
  newDocRecommend?: boolean;
}

export interface DocGoalGQl {
  _id: string;
  title: string;
  description: string;
  displayIcon: DisplayIcons;
  introduction: string;
  newDocRecommend?: boolean;
}

export interface DocGoal extends DocGoalGQl {
  activities: ActivityGQL[];
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
  FAILED = 'FAILED',
}

export interface DocumentTimelineJobStatus {
  jobStatus: JobStatus;
  documentTimeline?: GQLDocumentTimeline;
}

export enum TimelinePointType {
  INTRO = 'INTRO',
  START = 'START',
  MOST_RECENT = 'MOST_RECENT',
  NEW_ACTIVITY = 'NEW_ACTIVITY',
  TIME_DIFFERENCE = 'TIME_DIFFERENCE',
  NONE = '',
}

export enum MockDefaultType {
  VERSION = 'VERSION',
  REVERSE_OUTLINE = 'REVERSE_OUTLINE',
  CUSTOM_FILE_DATA = 'CUSTOM_FILE_DATA',
  ALL = 'ALL',
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
  userInputSummary: string;
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
