/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { PromptOutputTypes } from '../types';
import {
  ActivityBuilder,
  ActivityBuilderStepType,
  SystemMessageActivityStep,
  RequestUserInputActivityStep,
  PromptActivityStep,
  JsonResponseDataType,
} from '../components/activity-builder/types';
import { DisplayIcons } from '../helpers/display-icon-helper';

export const exampleSystemMessageActivityStep: SystemMessageActivityStep = {
  stepId: '1',
  stepType: ActivityBuilderStepType.SYSTEM_MESSAGE,
  message: 'Hello, world!',
};

export const exampleRequestUserInputActivityStep: RequestUserInputActivityStep =
  {
    stepId: '1',
    stepType: ActivityBuilderStepType.REQUEST_USER_INPUT,
    message: 'What is your name?',
    saveAsIntention: false,
    saveResponseVariableName: 'name',
    disableFreeInput: false,
    predefinedResponses: [
      {
        message: 'I like it!',
        jumpToStepId: '2',
      },
    ],
  };

export const examplePromptActivityStep: PromptActivityStep = {
  stepId: '1',
  stepType: ActivityBuilderStepType.PROMPT,
  promptText: 'Please generate a nickname for Aaron',
  responseFormat: '',
  jsonResponseData: [
    {
      clientId: '1',
      name: 'nickname',
      type: JsonResponseDataType.STRING,
      isRequired: true,
    },
  ],
  includeChatLogContext: false,
  includeEssay: false,
  outputDataType: PromptOutputTypes.JSON,
  customSystemRole: 'user',
};

export const collectUserNameActivity: ActivityBuilder = {
  _id: 'collect-user-name',
  title: 'Collect User Name',
  activityType: 'builder',
  description: '',
  user: '123',
  visibility: 'public',
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

export const collectIntentionActivity: ActivityBuilder = {
  _id: 'collect-user-intention',
  title: 'Collect User Intention',
  activityType: 'builder',
  user: '123',
  visibility: 'public',
  description: '',
  displayIcon: DisplayIcons.DEFAULT,
  flowsList: [
    {
      clientId: '2',
      name: '',
      steps: [
        {
          stepId: '1',
          stepType: ActivityBuilderStepType.REQUEST_USER_INPUT,
          message: 'What would you like to do next?',
          saveAsIntention: true,
          saveResponseVariableName: 'intention',
          disableFreeInput: false,
          predefinedResponses: [],
        } as RequestUserInputActivityStep,
        {
          stepId: '2',
          stepType: ActivityBuilderStepType.SYSTEM_MESSAGE,
          message: 'Your intention: {{intention}}',
          jumpToStepId: '1',
        } as SystemMessageActivityStep,
      ],
    },
  ],
};

export const collectAiDataAndDisplayActivity: ActivityBuilder = {
  _id: 'test-ai-response-data',
  title: 'Test AI Response Data',
  activityType: 'builder',
  user: '123',
  visibility: 'public',
  description: '',
  displayIcon: DisplayIcons.DEFAULT,
  flowsList: [
    {
      clientId: '2',
      name: 'Flow 1',
      steps: [
        {
          stepId: '1',
          stepType: ActivityBuilderStepType.PROMPT,
          promptText: 'Please generate a nickname for Aaron',
          responseFormat: '',
          jsonResponseData: [
            {
              clientId: '1',
              name: 'nickname',
              type: 'string',
              isRequired: true,
            },
          ],
          includeChatLogContext: false,
          includeEssay: false,
          outputDataType: PromptOutputTypes.JSON,
          customSystemRole: 'user',
        } as PromptActivityStep,
        {
          stepId: '2',
          stepType: ActivityBuilderStepType.REQUEST_USER_INPUT,
          saveAsIntention: false,
          saveResponseVariableName: '',
          disableFreeInput: false,
          predefinedResponses: [
            {
              message: 'I like it!',
            },
            {
              message: 'I do not like it.',
            },
          ],
          message: 'Do you like this nickname: {{nickname}}?',
          jumpToStepId: '1',
        } as RequestUserInputActivityStep,
      ],
    },
  ],
};

export const sendDataToPromptsActivity: ActivityBuilder = {
  _id: 'test-ai-response-data',
  title: 'Test AI Response Data',
  activityType: 'builder',
  user: '123',
  visibility: 'public',
  description: '',
  displayIcon: DisplayIcons.DEFAULT,
  flowsList: [
    {
      clientId: '1',
      name: '',
      steps: [
        {
          stepId: '1',
          stepType: ActivityBuilderStepType.SYSTEM_MESSAGE,
          message: 'Welcome to the test activity',
        } as SystemMessageActivityStep,
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
          stepId: '4',
          stepType: ActivityBuilderStepType.PROMPT,
          promptText: 'Please generate a nickname for {{name}}',
          responseFormat: '',
          jsonResponseData: [
            {
              clientId: '1',
              name: 'nickname',
              type: JsonResponseDataType.STRING,
              additionalInfo: 'a nickname generated for the supplied name',
              isRequired: true,
            },
          ],
          includeChatLogContext: true,
          includeEssay: false,
          outputDataType: PromptOutputTypes.JSON,
          customSystemRole: 'user',
        } as PromptActivityStep,
        {
          stepId: '5',
          stepType: ActivityBuilderStepType.SYSTEM_MESSAGE,
          message:
            'Thank you for participating in the test activity, {{nickname}}!',
          jumpToStepId: '1',
        } as SystemMessageActivityStep,
      ],
    },
  ],
};

export const multipleFlowActivity: ActivityBuilder = {
  _id: 'multiple-flow-activity',
  title: 'Multiple Flow Activity',
  activityType: 'builder',
  user: '123',
  visibility: 'public',
  description: '',
  displayIcon: DisplayIcons.DEFAULT,
  flowsList: [
    {
      clientId: '1',
      name: 'flow 1',
      steps: [
        {
          stepId: '1',
          stepType: ActivityBuilderStepType.SYSTEM_MESSAGE,
          message: 'Welcome to the test activity',
        } as SystemMessageActivityStep,
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
          jumpToStepId: '4',
        } as SystemMessageActivityStep,
      ],
    },
    {
      clientId: '2',
      name: 'flow 2',
      steps: [
        {
          stepId: '4',
          stepType: ActivityBuilderStepType.PROMPT,
          promptText: 'Please generate a nickname for {{name}}',
          responseFormat: '',
          jsonResponseData: [
            {
              clientId: '1',
              name: 'nickname',
              type: JsonResponseDataType.STRING,
              additionalInfo: 'a nickname generated for the supplied name',
              isRequired: true,
            },
          ],
          includeChatLogContext: true,
          includeEssay: false,
          outputDataType: PromptOutputTypes.JSON,
          customSystemRole: 'user',
        } as PromptActivityStep,
        {
          stepId: '5',
          stepType: ActivityBuilderStepType.SYSTEM_MESSAGE,
          message:
            'Thank you for participating in the test activity, {{nickname}}!',
          jumpToStepId: '1',
        } as SystemMessageActivityStep,
      ],
    },
    {
      clientId: '3',
      name: 'flow 3',
      steps: [],
    },
  ],
};

export const utilizeListMcqActivity: ActivityBuilder = {
  _id: 'utilize-list-mcq',
  title: 'Utilize List MCQ',
  activityType: 'builder',
  description: '',
  user: '123',
  visibility: 'public',
  displayIcon: DisplayIcons.DEFAULT,
  flowsList: [
    {
      clientId: '2',
      name: 'Flow 1',
      steps: [
        {
          stepId: '1',
          stepType: ActivityBuilderStepType.PROMPT,
          promptText: 'Please generate 3 nicknames for Aaron',
          responseFormat: '',
          jsonResponseData: [
            {
              clientId: '1',
              name: 'nicknames',
              type: 'array',
              isRequired: true,
            },
          ],
          includeChatLogContext: false,
          includeEssay: false,
          outputDataType: PromptOutputTypes.JSON,
          customSystemRole: 'user',
        } as PromptActivityStep,
        {
          stepId: '2',
          stepType: ActivityBuilderStepType.REQUEST_USER_INPUT,
          saveAsIntention: false,
          saveResponseVariableName: '',
          disableFreeInput: false,
          predefinedResponses: [
            {
              message: '{{nicknames}}',
              isArray: true,
              jumpToStepId: '1',
            },
          ],
          message: 'Which nickname do you like best?',
          // jumpToStepId: '1',
        } as RequestUserInputActivityStep,
      ],
    },
  ],
};
