import { addContextToPromptSteps, validateJsonResponse } from "../../../../helpers";
import { ChatMessageTypes, MessageDisplayType, Sender } from "../../../../store/slices/chat";
import { ActiveActivityStep, ActivityStepTypes, GQLPrompt, PromptRoles } from "../../../../types";
import { StepData } from "../../../use-with-stronger-hook-activity";
import { CompareAnalysisRes, compareAnalysisSchema } from "../../types";
import { EciActivityState, EciStepNames, freeInputPrompt } from "../../use-with-eci-activity";
import { v4 as uuidv4 } from 'uuid';

export function startReviewUnderstandingCmdIntention(
        stepData: StepData,
        getMessage: (messageId: string) => string | undefined,
        state: EciActivityState,
        setState: (value: React.SetStateAction<EciActivityState>) => void,
        compareUserInterpretationOfCmdIntentPrompt: GQLPrompt
    ): ActiveActivityStep {
        const {
            executePrompt,
            sendMessage,
            setWaitingForUserAnswer,
            updateSessionIntention,
          } = stepData;
    const introMessage = getMessage("35b8459017dcb51adc3bf967");
    return {
        text: introMessage || "Pretend that I'm a new officer that has just arrived to the unit. All I have been told is the Commander's intent. How would you explain their intent to me? What else would I need to know?",
        stepType: ActivityStepTypes.FREE_RESPONSE_QUESTION,
        handleResponse: async (userInterpretationOfCmdIntent) => {
            const updatedPrompt = addContextToPromptSteps(compareUserInterpretationOfCmdIntentPrompt, [
                {
                    promptRole: PromptRoles.SYSTEM,
                    promptText: `Here is the commanders intent: ${state.commandersIntention}
                    Here is the users interpretation of the Commanders Intent: ${userInterpretationOfCmdIntent}`,
                    includeEssay: false
                }
            ])
            await executePrompt(
                () => updatedPrompt,
                (res) =>{
                    const compareInterpretationRes = validateJsonResponse<CompareAnalysisRes>(
                        res.answer,
                        compareAnalysisSchema
                    )
                    sendMessage({
                        id: uuidv4(),
                        message: compareInterpretationRes.response,
                        sender: Sender.SYSTEM,
                        displayType: MessageDisplayType.TEXT,
                    })

                    setState({
                        ...state,
                        usersInterpretationOfCmdIntent: {
                            ...state.usersInterpretationOfCmdIntent,
                            interpretation: userInterpretationOfCmdIntent,
                            matchRating: compareInterpretationRes.matchRating,
                            aiQuestionList: compareInterpretationRes.questionList
                        },
                        curStepName: EciStepNames.PICK_QUESTION_ABOUT_INTERPRETATION,
                    })
                }
            )
        }
    };
}

export function pickQuestionAboutInterpretation(
    stepData: StepData,
    getMessage: (messageId: string) => string | undefined,
    state: EciActivityState,
    setState: (value: React.SetStateAction<EciActivityState>) => void,
    initiateConverstaionPrompt: GQLPrompt
): ActiveActivityStep {
    const {
        executePrompt,
        sendMessage,
        setWaitingForUserAnswer,
        updateSessionIntention,
      } = stepData;
    const pickQuestionMessage = getMessage("45b3559017dcb51adc3bf967");
    return {
        text: pickQuestionMessage || "Pick one of these questions to explore in depth",
        stepType: ActivityStepTypes.MULTIPLE_CHOICE_QUESTIONS,
        mcqChoices: state.usersInterpretationOfCmdIntent.aiQuestionList,
        handleResponse: async (selectedQuestion) => {
            const questionDiscussing = selectedQuestion
            function setupInitiateConversationPrompt(){
                const prompt = initiateConverstaionPrompt
                const updatedPrompt = addContextToPromptSteps(prompt, [
                    {
                        promptRole: PromptRoles.SYSTEM,
                        promptText: `
                        Here is the commanders intention: ${state.commandersIntention}
                        You had this question about the users interpretation of the commanders intent, and you are now discussing it with them: ${questionDiscussing}
                        `,
                        includeEssay: false
                    }
                ])
                return updatedPrompt
              }
            await executePrompt(
                setupInitiateConversationPrompt,
                (res) => {
                    setState({
                        ...state,
                        usersInterpretationOfCmdIntent: {
                            ...state.usersInterpretationOfCmdIntent,
                            questionDiscussing,
                            discussQuestionIntroMessage: res.answer
                        },
                        curStepName: EciStepNames.DISCUSS_INTERPRETATION_QUESTION,
                    })
                }
            )
        }
    }
}

/** free discussion */
const REVISE_INTERPRETATION = "Revise my Interpretation of Commanders Intention"
const PICK_ANOTHER_CRITIQUE = "Pick Another Critique"
export function discussInterpretationQuestion(
    stepData: StepData,
    state: EciActivityState,
    setState: (value: React.SetStateAction<EciActivityState>) => void
): ActiveActivityStep {
    const {
        executePrompt,
        sendMessage,
        setWaitingForUserAnswer,
        updateSessionIntention,
      } = stepData;
      function setupFreeInputPrompt(chat: ChatMessageTypes[]){
        const prompt = freeInputPrompt(chat)
        const updatedPrompt = addContextToPromptSteps(prompt, [
            {
                promptRole: PromptRoles.SYSTEM,
                promptText: `Here is the commanders intent: ${state.commandersIntention}
                Here is the users interpretation of the Commanders Intent: ${state.usersInterpretationOfCmdIntent.interpretation}
                You had this question about their interpretation of the commanders intent, and you are now discussing it with them: ${state.usersInterpretationOfCmdIntent.questionDiscussing}`,
                includeEssay: false
            }
        ])
        return updatedPrompt
      }
    return {
        text: state.usersInterpretationOfCmdIntent.discussQuestionIntroMessage,
        stepType: ActivityStepTypes.FREE_RESPONSE_QUESTION,
        mcqChoices: [REVISE_INTERPRETATION, PICK_ANOTHER_CRITIQUE],
        handleResponse: async (response) => {
            if(response === PICK_ANOTHER_CRITIQUE){
                setState({
                    ...state,
                    curStepName: EciStepNames.PICK_QUESTION_ABOUT_INTERPRETATION
                })
            } else if (response === REVISE_INTERPRETATION){
                setState({
                    ...state,
                    curStepName: EciStepNames.REVISE_INTERPRETATION
                })
            }else{
                setWaitingForUserAnswer(true);
                await executePrompt(
                    (chat) => setupFreeInputPrompt(chat),
                    (res) =>{
                        sendMessage({
                            id: uuidv4(),
                            message: res.answer,
                            sender: Sender.SYSTEM,
                            mcqChoices: [REVISE_INTERPRETATION, PICK_ANOTHER_CRITIQUE],
                            displayType: MessageDisplayType.TEXT,
                        })
                    }
                )
            }
        }
    }
}

export function reviseInterpretation(
    stepData: StepData,
    getMessage: (messageId: string) => string | undefined,
    state: EciActivityState,
    setState: (value: React.SetStateAction<EciActivityState>) => void,
    
): ActiveActivityStep {
    const {
        executePrompt,
        sendMessage,
        setWaitingForUserAnswer,
        updateSessionIntention,
      } = stepData;
      const reivisonMessage = getMessage("55b3559017dcb51adc3bf967");
    return {
        text: reivisonMessage || "What revision would you like to make?",
        stepType: ActivityStepTypes.FREE_RESPONSE_QUESTION,
        handleResponse: async (intendedRevision) => {
            updateSessionIntention({
                description: intendedRevision
            })
            setState({
                ...state,
                curStepName: EciStepNames.SHOULD_WE_REVIEW_UNDERSTANDING
            })
        }
    }
}