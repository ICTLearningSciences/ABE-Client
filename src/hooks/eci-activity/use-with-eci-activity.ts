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
} from '../../store/slices/chat';
import {
  Activity,
  ActivityGQL,
  ActiveActivityStep,
  ActivityStepTypes,
  GQLPrompt,
  PromptOutputTypes,
  DocGoal,
  StepMessage,
} from '../../types';
import { StepData } from '../use-with-stronger-hook-activity';
import { useAppSelector } from '../../store/hooks';
import { v4 as uuidv4 } from 'uuid';
import { useWithState } from '../../store/slices/state/use-with-state';
import {
    startReviewUnderstandingCmdIntention,
    pickQuestionAboutInterpretation,
    discussInterpretationQuestion,
    reviseInterpretation,
} from './routes/understanding-cmd-intention/start-understanding-cmd-intention';
import{
    startReviewDocumentContent,
    pickCritiqueToDiscuss,
    discussCritique,
    revisePaper
} from './routes/review-document-content/start-review-document-content';

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

export interface EciActivityPrompts {
    compareUserInterpretationOfCmdIntent: GQLPrompt; // compare user interpretation of commanders intent
    initiateCompareInterpreationDiscussion: GQLPrompt; // initiate discussion on interpretation of commanders intent
    compareDocumentContentToCmdIntent: GQLPrompt; // compare document content to commanders intent
    initiateDocumentContentDiscussion: GQLPrompt; // initiate discussion on content compared to commanders intent
  }

 export enum EciStepNames {
    INTRO = 'INTRO',
    INTRO_2 = 'INTRO_2',
    FREE_INPUT = 'FREE_INPUT',
    SHOULD_WE_REVIEW_UNDERSTANDING = 'SHOULD_WE_REVIEW_UNDERSTANDING',

    // REVIEW UNDERSTANDING OF COMMANDERS INTENTION
    REVIEW_UNDERSTANDING_CMD_INTENTION = 'REVIEW_UNDERSTANDING_CMD_INTENTION',
    REVIEW_DOCUMENT_CONTENT = 'REVIEW_DOCUMENT_CONTENT',
    PICK_QUESTION_ABOUT_INTERPRETATION = 'PICK_QUESTION_ABOUT_INTERPRETATION',
    DISCUSS_INTERPRETATION_QUESTION = 'DISCUSS_INTERPRETATION_QUESTION',
    REVISE_INTERPRETATION = 'REVISE_INTERPRETATION',

    // REVIEW DOCUMENT CONTENT
    START_REVIEW_DOCUMENT_CONTENT = 'START_REVIEW_DOCUMENT_CONTENT',
    PICK_CRITIQUE_TO_DISCUSS = 'PICK_CRITIQUE_TO_DISCUSS',
    DISCUSS_CRITIQUE = 'DISCUSS_CRITIQUE',
    REVISE_PAPER = 'REVISE_PAPER',
  }

export interface EciActivityState{
    curStepName: EciStepNames;
    commandersIntention: string;
    usersInterpretationOfCmdIntent: {
        interpretation: string;
        matchRating: number;
        aiQuestionList: string[];
        questionDiscussing: string;
        discussQuestionIntroMessage: string;
    },
    compareDocumentToCmdIntent: {
        matchRating: number;
        aiQuestionList: string[];
        critiqueDiscussing: string;
        discussCritiqueIntroMessage: string;
    }
}


export function useWithEciActivity(
  activityGql: ActivityGQL,
  sendMessage: (msg: ChatMessageTypes) => void,
  setWaitingForUserAnswer: (waiting: boolean) => void,
  promptsLoading: boolean,
  prompts: GQLPrompt[],
  goal?: DocGoal
): Activity {
    const {updateSessionIntention} = useWithState();
  const googleDocId = useAppSelector((state) => state.state.googleDocId);
  const allActivityMessages: StepMessage[] = (activityGql.steps || [])?.reduce(
    (acc, step) => {
      return [...acc, ...step.messages];
    },
    [] as StepMessage[]
  );
  const [activityPrompts, setActivityPrompts] =
  useState<EciActivityPrompts>();

    const {
        compareUserInterpretationOfCmdIntent,
        initiateCompareInterpreationDiscussion,
        compareDocumentContentToCmdIntent,
        initiateDocumentContentDiscussion
    } = activityPrompts || {};

    const COMPARE_INTERPRETATION_PROMPT_ID = "6671e7da5e3bc37363ee2f75"
    const INITIATE_INTERPRETATION_DISCUSSION_PROMPT_ID = "6671e7e15e3bc37363ee2fe4"
    const COMPARE_DOCUMENT_CONTENT_PROMPT_ID = "6671e7eb5e3bc37363ee3055"
    const INITIATE_DOCUMENT_CONTENT_DISCUSSION_PROMPT_ID = "6671e7f45e3bc37363ee30c8"

    useEffect(() => {
        if (promptsLoading) {
          return;
        }
        const compareUserInterpretationOfCmdIntent = prompts.find(
          (prompt) => prompt._id === COMPARE_INTERPRETATION_PROMPT_ID
        );
        const initiateCompareInterpreationDiscussion = prompts.find(
          (prompt) => prompt._id === INITIATE_INTERPRETATION_DISCUSSION_PROMPT_ID
        );
        const compareDocumentContentToCmdIntent = prompts.find(
          (prompt) => prompt._id === COMPARE_DOCUMENT_CONTENT_PROMPT_ID
        );
        const initiateDocumentContentDiscussion = prompts.find(
          (prompt) => prompt._id === INITIATE_DOCUMENT_CONTENT_DISCUSSION_PROMPT_ID
        );
    
        if (
          !compareUserInterpretationOfCmdIntent ||
            !initiateCompareInterpreationDiscussion ||
            !compareDocumentContentToCmdIntent ||
            !initiateDocumentContentDiscussion
        ) {
          throw new Error('Missing prompts');
        }
        setActivityPrompts({
            compareUserInterpretationOfCmdIntent,
            initiateCompareInterpreationDiscussion,
            compareDocumentContentToCmdIntent,
            initiateDocumentContentDiscussion
        });
      }, [prompts, promptsLoading]);


      const [state, setState] = useState<EciActivityState>({
        curStepName: EciStepNames.INTRO,
        commandersIntention: '',
        usersInterpretationOfCmdIntent: {
            interpretation: '',
            matchRating: 0,
            aiQuestionList: [],
            questionDiscussing: '',
            discussQuestionIntroMessage: ''
        },
        compareDocumentToCmdIntent: {
            matchRating: 0,
            aiQuestionList: [],
            critiqueDiscussing: '',
            discussCritiqueIntroMessage: ''
        }
      });

      useEffect(() => {
        resetActivity();
      }, [activityGql.title, goal?._id]);

  function resetActivity(targetStep?: EciStepNames) {
    setState({
        curStepName: targetStep
          ? targetStep
          : state.curStepName === EciStepNames.INTRO
          ? EciStepNames.INTRO_2
          : EciStepNames.INTRO,
        commandersIntention: '',
        usersInterpretationOfCmdIntent: {
            interpretation: '',
            matchRating: 0,
            aiQuestionList: [],
            questionDiscussing: '',
            discussQuestionIntroMessage: ''
        },
        compareDocumentToCmdIntent: {
            matchRating: 0,
            aiQuestionList: [],
            critiqueDiscussing: '',
            discussCritiqueIntroMessage: ''
        }
      });
  }

  function getStep(stepData: StepData): ActiveActivityStep {
    if(!initiateCompareInterpreationDiscussion || !compareUserInterpretationOfCmdIntent || !initiateDocumentContentDiscussion || !compareDocumentContentToCmdIntent){
        throw new Error('Missing prompts');
    }
    switch (state.curStepName) {
      case EciStepNames.INTRO:
      case EciStepNames.INTRO_2:
        return introStep(stepData);
    case EciStepNames.SHOULD_WE_REVIEW_UNDERSTANDING:
        return shouldWeReviewUnderstanding(stepData);
    case EciStepNames.REVIEW_UNDERSTANDING_CMD_INTENTION:
        return startReviewUnderstandingCmdIntention(
            stepData,
            getMessage,
            state,
            setState,
            compareUserInterpretationOfCmdIntent
        );
    case EciStepNames.REVIEW_DOCUMENT_CONTENT:
        return startReviewDocumentContent(stepData, getMessage, state, setState, compareDocumentContentToCmdIntent);
    case EciStepNames.PICK_QUESTION_ABOUT_INTERPRETATION:
        return pickQuestionAboutInterpretation(stepData, getMessage, state, setState, initiateCompareInterpreationDiscussion);
    case EciStepNames.DISCUSS_INTERPRETATION_QUESTION:
        return discussInterpretationQuestion(stepData, state, setState);
    case EciStepNames.REVISE_INTERPRETATION:
        return reviseInterpretation(stepData, getMessage, state, setState);
    case EciStepNames.PICK_CRITIQUE_TO_DISCUSS:
        return pickCritiqueToDiscuss(stepData,getMessage, state, setState, initiateDocumentContentDiscussion);
    case EciStepNames.DISCUSS_CRITIQUE:
        return discussCritique(stepData, state, setState);
    case EciStepNames.REVISE_PAPER:
        return revisePaper(stepData, getMessage, state, setState);
      default:
        return introStep(stepData);
    }
  }

    function getMessage(messageId: string): string | undefined {
        return allActivityMessages.find((message) => message._id === messageId)?.text
    }

    function introStep(
        stepData: StepData
    ): ActiveActivityStep {
    const { executePrompt } = stepData;
    const introMessage = getMessage("16b8559017dcb51adc3bf967");
    return {
      text: introMessage || "What is the commanders provided intent?",
      stepType: ActivityStepTypes.FREE_RESPONSE_QUESTION,
      handleResponse: async (res) => {
        setState({
          ...state,
          commandersIntention: res,
          curStepName: EciStepNames.SHOULD_WE_REVIEW_UNDERSTANDING,
        });
      },
    };
  }

    function shouldWeReviewUnderstanding(
        stepData: StepData
    ): ActiveActivityStep {
    const reviewUnderstandingMessage = getMessage("25c8559017dcb51adc3bf967");
    return {
        text: reviewUnderstandingMessage || "Would you like to review your understanding of the Commander's Intent?",
        stepType: ActivityStepTypes.MULTIPLE_CHOICE_QUESTIONS,
        mcqChoices: ["Yes", "No"],
        handleResponse: async (res) => {
            if(res === "Yes"){
                setState({
                    ...state,
                    curStepName: EciStepNames.REVIEW_UNDERSTANDING_CMD_INTENTION
                });
            }else{
                setState({
                    ...state,
                    curStepName: EciStepNames.REVIEW_DOCUMENT_CONTENT
                });
            }
        },
    };
    }


  const activity: Activity = {
    ...activityGql,
    steps: [],
    getStep,
    stepName: state.curStepName,
    resetActivity,
    isReady: true,
  };
  return activity;
}
