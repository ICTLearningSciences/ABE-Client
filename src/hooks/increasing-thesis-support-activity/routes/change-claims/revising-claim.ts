import {
  ActiveActivityStep,
  ActivityStepTypes,
  GQLPrompt,
  StepMessage,
} from '../../../../types';
import { StepData } from '../../../use-with-stronger-hook-activity';
import {
  ThesisSupportActivityState,
  StepNames,
} from '../../use-with-thesis-support-activity';

export const REVISING_STEP_NAME = 'revising-claim';
export function cRevisingClaim(
  stepData: StepData,
  state: ThesisSupportActivityState,
  setState: (value: React.SetStateAction<ThesisSupportActivityState>) => void,
  analyzeIntentionVsOutline: GQLPrompt,
  allActivityMessages: StepMessage[]
): ActiveActivityStep {
  const { executePrompt, updateSessionIntention } = stepData;
  const revisionMessageId = '55b8559017dcb51adc3bf967';
  const message = allActivityMessages.find(
    (msg) => msg._id === revisionMessageId
  );
  return {
    text: message?.text || 'How do you intend to revise this claim?',
    stepType: ActivityStepTypes.FREE_RESPONSE_QUESTION,
    handleResponse: async (response) => {
      updateSessionIntention({
        description: response,
      });
      await executePrompt(
        () => analyzeIntentionVsOutline,
        (res) => {
          setState((prevValue) => ({
            ...prevValue,
            intendedClaimAdjustment: res.answer,
            analyzeIntentionOutput: res.answer,
            curStepName: StepNames.COLLECT_WHY_SAID_THINGS_STEP_NAME,
          }));
        }
      );
    },
  };
}
