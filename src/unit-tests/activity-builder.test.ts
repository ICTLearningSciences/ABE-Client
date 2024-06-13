/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/

import { AiServicesResponseTypes } from '../ai-services/ai-service-types';
import { BuiltActivityHandler } from '../classes/activity-builder-activity/built-activity-handler';
import { ActivityBuilder } from '../components/activity-builder/types';
import {
  ChatMessageTypes,
  MessageDisplayType,
  Sender,
} from '../store/slices/chat';
import { AiPromptStep, PromptOutputTypes, PromptRoles } from '../types';
import {
  collectAiDataAndDisplayActivity,
  sendDataToPromptsActivity,
  collectIntentionActivity,
  collectUserNameActivity,
} from './activity-builder-fixture';
import { openAiTextResponse } from './fixtures/basic-text-response';

enum ExecutedStepTypes {
  CHAT_MESSAGE = 'CHAT_MESSAGE',
  WAITING_FOR_USER_ANSWER = 'WAITING_FOR_USER_ANSWER',
  SESSION_INTENTION = 'SESSION_INTENTION',
  PROMPT_EXECUTION = 'PROMPT_EXECUTION',
}

interface ExecutedStep {
  type: ExecutedStepTypes;
  value: ChatMessageTypes | boolean | string | AiPromptStep[];
}

class ActivityBuilderDataAccumulator {
  stepsExecuted: ExecutedStep[];
  aiResponses: AiServicesResponseTypes[];

  constructor(aiResponses: AiServicesResponseTypes[]) {
    this.stepsExecuted = [];
    this.aiResponses = aiResponses;
  }

  sendMessage(msg: ChatMessageTypes) {
    this.stepsExecuted.push({
      type: ExecutedStepTypes.CHAT_MESSAGE,
      value: msg,
    });
  }

  setWaitingForUserAnswer(waiting: boolean) {
    this.stepsExecuted.push({
      type: ExecutedStepTypes.WAITING_FOR_USER_ANSWER,
      value: waiting,
    });
  }

  updateSessionIntention(intention: string) {
    this.stepsExecuted.push({
      type: ExecutedStepTypes.SESSION_INTENTION,
      value: intention,
    });
  }

  executePrompt(
    aiPromptSteps: AiPromptStep[]
  ): Promise<AiServicesResponseTypes> {
    this.stepsExecuted.push({
      type: ExecutedStepTypes.PROMPT_EXECUTION,
      value: aiPromptSteps,
    });
    const returnData = this.aiResponses.shift();
    if (!returnData) {
      throw new Error('No more AI responses');
    }
    return Promise.resolve(returnData);
  }
}

function confirmStepMessage(step: ExecutedStep, expectedMessage: string) {
  expect(step.type).toBe(ExecutedStepTypes.CHAT_MESSAGE);
  const typeStep = step.value as ChatMessageTypes;
  expect(typeStep.message).toBe(expectedMessage);
}

function confirmStepWaiting(step: ExecutedStep, expectedWaiting: boolean) {
  expect(step.type).toBe(ExecutedStepTypes.WAITING_FOR_USER_ANSWER);
  expect(step.value).toBe(expectedWaiting);
}

function confirmStepIntention(step: ExecutedStep, expectedIntention: string) {
  expect(step.type).toBe(ExecutedStepTypes.SESSION_INTENTION);
  expect(step.value).toBe(expectedIntention);
}

function confirmStepPromptExecution(
  step: ExecutedStep,
  expectedPrompts: AiPromptStep[]
) {
  expect(step.type).toBe(ExecutedStepTypes.PROMPT_EXECUTION);
  const typeStep = step.value as AiPromptStep[];
  expect(typeStep).toStrictEqual(expectedPrompts);
}

function prepareActivityBuilder(
  activityBuilderData: ActivityBuilder,
  activityBuilderStepAccumulator: ActivityBuilderDataAccumulator
) {
  return new BuiltActivityHandler(
    (msg: ChatMessageTypes) => activityBuilderStepAccumulator.sendMessage(msg),
    (waiting: boolean) =>
      activityBuilderStepAccumulator.setWaitingForUserAnswer(waiting),
    (intention: string) =>
      activityBuilderStepAccumulator.updateSessionIntention(intention),
    async (aiPromptSteps: AiPromptStep[]) =>
      activityBuilderStepAccumulator.executePrompt(aiPromptSteps),
    activityBuilderData
  );
}

test('can collect users name and display', () => {
  const activityBuilderStepAccumulator = new ActivityBuilderDataAccumulator([]);
  const activityBuilder = prepareActivityBuilder(
    collectUserNameActivity,
    activityBuilderStepAccumulator
  );
  activityBuilder.initializeActivity();
  expect(activityBuilderStepAccumulator.stepsExecuted.length).toBe(2);
  activityBuilder.newChatLogReceived([
    {
      id: '123',
      sender: Sender.USER,
      displayType: MessageDisplayType.TEXT,
      message: 'Aaron',
    },
  ]);
  expect(activityBuilderStepAccumulator.stepsExecuted.length).toBe(6);
  confirmStepMessage(
    activityBuilderStepAccumulator.stepsExecuted[0],
    'What is your name?'
  );
  confirmStepWaiting(activityBuilderStepAccumulator.stepsExecuted[1], true);
  confirmStepWaiting(activityBuilderStepAccumulator.stepsExecuted[2], false);
  confirmStepMessage(
    activityBuilderStepAccumulator.stepsExecuted[3],
    'Hello, Aaron!'
  );
  confirmStepMessage(
    activityBuilderStepAccumulator.stepsExecuted[4],
    'What would you like to do next?'
  );
  confirmStepWaiting(activityBuilderStepAccumulator.stepsExecuted[5], true);
});

test('can collect session intention and display', () => {
  const activityBuilderStepAccumulator = new ActivityBuilderDataAccumulator([]);
  const activityBuilder = prepareActivityBuilder(
    collectIntentionActivity,
    activityBuilderStepAccumulator
  );
  activityBuilder.initializeActivity();
  expect(activityBuilderStepAccumulator.stepsExecuted.length).toBe(2);
  activityBuilder.newChatLogReceived([
    {
      id: '123',
      sender: Sender.USER,
      displayType: MessageDisplayType.TEXT,
      message: 'fix the intro',
    },
  ]);
  expect(activityBuilderStepAccumulator.stepsExecuted.length).toBe(7);
  confirmStepMessage(
    activityBuilderStepAccumulator.stepsExecuted[0],
    'What would you like to do next?'
  );
  confirmStepWaiting(activityBuilderStepAccumulator.stepsExecuted[1], true);
  confirmStepIntention(
    activityBuilderStepAccumulator.stepsExecuted[2],
    'fix the intro'
  );
  confirmStepWaiting(activityBuilderStepAccumulator.stepsExecuted[3], false);
  confirmStepMessage(
    activityBuilderStepAccumulator.stepsExecuted[4],
    'Your intention: fix the intro'
  );
  confirmStepMessage(
    activityBuilderStepAccumulator.stepsExecuted[5],
    'What would you like to do next?'
  );
  confirmStepWaiting(activityBuilderStepAccumulator.stepsExecuted[6], true);
});

test('can collect data from ai response and display', async () => {
  const activityBuilderStepAccumulator = new ActivityBuilderDataAccumulator([
    openAiTextResponse('{"nickname":"air-in"}'),
  ]);
  const activityBuilder = prepareActivityBuilder(
    collectAiDataAndDisplayActivity,
    activityBuilderStepAccumulator
  );
  activityBuilder.initializeActivity();
  await new Promise((r) => setTimeout(r, 1000));
  expect(activityBuilderStepAccumulator.stepsExecuted.length).toBe(3);
  confirmStepPromptExecution(activityBuilderStepAccumulator.stepsExecuted[0], [
    {
      prompts: [
        {
          promptText: 'Please generate a nickname for Aaron',
          includeEssay: false,
          promptRole: PromptRoles.USER,
        },
      ],
      outputDataType: PromptOutputTypes.JSON,
      responseFormat:
        'Please only respond with JSON with these fields:\nnickname: string\t\t  \n',
      systemRole: 'user',
    },
  ]);
  confirmStepMessage(
    activityBuilderStepAccumulator.stepsExecuted[1],
    'Do you like this nickname: air-in?'
  );
  confirmStepWaiting(activityBuilderStepAccumulator.stepsExecuted[2], true);
});

test('can send data to prompt requests', async () => {
  const activityBuilderStepAccumulator = new ActivityBuilderDataAccumulator([
    openAiTextResponse('{"nickname":"air-in"}'),
  ]);

  const activityBuilder = prepareActivityBuilder(
    sendDataToPromptsActivity,
    activityBuilderStepAccumulator
  );
  activityBuilder.initializeActivity();

  expect(activityBuilderStepAccumulator.stepsExecuted.length).toBe(3);
  confirmStepMessage(
    activityBuilderStepAccumulator.stepsExecuted[0],
    'Welcome to the test activity'
  );
  confirmStepMessage(
    activityBuilderStepAccumulator.stepsExecuted[1],
    'What is your name?'
  );
  confirmStepWaiting(activityBuilderStepAccumulator.stepsExecuted[2], true);

  activityBuilder.newChatLogReceived([
    {
      id: '123',
      sender: Sender.USER,
      displayType: MessageDisplayType.TEXT,
      message: 'Aaron',
    },
  ]);
  await new Promise((r) => setTimeout(r, 2000));
  expect(activityBuilderStepAccumulator.stepsExecuted.length).toBe(10);
  confirmStepWaiting(activityBuilderStepAccumulator.stepsExecuted[3], false);
  confirmStepMessage(
    activityBuilderStepAccumulator.stepsExecuted[4],
    'Hello, Aaron!'
  );
  confirmStepPromptExecution(activityBuilderStepAccumulator.stepsExecuted[5], [
    {
      prompts: [
        {
          promptText:
            'Current state of chat log between user and system: USER: Aaron\n',
          includeEssay: false,
          promptRole: PromptRoles.USER,
        },
        {
          promptText: 'Please generate a nickname for Aaron', // Aaron is inserted
          includeEssay: true,
          promptRole: PromptRoles.USER,
        },
      ],
      outputDataType: PromptOutputTypes.JSON,
      responseFormat: '',
      systemRole: 'user',
    },
  ]);
  confirmStepMessage(
    activityBuilderStepAccumulator.stepsExecuted[6],
    'Thank you for participating in the test activity, air-in!'
  );
});
