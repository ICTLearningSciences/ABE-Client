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
  ActiveActivityStep,
  ActivityStepTypes,
  PromptRoles,
  StepMessage,
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
  impactDiscussionPrompt: GQLPrompt;
}

const MCQ_READY_TO_REVISE = 'Ready to revise';

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
  const allActivityMessages: StepMessage[] = (activityGql.steps || [])?.reduce(
    (acc, step) => {
      return [...acc, ...step.messages];
    },
    [] as StepMessage[]
  );
  const [activityPrompts, setActivityPrompts] =
    useState<StrongerConclusionActivityPrompts>();
  // collectAuthorOriginalIntentionPrompt || !soWhatQuestionPrompt
  const {
    analyzeConclusionPrompt,
    // audienceImplicationEmotionDetectionPrompt,
    commentOnKeyImplicationsPrompt,
    collectAuthorOriginalIntentionPrompt,
    soWhatQuestionPrompt,
    collectProposedRevisionPrompt,
    impactDiscussionPrompt,
  } = activityPrompts || {};

  const ANALYZE_CONCLUSION_PROMPT_ID = '66144b64c2027d0f8e5828dd';
  // const N_AUDIENCE_IMPLICATIONS_EMOTIONS_PROMPT_ID = '66144b70c2027d0f8e582920';
  const I_1_COMMENT_ON_KEY_IMPLICATIONS_PROMPT_ID = '66144b7ac2027d0f8e58295f';
  const I_2_COLLECT_AUTHOR_ORIGINAL_INTENT_PROMPT_ID =
    '66144b81c2027d0f8e5829a0';
  const I_3_SO_WHAT_QUESTION_PROMPT_ID = '66144b89c2027d0f8e5829e3';
  const I_4_BRAINSTORMING_ON_SO_WHAT_PROMPT_ID = '66144b97c2027d0f8e582a28';
  const I_5_COLLECT_PROPOSED_REVISION_PROMPT_ID = '66144b9fc2027d0f8e582a6f';
  const IMPACT_DISCUSSION_PROMPT_ID = '66185c96b765bc832e5b78aa';

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
    IMPACT_DISCUSSION = 'Impact Discussion',
    OUTRO = 'Outro',
  }

  useEffect(() => {
    if (promptsLoading) {
      return;
    }
    const analyzeConclusionPrompt = prompts.find(
      (prompt) => prompt._id === ANALYZE_CONCLUSION_PROMPT_ID
    );
    const impactDiscussionPrompt = prompts.find(
      (prompt) => prompt._id === IMPACT_DISCUSSION_PROMPT_ID
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
      !collectProposedRevisionPrompt ||
      !impactDiscussionPrompt
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
      impactDiscussionPrompt,
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

  function getStep(stepData: StepData): ActiveActivityStep {
    switch (state.curStepName) {
      case StepNames.INTRO:
      case StepNames.INTRO_2:
        return introStep(stepData);
      case StepNames.COLLECT_AUTHOR_ORIGINAL_INTENTION:
        return i2CollectAuthorOriginalIntentionStep(stepData);
      case StepNames.SO_WHAT_QUESTION:
        return i3SoWhatQuestionStep(stepData);
      case StepNames.IMPACT_DISCUSSION:
        return impactDiscussionStep(stepData);
      case StepNames.COLLECT_PROPOSED_REVISION:
        return i5CollectProposedRevisionStep(stepData);
      default:
        return introStep(stepData);
    }
  }

  function introStep(stepData: StepData): ActiveActivityStep {
    const INTRO_MESSAGE_ID = '65b8559017dcb51adc3af967';
    const introMessage = allActivityMessages.find(
      (msg) => msg._id === INTRO_MESSAGE_ID
    );
    const { executePrompt } = stepData;
    return {
      text:
        introMessage?.text ||
        "Feel free to edit your papers conlusion, and tell me when it's ready for me to review.",
      stepType: ActivityStepTypes.MULTIPLE_CHOICE_QUESTIONS,
      mcqChoices: [MCQ_READY_FOR_REVIEW],
      handleResponse: async () => {
        if (!analyzeConclusionPrompt || !commentOnKeyImplicationsPrompt) {
          return;
        }
        await executePrompt(
          () => analyzeConclusionPrompt,
          (res) => {
            if (!res.aiAllStepsData || res.aiAllStepsData.length < 2) {
              throw new Error('Missing step data');
            }
            const firstStepRes =
              res.aiAllStepsData[0].aiServiceResponse[0].message.content || '';
            // const secondStepRes = res.aiStepData[1].aiServiceResponse[0].message.content || "";
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
                      aiServiceRequestParams:
                        res.aiAllStepsData[0].aiServiceRequestParams,
                      aiServiceResponse:
                        res.aiAllStepsData[0].aiServiceResponse,
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
  ): ActiveActivityStep {
    const COLLECT_MESSAGE_ID = '65b8559017dbb51ddc3af967';
    const collectMessage = allActivityMessages.find(
      (msg) => msg._id === COLLECT_MESSAGE_ID
    );
    const { executePrompt } = stepData;
    return {
      text:
        collectMessage?.text ||
        'To make sure I understand it right, can you tell me your main intention for the paper so I can compare with my understanding?',
      stepType: ActivityStepTypes.FREE_RESPONSE_QUESTION,
      handleResponse: async (response) => {
        if (!collectAuthorOriginalIntentionPrompt) {
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
                  aiServiceRequestParams:
                    res.aiAllStepsData[0].aiServiceRequestParams,
                  aiServiceResponse: res.aiAllStepsData[0].aiServiceResponse,
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

  function i3SoWhatQuestionStep(stepData: StepData): ActiveActivityStep {
    const SO_WHAT_MESSAGE_ONE_ID = '65b8859017dbb51ddc3af967';
    // const SO_WHAT_MESSAGE_TWO_ID = '65b8859017dbb51ddc3af467';
    const soWhatMessageOne = allActivityMessages.find(
      (msg) => msg._id === SO_WHAT_MESSAGE_ONE_ID
    );
    const { executePrompt } = stepData;
    return {
      text:
        soWhatMessageOne?.text ||
        'Why do you think people should care about what you are writing about?',
      stepType: ActivityStepTypes.FREE_RESPONSE_QUESTION,
      mcqChoices: [],
      handleResponse: async () => {
        if (!soWhatQuestionPrompt) {
          return;
        }
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
                  aiServiceRequestParams:
                    res.aiAllStepsData[0].aiServiceRequestParams,
                  aiServiceResponse: res.aiAllStepsData[0].aiServiceResponse,
                },
              },
              false,
              googleDocId
            );
          }
        );
        goToStep(StepNames.IMPACT_DISCUSSION);
      },
    };
  }

  function impactDiscussionStep(stepData: StepData): ActiveActivityStep {
    const IMPACT_MESSAGE_ID = '65b8859017dbb51ddc3af997';
    const impactMessage = allActivityMessages.find(
      (msg) => msg._id === IMPACT_MESSAGE_ID
    );
    const { executePrompt } = stepData;
    return {
      text:
        impactMessage?.text ||
        "Let's have an open ended discussion about the impact your essay could have. If you are ready to revise, click [READY TO REVISE].",
      stepType: ActivityStepTypes.FREE_RESPONSE_QUESTION,
      mcqChoices: [MCQ_READY_TO_REVISE],
      handleResponse: async (res) => {
        if (!impactDiscussionPrompt) {
          return;
        }
        if (res === MCQ_READY_TO_REVISE) {
          goToStep(StepNames.COLLECT_PROPOSED_REVISION);
        } else {
          await executePrompt(
            () => impactDiscussionPrompt,
            (res) => {
              sendMessage(
                {
                  id: uuidv4(),
                  message: res.answer,
                  sender: Sender.SYSTEM,
                  mcqChoices: [MCQ_READY_TO_REVISE],
                  displayType: MessageDisplayType.TEXT,
                  activityStep: impactDiscussionStep(stepData),
                  openAiInfo: {
                    aiServiceRequestParams:
                      res.aiAllStepsData[0].aiServiceRequestParams,
                    aiServiceResponse: res.aiAllStepsData[0].aiServiceResponse,
                  },
                },
                false,
                googleDocId
              );
            }
          );
          setWaitingForUserAnswer(true);
        }
      },
    };
  }

  function i5CollectProposedRevisionStep(
    stepData: StepData
  ): ActiveActivityStep {
    const REVISION_MESSAGE_ID = '65b8859017dbb51ddc3af957';
    const revisionMessage = allActivityMessages.find(
      (msg) => msg._id === REVISION_MESSAGE_ID
    );
    const { executePrompt } = stepData;
    return {
      text:
        revisionMessage?.text ||
        'What revision would you like to make to your essays conclusion?',
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
                  aiServiceRequestParams:
                    res.aiAllStepsData[0].aiServiceRequestParams,
                  aiServiceResponse: res.aiAllStepsData[0].aiServiceResponse,
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
