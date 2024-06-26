/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import {
  ActivityBuilder,
  ActivityBuilderStepType,
  PromptActivityStepGql,
} from '../components/activity-builder/types';
import { ACCESS_TOKEN_KEY, localStorageGet } from '../store/local-storage';
import { execGql } from './api';

export const fullBuiltActivityQueryData = `
                      _id
                      clientId
                      title
                      user
                      visibility
                      activityType
                      description
                      displayIcon
                      disabled
                      newDocRecommend
                      flowsList{
                        clientId
                        name
                        steps{
                          ... on SystemMessageActivityStepType {
                              stepId
                              stepType
                              jumpToStepId
                              message
                          }

                          ... on RequestUserInputActivityStepType {
                              stepId
                              stepType
                              jumpToStepId
                              message
                              saveAsIntention
                              saveResponseVariableName
                              disableFreeInput
                              predefinedResponses{
                                  message
                                  jumpToStepId
                                  isArray
                                  responseWeight
                              }
                          }

                          ... on PromptActivityStepType{
                              stepId
                              stepType
                              jumpToStepId
                              promptText
                              responseFormat
                              includeChatLogContext
                              includeEssay
                              outputDataType
                              jsonResponseData
                              customSystemRole
                          }
                      }
                      }
`;

export function convertGqlToBuiltActivity(
  activity: ActivityBuilder
): ActivityBuilder {
  const copy: ActivityBuilder = JSON.parse(JSON.stringify(activity));
  copy.flowsList.forEach((flow) => {
    flow.steps.forEach((step) => {
      if (step.stepType === ActivityBuilderStepType.PROMPT) {
        const _step: PromptActivityStepGql = step as PromptActivityStepGql;
        if (typeof _step.jsonResponseData === 'string') {
          _step.jsonResponseData = JSON.parse(_step.jsonResponseData as string);
        }
      }
    });
  });
  return copy;
}

export function convertBuiltActivityToGql(
  activity: ActivityBuilder
): ActivityBuilder {
  const copy: ActivityBuilder = JSON.parse(JSON.stringify(activity));
  copy.flowsList.forEach((flow) => {
    flow.steps.forEach((step) => {
      if (step.stepType === ActivityBuilderStepType.PROMPT) {
        const _step: PromptActivityStepGql = step as PromptActivityStepGql;
        if (_step.jsonResponseData) {
          _step.jsonResponseData = JSON.stringify(_step.jsonResponseData);
        }
      }
    });
  });
  return copy;
}

export async function addOrUpdateBuiltActivity(
  activity: ActivityBuilder
): Promise<ActivityBuilder> {
  const accessToken = localStorageGet(ACCESS_TOKEN_KEY) || '';
  const res = await execGql<ActivityBuilder>(
    {
      query: `
          mutation AddOrUpdateBuiltActivity($activity: BuiltActivityInputType!) {
            addOrUpdateBuiltActivity(activity: $activity) {
                ${fullBuiltActivityQueryData}
            }
        }
        `,
      variables: {
        activity: convertBuiltActivityToGql(activity),
      },
    },
    {
      dataPath: 'addOrUpdateBuiltActivity',
      accessToken,
    }
  );
  return convertGqlToBuiltActivity(res);
}

export async function fetchBuiltActivities(): Promise<ActivityBuilder[]> {
  const accessToken = localStorageGet(ACCESS_TOKEN_KEY) || '';
  const res = await execGql<ActivityBuilder[]>(
    {
      query: `
        query FetchBuiltActivities{
            fetchBuiltActivities {
                ${fullBuiltActivityQueryData}
            }
        }
        `,
    },
    {
      dataPath: 'fetchBuiltActivities',
      accessToken,
    }
  );
  return res.map(convertGqlToBuiltActivity);
}
