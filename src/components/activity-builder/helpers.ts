/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { JsonResponseData } from './types';
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
  let promptString = 'Please only respond with JSON with these fields:\n';
  for (const expectedField of expectedData) {
    promptString += `${expectedField.name}: ${expectedField.type}\t\t ${
      expectedField.additionalInfo || ''
    } \n`;
  }
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
