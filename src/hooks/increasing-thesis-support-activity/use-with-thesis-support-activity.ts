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
  ActiveActivityStep,
  Activity,
  ActivityGQL,
  ActivityStepTypes,
  DocGoal,
  GQLPrompt,
  StepMessage,
} from '../../types';
import {
  MCQ_READY_FOR_REVIEW,
  StepData,
} from '../use-with-stronger-hook-activity';
import { v4 as uuidv4 } from 'uuid';
import { validateJsonResponse } from '../../helpers';
import {
  AreasToImproveSupportForClaim,
  ReverseOutlineResponse,
  reverseOutlineResponseSchema,
} from './prompt-helpers/reverse-outline-prompt';
import {
  cCollectIntentionStep,
} from './routes/change-claims/collect-change-intention';
import {
  caCollectArgumentForNewClaim,
  addClaimToPaperAnalyzeStep,
} from './routes/change-claims/adding-claim';
import {
  sCollectImproveClaimSupportIntention,
  sCollectWhyNotSayOrDidSayThings,
  sSelectIntendedImprovement,
} from './routes/supporting-claims/improve-support-on-claim';
import {
  cRevisingClaim,
} from './routes/change-claims/revising-claim';
import {
  crRemoveClaimFromPaper,
} from './routes/change-claims/removing-claim';

interface IncreasingSupportActivityPrompts {
  reverseOutlinePrompt: GQLPrompt; // 654e926e7aaab424574a7de6

  //  BUTTON: Change Claims
  // Change Claims
  c1BrainstormClaimsPrompt: GQLPrompt; // 6616fd3bf182cb71657eb628
  c2AnalyzeIntendedClaimUsagePrompt: GQLPrompt; // 6616fd4d32d66ed2526d8015

  // Change Claims Adding
  ca1BrainstormArgumentsForNewClaimPrompt: GQLPrompt; // 6616fd68f182cb71657eb797
  ca2AnalyzeIntendedArgumentsForNewClaimPrompt: GQLPrompt; // 6616fd77f182cb71657eb847
  ca3AnalyzeClaimAddedToPaperPrompt: GQLPrompt; // 6616fd8032d66ed2526d816c

  // Change Claims Removing
  cr1BrainstormClaimRemovalTipsPrompt: GQLPrompt; // 6616fd88f182cb71657eb954
  cr2AnalyzeClaimRemovalPrompt: GQLPrompt; // 6616fd90f182cb71657eb9ee

  // BUTTON: Supporting Claims
  // Supporting Claims
  s1AnalyzeIntentionVsOutlinePrompt: GQLPrompt; // 6616fd99f182cb71657eba8a
  s2SuggestClaimSupportChangesPrompt: GQLPrompt; // 6616fda532d66ed2526d82f5
  s3AnalyzeClaimSupportRevisionIntentionPrompt: GQLPrompt; // 661d8ef0947389cb72be7568
}

export enum StepNames {
  INTRO = 'intro',
  INTRO_2 = 'intro_2',
  CHOOSE_CHANGE_OR_SUPPORT_CLAIMS = 'choose_change_or_support_claims',

  // Change Claim
  COLLECTION_CHANGE_INTENTION_STEP_NAME = 'collect-change-intention',

  // adding claim
  COLLECT_ARGUMENT_FOR_NEW_CLAIM_STEP_NAME = 'collect-argument-for-new-claim',
  ADDING_CLAIM_TO_PAPER_STEP_NAME = 'adding-claim-to-paper',

  // removing claims
  REMOVING_CLAIM_STEP_NAME = 'removing-claim',

  // revising claim
  REVISING_STEP_NAME = 'revising-claim',

  // Supporting Claims
  IMPROVE_SUPPORT_ON_CLAIM_STEP_NAME = 'improve-support-on-claim',
  COLLECT_WHY_SAID_THINGS_STEP_NAME = 'collect-why-said-things',
  SELECT_INTENDED_IMPROVEMENT_STEP_NAME = 'select-intended-improvement',
}

export interface ThesisSupportActivityState {
  curStepName: StepNames;
  potentialClaimsToImprove: AreasToImproveSupportForClaim[];
  thesisSupportRating: number;
  claimsSupportRating: number;
  intendedClaimAdjustment: string;
  analyzeIntentionOutput: string;

  // supporting claims
  suggestedImprovements: string[];
  whySaidOrNotSaidUserInput: string;
}

const MCQ_CHANGE_CLAIMS = 'Change Claims';
const MCQ_SUPPORT_CLAIMS = 'Supporting Claims';

export function useWithThesisSupportActivity(
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
    useState<IncreasingSupportActivityPrompts>();

  const {
    reverseOutlinePrompt,
    c1BrainstormClaimsPrompt,
    c2AnalyzeIntendedClaimUsagePrompt,
    ca1BrainstormArgumentsForNewClaimPrompt,
    ca2AnalyzeIntendedArgumentsForNewClaimPrompt,
    ca3AnalyzeClaimAddedToPaperPrompt,
    cr1BrainstormClaimRemovalTipsPrompt,
    cr2AnalyzeClaimRemovalPrompt,
    s1AnalyzeIntentionVsOutlinePrompt,
    s2SuggestClaimSupportChangesPrompt,
    s3AnalyzeClaimSupportRevisionIntentionPrompt,
  } = activityPrompts || {};

  const REVERSE_OUTLINE_PROMPT_ID = '654e926e7aaab424574a7de6';
  const C1_BRAINSTORM_CLAIMS_PROMPT_ID = '6616fd3bf182cb71657eb628';
  const C2_ANALYZE_INTENDED_CLAIM_USAGE_PROMPT_ID = '6616fd4d32d66ed2526d8015';
  const CA1_BRAINSTORM_ARGUMENTS_FOR_NEW_CLAIM_PROMPT_ID =
    '6616fd68f182cb71657eb797';
  const CA2_ANALYZE_INTENDED_ARGUMENTS_FOR_NEW_CLAIM_PROMPT_ID =
    '6616fd77f182cb71657eb847';
  const CA3_ANALYZE_CLAIM_ADDED_TO_PAPER_PROMPT_ID = '6616fd8032d66ed2526d816c';
  const CR1_BRAINSTORM_CLAIM_REMOVAL_TIPS_PROMPT_ID =
    '6616fd88f182cb71657eb954';
  const CR2_ANALYZE_CLAIM_REMOVAL_PROMPT_ID = '6616fd90f182cb71657eb9ee';
  const S1_ANALYZE_INTENTION_VS_OUTLINE_PROMPT_ID = '6616fd99f182cb71657eba8a';
  const S2_SUGGEST_CLAIM_SUPPORT_CHANGES_PROMPT_ID = '6616fda532d66ed2526d82f5';
  const S3_ANALYZE_CLAIM_SUPPORT_REVISION_INTENTION_PROMPT_ID =
    '661d8ef0947389cb72be7568';

  useEffect(() => {
    if (promptsLoading) {
      console.log('prompts loading');
      return;
    }
    console.log('prompts loaded');
    const reverseOutlinePrompt = prompts.find(
      (prompt) => prompt._id === REVERSE_OUTLINE_PROMPT_ID
    );
    const c1BrainstormClaimsPrompt = prompts.find(
      (prompt) => prompt._id === C1_BRAINSTORM_CLAIMS_PROMPT_ID
    );
    const c2AnalyzeIntendedClaimUsagePrompt = prompts.find(
      (prompt) => prompt._id === C2_ANALYZE_INTENDED_CLAIM_USAGE_PROMPT_ID
    );
    const ca1BrainstormArgumentsForNewClaimPrompt = prompts.find(
      (prompt) =>
        prompt._id === CA1_BRAINSTORM_ARGUMENTS_FOR_NEW_CLAIM_PROMPT_ID
    );
    const ca2AnalyzeIntendedArgumentsForNewClaimPrompt = prompts.find(
      (prompt) =>
        prompt._id === CA2_ANALYZE_INTENDED_ARGUMENTS_FOR_NEW_CLAIM_PROMPT_ID
    );
    const ca3AnalyzeClaimAddedToPaperPrompt = prompts.find(
      (prompt) => prompt._id === CA3_ANALYZE_CLAIM_ADDED_TO_PAPER_PROMPT_ID
    );
    const cr1BrainstormClaimRemovalTipsPrompt = prompts.find(
      (prompt) => prompt._id === CR1_BRAINSTORM_CLAIM_REMOVAL_TIPS_PROMPT_ID
    );
    const cr2AnalyzeClaimRemovalPrompt = prompts.find(
      (prompt) => prompt._id === CR2_ANALYZE_CLAIM_REMOVAL_PROMPT_ID
    );
    const s1AnalyzeIntentionVsOutlinePrompt = prompts.find(
      (prompt) => prompt._id === S1_ANALYZE_INTENTION_VS_OUTLINE_PROMPT_ID
    );
    const s2SuggestClaimSupportChangesPrompt = prompts.find(
      (prompt) => prompt._id === S2_SUGGEST_CLAIM_SUPPORT_CHANGES_PROMPT_ID
    );
    const s3AnalyzeClaimSupportRevisionIntentionPrompt = prompts.find(
      (prompt) =>
        prompt._id === S3_ANALYZE_CLAIM_SUPPORT_REVISION_INTENTION_PROMPT_ID
    );

    if (
      !reverseOutlinePrompt ||
      !c1BrainstormClaimsPrompt ||
      !c2AnalyzeIntendedClaimUsagePrompt ||
      !ca1BrainstormArgumentsForNewClaimPrompt ||
      !ca2AnalyzeIntendedArgumentsForNewClaimPrompt ||
      !ca3AnalyzeClaimAddedToPaperPrompt ||
      !cr1BrainstormClaimRemovalTipsPrompt ||
      !cr2AnalyzeClaimRemovalPrompt ||
      !s1AnalyzeIntentionVsOutlinePrompt ||
      !s2SuggestClaimSupportChangesPrompt ||
      !s3AnalyzeClaimSupportRevisionIntentionPrompt
    ) {
      console.log('missing prompts');
      throw new Error('Missing prompts');
    }
    setActivityPrompts({
      reverseOutlinePrompt,
      c1BrainstormClaimsPrompt,
      c2AnalyzeIntendedClaimUsagePrompt,
      ca1BrainstormArgumentsForNewClaimPrompt,
      ca2AnalyzeIntendedArgumentsForNewClaimPrompt,
      ca3AnalyzeClaimAddedToPaperPrompt,
      cr1BrainstormClaimRemovalTipsPrompt,
      cr2AnalyzeClaimRemovalPrompt,
      s1AnalyzeIntentionVsOutlinePrompt,
      s2SuggestClaimSupportChangesPrompt,
      s3AnalyzeClaimSupportRevisionIntentionPrompt,
    });
  }, [prompts, promptsLoading]);

  const [state, setState] = useState<ThesisSupportActivityState>({
    curStepName: StepNames.INTRO,
    intendedClaimAdjustment: '',
    analyzeIntentionOutput: '',
    potentialClaimsToImprove: [],
    thesisSupportRating: -1,
    claimsSupportRating: -1,
    suggestedImprovements: [],
    whySaidOrNotSaidUserInput: '',
  });

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
      potentialClaimsToImprove: [],
      thesisSupportRating: -1,
      claimsSupportRating: -1,
      intendedClaimAdjustment: '',
      analyzeIntentionOutput: '',
      suggestedImprovements: [],
      whySaidOrNotSaidUserInput: '',
    });
  }

  function getStep(stepData: StepData): ActiveActivityStep {
    switch (state.curStepName) {
      case StepNames.INTRO:
      case StepNames.INTRO_2:
        return introStep(stepData, allActivityMessages);
      case StepNames.CHOOSE_CHANGE_OR_SUPPORT_CLAIMS:
        return chooseChangeOrSupportClaimsStep(allActivityMessages);
      case StepNames.COLLECTION_CHANGE_INTENTION_STEP_NAME:
        return cCollectIntentionStep(
          stepData,
          state,
          setState,
          c1BrainstormClaimsPrompt!,
          c2AnalyzeIntendedClaimUsagePrompt!,
          allActivityMessages
        );
      case StepNames.COLLECT_ARGUMENT_FOR_NEW_CLAIM_STEP_NAME:
        return caCollectArgumentForNewClaim(
          stepData,
          state,
          setState,
          ca1BrainstormArgumentsForNewClaimPrompt!,
          ca2AnalyzeIntendedArgumentsForNewClaimPrompt!,
          allActivityMessages
        );
      case StepNames.ADDING_CLAIM_TO_PAPER_STEP_NAME:
        return addClaimToPaperAnalyzeStep(
          stepData,
          state,
          setState,
          ca3AnalyzeClaimAddedToPaperPrompt!,
          allActivityMessages
        );
      case StepNames.REMOVING_CLAIM_STEP_NAME:
        return crRemoveClaimFromPaper(
          stepData,
          state,
          setState,
          cr1BrainstormClaimRemovalTipsPrompt!,
          cr2AnalyzeClaimRemovalPrompt!,
          allActivityMessages
        );
      case StepNames.REVISING_STEP_NAME:
        return cRevisingClaim(
          stepData,
          state,
          setState,
          s1AnalyzeIntentionVsOutlinePrompt!,
          allActivityMessages
        );
      case StepNames.IMPROVE_SUPPORT_ON_CLAIM_STEP_NAME:
        return sCollectImproveClaimSupportIntention(
          stepData,
          state,
          setState,
          s1AnalyzeIntentionVsOutlinePrompt!,
          allActivityMessages
        );
      case StepNames.COLLECT_WHY_SAID_THINGS_STEP_NAME:
        return sCollectWhyNotSayOrDidSayThings(
          stepData,
          state,
          setState,
          s2SuggestClaimSupportChangesPrompt!
        );
      case StepNames.SELECT_INTENDED_IMPROVEMENT_STEP_NAME:
        return sSelectIntendedImprovement(
          stepData,
          state,
          setState,
          s2SuggestClaimSupportChangesPrompt!,
          s3AnalyzeClaimSupportRevisionIntentionPrompt!,
          allActivityMessages
        );
      default:
        return introStep(stepData, allActivityMessages);
    }
  }

  function introStep(stepData: StepData, allActivityMessages: StepMessage[]): ActiveActivityStep {
    const introMessageId = "15b8559017dcb51adc3bf967"
    const message = allActivityMessages.find(
      (msg) => msg._id === introMessageId
    );
    const { executePrompt } = stepData;
    return {
      text: message?.text || 'Let me know when your paper is ready for me to review.',
      stepType: ActivityStepTypes.MULTIPLE_CHOICE_QUESTIONS,
      mcqChoices: [MCQ_READY_FOR_REVIEW],
      handleResponse: async () => {
        if (!reverseOutlinePrompt) {
          return;
        }
        await executePrompt(
          () => reverseOutlinePrompt,
          (res) => {
            const reverseOutlineRes =
              validateJsonResponse<ReverseOutlineResponse>(
                res.answer,
                reverseOutlineResponseSchema
              );
            sendMessage(
              {
                id: uuidv4(),
                message: reverseOutlineRes.overall.justification,
                sender: Sender.SYSTEM,
                displayType: MessageDisplayType.TEXT,
                activityStep: introStep(stepData, allActivityMessages),
                openAiInfo: {
                  openAiPrompt: res.openAiData[0].openAiPrompt,
                  openAiResponse: res.openAiData[0].openAiResponse,
                },
              },
              false,
              googleDocId
            );
            setState((prevValue) => {
              return {
                ...prevValue,
                curStepName: StepNames.CHOOSE_CHANGE_OR_SUPPORT_CLAIMS,
                potentialClaimsToImprove:
                  reverseOutlineRes.areasToImproveSupportForClaim,
                thesisSupportRating:
                  reverseOutlineRes.overall.thesisSupportRating,
                claimsSupportRating:
                  reverseOutlineRes.overall.claimsSupportRating,
              };
            });
          }
        );
      },
    };
  }

  function chooseChangeOrSupportClaimsStep(allActivityMessages: StepMessage[]): ActiveActivityStep {
    const changeMessageId = "25b8559017dcb51adc3bf967"
    const message = allActivityMessages.find(
      (msg) => msg._id === changeMessageId
    );
    return {
      text: message?.text || 'What would you like to work on?',
      stepType: ActivityStepTypes.MULTIPLE_CHOICE_QUESTIONS,
      mcqChoices:
        state.claimsSupportRating >= state.thesisSupportRating
          ? [MCQ_CHANGE_CLAIMS, MCQ_SUPPORT_CLAIMS]
          : [MCQ_SUPPORT_CLAIMS, MCQ_CHANGE_CLAIMS],
      handleResponse: async (response) => {
        if (response === MCQ_CHANGE_CLAIMS) {
          setState((prevValue) => {
            return {
              ...prevValue,
              curStepName: StepNames.COLLECTION_CHANGE_INTENTION_STEP_NAME,
            };
          });
        } else if (response === MCQ_SUPPORT_CLAIMS) {
          setState((prevValue) => {
            return {
              ...prevValue,
              curStepName: StepNames.IMPROVE_SUPPORT_ON_CLAIM_STEP_NAME,
            };
          });
        }
      },
    };
  }

  return {
    ...activityGql,
    steps: [],
    getStep,
    stepName: state.curStepName,
    resetActivity,
    isReady: Boolean(activityPrompts),
  };
}
