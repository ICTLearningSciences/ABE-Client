/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import {
  ActivityBuilder,
  FlowItem,
  JsonResponseData,
  PredefinedResponse,
} from './types';
import Validator, { Schema } from 'jsonschema';

function convertExpectedDataIntoSchema(
  expectedData: JsonResponseData[]
): Schema {
  const schema: Schema = {
    type: 'object',
    properties: {},
    required: [],
  };
  for (const expectedField of expectedData) {
    schema.properties![expectedField.name] = {
      type: expectedField.type,
    };
    if (expectedField.isRequired) {
      (schema.required! as string[]).push(expectedField.name);
    }
  }
  return schema;
}

export function convertExpectedDataToAiPromptString(
  expectedData: JsonResponseData[]
) {
  let promptString = `
  Respond in JSON. Validate that your response is valid JSON. Your JSON must follow this format:\n`;
  promptString += `{\n`;
  for (const expectedField of expectedData) {
    promptString += `"${expectedField.name}": ${expectedField.type}\t ${
      expectedField.additionalInfo ? `// ${expectedField.additionalInfo}` : ''
    } \n`;
  }
  promptString += `}\n`;
  return promptString;
}

export function receivedExpectedData(
  expectedData: JsonResponseData[],
  jsonResponse: string
) {
  try {
    const v = new Validator.Validator();
    const schema = convertExpectedDataIntoSchema(expectedData);
    const responseJson = JSON.parse(jsonResponse);
    const result = v.validate(responseJson, schema);
    if (result.errors.length > 0) {
      console.error(result.errors);
      return false;
    }
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export function getFlowForStepId(
  flow: FlowItem[],
  stepId: string
): FlowItem | undefined {
  return flow.find((flowItem) => {
    return flowItem.steps.find((step) => {
      return step.stepId === stepId;
    });
  });
}

export function processPredefinedResponses(
  processPredefinedResponses: PredefinedResponse[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stateData: Record<string, any>
): PredefinedResponse[] {
  const processedPredefinedResponses = processPredefinedResponses.map(
    (response) => {
      return {
        ...response,
        message: replaceStoredDataInString(response.message, stateData),
        responseWeight: replaceStoredDataInString(
          response.responseWeight || '',
          stateData
        ),
      };
    }
  );
  return processedPredefinedResponses;
}

export function replaceStoredDataInString(
  str: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stateData: Record<string, any>
): string {
  // replace all instances of {{key}} in str with stored data[key]
  const regex = /{{(.*?)}}/g;
  return str.trim().replace(regex, (match, key) => {
    return stateData[key] || match;
  });
}

export function sortMessagesByResponseWeight(
  messageList: string[],
  predefinedResponses: PredefinedResponse[]
): string[] {
  const sortedMessages = messageList.sort((a, b) => {
    const responseWeightA = predefinedResponses.find(
      (response) => response.message === a
    )?.responseWeight;
    const responseWeightB = predefinedResponses.find(
      (response) => response.message === b
    )?.responseWeight;
    try {
      if (responseWeightA && responseWeightB) {
        return parseInt(responseWeightB) - parseInt(responseWeightA);
      }
    } catch (e) {
      console.error(e);
      return 0;
    }
    return 0;
  });
  return sortedMessages;
}

export function getPromptStepById(stepId: string, flowsList: FlowItem[]) {
  for (const flow of flowsList) {
    const step = flow.steps.find((s) => s.stepId === stepId);
    if (step) {
      return step;
    }
  }
  return undefined;
}

export function isActivityRunnable(activity: ActivityBuilder) {
  return (
    activity.flowsList.length > 0 && activity.flowsList[0].steps.length > 0
  );
}
