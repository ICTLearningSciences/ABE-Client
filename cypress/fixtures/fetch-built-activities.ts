import { ActivityBuilder, ActivityBuilderVisibility, ActivityBuilderStepType, RequestUserInputActivityStep, SystemMessageActivityStep, PromptActivityStep, NumericOperations, Checking } from "../../src/components/activity-builder/types";
import { DisplayIcons, PromptOutputTypes } from "../helpers/types";
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
    description: '',
    user: testUser._id,
    visibility: ActivityBuilderVisibility.EDITABLE,
    displayIcon: DisplayIcons.DEFAULT,
    flowsList: [
      {
        clientId: '2',
        name: '',
        steps: [
          {
            stepId: '2',
            stepType: ActivityBuilderStepType.REQUEST_USER_INPUT,
            message: 'What is your name?',
            saveAsIntention: false,
            saveResponseVariableName: 'name',
            disableFreeInput: false,
            predefinedResponses: [],
          } as RequestUserInputActivityStep,
          {
            stepId: '3',
            stepType: ActivityBuilderStepType.SYSTEM_MESSAGE,
            message: 'Hello, {{name}}!',
          } as SystemMessageActivityStep,
          {
            stepId: '3.1',
            stepType: ActivityBuilderStepType.PROMPT,
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
            outputDataType: PromptOutputTypes.JSON,
            customSystemRole: 'user',
          } as PromptActivityStep,
          {
            stepId: "3.2",
            stepType: ActivityBuilderStepType.CONDITIONAL,
            jumpToStepId: '',
            conditionals: [
                {
                    stateDataKey: 'nickname1',
                    checking: Checking.VALUE,
                    operation: NumericOperations.EQUALS,
                    expectedValue: '3',
                    targetStepId: '4',
                }
            ],
          },
          {
            stepId: '4',
            stepType: ActivityBuilderStepType.REQUEST_USER_INPUT,
            message: 'What would you like to do next?',
            saveAsIntention: false,
            saveResponseVariableName: '',
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
        createActivityBuilder(testUser._id, 'My Editable Activity', 'my-editable-activity', ActivityBuilderVisibility.EDITABLE),
        createActivityBuilder(testUser._id, 'My Private Activity', 'my-private-activity', ActivityBuilderVisibility.PRIVATE),
        createActivityBuilder(testUser._id, 'My Read-Only Activity', 'my-read-only-activity', ActivityBuilderVisibility.READ_ONLY),
        createActivityBuilder("other-user", 'Other User Editable Activity', 'other-user-editable-activity', ActivityBuilderVisibility.EDITABLE),
        createActivityBuilder("other-user", 'Other User Read-Only Activity', 'other-user-read-only-activity', ActivityBuilderVisibility.READ_ONLY),
        // createActivityBuilder("other-user", 'Other User Private Activity', 'other-user-private-activity', ActivityBuilderVisibility.PRIVATE),
    ]
}