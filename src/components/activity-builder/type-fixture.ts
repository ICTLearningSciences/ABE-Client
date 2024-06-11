/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { PromptOutputTypes } from '../../types';
import {
  ActivityBuilder,
  ActivityBuilderStepType,
  SystemMessageActivityStep,
  UserMessageActivityStep,
  PromptActivityStep,
} from './types';

export const testActivityBuilder: ActivityBuilder = {
  title: 'Test Activity',
  steps: [
    {
      stepId: '1',
      stepType: ActivityBuilderStepType.SYSTEM_MESSAGE,
      message: 'Welcome to the test activity',
    } as SystemMessageActivityStep,
    {
      stepId: '2',
      stepType: ActivityBuilderStepType.USER_MESSAGE,
      message: 'What is your name?',
      saveAsIntention: true,
      saveResponseVariableName: 'name',
      disableFreeInput: false,
      predefinedResponses: [
        {
          message: 'John',
        },
        {
          message: 'Jane',
        },
      ],
    } as UserMessageActivityStep,
    {
      stepId: '3',
      stepType: 'Prompt',
      promptText: 'What is your age?',
      responseFormat: 'number',
      includeChatLogContext: true,
      outputDataType: PromptOutputTypes.TEXT,
      customSystemRole: 'user',
    } as PromptActivityStep,
    {
      stepId: '4',
      stepType: 'SystemMessage',
      message: 'Thank you for participating in the test activity',
      jumpToStepId: '1',
    } as SystemMessageActivityStep,
  ],
};
