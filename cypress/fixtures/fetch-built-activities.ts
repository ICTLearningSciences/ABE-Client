/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { ActivityBuilder, ActivityBuilderVisibility, PromptActivityStep, RequestUserInputActivityStep, SystemMessageActivityStep } from "../../src/components/activity-builder/types";
import { testUser } from "./user-data";

export function createActivityBuilder(userId: string, title: string, activityId: string, visibility: ActivityBuilderVisibility): ActivityBuilder{
    return {
        ...myEditableActivity,
        _id: activityId,
        clientId: activityId,
        user: userId,
        visibility: visibility,
        title: title
    }
}

export const myEditableActivity: ActivityBuilder = {
    _id: 'example-activity',
    clientId: '123',
    title: 'Example Activity',
    activityType: 'builder',
    attachedPanel: '',
    description: '',
    user: testUser._id,
    visibility: 'editable',
    displayIcon: 'DEFAULT',
    flowsList: [
      {
        clientId: '2',
        name: '',
        steps: [
          {
            stepId: '2',
            stepType: 'REQUEST_USER_INPUT',
            message: 'What is your name?',
            saveAsIntention: true,
            saveResponseVariableName: 'name',
            systemCustomName: '',
            disableFreeInput: false,
            predefinedResponses: [],
            setStudentActivityComplete: true,
          } as RequestUserInputActivityStep,
          {
            stepId: '3',
            stepType: 'SYSTEM_MESSAGE',
            message: 'Hello, {{name}}!',
          } as SystemMessageActivityStep,
          {
            stepId: '3.1',
            stepType: 'PROMPT',
            promptConfigurations: [
              {
                promptText: 'Please generate 3 nicknames for {{name}}',
                responseFormat: '',
                jsonResponseData: [
                  {
                    clientId: '1',
                    name: 'nickname1',
                    type: 'string',
                    isRequired: true,
                  }
                ],
                includeChatLogContext: false,
                includeEssay: false,
                outputDataType: 'JSON',
                customSystemRole: 'user',
              }
            ]
          } as PromptActivityStep,
          {
            stepId: "3.2",
            stepType: 'CONDITIONAL',
            jumpToStepId: '',
            conditionals: [
                {
                    stateDataKey: 'nickname1',
                    checking: 'VALUE',
                    operation: "==",
                    expectedValue: '3',
                    targetStepId: '4',
                }
            ],
          },
          {
            stepId: '4',
            stepType: 'REQUEST_USER_INPUT',
            message: 'What would you like to do next?',
            saveAsIntention: false,
            saveResponseVariableName: '',
            systemCustomName: '',
            disableFreeInput: true,
            predefinedResponses: [
              {
                message: 'Next activity.',
              },
            ],
            jumpToStepId: '2',
          } as RequestUserInputActivityStep,
        ],
      },
    ],
  };


  export const fetchBuiltActivitiesResponse = {
    "fetchBuiltActivities": [
        createActivityBuilder(testUser._id, 'My Editable Activity', 'my-editable-activity', 'editable'),
        createActivityBuilder(testUser._id, 'My Private Activity', 'my-private-activity', 'private'),
        createActivityBuilder(testUser._id, 'My Read-Only Activity', 'my-read-only-activity', 'read-only'),
        createActivityBuilder("other-user", 'Other User Editable Activity', 'other-user-editable-activity', 'editable'),
        createActivityBuilder("other-user", 'Other User Read-Only Activity', 'other-user-read-only-activity', 'read-only'),
        // createActivityBuilder("other-user", 'Other User Private Activity', 'other-user-private-activity', 'private'),
    ]
}