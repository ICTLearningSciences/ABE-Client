/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import {
  AiServicesResponseTypes,
  extractServiceStepResponse,
} from '../../ai-services/ai-service-types';
import {
  ActivityBuilder,
  ActivityBuilderStep,
  ActivityBuilderStepType,
  PromptActivityStep,
  SystemMessageActivityStep,
  RequestUserInputActivityStep,
  PredefinedResponse,
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
  PromptConfiguration,
  PromptOutputTypes,
  PromptRoles,
} from '../../types';
import { chatLogToString, isJsonString } from '../../helpers';
import {
  convertExpectedDataToAiPromptString,
  receivedExpectedData,
} from '../../components/activity-builder/helpers';
import { ChatLogSubscriber } from '../../hooks/use-with-chat-log-subscribers';

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

export class BuiltActivityHandler implements ChatLogSubscriber {
  builtActivityData: ActivityBuilder | undefined;
  curStep: ActivityBuilderStep | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stateData: Record<string, any>;
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
  userResponseHandleState: UserResponseHandleState;

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
    builtActivityData?: ActivityBuilder
  ) {
    this.builtActivityData = builtActivityData;
    this.stateData = {};
    this.userResponseHandleState = getDefaultUserResponseHandleState();
    this.sendMessage = sendMessage;
    this.clearChat = clearChat;
    this.setWaitingForUserAnswer = setWaitingForUserAnswer;
    this.updateSessionIntention = updateSessionIntention;
    this.executePrompt = executePrompt;
    this.setResponsePending = setResponsePending;

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
    this.replaceStoredDataInString = this.replaceStoredDataInString.bind(this);
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
    this.userResponseHandleState = getDefaultUserResponseHandleState();
    this.handleStep(this.curStep);
  }

  async handleStep(step: ActivityBuilderStep) {
    if (this.curStep?.stepId !== step.stepId) {
      this.curStep = step;
    }
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
      default:
        throw new Error(`Unknown step type: ${step.stepType}`);
    }
  }

  async handleSystemMessageStep(step: SystemMessageActivityStep) {
    this.sendMessage({
      id: uuidv4(),
      message: this.replaceStoredDataInString(step.message),
      sender: Sender.SYSTEM,
      displayType: MessageDisplayType.TEXT,
    });
    await this.goToNextStep();
  }

  async handleRequestUserInputStep(step: RequestUserInputActivityStep) {
    this.sendMessage({
      id: uuidv4(),
      message: this.replaceStoredDataInString(step.message),
      sender: Sender.SYSTEM,
      displayType: MessageDisplayType.TEXT,
      disableUserInput: step.disableFreeInput,
      mcqChoices: this.handleExtractMcqChoices(step.predefinedResponses),
    });
    this.setWaitingForUserAnswer(true);
    // Will now wait for user input before progressing to next step
  }

  handleExtractMcqChoices(predefinedResponses: PredefinedResponse[]): string[] {
    const finalRes: string[] = [];
    for (let i = 0; i < predefinedResponses.length; i++) {
      const res = predefinedResponses[i];
      if (res.isArray) {
        const responsesArray = this.getStoredArray(res.message);
        if (res.jumpToStepId) {
          for (let j = 0; j < responsesArray.length; j++) {
            this.addResponseNavigation(responsesArray[j], res.jumpToStepId);
          }
        }
        finalRes.push(...responsesArray);
      } else {
        const resString = this.replaceStoredDataInString(res.message);
        if (res.jumpToStepId) {
          this.addResponseNavigation(resString, res.jumpToStepId);
        }
        finalRes.push(resString);
      }
    }
    return finalRes;
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

  replaceStoredDataInString(str: string): string {
    // replace all instances of {{key}} in str with stored data[key]
    const regex = /{{(.*?)}}/g;
    return str.trim().replace(regex, (match, key) => {
      return this.stateData[key] || match;
    });
  }

  async goToNextStep() {
    if (!this.curStep) {
      throw new Error('No current step found');
    }
    this.curStep = this.getNextStep(this.curStep);
    await this.handleStep(this.curStep);
  }

  async handleNewUserMessage(message: string) {
    if (!this.curStep) {
      throw new Error('No current step found');
    }
    if (this.curStep.stepType !== ActivityBuilderStepType.REQUEST_USER_INPUT) {
      return;
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
            throw new Error(
              `Unable to find target step ${predefinedResponseMatch.jumpToStepId} for predefined input ${predefinedResponseMatch.message}, maybe you deleted it and forgot to update this step?`
            );
          }
          this.handleStep(jumpStep);
          return;
        }
      }
    }
    const userInputStep = this.curStep as RequestUserInputActivityStep;
    if (userInputStep.saveAsIntention) {
      this.updateSessionIntention(message);
    }
    if (userInputStep.saveResponseVariableName) {
      this.stateData[userInputStep.saveResponseVariableName] = message;
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
            throw new Error(
              `Unable to find target step ${responseNavigation.jumpToStepId} for predefined input ${responseNavigation.response}, maybe you deleted it and forgot to update this step?`
            );
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
    // handle replacing promptText with stored data
    const promptText = this.replaceStoredDataInString(step.promptText);
    // handle replacing responseFormat with stored data
    const responseFormat = this.replaceStoredDataInString(step.responseFormat);
    // handle replacing customSystemRole with stored data
    const customSystemRole = this.replaceStoredDataInString(
      step.customSystemRole
    );

    const aiPromptSteps: AiPromptStep[] = [];

    // currently, we only have one prompt step. In the future, this variable will likely be reduced to a single step.
    aiPromptSteps.push({
      prompts: [],
      outputDataType: step.outputDataType,
      responseFormat,
      systemRole: customSystemRole,
    });

    if (step.includeChatLogContext) {
      aiPromptSteps[0].prompts.push({
        promptText: `Current state of chat log between user and system: ${chatLogToString(
          this.chatLog
        )}`,
        includeEssay: false,
        promptRole: PromptRoles.USER,
      });
    }

    const promptConfig: PromptConfiguration = {
      promptText,
      includeEssay: step.includeEssay, // handled by server
      promptRole: PromptRoles.USER,
    };

    aiPromptSteps[0].prompts.push(promptConfig);
    if (step.jsonResponseData) {
      aiPromptSteps[0].responseFormat = convertExpectedDataToAiPromptString(
        step.jsonResponseData
      );
    }

    // handle sending prompt
    const _response = await this.executePrompt(aiPromptSteps);
    const response = extractServiceStepResponse(_response, 0);

    if (step.outputDataType === PromptOutputTypes.JSON) {
      if (!isJsonString(response)) {
        this.errorMessage = 'Did not receive valid JSON data';
        throw new Error('Did not receive valid JSON data');
      }
      if (step.jsonResponseData) {
        if (!receivedExpectedData(step.jsonResponseData, response)) {
          this.errorMessage = 'Did not receive expected JSON data';
          throw new Error('Did not receive expected JSON data');
        }
      }
      const resData = JSON.parse(response);
      this.stateData = { ...this.stateData, ...resData };
    }
    this.setResponsePending(false);
    await this.goToNextStep();
  }
}
