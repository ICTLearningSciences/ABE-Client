import {
  addContextToPromptSteps,
  validateJsonResponse,
} from '../../../../helpers';
import { Sender, MessageDisplayType } from '../../../../store/slices/chat';
import {
  ActiveActivityStep,
  ActivityStepTypes,
  GQLPrompt,
  PromptRoles,
  StepMessage,
} from '../../../../types';
import { StepData } from '../../../use-with-stronger-hook-activity';
import { v4 as uuidv4 } from 'uuid';
import {
  StepNames,
  ThesisSupportActivityState,
} from '../../use-with-thesis-support-activity';
import {
  SuggestImprovementResponse,
  suggestImprovementResponseSchema,
} from '../../prompt-helpers/suggest-improvement-prompt';

const MCQ_BRAINSTORM = 'BRAINSTORM';
export const IMPROVE_SUPPORT_ON_CLAIM_STEP_NAME = 'improve-support-on-claim';
export function sCollectImproveClaimSupportIntention(
  stepData: StepData,
  state: ThesisSupportActivityState,
  setState: (value: React.SetStateAction<ThesisSupportActivityState>) => void,
  analyzeIntentionVsOutline: GQLPrompt, allActivityMessages: StepMessage[]
): ActiveActivityStep {
  const {
    executePrompt,
    updateSessionIntention,
  } = stepData;
  const collectImproveClaimMessageId = "35b8559017dcb51adc3bf967"
  const message = allActivityMessages.find(
    (msg) => msg._id === collectImproveClaimMessageId
  );
  return {
    text: message?.text || 'What claim would you like to improve? You may select a suggest one or input your own.',
    stepType: ActivityStepTypes.FREE_RESPONSE_QUESTION,
    mcqChoices: state.potentialClaimsToImprove
      .map((claim) => claim.claim)
      .sort()
      .reverse()
      .slice(0, 3),
    handleResponse: async (response) => {
      updateSessionIntention({
        description: response,
      });
      await executePrompt(
        () => analyzeIntentionVsOutline,
        (res) => {
          setState((prevValue) => ({
            ...prevValue,
            analyzeIntentionOutput: res.answer,
            intendedClaimAdjustment: response,
            curStepName: StepNames.COLLECT_WHY_SAID_THINGS_STEP_NAME,
          }));
        }
      );
    },
  };
}

export const COLLECT_WHY_SAID_THINGS_STEP_NAME = 'collect-why-said-things';
export function sCollectWhyNotSayOrDidSayThings(
  stepData: StepData,
  state: ThesisSupportActivityState,
  setState: (value: React.SetStateAction<ThesisSupportActivityState>) => void,
  suggestClaimSupportChanges: GQLPrompt
): ActiveActivityStep {
  const { executePrompt } = stepData;
  return {
    text: state.analyzeIntentionOutput, // should be along the lines of (why did your or did not you say these things?)
    stepType: ActivityStepTypes.FREE_RESPONSE_QUESTION,
    handleResponse: async (userWhySaidOrNotSaid) => {
      const suggestClaimSupportWithData = addContextToPromptSteps(
        suggestClaimSupportChanges,
        [
          {
            promptText: `This is the claim that the student intends to improve: ${state.intendedClaimAdjustment}`,
            promptRole: PromptRoles.SYSTEM,
            includeEssay: false,
          },
        ]
      );
      await executePrompt(
        () => suggestClaimSupportWithData,
        (res) => {
          const suggestedImprovementsRes: SuggestImprovementResponse =
            validateJsonResponse<SuggestImprovementResponse>(
              res.answer,
              suggestImprovementResponseSchema
            );
          setState((prevValue) => ({
            ...prevValue,
            suggestedImprovements:
              suggestedImprovementsRes.suggestedImprovements,
            whySaidOrNotSaidUserInput: userWhySaidOrNotSaid,
            curStepName: StepNames.SELECT_INTENDED_IMPROVEMENT_STEP_NAME,
          }));
        }
      );
    },
  };
}

export const SELECT_INTENDED_IMPROVEMENT_STEP_NAME =
  'select-intended-improvement';
export function sSelectIntendedImprovement(
  stepData: StepData,
  state: ThesisSupportActivityState,
  setState: (value: React.SetStateAction<ThesisSupportActivityState>) => void,
  suggestClaimSupportChanges: GQLPrompt,
  analyzeRevisionIntention: GQLPrompt, allActivityMessages: StepMessage[]
): ActiveActivityStep {
  const {
    executePrompt,
    sendMessage,
    updateSessionIntention,
    setWaitingForUserAnswer,
  } = stepData;
  const whatImprovementMessageId = "45b8559017dcb51adc3bf967"
  const message = allActivityMessages.find(
    (msg) => msg._id === whatImprovementMessageId
  );
  return {
    text: message?.text || 'What improvement would you like to make? You may select one below, input your own, or we can brainstorm some more changes',
    stepType: ActivityStepTypes.MULTIPLE_CHOICE_QUESTIONS,
    mcqChoices: [MCQ_BRAINSTORM, ...state.suggestedImprovements],
    handleResponse: async (response) => {
      if (response === MCQ_BRAINSTORM) {
        const suggestClaimSupportWithData = addContextToPromptSteps(
          suggestClaimSupportChanges,
          [
            {
              promptText: `This is the claim that the student intends to improve: ${state.intendedClaimAdjustment}`,
              promptRole: PromptRoles.SYSTEM,
              includeEssay: false,
            },
            {
              promptText: `Do not suggest these improvements: ${state.suggestedImprovements.join(
                ', '
              )}`,
              promptRole: PromptRoles.SYSTEM,
              includeEssay: false,
            },
          ]
        );
        await executePrompt(
          () => suggestClaimSupportWithData,
          (res) => {
            const suggestedImprovementsRes: SuggestImprovementResponse =
              validateJsonResponse<SuggestImprovementResponse>(
                res.answer,
                suggestImprovementResponseSchema
              );
            sendMessage({
              id: uuidv4(),
              message:
                'Here are some more suggestions to improve your claim. You may select one below, input your own, or we can brainstorm some more changes',
              sender: Sender.SYSTEM,
              displayType: MessageDisplayType.TEXT,
              activityStep: sSelectIntendedImprovement(
                stepData,
                state,
                setState,
                suggestClaimSupportChanges,
                analyzeRevisionIntention,
                allActivityMessages
              ),
              mcqChoices: [
                MCQ_BRAINSTORM,
                ...suggestedImprovementsRes.suggestedImprovements,
              ],
              openAiInfo: {
                openAiPrompt: res.openAiData[0].openAiPrompt,
                openAiResponse: res.openAiData[0].openAiResponse,
              },
            });
            setWaitingForUserAnswer(true);
          }
        );
      } else {
        updateSessionIntention({
          description: response,
        });
        const analyzeRevisionIntentionWithData = addContextToPromptSteps(
          analyzeRevisionIntention,
          [
            {
              promptText: `This is the claim that the student intends to improve: ${state.intendedClaimAdjustment}`,
              promptRole: PromptRoles.SYSTEM,
              includeEssay: false,
            },
            {
              promptText: `This is the improvement that the student intends to make: ${response}`,
              promptRole: PromptRoles.SYSTEM,
              includeEssay: false,
            },
          ]
        );

        await executePrompt(
          () => analyzeRevisionIntentionWithData,
          (res) => {
            sendMessage({
              id: uuidv4(),
              message: res.answer,
              sender: Sender.SYSTEM,
              displayType: MessageDisplayType.TEXT,
              activityStep: sSelectIntendedImprovement(
                stepData,
                state,
                setState,
                suggestClaimSupportChanges,
                analyzeRevisionIntention,
                allActivityMessages
              ),
              openAiInfo: {
                openAiPrompt: res.openAiData[0].openAiPrompt,
                openAiResponse: res.openAiData[0].openAiResponse,
              },
            });
            setState((prevValue) => ({
              ...prevValue,
              curStepName: StepNames.INTRO,
            }));
          }
        );
      }
    },
  };
}
