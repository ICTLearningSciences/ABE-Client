import { DisplayIcons } from './helpers/display-icon-helper';
import { StepData } from './hooks/use-with-stronger-hook-activity';
import { ChatMessageTypes, UserInputType } from './store/slices/chat';
import { UserRole } from './store/slices/login';
import OpenAI from 'openai';

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

export interface OpenAiPromptStep {
  prompts: PromptConfiguration[];
  outputDataType: PromptOutputTypes;
  includeChatLogContext?: boolean;
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
  handleResponse?: (response: string, userInputType: UserInputType) => void;
}

export interface Activity extends ActivityGQL {
  steps: ActivityStep[];
  // introStep: ActivityStep;
  getStep: (stepData: StepData) => ActivityStep;
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
  activities?: ActivityGQL[];
  activityOrder: string[];
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
