import {
  addContextToPromptSteps,
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

const MCQ_BRAINSTORM = 'BRAINSTORM';
const MCQ_READY_FOR_REVIEW = 'ready for review';
export const REMOVING_CLAIM_STEP_NAME = 'removing-claim';
export function crRemoveClaimFromPaper(
  stepData: StepData,
  state: ThesisSupportActivityState,
  setState: (value: React.SetStateAction<ThesisSupportActivityState>) => void,
  brainstormClaimRemoval: GQLPrompt,
  analyzeClaimRemoval: GQLPrompt, allActivityMessages: StepMessage[]
): ActiveActivityStep {
  const { executePrompt, sendMessage, setWaitingForUserAnswer } = stepData;
  const removeMessageId = "65b8559017dcb51adc3bf967"
  const message = allActivityMessages.find(
    (msg) => msg._id === removeMessageId
  );
  return {
    text: message?.text || "Remove the claim for your paper and let me know when you'd like me to review your work. If you'd like tips on how to remove it from the paper, click [BRAINSTORM]",
    stepType: ActivityStepTypes.MULTIPLE_CHOICE_QUESTIONS,
    mcqChoices: [MCQ_BRAINSTORM, MCQ_READY_FOR_REVIEW],
    handleResponse: async (response) => {
      if (response === MCQ_BRAINSTORM) {
        await executePrompt(
          () => brainstormClaimRemoval,
          (res) => {
            sendMessage({
              id: uuidv4(),
              message: res.answer,
              sender: Sender.SYSTEM,
              mcqChoices: [MCQ_BRAINSTORM, MCQ_READY_FOR_REVIEW],
              displayType: MessageDisplayType.TEXT,
              activityStep: crRemoveClaimFromPaper(
                stepData,
                state,
                setState,
                brainstormClaimRemoval,
                analyzeClaimRemoval,
                allActivityMessages
              ),
            });
          }
        );
        setWaitingForUserAnswer(true);
      } else {
        const analyzeClaimRemovalPromptWithData = addContextToPromptSteps(
          analyzeClaimRemoval,
          [
            {
              promptText: `This is the claim that the student intends to remove from the paper: ${state.intendedClaimAdjustment}`,
              promptRole: PromptRoles.SYSTEM,
              includeEssay: false,
            },
          ]
        );
        await executePrompt(
          () => analyzeClaimRemovalPromptWithData,
          (res) => {
            sendMessage({
              id: uuidv4(),
              message: res.answer,
              sender: Sender.SYSTEM,
              mcqChoices: [],
              displayType: MessageDisplayType.TEXT,
              activityStep: crRemoveClaimFromPaper(
                stepData,
                state,
                setState,
                brainstormClaimRemoval,
                analyzeClaimRemoval,
                allActivityMessages
              ),
            });
            setState({
              ...state,
              curStepName: StepNames.INTRO,
            });
          }
        );
      }
    },
  };
}
