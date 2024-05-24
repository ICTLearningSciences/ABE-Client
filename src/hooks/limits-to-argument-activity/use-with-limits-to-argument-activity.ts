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
  ActivityGQL,
  GQLPrompt,
  DocGoal,
  Activity,
  StepMessage,
  ActiveActivityStep,
  ActivityStepTypes,
} from '../../types';
import {
  MCQ_READY_FOR_REVIEW,
  StepData,
} from '../use-with-stronger-hook-activity';
import { v4 as uuidv4 } from 'uuid';
import { useWithState } from '../../store/slices/state/use-with-state';
import { validateJsonResponse } from '../../helpers';
import { freeInputPrompt } from '../use-with-prompt-activity';
import {
  AnalyzeArgumentsResponse,
  analyzeArgumentsPromptSchema,
} from './prompt-helpers';
import { extractServiceStepResponse } from '../../ai-services/ai-service-types';

interface LimitsToArgumentActivityPrompts {
  analyzeArgumentPrompt: GQLPrompt;
  initiateConversationPrompt: GQLPrompt;
}

const MCQ_PICK_ANOTHER_ROLE = 'Pick another role';
const MCQ_REVISE_ESSAY = 'Revise essay';

export function useWithLimitsToArgumentActivity(
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
    useState<LimitsToArgumentActivityPrompts>();
  const { updateSessionIntention } = useWithState();

  const { analyzeArgumentPrompt, initiateConversationPrompt } =
    activityPrompts || {};

  const ANALYZE_ARGUMENT_PROMPT_ID = '6619c4c7050b5afe087a49f6';
  const INITIATE_CONVERSATION_PROMPT_ID = '6619c4d4050b5afe087a4a5f';

  enum StepNames {
    INTRO = 'Intro',
    INTRO_2 = 'Intro_2',
    PICK_AUDIENCE = 'Pick Audience',
    SPEAK_WITH_AUDIENCE = 'Speak With Audience',
    COLLECT_REVISION = 'Collect Revision',
  }

  useEffect(() => {
    if (promptsLoading) {
      return;
    }
    const analyzeArgumentPrompt = prompts.find(
      (prompt) => prompt._id === ANALYZE_ARGUMENT_PROMPT_ID
    );
    const initiateConversationPrompt = prompts.find(
      (prompt) => prompt._id === INITIATE_CONVERSATION_PROMPT_ID
    );

    if (!analyzeArgumentPrompt || !initiateConversationPrompt) {
      throw new Error('Missing prompts');
    }
    setActivityPrompts({
      analyzeArgumentPrompt,
      initiateConversationPrompt,
    });
  }, [prompts, promptsLoading]);

  interface StrongerConclusionActivityState {
    curStepName: StepNames;
    potentialAudienceMembers: string[];
    speakWithAudienceIntroMessage: string;
    targetAudienceSystemPrompt: string;
  }

  const [state, setState] = useState<StrongerConclusionActivityState>({
    curStepName: StepNames.INTRO,
    potentialAudienceMembers: [],
    speakWithAudienceIntroMessage: '',
    targetAudienceSystemPrompt: '',
  });

  function goToStep(stepName: StepNames) {
    setState((prevValue) => {
      return {
        ...prevValue,
        curStepName: stepName,
      };
    });
  }

  function resetActivity(targetStep?: StepNames) {
    setState({
      curStepName: targetStep
        ? targetStep
        : state.curStepName === StepNames.INTRO
        ? StepNames.INTRO_2
        : StepNames.INTRO,
      potentialAudienceMembers: [],
      speakWithAudienceIntroMessage: '',
      targetAudienceSystemPrompt: '',
    });
  }

  useEffect(() => {
    resetActivity();
  }, [activityGql.title, goal?._id]);

  function getStep(stepData: StepData): ActiveActivityStep {
    switch (state.curStepName) {
      case StepNames.INTRO:
      case StepNames.INTRO_2:
        return introStep(stepData);
      case StepNames.PICK_AUDIENCE:
        return pickAudienceStep(stepData);
      case StepNames.SPEAK_WITH_AUDIENCE:
        return speakWithAudienceStep(stepData);
      case StepNames.COLLECT_REVISION:
        return collectRevisionStep();
      default:
        return introStep(stepData);
    }
  }

  function introStep(stepData: StepData): ActiveActivityStep {
    const INTRO_MESSAGE_ID = '65b8559017dcb51adc3bf967';
    const introMessage = allActivityMessages.find(
      (msg) => msg._id === INTRO_MESSAGE_ID
    );
    const { executePrompt } = stepData;
    return {
      text:
        introMessage?.text ||
        "Let me know when your paper is ready for me to review, and I'll figure out who you should talk to about it.",
      stepType: ActivityStepTypes.MULTIPLE_CHOICE_QUESTIONS,
      mcqChoices: [MCQ_READY_FOR_REVIEW],
      handleResponse: async () => {
        if (!analyzeArgumentPrompt) {
          return;
        }
        await executePrompt(
          () => analyzeArgumentPrompt,
          (res) => {
            const firstStepRes = extractServiceStepResponse(res, 0);
            const audiencesResponse =
              validateJsonResponse<AnalyzeArgumentsResponse>(
                firstStepRes,
                analyzeArgumentsPromptSchema
              );
            sendMessage(
              {
                id: uuidv4(),
                message: res.answer,
                sender: Sender.SYSTEM,
                displayType: MessageDisplayType.TEXT,
                activityStep: introStep(stepData),
                aiServiceStepData: res.aiAllStepsData,
              },
              false,
              googleDocId
            );

            setState((prevValue) => {
              return {
                ...prevValue,
                potentialAudienceMembers: [
                  ...audiencesResponse.otherAudiences.map(
                    (audience) => audience.name
                  ),
                ],
                curStepName: StepNames.PICK_AUDIENCE,
              };
            });
          }
        );
      },
    };
  }

  function pickAudienceStep(stepData: StepData): ActiveActivityStep {
    const PICK_AUDIENCE_MESSAGE_ID = '65b8559017dbb51ddc4af967';
    const pickAudienceMessage = allActivityMessages.find(
      (msg) => msg._id === PICK_AUDIENCE_MESSAGE_ID
    );
    const { executePrompt } = stepData;
    return {
      text:
        pickAudienceMessage?.text ||
        "Either pick or enter your own critical audience member that you'd like to converse with about your paper.",
      stepType: ActivityStepTypes.FREE_RESPONSE_QUESTION,
      mcqChoices: state.potentialAudienceMembers,
      handleResponse: async (targetAudience) => {
        if (!initiateConversationPrompt) {
          return;
        }
        // TODO: the res is the potential audience member, so pass that as the system prompt
        const targetAudienceSystemPrompt = `You are speaking to a student writer.
            You must speak as if you are part of this audience: ${targetAudience}.
            Be critical of the writer's argument and provide constructive feedback as if you were a part of this audience: ${targetAudience}.
            `;
        await executePrompt(
          () => initiateConversationPrompt,
          (res) => {
            setState((prevValue) => {
              return {
                ...prevValue,
                targetAudienceMember: targetAudienceSystemPrompt,
                speakWithAudienceIntroMessage: res.answer,
                curStepName: StepNames.SPEAK_WITH_AUDIENCE,
                targetAudienceSystemPrompt,
              };
            });
          },
          targetAudienceSystemPrompt
        );
      },
    };
  }

  function speakWithAudienceStep(stepData: StepData): ActiveActivityStep {
    const { executePrompt } = stepData;
    return {
      text: state.speakWithAudienceIntroMessage,
      stepType: ActivityStepTypes.FREE_RESPONSE_QUESTION,
      mcqChoices: [MCQ_PICK_ANOTHER_ROLE, MCQ_REVISE_ESSAY],
      handleResponse: async (userResponse) => {
        if (userResponse === MCQ_PICK_ANOTHER_ROLE) {
          goToStep(StepNames.PICK_AUDIENCE);
        } else if (userResponse === MCQ_REVISE_ESSAY) {
          goToStep(StepNames.COLLECT_REVISION);
        } else {
          await executePrompt(
            freeInputPrompt,
            (res) => {
              sendMessage(
                {
                  id: uuidv4(),
                  message: res.answer,
                  mcqChoices: [MCQ_PICK_ANOTHER_ROLE, MCQ_REVISE_ESSAY],
                  sender: Sender.SYSTEM,
                  displayType: MessageDisplayType.TEXT,
                  activityStep: speakWithAudienceStep(stepData),
                  aiServiceStepData: res.aiAllStepsData,
                },
                false,
                googleDocId
              );
            },
            state.targetAudienceSystemPrompt
          );
          setWaitingForUserAnswer(true);
        }
      },
    };
  }

  function collectRevisionStep(): ActiveActivityStep {
    const COLLECT_REVISION_MESSAGE_ID = '65b8559017dbb51ddc5af967';
    const collectRevisionMessage = allActivityMessages.find(
      (msg) => msg._id === COLLECT_REVISION_MESSAGE_ID
    );
    return {
      text:
        collectRevisionMessage?.text || 'What revision would you like to make?',
      stepType: ActivityStepTypes.FREE_RESPONSE_QUESTION,
      mcqChoices: [],
      handleResponse: async (userRevisionResponse) => {
        updateSessionIntention({
          description: userRevisionResponse,
        });
        goToStep(StepNames.INTRO);
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
