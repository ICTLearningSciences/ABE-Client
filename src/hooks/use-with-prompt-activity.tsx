/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { useEffect, useState } from 'react';
import {
  ChatLog,
  ChatMessageTypes,
  MessageDisplayType,
  Sender,
} from '../store/slices/chat';
import {
  Activity,
  ActivityGQL,
  ActiveActivityStep,
  ActivityStepTypes,
  GQLPrompt,
  PromptOutputTypes,
} from '../types';
import { StepData } from './use-with-stronger-hook-activity';
import { useAppSelector } from '../store/hooks';
import { v4 as uuidv4 } from 'uuid';

const MCQ_READY = 'Ready';
const MCQ_ANALYZE = 'Analyze';

export const freeInputPrompt = (chatLog: ChatMessageTypes[]): GQLPrompt => {
  const reversedChatLog: ChatLog = [...chatLog].reverse();
  const lastUserMessage = reversedChatLog.find(
    (msg) => msg.sender === Sender.USER
  );
  const message = lastUserMessage ? lastUserMessage.message : '';
  return {
    _id: '',
    clientId: '',
    aiPromptSteps: [
      {
        prompts: [
          {
            promptText: message,
            includeEssay: true,
          },
        ],
        outputDataType: PromptOutputTypes.TEXT,
        includeChatLogContext: true,
      },
    ],
    title: 'Free Input',
  };
};

export function useWithPromptActivity(
  activityGql: ActivityGQL,
  sendMessage: (
    msg: ChatMessageTypes,
    clearChat: boolean,
    docId: string
  ) => void,
  setWaitingForUserAnswer: (waiting: boolean) => void
): Activity {
  const curDocId = useAppSelector((state) => state.state.curDocId);
  enum StepNames {
    INTRO = 'INTRO',
    INTRO_2 = 'INTRO_2',
    FREE_INPUT = 'FREE_INPUT',
  }

  const [curStepName, setCurStepName] = useState<StepNames>(StepNames.INTRO);

  useEffect(() => {
    if (curStepName === StepNames.INTRO) {
      setCurStepName(StepNames.INTRO_2);
    } else {
      setCurStepName(StepNames.INTRO);
    }
  }, [activityGql.title]);

  function resetActivity() {
    if (curStepName === StepNames.INTRO) {
      setCurStepName(StepNames.INTRO_2);
    } else {
      setCurStepName(StepNames.INTRO);
    }
  }

  function introStep(stepData: StepData): ActiveActivityStep {
    const { executePrompt } = stepData;
    return {
      text: "This is a single prompt preview activity. The result of your request may be in JSON or other formats. Feel free to edit your paper. Let me know when you're ready for me to analyze it.",
      stepType: ActivityStepTypes.MULTIPLE_CHOICE_QUESTIONS,
      mcqChoices: [MCQ_READY],
      handleResponse: async () => {
        executePrompt(
          () => activityGql.prompt!,
          (response) => {
            sendMessage(
              {
                id: uuidv4(),
                message: response.answer,
                sender: Sender.SYSTEM,
                displayType: MessageDisplayType.TEXT,
                disableUserInput: true,
                aiServiceStepData: response.aiAllStepsData,
              },
              false,
              curDocId
            );
            setCurStepName(StepNames.FREE_INPUT);
          }
        );
      },
    };
  }

  function freeInputStep(stepData: StepData): ActiveActivityStep {
    const { executePrompt } = stepData;
    return {
      text: 'Feel free to ask me anything else about your essay, or I can analyze it again for you.',
      stepType: ActivityStepTypes.FREE_RESPONSE_QUESTION,
      mcqChoices: [MCQ_ANALYZE],
      handleResponse: async (response: string) => {
        if (response === MCQ_ANALYZE) {
          executePrompt(
            () => activity.prompt!,
            (response) => {
              setWaitingForUserAnswer(true);
              sendMessage(
                {
                  id: uuidv4(),
                  message: response.answer,
                  sender: Sender.SYSTEM,
                  displayType: MessageDisplayType.TEXT,

                  aiServiceStepData: response.aiAllStepsData,
                },
                false,
                curDocId
              );
              sendMessage(
                {
                  id: uuidv4(),
                  message:
                    'Feel free to ask me anything else about your essay, or I can anaylze it again for you.',
                  sender: Sender.SYSTEM,
                  displayType: MessageDisplayType.TEXT,

                  mcqChoices: [MCQ_ANALYZE],
                },
                false,
                curDocId
              );
            }
          );
        } else {
          executePrompt(freeInputPrompt, (response) => {
            setWaitingForUserAnswer(true);
            sendMessage(
              {
                id: uuidv4(),
                message: response.answer,
                sender: Sender.SYSTEM,
                displayType: MessageDisplayType.TEXT,

                aiServiceStepData: response.aiAllStepsData,
              },
              false,
              curDocId
            );
            sendMessage(
              {
                id: uuidv4(),
                message:
                  'Feel free to ask me anything else about your essay, or I can anaylze it again for you.',
                sender: Sender.SYSTEM,
                displayType: MessageDisplayType.TEXT,

                mcqChoices: [MCQ_ANALYZE],
              },
              false,
              curDocId
            );
          });
        }
      },
    };
  }

  function getStep(stepData: StepData): ActiveActivityStep {
    switch (curStepName) {
      case StepNames.INTRO:
      case StepNames.INTRO_2:
        return introStep(stepData);
      case StepNames.FREE_INPUT:
        return freeInputStep(stepData);
    }
  }

  const activity: Activity = {
    ...activityGql,
    steps: [],
    getStep,
    stepName: curStepName,
    resetActivity,
    isReady: true,
  };
  return activity;
}
