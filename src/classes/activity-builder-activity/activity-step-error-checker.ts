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
type StepId = string;
type ErrorMessage = string;

export type StepErrors = Record<StepId, ErrorMessage[]>;

export class ActivityStepErrorChecker {
  errors: StepErrors = {};
  globalStateKeys: string[] = [];

  setGlobalStateKeys(keys: string[]) {
    this.globalStateKeys = keys;
  }

  checkErrors(activity: ActivityBuilder) {
    this.errors = {};
    activity.flowsList.forEach((flow) => {
      flow.steps.forEach((step) => {
        this.checkStepErrors(step);
      });
    });
    console.log(this.errors);
  }

  checkStepErrors(step: ActivityBuilderStep) {
    if (step.stepType === ActivityBuilderStepType.SYSTEM_MESSAGE) {
      this.checkMessageStepErrors(step as SystemMessageActivityStep);
    } else if (step.stepType === ActivityBuilderStepType.CONDITIONAL) {
      this.checkConditionalStepErrors(step as ConditionalActivityStep);
    } else if (step.stepType === ActivityBuilderStepType.REQUEST_USER_INPUT) {
      this.checkRequestUserInputStepErrors(
        step as RequestUserInputActivityStep
      );
    } else if (step.stepType === ActivityBuilderStepType.PROMPT) {
      this.checkPromptStepErrors(step as PromptActivityStep);
    }
  }

  checkMessageStepErrors(step: SystemMessageActivityStep) {
    const keys = getAllContextDataKeys(step.message);
    console.log(keys);
    const invalidKeys = keys.filter(
      (key) => !this.globalStateKeys.includes(key)
    );
    if (invalidKeys.length > 0) {
      this.errors[step.stepId] = [
        `Did not find the following keys in the global state: ${invalidKeys.join(
          ', '
        )}`,
      ];
    }
  }

  checkConditionalStepErrors(step: ConditionalActivityStep) {
    const conditions = step.conditionals;
    // for each condition, if next step is not set, add error
    conditions.forEach((condition) => {
      if (!condition.targetStepId) {
        this.errors[step.stepId] = [
          'One or more conditions are missing a target step',
        ];
      }
    });
  }

  checkRequestUserInputStepErrors(step: RequestUserInputActivityStep) {
    if (!(step.stepId in this.errors)) {
      this.errors[step.stepId] = [];
    }
    const keys = getAllContextDataKeys(step.message);
    const invalidKeys = keys.filter(
      (key) => !this.globalStateKeys.includes(key)
    );
    if (invalidKeys.length > 0) {
      this.errors[step.stepId].push(
        `Did not find the following keys in the global state: ${invalidKeys.join(
          ', '
        )}`
      );
    }

    if (step.disableFreeInput && step.predefinedResponses.length === 0) {
      this.errors[step.stepId].push(
        'Free input is disabled but no predefined responses are set'
      );
    }
  }

  checkPromptStepErrors(step: PromptActivityStep) {
    if (!(step.stepId in this.errors)) {
      this.errors[step.stepId] = [];
    }
    const keys = getAllContextDataKeys(step.promptText).concat(
      getAllContextDataKeys(step.customSystemRole)
    );
    const invalidKeys = keys.filter(
      (key) => !this.globalStateKeys.includes(key)
    );
    if (invalidKeys.length > 0) {
      this.errors[step.stepId].push(
        `Did not find the following keys in the global state: ${invalidKeys.join(
          ', '
        )}`
      );
    }

    if (
      step.outputDataType === PromptOutputTypes.JSON &&
      step.jsonResponseData?.length === 0
    ) {
      this.errors[step.stepId].push('No JSON response data is set');
    }
  }
}
