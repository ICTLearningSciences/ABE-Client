import {
  addContextToPromptSteps,
  validateJsonResponse,
} from '../../../../helpers';
import {
  ChatMessageTypes,
  MessageDisplayType,
  Sender,
} from '../../../../store/slices/chat';
import {
  ActiveActivityStep,
  ActivityStepTypes,
  GQLPrompt,
  PromptRoles,
} from '../../../../types';
import { StepData } from '../../../use-with-stronger-hook-activity';
import { CompareAnalysisRes, compareAnalysisSchema } from '../../types';

import {
  EciActivityState,
  EciStepNames,
  freeInputPrompt,
} from '../../use-with-eci-activity';
import { v4 as uuidv4 } from 'uuid';

const MCQ_READY = 'Ready';
export function startReviewDocumentContent(
  stepData: StepData,
  getMessage: (messageId: string) => string | undefined,
  state: EciActivityState,
  setState: (value: React.SetStateAction<EciActivityState>) => void,
  compareDocumentContentToCmdIntent: GQLPrompt
): ActiveActivityStep {
  const { executePrompt, sendMessage } = stepData;
  const introMessage = getMessage('65b3559017dcb51adc3bf967');
  return {
    text: introMessage || 'Let me know when your paper is ready for review.',
    stepType: ActivityStepTypes.MULTIPLE_CHOICE_QUESTIONS,
    mcqChoices: [MCQ_READY],
    handleResponse: async () => {
      const updatedPrompt: GQLPrompt = addContextToPromptSteps(
        compareDocumentContentToCmdIntent,
        [
          {
            promptRole: PromptRoles.SYSTEM,
            includeEssay: true,
            promptText: `
                            Here is the commanders intention: ${state.commandersIntention},
                        `,
          },
        ]
      );
      await executePrompt(
        () => updatedPrompt,
        (res) => {
          const compareDocContentRes = validateJsonResponse<CompareAnalysisRes>(
            res.answer,
            compareAnalysisSchema
          );
          sendMessage({
            id: uuidv4(),
            message: compareDocContentRes.response,
            sender: Sender.SYSTEM,
            displayType: MessageDisplayType.TEXT,
          });

          setState({
            ...state,
            compareDocumentToCmdIntent: {
              ...state.compareDocumentToCmdIntent,
              matchRating: compareDocContentRes.matchRating,
              aiQuestionList: compareDocContentRes.questionList,
            },

            curStepName: EciStepNames.PICK_CRITIQUE_TO_DISCUSS,
          });
        }
      );
    },
  };
}

export function pickCritiqueToDiscuss(
  stepData: StepData,
  getMessage: (messageId: string) => string | undefined,
  state: EciActivityState,
  setState: (value: React.SetStateAction<EciActivityState>) => void,
  initiateConversationPrompt: GQLPrompt
): ActiveActivityStep {
  const { executePrompt } = stepData;
  const pickCritiqueMessage = getMessage('75b3559017dcb51adc3bf967');
  return {
    text:
      pickCritiqueMessage || 'Pick one of these critiques to explore in depth',
    stepType: ActivityStepTypes.MULTIPLE_CHOICE_QUESTIONS,
    mcqChoices: state.compareDocumentToCmdIntent.aiQuestionList,
    handleResponse: async (selectedCritique) => {
      const critiqueDiscussing = selectedCritique;
      function setupInitiateConversationPrompt() {
        const prompt = initiateConversationPrompt;
        const updatedPrompt = addContextToPromptSteps(prompt, [
          {
            promptRole: PromptRoles.SYSTEM,
            promptText: `
                        Here is the commanders intention: ${state.commandersIntention}
                        You had this critique about the users document and how its content pertains to the commanders intention, and you are now discussing it with them: ${critiqueDiscussing}
                        `,
            includeEssay: true,
          },
        ]);
        return updatedPrompt;
      }
      await executePrompt(setupInitiateConversationPrompt, (res) => {
        setState({
          ...state,
          compareDocumentToCmdIntent: {
            ...state.compareDocumentToCmdIntent,
            critiqueDiscussing,
            discussCritiqueIntroMessage: res.answer,
          },
          curStepName: EciStepNames.DISCUSS_CRITIQUE,
        });
      });
    },
  };
}

/** free discussion */
const REVISE_PAPER = 'Revise Paper';
const PICK_ANOTHER_CRITIQUE = 'Pick Another Critique';
export function discussCritique(
  stepData: StepData,
  state: EciActivityState,
  setState: (value: React.SetStateAction<EciActivityState>) => void
): ActiveActivityStep {
  const { executePrompt, sendMessage, setWaitingForUserAnswer } = stepData;
  function setupFreeInputPrompt(chat: ChatMessageTypes[]) {
    const prompt = freeInputPrompt(chat);
    const updatedPrompt = addContextToPromptSteps(prompt, [
      {
        promptRole: PromptRoles.SYSTEM,
        promptText: `
                Here is the commanders intention: ${state.commandersIntention}
                You had this critique about the users essay and how its content pertains to the commanders intention, and you are now discussing it with them: ${state.compareDocumentToCmdIntent.critiqueDiscussing}
                `,
        includeEssay: true,
      },
    ]);
    return updatedPrompt;
  }
  return {
    text: state.compareDocumentToCmdIntent.discussCritiqueIntroMessage,
    stepType: ActivityStepTypes.FREE_RESPONSE_QUESTION,
    mcqChoices: [REVISE_PAPER, PICK_ANOTHER_CRITIQUE],
    handleResponse: async (response) => {
      if (response === PICK_ANOTHER_CRITIQUE) {
        setState({
          ...state,
          curStepName: EciStepNames.PICK_CRITIQUE_TO_DISCUSS,
        });
      } else if (response === REVISE_PAPER) {
        setState({
          ...state,
          curStepName: EciStepNames.REVISE_PAPER,
        });
      } else {
        await executePrompt(setupFreeInputPrompt, (res) => {
          sendMessage({
            id: uuidv4(),
            message: res.answer,
            mcqChoices: [REVISE_PAPER, PICK_ANOTHER_CRITIQUE],
            sender: Sender.SYSTEM,
            displayType: MessageDisplayType.TEXT,
          });
          setWaitingForUserAnswer(true);
        });
      }
    },
  };
}

export function revisePaper(
  stepData: StepData,
  getMessage: (messageId: string) => string | undefined,
  state: EciActivityState,
  setState: (value: React.SetStateAction<EciActivityState>) => void
): ActiveActivityStep {
  const { updateSessionIntention } = stepData;
  const reivisonMessage = getMessage('85b3559017dcb51adc3bf967');
  return {
    text: reivisonMessage || 'What revision would you like to make?',
    stepType: ActivityStepTypes.FREE_RESPONSE_QUESTION,
    handleResponse: async (intendedRevision) => {
      updateSessionIntention({
        description: intendedRevision,
      });
      setState({
        ...state,
        curStepName: EciStepNames.REVIEW_DOCUMENT_CONTENT,
      });
    },
  };
}
