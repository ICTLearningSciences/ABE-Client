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
  ActivityStep,
  ActivityStepTypes,
  DocGoal,
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
    openAiPromptSteps: [
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
  const googleDocId = useAppSelector((state) => state.state.googleDocId);
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

  function introStep(stepData: StepData): ActivityStep {
    const { executePrompt } = stepData;
    return {
      text: "Feel free to edit your paper. Let me know when you're ready for me to analyze it.",
      stepType: ActivityStepTypes.MULTIPLE_CHOICE_QUESTIONS,
      mcqChoices: [MCQ_READY],
      handleResponse: () => {
        executePrompt(
          () => activityGql.prompt!,
          (response) => {
            sendMessage(
              {
                id: uuidv4(),
                message: response.answer,
                sender: Sender.SYSTEM,
                displayType: MessageDisplayType.TEXT,
                activityStep: introStep(stepData),
                openAiInfo: {
                  openAiPrompt: response.openAiData[0].openAiPrompt,
                  openAiResponse: response.openAiData[0].openAiResponse,
                },
              },
              false,
              googleDocId
            );
            setCurStepName(StepNames.FREE_INPUT);
          }
        );
      },
    };
  }

  function freeInputStep(stepData: StepData): ActivityStep {
    const { executePrompt } = stepData;
    return {
      text: 'Feel free to ask me anything else about your essay, or I can analyze it again for you.',
      stepType: ActivityStepTypes.FREE_RESPONSE_QUESTION,
      mcqChoices: [MCQ_ANALYZE],
      handleResponse: (response: string) => {
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
                  activityStep: freeInputStep(stepData),
                  openAiInfo: {
                    openAiPrompt: response.openAiData[0].openAiPrompt,
                    openAiResponse: response.openAiData[0].openAiResponse,
                  },
                },
                false,
                googleDocId
              );
              sendMessage(
                {
                  id: uuidv4(),
                  message:
                    'Feel free to ask me anything else about your essay, or I can anaylze it again for you.',
                  sender: Sender.SYSTEM,
                  displayType: MessageDisplayType.TEXT,
                  activityStep: freeInputStep(stepData),
                  mcqChoices: [MCQ_ANALYZE],
                },
                false,
                googleDocId
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
                activityStep: freeInputStep(stepData),
                openAiInfo: {
                  openAiPrompt: response.openAiData[0].openAiPrompt,
                  openAiResponse: response.openAiData[0].openAiResponse,
                },
              },
              false,
              googleDocId
            );
            sendMessage(
              {
                id: uuidv4(),
                message:
                  'Feel free to ask me anything else about your essay, or I can anaylze it again for you.',
                sender: Sender.SYSTEM,
                displayType: MessageDisplayType.TEXT,
                activityStep: freeInputStep(stepData),
                mcqChoices: [MCQ_ANALYZE],
              },
              false,
              googleDocId
            );
          });
        }
      },
    };
  }

  function getStep(stepData: StepData): ActivityStep {
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
