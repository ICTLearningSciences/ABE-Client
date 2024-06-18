/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { ActivityBuilder } from '../components/activity-builder/types';
import { ACCESS_TOKEN_KEY, localStorageGet } from '../store/local-storage';
import { execGql } from './api';

export const fullBuiltActivityQueryData = `
                      _id
                      title
                      user
                      visibility
                      activityType
                      description
                      displayIcon
                      disabled
                      newDocRecommend
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
                              jsonResponseData{
                                  name
                                  type
                                  isRequired
                                  additionalInfo
                              }
                              customSystemRole
                          }
                      }
`;

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
        activity,
      },
    },
    {
      dataPath: 'addOrUpdateBuiltActivity',
      accessToken,
    }
  );
  return res;
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
  return res;
}
