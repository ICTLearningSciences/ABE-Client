/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { useEffect, useState } from 'react';
import { useAppSelector } from '../../store/hooks';
import {
  ChatMessageTypes,
  MessageDisplayType,
  Sender,
} from '../../store/slices/chat';
import {
  GQLPrompt,
  ActivityGQL,
  DocGoal,
  Activity,
  ActivityStep,
  ActivityStepTypes,
  PromptRoles,
} from '../../types';
import {
  StepData,
  MCQ_READY_FOR_REVIEW,
} from '../use-with-stronger-hook-activity';
import { v4 as uuidv4 } from 'uuid';
import { addContextToPromptSteps, validateJsonResponse } from '../../helpers';
import {
  AnalyzeConclusionFirstStep,
  analyzeConclusionFirstStepSchema,
} from './prompts/analyze-conclusion';

interface StrongerConclusionActivityPrompts {
  analyzeConclusionPrompt: GQLPrompt;
  // audienceImplicationEmotionDetectionPrompt: GQLPrompt;
  commentOnKeyImplicationsPrompt: GQLPrompt;
  collectAuthorOriginalIntentionPrompt: GQLPrompt;
  brainstormingOnSoWhatPrompt: GQLPrompt;
  soWhatQuestionPrompt: GQLPrompt;
  collectProposedRevisionPrompt: GQLPrompt;
}

const HELP_ME_BRAINSTORM = 'Help me brainstorm';

export function useWithStrongerConclusionActivity(
  activityGql: ActivityGQL,
  sendMessage: (
    msg: ChatMessageTypes,
    clearChat: boolean,
    docId: string
  ) => void,
  setWaitingForUserAnswer: (waiting: boolean) => void,
  promptsLoading: boolean,
  prompts: GQLPrompt[],
  goal?: DocGoal
): Activity {
  const googleDocId = useAppSelector((state) => state.state.googleDocId);

  const [activityPrompts, setActivityPrompts] =
    useState<StrongerConclusionActivityPrompts>();

  const {
    analyzeConclusionPrompt,
    // audienceImplicationEmotionDetectionPrompt,
    commentOnKeyImplicationsPrompt,
    collectAuthorOriginalIntentionPrompt,
    soWhatQuestionPrompt,
    brainstormingOnSoWhatPrompt,
    collectProposedRevisionPrompt,
  } = activityPrompts || {};

  const ANALYZE_CONCLUSION_PROMPT_ID = '66144b64c2027d0f8e5828dd';
  // const N_AUDIENCE_IMPLICATIONS_EMOTIONS_PROMPT_ID = '66144b70c2027d0f8e582920';
  const I_1_COMMENT_ON_KEY_IMPLICATIONS_PROMPT_ID = '66144b7ac2027d0f8e58295f';
  const I_2_COLLECT_AUTHOR_ORIGINAL_INTENT_PROMPT_ID =
    '66144b81c2027d0f8e5829a0';
  const I_3_SO_WHAT_QUESTION_PROMPT_ID = '66144b89c2027d0f8e5829e3';
  const I_4_BRAINSTORMING_ON_SO_WHAT_PROMPT_ID = '66144b97c2027d0f8e582a28';
  const I_5_COLLECT_PROPOSED_REVISION_PROMPT_ID = '66144b9fc2027d0f8e582a6f';

  enum StepNames {
    INTRO = 'intro',
    INTRO_2 = 'intro_2',
    ANALYZE_CONCLUSION = 'Analyze Conclusion',
    AUDIENCE_IMPLICATIONS_EMOTIONS = 'Audience Implications & Emotions',
    COMMENT_ON_KEY_IMPLICATIONS = 'Comment on Key Implications',
    COLLECT_AUTHOR_ORIGINAL_INTENTION = 'Collect Author Original Intention',
    SO_WHAT_QUESTION = 'So What Question',
    BRAINSTORMING_ON_SO_WHAT = 'Brainstorming on So What',
    COLLECT_PROPOSED_REVISION = 'Collect Proposed Revision',
    OUTRO = 'Outro',
  }

  useEffect(() => {
    if (promptsLoading) {
      return;
    }
    const analyzeConclusionPrompt = prompts.find(
      (prompt) => prompt._id === ANALYZE_CONCLUSION_PROMPT_ID
    );
    // const audienceImplicationEmotionDetectionPrompt = prompts.find(
    //   (prompt) => prompt._id === N_AUDIENCE_IMPLICATIONS_EMOTIONS_PROMPT_ID
    // );
    const commentOnKeyImplicationsPrompt = prompts.find(
      (prompt) => prompt._id === I_1_COMMENT_ON_KEY_IMPLICATIONS_PROMPT_ID
    );
    const collectAuthorOriginalIntentionPrompt = prompts.find(
      (prompt) => prompt._id === I_2_COLLECT_AUTHOR_ORIGINAL_INTENT_PROMPT_ID
    );
    const soWhatQuestionPrompt = prompts.find(
      (prompt) => prompt._id === I_3_SO_WHAT_QUESTION_PROMPT_ID
    );
    const brainstormingOnSoWhatPrompt = prompts.find(
      (prompt) => prompt._id === I_4_BRAINSTORMING_ON_SO_WHAT_PROMPT_ID
    );
    const collectProposedRevisionPrompt = prompts.find(
      (prompt) => prompt._id === I_5_COLLECT_PROPOSED_REVISION_PROMPT_ID
    );
    if (
      !analyzeConclusionPrompt ||
      // !audienceImplicationEmotionDetectionPrompt ||
      !commentOnKeyImplicationsPrompt ||
      !collectAuthorOriginalIntentionPrompt ||
      !soWhatQuestionPrompt ||
      !brainstormingOnSoWhatPrompt ||
      !collectProposedRevisionPrompt
    ) {
      throw new Error('Missing prompts');
    }
    setActivityPrompts({
      analyzeConclusionPrompt,
      // audienceImplicationEmotionDetectionPrompt,
      commentOnKeyImplicationsPrompt,
      collectAuthorOriginalIntentionPrompt,
      soWhatQuestionPrompt,
      brainstormingOnSoWhatPrompt,
      collectProposedRevisionPrompt,
    });
  }, [prompts, promptsLoading]);

  interface StrongerConclusionActivityState {
    curStepName: StepNames;
  }

  const [state, setState] = useState<StrongerConclusionActivityState>({
    curStepName: StepNames.INTRO,
  });

  function goToStep(stepName: StepNames) {
    setState((prevValue) => {
      return {
        ...prevValue,
        curStepName: stepName,
      };
    });
  }

  useEffect(() => {
    resetActivity();
  }, [activityGql.title, goal?._id]);

  function resetActivity(targetStep?: StepNames) {
    setState({
      curStepName: targetStep
        ? targetStep
        : state.curStepName === StepNames.INTRO
        ? StepNames.INTRO_2
        : StepNames.INTRO,
    });
  }

  function getStep(stepData: StepData): ActivityStep {
    switch (state.curStepName) {
      case StepNames.INTRO:
      case StepNames.INTRO_2:
        return introStep(stepData);
      case StepNames.COLLECT_AUTHOR_ORIGINAL_INTENTION:
        return i2CollectAuthorOriginalIntentionStep(stepData);
      case StepNames.SO_WHAT_QUESTION:
        return i3SoWhatQuestionStep(stepData);
      case StepNames.COLLECT_PROPOSED_REVISION:
        return i5CollectProposedRevisionStep(stepData);
      default:
        return introStep(stepData);
    }
  }

  function introStep(stepData: StepData): ActivityStep {
    const { executePrompt } = stepData;
    return {
      text: "Feel free to edit your papers conlusion, and tell me when it's ready for me to review.",
      stepType: ActivityStepTypes.MULTIPLE_CHOICE_QUESTIONS,
      mcqChoices: [MCQ_READY_FOR_REVIEW],
      handleResponse: async () => {
        console.log('handling response of intro step1 ');
        if (!analyzeConclusionPrompt || !commentOnKeyImplicationsPrompt) {
          return;
        }
        console.log('handling response of intro step 2');
        await executePrompt(
          () => analyzeConclusionPrompt,
          (res) => {
            if (!res.openAiData || res.openAiData.length < 2) {
              throw new Error('Missing step data');
            }
            const firstStepRes =
              res.openAiData[0].openAiResponse[0].message.content || '';
            // const secondStepRes = res.openAiData[1].openAiResponse[0].message.content || "";
            const audienceImplicationContentRes =
              validateJsonResponse<AnalyzeConclusionFirstStep>(
                firstStepRes,
                analyzeConclusionFirstStepSchema
              );
            // const emotionNarrativityImpactConclusionRes = validateJsonResponse<AnalyzeConclusionSecondStep>(
            //   secondStepRes,
            //   analyzeConclusionSecondStepSchema
            // );

            const commentOnKeyImplicationsPromptWithData: GQLPrompt =
              addContextToPromptSteps(commentOnKeyImplicationsPrompt, [
                {
                  promptText: `The key implications of the essay are: ${JSON.stringify(
                    audienceImplicationContentRes.implications
                  )}`,
                  includeEssay: false,
                  promptRole: PromptRoles.SYSTEM,
                },
                {
                  promptText: `The content of the essay is : ${JSON.stringify(
                    audienceImplicationContentRes.content
                  )}`,
                  includeEssay: false,
                  promptRole: PromptRoles.SYSTEM,
                },
              ]);
            executePrompt(
              () => commentOnKeyImplicationsPromptWithData,
              (res) => {
                sendMessage(
                  {
                    id: uuidv4(),
                    message: res.answer,
                    sender: Sender.SYSTEM,
                    displayType: MessageDisplayType.TEXT,
                    activityStep: introStep(stepData),
                    openAiInfo: {
                      openAiPrompt: res.openAiData[0].openAiPrompt,
                      openAiResponse: res.openAiData[0].openAiResponse,
                    },
                  },
                  false,
                  googleDocId
                );
                goToStep(StepNames.COLLECT_AUTHOR_ORIGINAL_INTENTION);
              }
            );
          }
        );
      },
    };
  }

  function i2CollectAuthorOriginalIntentionStep(
    stepData: StepData
  ): ActivityStep {
    const { executePrompt } = stepData;
    return {
      text: 'What was your original intention for writing this paper?',
      stepType: ActivityStepTypes.FREE_RESPONSE_QUESTION,
      handleResponse: async (response) => {
        if (!collectAuthorOriginalIntentionPrompt || !soWhatQuestionPrompt) {
          return;
        }
        const collectIntentionPromptWithData: GQLPrompt =
          addContextToPromptSteps(collectAuthorOriginalIntentionPrompt, [
            {
              promptText: `When the user originally wrote this paper, this was their intention: ${response}`,
              includeEssay: false,
              promptRole: PromptRoles.SYSTEM,
            },
          ]);
        await executePrompt(
          () => collectIntentionPromptWithData,
          (res) => {
            sendMessage(
              {
                id: uuidv4(),
                message: res.answer,
                sender: Sender.SYSTEM,
                displayType: MessageDisplayType.TEXT,
                activityStep: i2CollectAuthorOriginalIntentionStep(stepData),
                openAiInfo: {
                  openAiPrompt: res.openAiData[0].openAiPrompt,
                  openAiResponse: res.openAiData[0].openAiResponse,
                },
              },
              false,
              googleDocId
            );
          }
        );

        goToStep(StepNames.SO_WHAT_QUESTION);
      },
    };
  }

  function i3SoWhatQuestionStep(stepData: StepData): ActivityStep {
    const { executePrompt } = stepData;
    return {
      text: 'Why do you think people should care about what you are writing about? If you need help, click HELP ME BRAINSTORM.',
      stepType: ActivityStepTypes.FREE_RESPONSE_QUESTION,
      mcqChoices: [HELP_ME_BRAINSTORM],
      handleResponse: async (response) => {
        if (!soWhatQuestionPrompt || !brainstormingOnSoWhatPrompt) {
          return;
        }
        if (response === HELP_ME_BRAINSTORM) {
          await executePrompt(
            () => brainstormingOnSoWhatPrompt,
            (res) => {
              sendMessage(
                {
                  id: uuidv4(),
                  message: res.answer,
                  sender: Sender.SYSTEM,
                  displayType: MessageDisplayType.TEXT,
                  activityStep: i3SoWhatQuestionStep(stepData),
                  openAiInfo: {
                    openAiPrompt: res.openAiData[0].openAiPrompt,
                    openAiResponse: res.openAiData[0].openAiResponse,
                  },
                },
                false,
                googleDocId
              );
            }
          );
          setWaitingForUserAnswer(true);
          sendMessage(
            {
              id: uuidv4(),
              message:
                "Hope that helped. Why do you think people should care about what you're writing about?",
              sender: Sender.SYSTEM,
              mcqChoices: [HELP_ME_BRAINSTORM],
              displayType: MessageDisplayType.TEXT,
              activityStep: i3SoWhatQuestionStep(stepData),
            },
            false,
            googleDocId
          );
        } else {
          await executePrompt(
            () => soWhatQuestionPrompt,
            (res) => {
              sendMessage(
                {
                  id: uuidv4(),
                  message: res.answer,
                  sender: Sender.SYSTEM,
                  displayType: MessageDisplayType.TEXT,
                  activityStep: i3SoWhatQuestionStep(stepData),
                  openAiInfo: {
                    openAiPrompt: res.openAiData[0].openAiPrompt,
                    openAiResponse: res.openAiData[0].openAiResponse,
                  },
                },
                false,
                googleDocId
              );
            }
          );
          goToStep(StepNames.COLLECT_PROPOSED_REVISION);
        }
      },
    };
  }

  // function i4BrainstormingOnSoWhatStep(stepData: StepData): ActivityStep {
  //   const { executePrompt } = stepData;
  //   return {
  //     text: 'Would you like brainstorm more on what you could write about?',
  //     stepType: ActivityStepTypes.MULTIPLE_CHOICE_QUESTIONS,
  //     mcqChoices: [PLAN_REVISION, HELP_ME_BRAINSTORM],
  //     handleResponse: async (response) => {
  //       if (response === PLAN_REVISION) {
  //         goToStep(StepNames.COLLECT_PROPOSED_REVISION);
  //       } else {
  //         if (!brainstormingOnSoWhatPrompt) {
  //           return;
  //         }
  //         await executePrompt(
  //           () => brainstormingOnSoWhatPrompt,
  //           (res) => {
  //             sendMessage(
  //               {
  //                 id: uuidv4(),
  //                 message: res.answer,
  //                 sender: Sender.SYSTEM,
  //                 displayType: MessageDisplayType.TEXT,
  //                 activityStep: i4BrainstormingOnSoWhatStep(stepData),
  //                 openAiInfo: {
  //                   openAiPrompt: res.openAiData[0].openAiPrompt,
  //                   openAiResponse: res.openAiData[0].openAiResponse,
  //                 },
  //               },
  //               false,
  //               googleDocId
  //             );
  //           }
  //         );
  //         setWaitingForUserAnswer(true);
  //         sendMessage(
  //           {
  //             id: uuidv4(),
  //             message:
  //               'Would you like to plan your revision or continue brainstorming?',
  //             sender: Sender.SYSTEM,
  //             mcqChoices: [HELP_ME_BRAINSTORM, PLAN_REVISION],
  //             displayType: MessageDisplayType.TEXT,
  //             activityStep: i4BrainstormingOnSoWhatStep(stepData),
  //           },
  //           false,
  //           googleDocId
  //         );
  //       }
  //     },
  //   };
  // }

  function i5CollectProposedRevisionStep(stepData: StepData): ActivityStep {
    const { executePrompt } = stepData;
    return {
      text: 'What revision would you like to make to your essays conclusion?',
      stepType: ActivityStepTypes.FREE_RESPONSE_QUESTION,
      handleResponse: async () => {
        if (!collectProposedRevisionPrompt) {
          return;
        }
        await executePrompt(
          () => collectProposedRevisionPrompt,
          (res) => {
            sendMessage(
              {
                id: uuidv4(),
                message: res.answer,
                sender: Sender.SYSTEM,
                displayType: MessageDisplayType.TEXT,
                activityStep: i5CollectProposedRevisionStep(stepData),
                openAiInfo: {
                  openAiPrompt: res.openAiData[0].openAiPrompt,
                  openAiResponse: res.openAiData[0].openAiResponse,
                },
              },
              false,
              googleDocId
            );
          }
        );

        goToStep(StepNames.INTRO);
      },
    };
  }

  const activity: Activity = {
    ...activityGql,
    steps: [],
    getStep,
    stepName: state.curStepName,
    resetActivity,
    isReady: !!activityPrompts,
  };
  return activity;
}
