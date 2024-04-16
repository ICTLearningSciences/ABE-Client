import { validateJsonResponse } from '../../../../helpers';
import { Sender, MessageDisplayType } from '../../../../store/slices/chat';
import {
  ActiveActivityStep,
  ActivityStepTypes,
  GQLPrompt,
  StepMessage,
} from '../../../../types';
import { StepData } from '../../../use-with-stronger-hook-activity';
import { v4 as uuidv4 } from 'uuid';
import {
  AnalyzeIntendedClaimResponse,
  analyzeIntendedClaimResponseSchema,
} from '../../prompt-helpers/analyze-intended-claim-prompt';
import {
  StepNames,
  ThesisSupportActivityState,
} from '../../use-with-thesis-support-activity';

enum ClaimAction {
  ADDING = 'ADDING',
  REMOVING = 'REMOVING',
  REVISING = 'REVISING',
}

const MCQ_BRAINSTORM = 'BRAINSTORM';
export const COLLECTION_CHANGE_INTENTION_STEP_NAME = 'collect-change-intention';
export function cCollectIntentionStep(
  stepData: StepData,
  state: ThesisSupportActivityState,
  setState: (value: React.SetStateAction<ThesisSupportActivityState>) => void,
  brainstormPrompt: GQLPrompt,
  analyzeIntendedClaimUsagePrompt: GQLPrompt,
  allActivityMessages: StepMessage[]
): ActiveActivityStep {
  const {
    executePrompt,
    sendMessage,
    setWaitingForUserAnswer,
    updateSessionIntention,
  } = stepData;
  const collectChangeIntentionMessageId = '75b8559017dcb51adc3bf967';
  const collectChangeIntentionMessage = allActivityMessages.find(
    (msg) => msg._id === collectChangeIntentionMessageId
  );
  const hopeThatHelpedMessageId = '85b8559017dcb51adc3bf967';
  const hopeThatHelpedMessage = allActivityMessages.find(
    (msg) => msg._id === hopeThatHelpedMessageId
  );
  return {
    text:
      collectChangeIntentionMessage?.text ||
      'What claim would you like to add, remove, or revise? You may click [BRAINSTORM] for help.',
    stepType: ActivityStepTypes.FREE_RESPONSE_QUESTION,
    mcqChoices: [MCQ_BRAINSTORM],
    handleResponse: async (response) => {
      if (response === MCQ_BRAINSTORM) {
        await executePrompt(
          () => brainstormPrompt,
          (res) => {
            sendMessage({
              id: uuidv4(),
              message: res.answer,
              sender: Sender.SYSTEM,
              displayType: MessageDisplayType.TEXT,
              activityStep: cCollectIntentionStep(
                stepData,
                state,
                setState,
                brainstormPrompt,
                analyzeIntendedClaimUsagePrompt,
                allActivityMessages
              ),
              mcqChoices: [MCQ_BRAINSTORM],
              openAiInfo: {
                openAiPrompt: res.openAiData[0].openAiPrompt,
                openAiResponse: res.openAiData[0].openAiResponse,
              },
            });
          }
        );
        sendMessage({
          id: uuidv4(),
          message:
            hopeThatHelpedMessage?.text ||
            'Hope that helped. What claim would you like to add, remove, or revise?',
          sender: Sender.SYSTEM,
          displayType: MessageDisplayType.TEXT,
          activityStep: cCollectIntentionStep(
            stepData,
            state,
            setState,
            brainstormPrompt,
            analyzeIntendedClaimUsagePrompt,
            allActivityMessages
          ),
          mcqChoices: [MCQ_BRAINSTORM],
        });
        setWaitingForUserAnswer(true);
      } else {
        updateSessionIntention({ description: response });
        await executePrompt(
          () => analyzeIntendedClaimUsagePrompt,
          (res) => {
            const analyzeIntendedClaimResponse =
              validateJsonResponse<AnalyzeIntendedClaimResponse>(
                res.answer,
                analyzeIntendedClaimResponseSchema
              );
            const claimAction: ClaimAction =
              analyzeIntendedClaimResponse.intendedAction as ClaimAction;
            sendMessage({
              id: uuidv4(),
              message: analyzeIntendedClaimResponse.intentionFeedback,
              sender: Sender.SYSTEM,
              displayType: MessageDisplayType.TEXT,
              activityStep: cCollectIntentionStep(
                stepData,
                state,
                setState,
                brainstormPrompt,
                analyzeIntendedClaimUsagePrompt,
                allActivityMessages
              ),
              openAiInfo: {
                openAiPrompt: res.openAiData[0].openAiPrompt,
                openAiResponse: res.openAiData[0].openAiResponse,
              },
            });
            if (claimAction === ClaimAction.ADDING) {
              setState((prevState) => {
                return {
                  ...prevState,
                  intendedClaimAdjustment: response,
                  curStepName:
                    StepNames.COLLECT_ARGUMENT_FOR_NEW_CLAIM_STEP_NAME,
                };
              });
            } else if (claimAction === ClaimAction.REMOVING) {
              setState((prevState) => {
                return {
                  ...prevState,
                  intendedClaimAdjustment: response,
                  curStepName: StepNames.REMOVING_CLAIM_STEP_NAME,
                };
              });
            } else {
              setState((prevState) => {
                return {
                  ...prevState,
                  intendedClaimAdjustment: response,
                  curStepName: StepNames.REVISING_STEP_NAME,
                };
              });
            }
          }
        );
      }
    },
  };
}
