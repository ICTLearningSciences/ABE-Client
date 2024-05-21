import { addContextToPromptSteps } from '../../../../helpers';
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

const MCQ_BRAINSTORM = 'BRAINSTORM';
export const COLLECT_ARGUMENT_FOR_NEW_CLAIM_STEP_NAME =
  'collect-argument-for-new-claim';
export function caCollectArgumentForNewClaim(
  stepData: StepData,
  state: ThesisSupportActivityState,
  setState: (value: React.SetStateAction<ThesisSupportActivityState>) => void,
  brainstormArgsForNewClaim: GQLPrompt,
  analyzeIntendedArgForClaim: GQLPrompt,
  allActivityMessages: StepMessage[]
): ActiveActivityStep {
  const {
    executePrompt,
    sendMessage,
    setWaitingForUserAnswer,
    updateSessionIntention,
  } = stepData;
  const collectArgumentMessageId = '95b8559017dcb51adc3bf967';
  const message = allActivityMessages.find(
    (msg) => msg._id === collectArgumentMessageId
  );
  return {
    text:
      message?.text ||
      'What arguments do you intend to use to support this claim? You may click [BRAINSTORM] for help.',
    stepType: ActivityStepTypes.FREE_RESPONSE_QUESTION,
    mcqChoices: [MCQ_BRAINSTORM],
    handleResponse: async (response) => {
      if (response === MCQ_BRAINSTORM) {
        await executePrompt(
          () => brainstormArgsForNewClaim,
          (res) => {
            sendMessage({
              id: uuidv4(),
              message: res.answer,
              sender: Sender.SYSTEM,
              displayType: MessageDisplayType.TEXT,
              activityStep: caCollectArgumentForNewClaim(
                stepData,
                state,
                setState,
                brainstormArgsForNewClaim,
                analyzeIntendedArgForClaim,
                allActivityMessages
              ),
              mcqChoices: [MCQ_BRAINSTORM],
              aiServiceStepData: res.aiAllStepsData,
            });
          }
        );
        setWaitingForUserAnswer(true);
      } else {
        updateSessionIntention({
          description: response,
        });
        const analyzIntendedArgsWithData = addContextToPromptSteps(
          analyzeIntendedArgForClaim,
          [
            {
              promptText: `The claim I intend to add: ${state.intendedClaimAdjustment}`,
              includeEssay: false,
              promptRole: PromptRoles.USER,
            },
          ]
        );
        await executePrompt(
          () => analyzIntendedArgsWithData,
          (res) => {
            sendMessage({
              id: uuidv4(),
              message: res.answer,
              sender: Sender.SYSTEM,
              displayType: MessageDisplayType.TEXT,
              activityStep: caCollectArgumentForNewClaim(
                stepData,
                state,
                setState,
                brainstormArgsForNewClaim,
                analyzeIntendedArgForClaim,
                allActivityMessages
              ),
              mcqChoices: [],
              aiServiceStepData: res.aiAllStepsData,
            });
          }
        );
        setState((prevState) => {
          return {
            ...prevState,
            curStepName: StepNames.ADDING_CLAIM_TO_PAPER_STEP_NAME,
          };
        });
      }
    },
  };
}

const MCQ_REVIEW_MY_WORK = 'REVIEW_MY_WORK';
export const ADDING_CLAIM_TO_PAPER_STEP_NAME = 'adding-claim-to-paper';
export function addClaimToPaperAnalyzeStep(
  stepData: StepData,
  state: ThesisSupportActivityState,
  setState: (value: React.SetStateAction<ThesisSupportActivityState>) => void,
  analyzeClaimAddedToPaper: GQLPrompt,
  allActivityMessages: StepMessage[]
): ActiveActivityStep {
  const { executePrompt, sendMessage } = stepData;
  const addClaimMessageId = 'a5b8559017dcb51adc3bf967';
  const message = allActivityMessages.find(
    (msg) => msg._id === addClaimMessageId
  );
  return {
    text:
      message?.text ||
      "Please add the claim to your paper and let me know when you'd like me to review your work.",
    stepType: ActivityStepTypes.FREE_RESPONSE_QUESTION,
    mcqChoices: [MCQ_REVIEW_MY_WORK],
    handleResponse: async () => {
      const analyzeClaimAddedToPaperWithData = addContextToPromptSteps(
        analyzeClaimAddedToPaper,
        [
          {
            promptText: `The claim I intend to add: ${state.intendedClaimAdjustment}`,
            includeEssay: false,
            promptRole: PromptRoles.USER,
          },
        ]
      );
      await executePrompt(
        () => analyzeClaimAddedToPaperWithData,
        (res) => {
          sendMessage({
            id: uuidv4(),
            message: res.answer,
            sender: Sender.SYSTEM,
            displayType: MessageDisplayType.TEXT,
            activityStep: addClaimToPaperAnalyzeStep(
              stepData,
              state,
              setState,
              analyzeClaimAddedToPaper,
              allActivityMessages
            ),
            aiServiceStepData: res.aiAllStepsData,
          });
        }
      );
      setState((prevState) => {
        return {
          ...prevState,
          curStepName: StepNames.INTRO,
          intendedClaimAdjustment: '',
        };
      });
    },
  };
}
