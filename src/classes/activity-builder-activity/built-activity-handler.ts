/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import {
  AiServicesResponseTypes,
  AiServiceStepDataTypes,
} from '../../ai-services/ai-service-types';
import {
  ActivityBuilder,
  ActivityBuilderStep,
  ActivityBuilderStepType,
  PromptActivityStep,
  SystemMessageActivityStep,
  RequestUserInputActivityStep,
  PredefinedResponse,
  ConditionalActivityStep,
  Checking,
  SinglePromptConfiguration,
  JsonResponseData,
} from '../../components/activity-builder/types';
import {
  ChatLog,
  ChatMessageTypes,
  MessageDisplayType,
  Sender,
} from '../../store/slices/chat';
import { v4 as uuidv4 } from 'uuid';
import {
  AiPromptStep,
  DocData,
  DocService,
  PromptConfiguration,
  PromptOutputTypes,
  PromptRoles,
} from '../../types';
import { chatLogToString, isJsonString } from '../../helpers';
import {
  recursivelyConvertExpectedDataToAiPromptString,
  processPredefinedResponses,
  receivedExpectedData,
  replaceStoredDataInString,
  sortMessagesByResponseWeight,
  recursiveUpdateAdditionalInfo,
  STRING_ARRAY_SPLITTER,
} from '../../components/activity-builder/helpers';
import { ChatLogSubscriber } from '../../hooks/use-with-chat-log-subscribers';
import { getDocData } from '../../hooks/api';
import { Panelist, Panel } from '../../store/slices/panels/types';
import { RagStoreConfiguration } from '../../types';

interface UserResponseHandleState {
  responseNavigations: {
    response: string;
    jumpToStepId: string;
  }[];
}

function getDefaultUserResponseHandleState(): UserResponseHandleState {
  return {
    responseNavigations: [],
  };
}
export const EDIT_DOC_GOAL_MESSAGE = 'New Activity';
export const GO_HOME_BUTTON_MESSAGE = 'Return to Home';
export const DOC_TEXT_KEY = 'doc_text';
export const DOC_NUM_WORDS_KEY = 'doc_num_words';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type StateData = Record<string, any>;

export class BuiltActivityHandler implements ChatLogSubscriber {
  builtActivityData: ActivityBuilder | undefined;
  curStep: ActivityBuilderStep | undefined;
  stateData: StateData;
  chatLog: ChatLog = [];
  errorMessage: string | null = null;
  sendMessage: (msg: ChatMessageTypes) => void;
  clearChat: () => void;
  setWaitingForUserAnswer: (waiting: boolean) => void;
  setResponsePending: (pending: boolean) => void;
  updateSessionIntention: (intention: string) => void;
  executePrompt: (
    aiPromptSteps: AiPromptStep[]
  ) => Promise<AiServicesResponseTypes>;
  editDocGoal: () => void;
  userResponseHandleState: UserResponseHandleState;
  stepIdsSinceLastInput: string[];
  lastFailedStepId: string | null = null;
  docId: string;
  docService: DocService;
  handleStudentActivityComplete: () => void;
  onGoHome: () => void;
  activityPanel?: Panel;
  activityPanelists?: Panelist[];

  getStepById(stepId: string): ActivityBuilderStep | undefined {
    if (
      !this.builtActivityData ||
      !this.builtActivityData.flowsList.length ||
      !this.builtActivityData.flowsList[0].steps.length
    ) {
      throw new Error('No activity data found');
    }
    for (let i = 0; i < this.builtActivityData.flowsList.length; i++) {
      const flow = this.builtActivityData.flowsList[i];
      for (let j = 0; j < flow.steps.length; j++) {
        const step = flow.steps[j];
        if (step.stepId === stepId) {
          return step;
        }
      }
    }
    return undefined;
  }

  getNextStep(currentStep: ActivityBuilderStep): ActivityBuilderStep {
    if (!this.builtActivityData) {
      throw new Error('No activity data found');
    }

    if (currentStep.jumpToStepId) {
      const jumpStep = this.getStepById(currentStep.jumpToStepId);
      if (!jumpStep) {
        throw new Error(
          `Unable to find target step ${currentStep.jumpToStepId}, maybe you deleted it and forgot to update this step?`
        );
      }
      return jumpStep;
    } else {
      // go to next step in current flow
      const currentStepFlowList = this.builtActivityData.flowsList.find(
        (flow) => flow.steps.find((step) => step.stepId === currentStep.stepId)
      );

      if (!currentStepFlowList) {
        throw new Error(`Unable to find flow for step: ${currentStep.stepId}`);
      }

      const currentStepIndex = currentStepFlowList.steps.findIndex(
        (step) => step.stepId === currentStep.stepId
      );

      if (currentStepIndex === -1) {
        throw new Error(
          `Unable to find requested step: ${currentStep.stepId} in flow ${currentStepFlowList.name}`
        );
      }
      const nextStepIndex = currentStepIndex + 1;
      if (nextStepIndex >= currentStepFlowList.steps.length) {
        throw new Error(
          'No next step found, maybe you forgot to add a jumpToStepId for the last step in a flow?'
        );
      } else {
        return currentStepFlowList.steps[nextStepIndex];
      }
    }
  }

  constructor(
    sendMessage: (msg: ChatMessageTypes) => void,
    clearChat: () => void,
    setWaitingForUserAnswer: (waiting: boolean) => void,
    setResponsePending: (pending: boolean) => void,
    updateSessionIntention: (intention: string) => void,
    executePrompt: (
      aiPromptSteps: AiPromptStep[]
    ) => Promise<AiServicesResponseTypes>,
    docId: string,
    editDocGoal: () => void,
    docService: DocService,
    handleStudentActivityComplete: () => void,
    onGoHome: () => void,
    builtActivityData?: ActivityBuilder,
    activityPanel?: Panel,
    activityPanelists?: Panelist[]
  ) {
    this.docId = docId;
    this.docService = docService;
    this.builtActivityData = builtActivityData;
    this.stateData = {};
    this.stepIdsSinceLastInput = [];
    this.userResponseHandleState = getDefaultUserResponseHandleState();
    this.sendMessage = sendMessage;
    this.clearChat = clearChat;
    this.setWaitingForUserAnswer = setWaitingForUserAnswer;
    this.updateSessionIntention = updateSessionIntention;
    this.executePrompt = executePrompt;
    this.setResponsePending = setResponsePending;
    this.editDocGoal = editDocGoal;
    this.handleStudentActivityComplete = handleStudentActivityComplete;
    this.onGoHome = onGoHome;
    this.activityPanel = activityPanel;
    this.activityPanelists = activityPanelists;
    this.setBuiltActivityData = this.setBuiltActivityData.bind(this);
    this.initializeActivity = this.initializeActivity.bind(this);
    this.resetActivity = this.resetActivity.bind(this);
    this.handleStep = this.handleStep.bind(this);
    this.handleSystemMessageStep = this.handleSystemMessageStep.bind(this);
    this.handleRequestUserInputStep =
      this.handleRequestUserInputStep.bind(this);
    this.goToNextStep = this.goToNextStep.bind(this);
    this.handleNewUserMessage = this.handleNewUserMessage.bind(this);
    this.handlePromptStep = this.handlePromptStep.bind(this);
    this.getNextStep = this.getNextStep.bind(this);
    this.getStepById = this.getStepById.bind(this);
    this.addResponseNavigation = this.addResponseNavigation.bind(this);
    this.handleExtractMcqChoices = this.handleExtractMcqChoices.bind(this);
  }

  setBuiltActivityData(builtActivityData?: ActivityBuilder) {
    this.builtActivityData = builtActivityData;
  }

  initializeActivity() {
    if (
      !this.builtActivityData ||
      !this.builtActivityData.flowsList.length ||
      !this.builtActivityData.flowsList[0].steps.length
    ) {
      throw new Error('No built activity data found');
    }
    this.resetActivity();
  }

  resetActivity() {
    if (
      !this.builtActivityData ||
      !this.builtActivityData.flowsList.length ||
      !this.builtActivityData.flowsList[0].steps.length
    ) {
      throw new Error('No built activity data found');
    }
    this.clearChat();
    this.curStep = this.builtActivityData.flowsList[0].steps[0];
    this.stateData = {};
    this.stepIdsSinceLastInput = [];
    this.userResponseHandleState = getDefaultUserResponseHandleState();
    this.handleStep(this.curStep);
  }

  async handleStep(step: ActivityBuilderStep) {
    if (this.curStep?.stepId !== step.stepId) {
      this.curStep = step;
    }
    if (step.setStudentActivityComplete) {
      this.handleStudentActivityComplete();
    }
    if (step.stepType === ActivityBuilderStepType.REQUEST_USER_INPUT) {
      this.stepIdsSinceLastInput = [];
    }
    if (this.stepIdsSinceLastInput.includes(step.stepId)) {
      this.sendMessage({
        id: uuidv4(),
        message:
          'Oops! A loop was detected in this activity, we are halting the activity to prevent an infinite loop. Please contact the activity creator to fix this issue.',
        sender: Sender.SYSTEM,
        displayType: MessageDisplayType.TEXT,
      });
      return;
    }
    this.stepIdsSinceLastInput.push(step.stepId);
    // work through steps until we get to a user message step, then wait to be notified of a user message
    // handle the step
    switch (step.stepType) {
      case ActivityBuilderStepType.REQUEST_USER_INPUT:
        await this.handleRequestUserInputStep(
          step as RequestUserInputActivityStep
        );
        break;
      case ActivityBuilderStepType.SYSTEM_MESSAGE:
        await this.handleSystemMessageStep(step as SystemMessageActivityStep);
        break;
      case ActivityBuilderStepType.PROMPT:
        await this.handlePromptStep(step as PromptActivityStep);
        break;
      case ActivityBuilderStepType.CONDITIONAL:
        await this.handleLogicOperationStep(step as ConditionalActivityStep);
        break;
      default:
        throw new Error(`Unknown step type: ${step.stepType}`);
    }
  }

  async handleLogicOperationStep(step: ConditionalActivityStep) {
    this.setResponsePending(true);
    const docData = await getDocData(this.docId, this.docService);
    this.stateData = {
      ...this.stateData,
      [DOC_TEXT_KEY]: docData.plainText,
      [DOC_NUM_WORDS_KEY]: docData.plainText.split(' ').length,
    };
    const conditionals = step.conditionals.map((c) => ({
      ...c,
      expectedValue: replaceStoredDataInString(c.expectedValue, this.stateData),
    }));
    this.setResponsePending(false);
    for (let i = 0; i < conditionals.length; i++) {
      const condition = conditionals[i];
      const stateValue = this.stateData[condition.stateDataKey];
      if (!stateValue) {
        this.sendErrorMessage(
          `An error occured during this activity. Could not find state value ${condition.stateDataKey}.`
        );
        return;
      }

      if (condition.checking === Checking.VALUE) {
        const expression = `${String(stateValue)} ${condition.operation} ${
          condition.expectedValue
        }`;
        const conditionTrue = new Function(`return ${expression};`)();
        if (conditionTrue) {
          const step = this.getStepById(condition.targetStepId);
          if (!step) {
            this.sendErrorMessage(
              `An error occured during this activity. Could not find step: ${condition.targetStepId}`
            );
            return;
          }
          this.handleStep(step);
          return;
        }
      } else if (condition.checking === Checking.LENGTH) {
        const expression = `${stateValue.length} ${condition.operation} ${condition.expectedValue}`;
        const conditionTrue = new Function(`return ${expression};`)();
        if (conditionTrue) {
          const step = this.getStepById(condition.targetStepId);
          if (!step) {
            this.sendErrorMessage(
              `An error occured during this activity. Could not find step: ${condition.targetStepId}`
            );
            return;
          }
          this.handleStep(step);
          return;
        }
      } else {
        // Checking if array or string contains value
        const conditionTrue = Array.isArray(stateValue)
          ? stateValue.find((a) => String(a) === condition.expectedValue)
          : (stateValue as string).includes(String(condition.expectedValue));
        if (conditionTrue) {
          const step = this.getStepById(condition.targetStepId);
          if (!step) {
            this.sendErrorMessage(
              `An error occured during this activity. Could not find step: ${condition.targetStepId}`
            );
            return;
          }
          this.handleStep(step);
          return;
        }
      }
    }

    await this.goToNextStep();
  }

  async handleSystemMessageStep(step: SystemMessageActivityStep) {
    // Check if we should send messages from panelists
    console.log(
      'step.sendFromPanelistClientIds',
      step.sendFromPanelistClientIds
    );
    console.log('this.activityPanel', this.activityPanel);
    console.log('this.activityPanelists', this.activityPanelists);
    if (
      step.sendFromPanelistClientIds &&
      step.sendFromPanelistClientIds.length > 0 &&
      this.activityPanel &&
      this.activityPanelists
    ) {
      const effectivePanelists = step.sendFromPanelistClientIds.reduce(
        (acc: Panelist[], clientId) => {
          const panelist = this.activityPanelists?.find(
            (p) => p.clientId === clientId
          );
          if (panelist) {
            acc.push(panelist);
          }
          return acc;
        },
        []
      );
      const panelistData = this.stateData['panelistData'];

      if (panelistData && typeof panelistData === 'object') {
        // Send a message for each panelist
        for (const panelistClientId of Object.keys(panelistData)) {
          const panelist = effectivePanelists.find(
            (p) => p.clientId === panelistClientId
          );

          if (panelist) {
            console.log('panelist found', panelist.panelistName);
            this.sendMessage({
              id: uuidv4(),
              message: replaceStoredDataInString(
                step.message,
                this.stateData,
                panelistClientId
              ),
              sender: Sender.SYSTEM,
              systemCustomName: panelist.panelistName,
              displayType: MessageDisplayType.TEXT,
            });
          } else {
            console.log('panelist not found', panelistClientId);
          }
        }
      }
    } else {
      // Normal system message
      this.sendMessage({
        id: uuidv4(),
        message: replaceStoredDataInString(step.message, this.stateData),
        sender: Sender.SYSTEM,
        systemCustomName: step.systemCustomName,
        displayType: MessageDisplayType.TEXT,
      });
    }
    await this.goToNextStep();
  }

  async handleRequestUserInputStep(step: RequestUserInputActivityStep) {
    const processedPredefinedResponses = processPredefinedResponses(
      step.predefinedResponses,
      this.stateData
    );
    this.sendMessage({
      id: uuidv4(),
      message: replaceStoredDataInString(step.message, this.stateData),
      sender: Sender.SYSTEM,
      systemCustomName: step.systemCustomName,
      displayType: MessageDisplayType.TEXT,
      disableUserInput: step.disableFreeInput,
      mcqChoices: this.handleExtractMcqChoices(processedPredefinedResponses),
    });
    this.setWaitingForUserAnswer(true);
    // Will now wait for user input before progressing to next step
  }

  handleExtractMcqChoices(predefinedResponses: PredefinedResponse[]): string[] {
    const finalRes: string[] = [];
    for (let i = 0; i < predefinedResponses.length; i++) {
      const res = predefinedResponses[i];
      if (res.isArray) {
        const responsesArray = res.message.split(STRING_ARRAY_SPLITTER);
        if (res.jumpToStepId) {
          for (let j = 0; j < responsesArray.length; j++) {
            this.addResponseNavigation(responsesArray[j], res.jumpToStepId);
          }
        }
        finalRes.push(...responsesArray);
      } else {
        const resString = replaceStoredDataInString(
          res.message,
          this.stateData
        );
        if (res.jumpToStepId) {
          this.addResponseNavigation(resString, res.jumpToStepId);
        }
        finalRes.push(resString);
      }
    }
    return sortMessagesByResponseWeight(finalRes, predefinedResponses);
  }

  addResponseNavigation(response: string, jumpToStepId: string) {
    this.userResponseHandleState.responseNavigations.push({
      response,
      jumpToStepId,
    });
  }

  getStoredArray(str: string): string[] {
    const regex = /{{(.*?)}}/g;
    const key = str.match(regex);
    if (key) {
      const keyName = key[0].slice(2, -2);
      if (Array.isArray(this.stateData[keyName])) {
        return this.stateData[keyName];
      }
    }
    return [str];
  }

  mergeRagConfigs(
    baseRagConfig: RagStoreConfiguration | undefined,
    panelistRagConfig: RagStoreConfiguration
  ): RagStoreConfiguration | undefined {
    // If no base config, return panelist config
    if (!baseRagConfig) {
      return panelistRagConfig;
    }

    // Merge ragQuery fields (combine base + panelist)
    const baseRagQuery = baseRagConfig.ragQuery || '';
    const panelistRagQuery = panelistRagConfig.ragQuery || '';

    const mergedRagQuery =
      baseRagQuery && panelistRagQuery
        ? `${baseRagQuery}\n${panelistRagQuery}`
        : baseRagQuery || panelistRagQuery;

    // Merge filters (combine agent_ids and group_ids arrays)
    const mergedFilters: Record<string, string | string[]> = {
      ...(baseRagConfig.filters || {}),
    };

    if (panelistRagConfig.filters) {
      for (const [key, value] of Object.entries(panelistRagConfig.filters)) {
        if (mergedFilters[key]) {
          // Merge arrays for existing keys
          const existingValue = mergedFilters[key];
          const newValue = value;

          const existingArray = Array.isArray(existingValue)
            ? existingValue
            : [existingValue];
          const newArray = Array.isArray(newValue) ? newValue : [newValue];

          mergedFilters[key] = [...existingArray, ...newArray];
        } else {
          // Add new key
          mergedFilters[key] = value;
        }
      }
    }

    // Return merged config with base topN, merged filters and ragQuery
    return {
      ragQuery: mergedRagQuery,
      topN: baseRagConfig.topN,
      filters: mergedFilters,
    };
  }

  async goToNextStep() {
    if (!this.curStep) {
      throw new Error('No current step found');
    }
    try {
      this.curStep = this.getNextStep(this.curStep);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      this.sendErrorMessage(err.message);
      return;
    }
    await this.handleStep(this.curStep);
  }

  sendErrorMessage(message: string) {
    this.sendMessage({
      id: uuidv4(),
      message,
      sender: Sender.SYSTEM,
      displayType: MessageDisplayType.TEXT,
      disableUserInput: true,
    });
  }

  async handleNewUserMessage(message: string) {
    if (!this.curStep) {
      throw new Error('No current step found');
    }
    if (this.curStep.stepType !== ActivityBuilderStepType.REQUEST_USER_INPUT) {
      return;
    }
    console.log('message', message);
    if (message === EDIT_DOC_GOAL_MESSAGE) {
      this.editDocGoal();
    }
    if (message === GO_HOME_BUTTON_MESSAGE) {
      this.onGoHome();
    }
    const userInputStep = this.curStep as RequestUserInputActivityStep;
    if (userInputStep.saveAsIntention) {
      this.updateSessionIntention(message);
    }
    if (userInputStep.saveResponseVariableName) {
      this.stateData[userInputStep.saveResponseVariableName] = message;
    }
    const requestUserInputStep = this.curStep as RequestUserInputActivityStep;
    if (requestUserInputStep.predefinedResponses.length > 0) {
      const predefinedResponseMatch =
        requestUserInputStep.predefinedResponses.find(
          (response) => response.message === message
        );
      if (predefinedResponseMatch) {
        if (predefinedResponseMatch.jumpToStepId) {
          const jumpStep = this.getStepById(
            predefinedResponseMatch.jumpToStepId
          );
          if (!jumpStep) {
            this.sendErrorMessage(
              `Unable to find target step ${predefinedResponseMatch.jumpToStepId} for predefined input ${predefinedResponseMatch.message}, maybe you deleted it and forgot to update this step?`
            );
            return;
          }
          this.handleStep(jumpStep);
          return;
        }
      }
    }
    this.setWaitingForUserAnswer(false);
    if (this.userResponseHandleState.responseNavigations.length > 0) {
      for (
        let i = 0;
        i < this.userResponseHandleState.responseNavigations.length;
        i++
      ) {
        const responseNavigation =
          this.userResponseHandleState.responseNavigations[i];
        if (responseNavigation.response === message) {
          const jumpStep = this.getStepById(responseNavigation.jumpToStepId);
          if (!jumpStep) {
            this.sendErrorMessage(
              `Unable to find target step ${responseNavigation.jumpToStepId} for predefined input ${responseNavigation.response}, maybe you deleted it and forgot to update this step?`
            );
            return;
          }
          this.handleStep(jumpStep);
          return;
        }
      }
    }
    // reset user response handle state since we handled the user response
    this.userResponseHandleState = getDefaultUserResponseHandleState();
    await this.goToNextStep();
  }

  newDocDataReceived(docData?: DocData) {
    if (!docData) {
      delete this.stateData[DOC_TEXT_KEY];
      delete this.stateData[DOC_NUM_WORDS_KEY];
      return;
    }
    this.stateData = {
      ...this.stateData,
      [DOC_TEXT_KEY]: docData.plainText,
      [DOC_NUM_WORDS_KEY]: docData.plainText.split(' ').length,
    };
  }

  newChatLogReceived(chatLog: ChatLog) {
    this.chatLog = chatLog;
    if (chatLog.length === 0) {
      return;
    }
    const newMessage = chatLog[chatLog.length - 1];
    if (newMessage.sender === Sender.USER) {
      this.handleNewUserMessage(newMessage.message);
    }
  }

  async handlePromptStep(step: PromptActivityStep) {
    this.setResponsePending(true);

    // Prepare all prompt executions (including panelist prompts)
    const promptExecutions: Promise<
      | {
          type: 'json';
          data: StateData;
          originalConfiguration: SinglePromptConfiguration;
          panelistClientId?: string;
        }
      | {
          type: 'text';
          message: string;
          aiServiceStepData: AiServiceStepDataTypes[];
          originalConfiguration: SinglePromptConfiguration;
          panelistClientId?: string;
          panelistName?: string;
        }
    >[] = [];

    for (const config of step.promptConfigurations) {
      if (
        config.runForPanelistClientIds &&
        this.activityPanel &&
        this.activityPanelists
      ) {
        const effectivePanelists = config.runForPanelistClientIds.reduce(
          (acc: Panelist[], clientId) => {
            const panelist = this.activityPanelists?.find(
              (p) => p.clientId === clientId
            );
            if (panelist) {
              acc.push(panelist);
            }
            return acc;
          },
          []
        );
        // Execute prompt for each panelist
        for (const panelist of effectivePanelists) {
          promptExecutions.push(
            this.executePanelistPromptConfiguration(config, panelist)
          );
        }
      } else {
        // Execute normal prompt
        promptExecutions.push(this.executeSinglePromptConfiguration(config));
      }
    }

    // Execute all prompts in parallel
    const promptResults = await Promise.allSettled(promptExecutions);

    // Check if any prompts failed
    const hasFailures = promptResults.some(
      (result) => result.status === 'rejected'
    );

    if (hasFailures) {
      // If any prompt failed, fail the entire step
      this.sendErrorMessage('AI Service request failed');
      this.lastFailedStepId = step.stepId;
      this.setResponsePending(false);
      return;
    }

    // All prompts succeeded - process results
    const jsonResults: StateData = {};
    const panelistData: Record<string, StateData> = {};

    for (const result of promptResults) {
      if (result.status === 'fulfilled') {
        if (result.value.type === 'json') {
          // Check if this is a panelist result
          if (result.value.panelistClientId) {
            // Store panelist JSON data under panelistData
            panelistData[result.value.panelistClientId] = result.value.data;
          } else {
            // Merge JSON results into accumulated object
            if (result.value.originalConfiguration.systemCustomName) {
              jsonResults['named_system_responses'] = {
                ...(jsonResults['named_system_responses'] || {}),
                [result.value.originalConfiguration.systemCustomName]:
                  result.value.data,
              };
            } else {
              Object.assign(jsonResults, result.value.data);
            }
          }
        } else if (result.value.type === 'text') {
          // Send text response as message
          this.sendMessage({
            id: uuidv4(),
            message: result.value.message,
            aiServiceStepData: result.value.aiServiceStepData,
            sender: Sender.SYSTEM,
            systemCustomName:
              result.value.panelistName ||
              result.value.originalConfiguration.systemCustomName,
            displayType: MessageDisplayType.TEXT,
          });
        }
      }
    }

    // Merge all JSON results into stateData
    if (Object.keys(jsonResults).length > 0) {
      this.stateData = { ...this.stateData, ...jsonResults };
    }

    // Add panelist data to stateData
    if (Object.keys(panelistData).length > 0) {
      this.stateData = {
        ...this.stateData,
        panelistData: {
          ...(this.stateData['panelistData'] || {}),
          ...panelistData,
        },
      };
    }

    this.setResponsePending(false);
    await this.goToNextStep();
  }

  async executeSinglePromptConfiguration(
    config: SinglePromptConfiguration
  ): Promise<
    | {
        type: 'json';
        data: StateData;
        originalConfiguration: SinglePromptConfiguration;
      }
    | {
        type: 'text';
        message: string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        aiServiceStepData: any;
        originalConfiguration: SinglePromptConfiguration;
      }
  > {
    // Build AI prompt steps with replaced data
    const promptText = replaceStoredDataInString(
      config.promptText,
      this.stateData
    );
    const responseFormat = replaceStoredDataInString(
      config.responseFormat,
      this.stateData
    );
    const customSystemRole = replaceStoredDataInString(
      config.customSystemRole,
      this.stateData
    );

    const ragConfiguration = config.ragConfiguration
      ? {
          ragQuery: replaceStoredDataInString(
            config.ragConfiguration.ragQuery,
            this.stateData
          ),
          topN: config.ragConfiguration.topN,
          filters: config.ragConfiguration.filters,
        }
      : undefined;

    const aiPromptSteps: AiPromptStep[] = [
      {
        prompts: [],
        outputDataType: config.outputDataType,
        responseFormat,
        systemRole: customSystemRole,
        webSearch: config.webSearch || false,
        editDoc: config.editDoc || false,
        ragConfiguration: ragConfiguration,
      },
    ];

    // Add chat log context if configured
    if (config.includeChatLogContext) {
      aiPromptSteps[0].prompts.push({
        promptText: `Current state of chat log between user and system: ${chatLogToString(
          this.chatLog,
          1000
        )}`,
        includeEssay: false,
        promptRole: PromptRoles.USER,
      });
    }

    // Add main prompt
    const promptConfiguration: PromptConfiguration = {
      promptText,
      includeEssay: config.includeEssay,
      promptRole: PromptRoles.USER,
    };
    aiPromptSteps[0].prompts.push(promptConfiguration);

    // Handle JSON response format
    if (
      config.jsonResponseData &&
      config.outputDataType === PromptOutputTypes.JSON
    ) {
      aiPromptSteps[0].responseFormat =
        recursivelyConvertExpectedDataToAiPromptString(
          recursiveUpdateAdditionalInfo(config.jsonResponseData, this.stateData)
        );
    }

    // Retry logic: attempt up to 3 times
    return await this.retryPromptExecution(
      aiPromptSteps,
      config.outputDataType,
      config,
      config.jsonResponseData
    );
  }

  async executePanelistPromptConfiguration(
    config: SinglePromptConfiguration,
    panelist: Panelist
  ): Promise<
    | {
        type: 'json';
        data: StateData;
        originalConfiguration: SinglePromptConfiguration;
        panelistClientId: string;
      }
    | {
        type: 'text';
        message: string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        aiServiceStepData: any;
        originalConfiguration: SinglePromptConfiguration;
        panelistClientId: string;
        panelistName: string;
      }
  > {
    // Build AI prompt steps with replaced data and panelist modifications
    const basePromptText = replaceStoredDataInString(
      config.promptText,
      this.stateData
    );
    const panelistPromptSegment = replaceStoredDataInString(
      panelist.promptSegment,
      this.stateData
    );
    const promptText = `${basePromptText}\n${panelistPromptSegment}`;

    const responseFormat = replaceStoredDataInString(
      config.responseFormat,
      this.stateData
    );

    const baseCustomSystemRole = replaceStoredDataInString(
      config.customSystemRole,
      this.stateData
    );
    const panelistRoleSegment = replaceStoredDataInString(
      panelist.roleSegment,
      this.stateData
    );
    const customSystemRole = `${baseCustomSystemRole}\n${panelistRoleSegment}`;

    // Merge RAG configurations
    const mergedRagConfig = this.mergeRagConfigs(
      config.ragConfiguration,
      panelist.ragConfig || { ragQuery: '', topN: 0, filters: {} }
    );

    const ragConfiguration = mergedRagConfig
      ? {
          ragQuery: replaceStoredDataInString(
            mergedRagConfig.ragQuery,
            this.stateData
          ),
          topN: mergedRagConfig.topN,
          filters: mergedRagConfig.filters || {},
        }
      : undefined;

    const aiPromptSteps: AiPromptStep[] = [
      {
        prompts: [],
        outputDataType: config.outputDataType,
        responseFormat,
        systemRole: customSystemRole,
        webSearch: config.webSearch || false,
        editDoc: config.editDoc || false,
        ragConfiguration: ragConfiguration,
      },
    ];

    // Add chat log context if configured
    if (config.includeChatLogContext) {
      aiPromptSteps[0].prompts.push({
        promptText: `Current state of chat log between user and system: ${chatLogToString(
          this.chatLog,
          1000
        )}`,
        includeEssay: false,
        promptRole: PromptRoles.USER,
      });
    }

    // Add main prompt
    const promptConfiguration: PromptConfiguration = {
      promptText,
      includeEssay: config.includeEssay,
      promptRole: PromptRoles.USER,
    };
    aiPromptSteps[0].prompts.push(promptConfiguration);

    // Handle JSON response format
    if (
      config.jsonResponseData &&
      config.outputDataType === PromptOutputTypes.JSON
    ) {
      aiPromptSteps[0].responseFormat =
        recursivelyConvertExpectedDataToAiPromptString(
          recursiveUpdateAdditionalInfo(config.jsonResponseData, this.stateData)
        );
    }

    // Retry logic: attempt up to 3 times
    const result = await this.retryPromptExecution(
      aiPromptSteps,
      config.outputDataType,
      config,
      config.jsonResponseData
    );

    // Add panelist information to the result
    if (result.type === 'json') {
      return {
        ...result,
        panelistClientId: panelist.clientId,
      };
    } else {
      return {
        ...result,
        panelistClientId: panelist.clientId,
        panelistName: panelist.panelistName,
      };
    }
  }

  async retryPromptExecution(
    aiPromptSteps: AiPromptStep[],
    outputDataType: PromptOutputTypes,
    originalConfiguration: SinglePromptConfiguration,
    jsonResponseData?: JsonResponseData[]
  ): Promise<
    | {
        type: 'json';
        data: StateData;
        originalConfiguration: SinglePromptConfiguration;
      }
    | {
        type: 'text';
        message: string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        aiServiceStepData: any;
        originalConfiguration: SinglePromptConfiguration;
      }
  > {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const _response = await this.executePrompt(aiPromptSteps);
        const response = _response.answer;

        if (outputDataType === PromptOutputTypes.JSON) {
          // Validate and parse JSON response
          if (!isJsonString(response)) {
            throw new Error('Did not receive valid JSON data');
          }
          if (jsonResponseData) {
            if (!receivedExpectedData(jsonResponseData, response)) {
              this.errorMessage = 'Did not receive expected JSON data';
              throw new Error('Did not receive expected JSON data');
            }
          }
          const resData = JSON.parse(response);
          return {
            type: 'json',
            data: resData,
            originalConfiguration: originalConfiguration,
          };
        } else {
          // Return text response
          return {
            type: 'text',
            message: response,
            aiServiceStepData: _response.aiAllStepsData,
            originalConfiguration: originalConfiguration,
          };
        }
      } catch (err) {
        console.log(`Prompt execution attempt ${attempt + 1} failed:`, err);
        lastError = err as Error;
      }
    }

    // All retries exhausted
    throw lastError || new Error('Prompt execution failed after 3 attempts');
  }
}
