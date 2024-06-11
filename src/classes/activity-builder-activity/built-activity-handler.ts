/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import {
  ActivityBuilder,
  ActivityBuilderStepType,
  PromptActivityStep,
  SystemMessageActivityStep,
  UserMessageActivityStep,
} from '../../components/activity-builder/types';
import { ChatMessageTypes } from '../../store/slices/chat';

export class BuiltActivityHandler {
  builtActivityData: ActivityBuilder;
  curStepId: string;
  stateData: string;
  sendMessage: (
    msg: ChatMessageTypes,
    clearChat: boolean,
    docId: string
  ) => void;
  setWaitingForUserAnswer: (waiting: boolean) => void;

  addDataToStoredData(key: string, data: any) {
    const newData = JSON.parse(this.stateData);
    newData[key] = data;
    this.stateData = JSON.stringify(newData);
  }

  removeDataFromStoredData(key: string) {
    const newData = JSON.parse(this.stateData);
    delete newData[key];
    this.stateData = JSON.stringify(newData);
  }

  getStoredData<T>(key: string): T {
    const data = JSON.parse(this.stateData);
    return data[key];
  }

  constructor(
    builtActivityData: ActivityBuilder,
    sendMessage: (
      msg: ChatMessageTypes,
      clearChat: boolean,
      docId: string
    ) => void,
    setWaitingForUserAnswer: (waiting: boolean) => void
  ) {
    this.builtActivityData = builtActivityData;
    this.curStepId = builtActivityData.steps.length
      ? builtActivityData.steps[0].stepId
      : '';
    this.stateData = '{}';
    this.sendMessage = sendMessage;
    this.setWaitingForUserAnswer = setWaitingForUserAnswer;
    this.initializeActivity();
  }

  initializeActivity() {
    this.resetActivity();
  }

  resetActivity() {
    if (!this.builtActivityData || !this.builtActivityData.steps.length) {
      return;
    }
    this.curStepId = this.builtActivityData.steps[0].stepId;
    this.stateData = '{}';
  }

  newUserMessageReceived(message: string) {
    //TODO
  }

  handleStep() {
    // work through steps until we get to a user message step, then wait to be notified of a user message
    const currentStep = this.builtActivityData.steps.find(
      (step) => step.stepId === this.curStepId
    );
    if (!currentStep) {
      throw new Error(`Unable to find requested step: ${this.curStepId}`);
    }
    // handle the step
    switch (currentStep.stepType) {
      case ActivityBuilderStepType.USER_MESSAGE:
        this.handleUserMessageStep(currentStep as UserMessageActivityStep);
        break;
      case ActivityBuilderStepType.SYSTEM_MESSAGE:
        this.handleSystemMessageStep(currentStep as SystemMessageActivityStep);
        break;
      case ActivityBuilderStepType.PROMPT:
        this.handlePromptStep(currentStep as PromptActivityStep);
        break;
      default:
        throw new Error(`Unknown step type: ${currentStep.stepType}`);
    }
  }

  handleSystemMessageStep(step: SystemMessageActivityStep) {
    // send system message and set next step
  }

  handleUserMessageStep(step: UserMessageActivityStep) {
    //
  }

  handlePromptStep(step: PromptActivityStep) {}
}
