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
  ConditionalActivityStep,
  Checking,
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
export const DOC_TEXT_KEY = 'doc_text';
export const DOC_NUM_WORDS_KEY = 'doc_num_words';

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
  editDocGoal: () => void;
  userResponseHandleState: UserResponseHandleState;
  stepIdsSinceLastInput: string[];
  lastFailedStepId: string | null = null;
  docId: string;

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
    builtActivityData?: ActivityBuilder
  ) {
    this.docId = docId;
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
    const docData = await getDocData(this.docId);
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
    this.sendMessage({
      id: uuidv4(),
      message: replaceStoredDataInString(step.message, this.stateData),
      sender: Sender.SYSTEM,
      displayType: MessageDisplayType.TEXT,
    });
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
    if (message === EDIT_DOC_GOAL_MESSAGE) {
      this.editDocGoal();
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
    // handle replacing promptText with stored data
    const promptText = replaceStoredDataInString(
      step.promptText,
      this.stateData
    );
    // handle replacing responseFormat with stored data
    const responseFormat = replaceStoredDataInString(
      step.responseFormat,
      this.stateData
    );
    // handle replacing customSystemRole with stored data
    const customSystemRole = replaceStoredDataInString(
      step.customSystemRole,
      this.stateData
    );

    const aiPromptSteps: AiPromptStep[] = [];

    // currently, we only have one prompt step. In the future, this variable will likely be reduced to a single step.
    aiPromptSteps.push({
      prompts: [],
      outputDataType: step.outputDataType,
      responseFormat,
      systemRole: customSystemRole,
      webSearch: step.webSearch || false,
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
    if (
      step.jsonResponseData &&
      step.outputDataType === PromptOutputTypes.JSON
    ) {
      aiPromptSteps[0].responseFormat =
        recursivelyConvertExpectedDataToAiPromptString(
          recursiveUpdateAdditionalInfo(step.jsonResponseData, this.stateData)
        );
    }

    // handle sending prompt
    const requestFunction = async () => {
      const _response = await this.executePrompt(aiPromptSteps);
      const response = extractServiceStepResponse(_response, 0);
      if (step.outputDataType === PromptOutputTypes.JSON) {
        if (!isJsonString(response)) {
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
      } else {
        // is a text response
        this.sendMessage({
          id: uuidv4(),
          message: response,
          aiServiceStepData: _response.aiAllStepsData,
          sender: Sender.SYSTEM,
          displayType: MessageDisplayType.TEXT,
        });
      }
    };

    // try request function 3 times
    let counter = 0;
    let success = false;
    while (counter < 3) {
      try {
        await requestFunction();
        success = true;
        console.log('breaking');
        break;
      } catch (err) {
        console.log('error', err);
        counter++;
      }
    }
    if (!success) {
      this.sendErrorMessage('AI Service request failed');
      this.lastFailedStepId = step.stepId;
      this.setResponsePending(false);
      return;
    }

    this.setResponsePending(false);
    await this.goToNextStep();
  }
}
