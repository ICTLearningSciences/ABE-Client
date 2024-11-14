/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import {
  ActivityBuilder,
  ActivityBuilderStep,
  ActivityBuilderStepType,
  ConditionalActivityStep,
  PromptActivityStep,
  RequestUserInputActivityStep,
  SystemMessageActivityStep,
} from '../../components/activity-builder/types';
import { getAllContextDataKeys } from '../../components/activity-builder/helpers';
import { PromptOutputTypes } from '../../types';
type FlowId = string;
type StepId = string;
export type StepErrors = Record<StepId, ErrorMessage[]>;
type ErrorMessage = string;

export type FlowErrors = Record<FlowId, StepErrors>;

export class ActivityStepErrorChecker {
  errors: FlowErrors = {};
  globalStateKeys: string[] = [];

  setGlobalStateKeys(keys: string[]) {
    this.globalStateKeys = keys;
  }

  checkErrors(activity: ActivityBuilder) {
    this.errors = {};
    const existingSteps = new Set<string>();
    activity.flowsList.forEach((flow) => {
      flow.steps.forEach((step) => {
        existingSteps.add(step.stepId);
      });
    });
    activity.flowsList.forEach((flow) => {
      this.errors[flow.clientId] = {};
      flow.steps.forEach((step) => {
        this.checkStepErrors(step, flow.clientId, existingSteps);
      });
    });
  }

  checkStepErrors(
    step: ActivityBuilderStep,
    flowId: string,
    existingSteps: Set<string>
  ) {
    if (step.stepType === ActivityBuilderStepType.SYSTEM_MESSAGE) {
      this.checkMessageStepErrors(
        step as SystemMessageActivityStep,
        flowId,
        existingSteps
      );
    } else if (step.stepType === ActivityBuilderStepType.CONDITIONAL) {
      this.checkConditionalStepErrors(
        step as ConditionalActivityStep,
        flowId,
        existingSteps
      );
    } else if (step.stepType === ActivityBuilderStepType.REQUEST_USER_INPUT) {
      this.checkRequestUserInputStepErrors(
        step as RequestUserInputActivityStep,
        flowId,
        existingSteps
      );
    } else if (step.stepType === ActivityBuilderStepType.PROMPT) {
      this.checkPromptStepErrors(
        step as PromptActivityStep,
        flowId,
        existingSteps
      );
    }
  }

  initializeStepErrors(flowId: string, stepId: string) {
    if (!(stepId in this.errors[flowId])) {
      this.errors[flowId][stepId] = [];
    }
  }

  clearEmptyStepErrors(flowId: string, stepId: string) {
    if (this.errors[flowId][stepId].length === 0) {
      delete this.errors[flowId][stepId];
    }
  }

  checkMessageStepErrors(
    step: SystemMessageActivityStep,
    flowId: string,
    existingSteps: Set<string>
  ) {
    this.initializeStepErrors(flowId, step.stepId);
    const keys = getAllContextDataKeys(step.message);
    const invalidKeys = keys.filter(
      (key) => !this.globalStateKeys.includes(key)
    );
    if (invalidKeys.length > 0) {
      this.errors[flowId][step.stepId].push(
        `Did not find the following keys in the global state: ${invalidKeys.join(
          ', '
        )}`
      );
    }

    if (step.jumpToStepId && !existingSteps.has(step.jumpToStepId)) {
      this.errors[flowId][step.stepId].push(
        'This step is set to jump to a step that does not exist'
      );
    }

    this.clearEmptyStepErrors(flowId, step.stepId);
  }

  checkConditionalStepErrors(
    step: ConditionalActivityStep,
    flowId: string,
    existingSteps: Set<string>
  ) {
    this.initializeStepErrors(flowId, step.stepId);
    const conditions = step.conditionals;
    // for each condition, if next step is not set, add error
    let missingTargetStepFound = false;
    conditions.forEach((condition) => {
      if (!condition.targetStepId) {
        this.errors[flowId][step.stepId].push(
          'One or more conditions are missing a target step'
        );
      }
      if (
        !missingTargetStepFound &&
        condition.targetStepId &&
        !existingSteps.has(condition.targetStepId)
      ) {
        this.errors[flowId][step.stepId].push(
          'One or more conditions are set to jump to a step that does not exist'
        );
        missingTargetStepFound = true;
      }
    });

    if (step.jumpToStepId && !existingSteps.has(step.jumpToStepId)) {
      this.errors[flowId][step.stepId].push(
        'This step is set to jump to a step that does not exist'
      );
    }

    this.clearEmptyStepErrors(flowId, step.stepId);
  }

  checkRequestUserInputStepErrors(
    step: RequestUserInputActivityStep,
    flowId: string,
    existingSteps: Set<string>
  ) {
    this.initializeStepErrors(flowId, step.stepId);
    const keys = getAllContextDataKeys(step.message);
    const invalidKeys = keys.filter(
      (key) => !this.globalStateKeys.includes(key)
    );
    if (invalidKeys.length > 0) {
      this.errors[flowId][step.stepId].push(
        `Did not find the following keys in the global state: ${invalidKeys.join(
          ', '
        )}`
      );
    }

    if (step.disableFreeInput && step.predefinedResponses.length === 0) {
      this.errors[flowId][step.stepId].push(
        'Free input is disabled but no predefined responses are set'
      );
    }

    if (step.jumpToStepId && !existingSteps.has(step.jumpToStepId)) {
      this.errors[flowId][step.stepId].push(
        'This step is set to jump to a step that does not exist'
      );
    }

    this.clearEmptyStepErrors(flowId, step.stepId);
  }

  checkPromptStepErrors(
    step: PromptActivityStep,
    flowId: string,
    existingSteps: Set<string>
  ) {
    this.initializeStepErrors(flowId, step.stepId);
    const keys = getAllContextDataKeys(step.promptText).concat(
      getAllContextDataKeys(step.customSystemRole)
    );
    const invalidKeys = keys.filter(
      (key) => !this.globalStateKeys.includes(key)
    );
    if (invalidKeys.length > 0) {
      this.errors[flowId][step.stepId].push(
        `Did not find the following keys in the global state: ${invalidKeys.join(
          ', '
        )}`
      );
    }

    if (
      step.outputDataType === PromptOutputTypes.JSON &&
      step.jsonResponseData?.length === 0
    ) {
      this.errors[flowId][step.stepId].push('No JSON response data is set');
    }

    if (step.jumpToStepId && !existingSteps.has(step.jumpToStepId)) {
      this.errors[flowId][step.stepId].push(
        'This step is set to jump to a step that does not exist'
      );
    }

    this.clearEmptyStepErrors(flowId, step.stepId);
  }
}
