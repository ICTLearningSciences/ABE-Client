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

export class BuiltActivityHandler {
  builtActivityData: ActivityBuilder;
  curStep: ActivityBuilderStep;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stateData: Record<string, any>;
  chatLog: ChatLog = [];
  sendMessage: (msg: ChatMessageTypes) => void;
  setWaitingForUserAnswer: (waiting: boolean) => void;
  updateSessionIntention: (intention: string) => void;
  executePrompt: (
    aiPromptSteps: AiPromptStep[]
  ) => Promise<AiServicesResponseTypes>;

  removeDataFromStoredData(key: string) {
    delete this.stateData[key];
  }

  getNextStep(step: ActivityBuilderStep): ActivityBuilderStep {
    if (step.jumpToStepId) {
      const jumpStep = this.builtActivityData.steps.find(
        (step) => step.stepId === this.curStep.jumpToStepId
      );
      if (!jumpStep) {
        throw new Error(
          `Unable to find requested step: ${this.curStep.jumpToStepId}`
        );
      }
      return jumpStep;
    } else {
      const currentStepIndex = this.builtActivityData.steps.findIndex(
        (step) => step.stepId === this.curStep.stepId
      );
      if (currentStepIndex === -1) {
        throw new Error(
          `Unable to find requested step: ${this.curStep.stepId}`
        );
      }
      const nextStepIndex = currentStepIndex + 1;
      if (nextStepIndex >= this.builtActivityData.steps.length) {
        return this.builtActivityData.steps[0];
      } else {
        return this.builtActivityData.steps[nextStepIndex];
      }
    }
  }

  constructor(
    builtActivityData: ActivityBuilder,
    sendMessage: (msg: ChatMessageTypes) => void,
    setWaitingForUserAnswer: (waiting: boolean) => void,
    updateSessionIntention: (intention: string) => void,
    executePrompt: (
      aiPromptSteps: AiPromptStep[]
    ) => Promise<AiServicesResponseTypes>
  ) {
    if (!builtActivityData || !builtActivityData.steps.length) {
      throw new Error('No steps found in built activity data');
    }
    this.builtActivityData = builtActivityData;
    this.curStep = builtActivityData.steps[0];
    this.stateData = {};
    this.sendMessage = sendMessage;
    this.setWaitingForUserAnswer = setWaitingForUserAnswer;
    this.updateSessionIntention = updateSessionIntention;
    this.executePrompt = executePrompt;
  }

  initializeActivity() {
    this.resetActivity();
    this.handleStep(this.curStep);
  }

  resetActivity() {
    if (!this.builtActivityData || !this.builtActivityData.steps.length) {
      return;
    }
    this.curStep = this.builtActivityData.steps[0];
    this.stateData = {};
  }

  async handleStep(step: ActivityBuilderStep) {
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
      mcqChoices: step.predefinedResponses.map((response) => response.message),
    });
    this.setWaitingForUserAnswer(true);
    // Will now wait for user input before progressing to next step
  }

  async goToNextStep() {
    this.curStep = this.getNextStep(this.curStep);
    await this.handleStep(this.curStep);
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

  async handleNewUserMessage(message: string) {
    if (this.curStep.stepType !== ActivityBuilderStepType.REQUEST_USER_INPUT) {
      return;
    }
    const userInputStep = this.curStep as RequestUserInputActivityStep;
    if (userInputStep.saveAsIntention) {
      this.updateSessionIntention(message);
    }
    if (userInputStep.saveResponseVariableName) {
      this.stateData[userInputStep.saveResponseVariableName] = message;
    }
    this.setWaitingForUserAnswer(false);
    await this.goToNextStep();
  }

  async handlePromptStep(step: PromptActivityStep) {
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

    // handle sending prompt
    const _response = await this.executePrompt(aiPromptSteps);
    const response = extractServiceStepResponse(_response, 0);

    if (step.outputDataType === PromptOutputTypes.JSON) {
      if (!isJsonString(response)) {
        throw new Error('Invalid JSON response');
      }
      // TODO: Confirm that the JSON response matches the json data form
      // Do this by creating a json object out of the desiredJsonData and asserting that all expected fields exist
      const resData = JSON.parse(response);
      this.stateData = { ...this.stateData, ...resData };
    }
    await this.goToNextStep();
  }

  replaceStoredDataInString(str: string): string {
    // replace all instances of {{key}} in str with stored data[key]
    const regex = /{{(.*?)}}/g;
    return str.replace(regex, (match, key) => {
      return this.stateData[key] || match;
    });
  }
}