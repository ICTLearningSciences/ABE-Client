/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { AiServicesResponseTypes } from './ai-services/ai-service-types';
import {
  ActivityBuilder,
  IActivity,
} from './components/activity-builder/types';
import { DisplayIcons } from './helpers/display-icon-helper';
import { ChatMessageTypes, Sender, UserInputType } from './store/slices/chat';
import { LoginService, UserRole } from './store/slices/login';

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

export interface ClassroomCode {
  code: string;
  createdAt: string;
}

export interface UpdateUserInfo {
  name?: string;
  email?: string;
  classroomCode?: string;
  educationalRole?: EducationalRole;
}

export enum EducationalRole {
  INSTRUCTOR = 'INSTRUCTOR',
  STUDENT = 'STUDENT',
}

export interface User {
  _id: string;
  googleId: string;
  name: string;
  email: string;
  userRole: UserRole;
  loginService: LoginService;
  lastLoginAt: Date;
  classroomCode?: ClassroomCode;
  previousClassroomCodes?: ClassroomCode[];
  educationalRole?: EducationalRole;
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
  markdownText: string;
  lastChangedId: string;
  title: string;
  lastModifyingUser: string;
  modifiedTime: string;
}

export enum DocService {
  GOOGLE_DOCS = 'GOOGLE_DOCS',
  MICROSOFT_WORD = 'MICROSOFT_WORD',
  RAW_TEXT = 'RAW_TEXT',
}

export function getDocServiceFromLoginService(
  loginService?: LoginService
): DocService {
  switch (loginService) {
    case LoginService.GOOGLE:
      return DocService.GOOGLE_DOCS;
    case LoginService.MICROSOFT:
      return DocService.MICROSOFT_WORD;
    case LoginService.AMAZON_COGNITO:
    default:
      return DocService.RAW_TEXT;
  }
}

export interface Intention {
  description: string;
  createdAt?: string;
}

export interface DocVersion {
  docId: string;
  plainText: string;
  markdownText: string;
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
  courseAssignmentId: string;
}

export enum UserActions {
  ASK_QUESTION = 'ASK_QUESTION',
  MULTISTEP_PROMPTS = 'MULTISTEP_PROMPTS',
  SINGLE_PROMPT = 'SINGLE_PROMPT',
}

export interface UserDoc {
  googleDocId: string;
  user: string;
  wordDocId?: string;
  title: string;
  documentIntention?: Intention;
  currentDayIntention?: Intention;
  assignmentDescription?: string;
  createdAt: string;
  updatedAt: string;
  admin: boolean;
  service: DocService;
  archived: boolean;
  courseAssignmentId: string;
}

export interface StoreUserDoc
  extends Partial<
    Omit<UserDoc, 'createdAt' | 'updatedAt' | 'googleDocId' | 'user'>
  > {
  googleDocId: string;
  user: string;
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

export enum NumChatMessagesIncluded {
  ALL = 'all',
  LAST_1 = 'last_1',
  LAST_3 = 'last_3',
  LAST_5 = 'last_5',
  LAST_10 = 'last_10',
}

export const numMessagesToNumber = {
  [NumChatMessagesIncluded.ALL]: 1000,
  [NumChatMessagesIncluded.LAST_1]: 1,
  [NumChatMessagesIncluded.LAST_3]: 3,
  [NumChatMessagesIncluded.LAST_5]: 5,
  [NumChatMessagesIncluded.LAST_10]: 10,
};

export interface AiPromptStep {
  prompts: PromptConfiguration[];
  targetAiServiceModel?: AiServiceModel;
  systemRole?: string;
  outputDataType: PromptOutputTypes;
  includeChatLogContext?: boolean;
  numChatMessagesIncluded?: NumChatMessagesIncluded;
  responseFormat?: string;
  webSearch?: boolean;
  editDoc?: boolean;
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
  disabled?: boolean;
}

export interface IGoalActivites {
  goal: string;
  builtActivities: IActivityConfig[];
}

export interface ColorThemeConfig {
  headerColor: string;
  headerButtonsColor: string;
  chatSystemBubbleColor: string;
  chatSystemTextColor: string;
  chatUserBubbleColor: string;
  chatUserTextColor: string;
}

export interface SurveyConfig {
  surveyLink: string;
  surveyQueryParam: string;
  surveyClassroomParam: string;
}

export interface ServiceModelInfo {
  name: string;
  maxTokens: number;
  supportsWebSearch: boolean;
  onlyAdminUse?: boolean;
  disabled?: boolean;
}

export type AiServiceModelConfigs = {
  serviceName: AiServiceNames;
  modelList: ServiceModelInfo[];
};

export interface Config {
  aiSystemPrompt: string[];
  colorTheme?: ColorThemeConfig;
  displayedGoalActivities?: IGoalActivites[];
  exampleGoogleDocs?: string[];
  overrideAiModel?: AiServiceModel;
  defaultAiModel?: AiServiceModel;
  aiServiceModelConfigs?: AiServiceModelConfigs[];
  approvedEmailsForAiModels?: string[];
  headerTitle?: string; // first word will be golden
  orgName?: string;
  loginScreenTitle?: string;
  surveyConfig?: SurveyConfig;
  bannerConfig?: BannerConfig;
  privacyPolicy?: string;
}

export interface BannerConfig {
  bannerText: string;
  bannerTextColor: string;
  bannerBgColor: string;
}

export enum ActivityStepTypes {
  FREE_RESPONSE_QUESTION = 'FREE_RESPONSE_QUESTION',
  MULTIPLE_CHOICE_QUESTIONS = 'MULTIPLE_CHOICE_QUESTIONS',
  MESSAGE = 'MESSAGE',
  SHOULD_INCLUDE_ESSAY = 'SHOULD_INCLUDE_ESSAY',
}

export interface ActiveActivityStep {
  id?: string;
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

export interface StepData {
  executePrompt: (
    prompt: (messages: ChatMessageTypes[]) => GQLPrompt,
    callback?: (response: AiServicesResponseTypes) => void,
    customSystemRoleMessage?: string
  ) => Promise<void>;
  openSelectActivityModal: () => void;
  sendMessage: (msg: ChatMessageTypes) => void;
  setWaitingForUserAnswer: (waiting: boolean) => void;
  updateSessionIntention: (intention?: Intention) => void;
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

export type ActivityTypes = ActivityBuilder | ActivityGQL;

export interface ActivityGQL extends IActivity {
  _id: string;
  title: string;
  activityType: 'gql';
  introduction: string;
  description: string;
  steps?: ActivityStepGQL[];
  displayIcon: DisplayIcons;
  disabled?: boolean;
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
  builtActivities: ActivityBuilder[];
}

export enum JobStatus {
  QUEUED = 'QUEUED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETE = 'COMPLETE',
  FAILED = 'FAILED',
}

export interface DocumentTimelineJobStatus {
  jobStatus: JobStatus;
  documentTimeline?: DehydratedGQLDocumentTimeline;
}

export enum TimelinePointType {
  INTRO = 'INTRO',
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
  versionId: string;
  version: IGDocVersion;
  intent: string;
  changeSummary: string;
  changeSummaryStatus: AiGenerationStatus;
  userInputSummary: string;
  reverseOutline: string;
  reverseOutlineStatus: AiGenerationStatus;
  relatedFeedback: string;
}

export interface DehydratedGQLTimelinePoint
  extends Omit<GQLTimelinePoint, 'version'> {
  version?: IGDocVersion;
}

export interface ChatItem {
  sender: Sender;
  message: string;
}

export interface IGDocVersion {
  _id: string;
  docId: string;
  plainText: string;
  markdownText: string;
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
  courseAssignmentId: string;
}

export interface GQLDocumentTimeline {
  docId: string;
  user: string;
  timelinePoints: GQLTimelinePoint[];
}

export interface DehydratedGQLDocumentTimeline
  extends Omit<GQLDocumentTimeline, 'timelinePoints'> {
  timelinePoints: DehydratedGQLTimelinePoint[];
}

export interface SortConfig {
  field: string;
  ascend: boolean;
}

export interface ReverseOutline {
  'Thesis Statement': string;
  'Supporting Claims': string[];
  'Evidence Given for Each Claim': Record<string, string[]>[];
  /**
   * {
   *  'Claim A': string;
   *  'Claim A Evidence': string[];
   * }
   *
   * {
   *  'Claim B': string;
   *  'Claim B Evidence': string[];
   * }
   * ...
   */
}
