import { useEffect, useState } from 'react';
import {
  Activity,
  ActivityGQL,
  ActivityStep,
  ActivityStepTypes,
  DocGoal,
  GQLPrompt,
  MultistepPromptRes,
  PromptOutputTypes,
  PromptRoles,
} from '../types';
import {
  ChatMessageTypes,
  MessageDisplayType,
  Sender,
} from '../store/slices/chat';
import { addContextToPromptSteps, validateJsonResponse } from '../helpers';
import { useWithState } from '../store/slices/state/use-with-state';
import { useAppSelector } from '../store/hooks';
import { freeInputPrompt } from './use-with-prompt-activity';

export const WEAK_THRESHOLD = 4;
export const MCQ_READY_FOR_REVIEW = 'Ready';
export const MCQ_YES = 'Yes';
export const MCQ_NO = 'No';
export const MCQ_ANALYZE_AGAIN = 'Analyze again';
export const HELP_ME_BRAINSTORM = 'Help me brainstorm';
export const GENERATE_MORE_IDEAS = 'Generate more ideas';

export const MCQ_IMPROVE_NARRATIVITY = 'Improve narrativity';
export const MCQ_IMPROVE_EMOTION = 'Improve emotion';
export const MCQ_ASK_MY_OWN_QUESTION = 'Ask my own question';
export const MCQ_SOMETHING_ELSE = 'Something else';

export const MCQ_ANOTHER_ACTIVITY = 'Another activity';
export const MCQ_OPEN_DIALOGUE = 'Continue as Open Dialogue';

export const BRAINSTORM_STORIES = 'Brainstorm stories';
export const STORY_IN_MIND = 'Story in mind';

export const MCQ_BRAINSTORM_MORE = 'Brainstorm More';
export const MCQ_WORK_WITH_WHAT_YOU_HAVE = 'Work with what I have';

export interface HookPromptResponse {
  content: {
    thesis_statement: string;
    paragraph: string;
  };
  emotion: {
    emotions: string[];
    rating: number;
    justification: string;
  };
  narrativity: {
    rating: number;
    justification: string;
  };
  overall: {
    rating: number;
    justification: string;
  };
}

export interface Experience {
  experience: string;
  interest: number;
  justification: string;
  question: string;
}

export interface EntityDetectionPromptResponse {
  experiences: Experience[];
  response: string;
}

const analyzePromptResponseSchema = {
  type: 'object',
  properties: {
    content: {
      type: 'object',
      properties: {
        thesis_statement: { type: 'string' },
        paragraph: { type: 'string' },
      },
      required: [],
    },
    emotion: {
      type: 'object',
      properties: {
        emotions: { type: 'array', items: { type: 'string' } },
        rating: { type: 'number', minimum: 1, maximum: 5 },
        justification: { type: 'string' },
      },
      required: ['rating'],
    },
    narrativity: {
      type: 'object',
      properties: {
        rating: { type: 'number', minimum: 1, maximum: 5 },
        justification: { type: 'string' },
      },
      required: ['rating'],
    },
    overall: {
      type: 'object',
      properties: {
        rating: { type: 'number', minimum: 1, maximum: 5 },
        justification: { type: 'string' },
      },
      required: ['rating'],
    },
  },
  required: ['content', 'emotion', 'narrativity', 'overall'],
};

const entityDetectionPromptResponseSchema = {
  type: 'object',
  properties: {
    experiences: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          experience: { type: 'string' },
          interest: { type: 'number', minimum: 1, maximum: 5 },
          justification: { type: 'string' },
          question: { type: 'string' },
        },
        required: ['experience', 'interest', 'justification', 'question'],
      },
    },
    response: { type: 'string' },
  },
  required: ['experiences', 'response'],
};

interface AudienceEmtionsMember {
  name: string;
  emotions: string[];
}

interface AudienceAndEmotionsPromptResponse {
  audience: AudienceEmtionsMember[];
}

const audienceMemberAndEmotionsPromptResponseSchema = {
  type: 'object',
  properties: {
    audience: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          emotions: { type: 'array', items: { type: 'string' } },
        },
        required: ['name', 'emotions'],
      },
    },
  },
  required: ['audience'],
};

export const narrativityCannedResponses: Record<number, string[]> = {
  1: [
    'Your hook lacks any narrativity. It is hard to imagine how this would be connected to a story, person, or place.',
  ],
  2: [
    'Your hook lacks any narrativity. It is hard to imagine how this would be connected to a story, person, or place.',
  ],
  3: ['Your hook contains narritivity, but it could be stronger.'],
  4: ['Your hook has some good narritivity, but it could be stronger.'],
  5: ['Your hook contains strong narritivity. Good job!'],
};

export const emotionCannedResponses: Record<number, string[]> = {
  1: ['Your hook lacks any emotion.'],
  2: ['Your hook mostly lacks any emotion.'],
  3: ['Your hook contains emotion, but it could be stronger.'],
  4: ['Your hook has some good emotion, but it could be stronger.'],
  5: ['Your hook contains strong emotion. Good job!'],
};

export interface StepData {
  executePrompt: (
    prompt: (messages: ChatMessageTypes[]) => GQLPrompt,
    callback: (response: MultistepPromptRes) => void
  ) => void;
  openSelectActivityModal: () => void;
}

export default function useWithStrongerHookActivity(
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
  const userId = useAppSelector((state) => state.login.user?._id);
  const { updateUserActivityState } = useWithState();

  interface StrongerHookActivityPrompts {
    analyzeHookPrompt: GQLPrompt;
    entityDetectionPrompt: GQLPrompt;
    helpBrainstormPrompt: GQLPrompt;
    compareStoryToHookPrompt: GQLPrompt;
    relateStoryAndRevisionToHookPrompt: GQLPrompt;
    audienceAndEmotionsDetectionPrompt: GQLPrompt;
    audienceAnalysisPrompt: GQLPrompt;
    eCommentOnProposedRevisionPrompt: GQLPrompt;
    eAnalyzeDocRevisionPrompt: GQLPrompt;
  }

  const [activityPrompts, setActivityPrompts] =
    useState<StrongerHookActivityPrompts>();
  const {
    analyzeHookPrompt,
    entityDetectionPrompt,
    helpBrainstormPrompt,
    compareStoryToHookPrompt,
    relateStoryAndRevisionToHookPrompt,
    audienceAndEmotionsDetectionPrompt,
    audienceAnalysisPrompt,
    eCommentOnProposedRevisionPrompt,
    eAnalyzeDocRevisionPrompt,
  } = activityPrompts || {};

  useEffect(() => {
    if (promptsLoading) {
      return;
    }
    const analyzeHookPrompt = prompts.find(
      (prompt) => prompt._id === ANALYZE_HOOK_PROMPT_ID
    );
    const entityDetectionPrompt = prompts.find(
      (prompt) => prompt._id === N_ENTITY_DETECTION_PROMPT_ID
    );
    const helpBrainstormPrompt = prompts.find(
      (prompt) => prompt._id === N_2_HELP_BRAINSTORM_PROMPT_ID
    );
    const compareStoryToHookPrompt = prompts.find(
      (prompt) => prompt._id === N_3_COMPARE_STORY_TO_HOOK_PROMPT_ID
    );
    const relateStoryAndRevisionToHookPrompt = prompts.find(
      (prompt) => prompt._id === N_4_RELATE_STORY_AND_REVISION_TO_HOOK_PROMPT_ID
    );
    const audienceAndEmotionsDetectionPrompt = prompts.find(
      (prompt) => prompt._id === E_1_AUDIENCE_AND_EMOTIONS_DETECTION_PROMPT_ID
    );
    const audienceAnalysisPrompt = prompts.find(
      (prompt) => prompt._id === E_1_B_AUDIENCE_ANALYSIS_PROMPT_ID
    );
    const eCommentOnProposedRevisionPrompt = prompts.find(
      (prompt) => prompt._id === E_2_COMMENT_ON_PROPOSED_REVISION_PROMPT_ID
    );
    const eAnalyzeDocRevisionPrompt = prompts.find(
      (prompt) => prompt._id === E_3_ANALYZE_DOC_REVISION_PROMPT_ID
    );
    if (
      !analyzeHookPrompt ||
      !entityDetectionPrompt ||
      !helpBrainstormPrompt ||
      !compareStoryToHookPrompt ||
      !relateStoryAndRevisionToHookPrompt ||
      !audienceAndEmotionsDetectionPrompt ||
      !audienceAnalysisPrompt ||
      !eCommentOnProposedRevisionPrompt ||
      !eAnalyzeDocRevisionPrompt
    ) {
      throw new Error('Failed to load prompts for activity.');
    }
    setActivityPrompts({
      analyzeHookPrompt,
      entityDetectionPrompt,
      helpBrainstormPrompt,
      compareStoryToHookPrompt,
      relateStoryAndRevisionToHookPrompt,
      audienceAndEmotionsDetectionPrompt,
      audienceAnalysisPrompt,
      eCommentOnProposedRevisionPrompt,
      eAnalyzeDocRevisionPrompt,
    });
  }, [prompts, promptsLoading]);

  const ANALYZE_HOOK_PROMPT_ID = '6597e33ebe5c8774bb51b4da';
  const N_ENTITY_DETECTION_PROMPT_ID = '6597e3e42e029947c96556f4';
  const N_2_HELP_BRAINSTORM_PROMPT_ID = '65b87466dd9a050559af68ba';
  const N_3_COMPARE_STORY_TO_HOOK_PROMPT_ID = '65a622d688aa62b94041f87e';
  const N_4_RELATE_STORY_AND_REVISION_TO_HOOK_PROMPT_ID =
    '65b876425d92d7f15e694a63';
  const E_1_AUDIENCE_AND_EMOTIONS_DETECTION_PROMPT_ID =
    '65a752f7005cd6556ad048aa';
  const E_1_B_AUDIENCE_ANALYSIS_PROMPT_ID = '65b9a2bd609726ae17d2b9d3';
  const E_2_COMMENT_ON_PROPOSED_REVISION_PROMPT_ID = '65b8775765e5a0d202475c94';
  const E_3_ANALYZE_DOC_REVISION_PROMPT_ID = '65b8781668b6a0e94c7bee47';

  enum StepNames {
    INTRO = 'intro',
    INTRO_2 = 'intro_2',
    NARRATIVE_WEAK_STEP_ONE = 'narrativeWeakStepOne',
    NARRATIVE_WEAK_STEP_TWO = 'narrativeWeakStepTwo',
    NARRATIVE_WEAK_STEP_THREE = 'narrativeWeakStepThree',
    NARRATIVE_WEAK_STEP_FOUR = 'narrativeWeakStepFour',
    NARRATIVE_WEAK_STEP_FIVE = 'narrativeWeakStepFive',
    NARRATIVE_WEAK_STEP_SIX = 'narrativeWeakStepSix',
    NARRATIVE_WEAK_STEP_SEVEN = 'narrativeWeakStepSeven',
    EMOTION_WEAK_STEP_ONE = 'emotionWeakStepOne',
    EMOTION_WEAK_STEP_TWO = 'emotionWeakStepTwo',
    EMOTION_WEAK_STEP_THREE = 'emotionWeakStepThree',
    OUTRO = 'outro',
    OUTRO_2 = 'outro_2',
    FREE_INPUT_STEP = 'freeInputStep',
    SELECT_NARRATIVE_OR_EMOTION = 'selectNarrativeOrEmotion',
  }
  interface StrongerHookActivityState {
    curStepName: StepNames;
    emotionScore: number;
    proposedEmotionRevision: string;
    narrativeScore: number;
    numPumps: number;
    selectedExperience: string;
    experiencesList: Experience[];
    audienceEmotionsList: AudienceEmtionsMember[];
    narrativityStory: string;
    proposedNarrativityRevision: string;
  }

  const [state, setState] = useState<StrongerHookActivityState>({
    curStepName: StepNames.INTRO,
    emotionScore: 0,
    proposedEmotionRevision: '',
    narrativeScore: 0,
    numPumps: 0,
    selectedExperience: '',
    experiencesList: [],
    audienceEmotionsList: [],
    narrativityStory: '',
    proposedNarrativityRevision: '',
  });

  const [cannedResponse, setCannedResponse] = useState<string>('');

  // Reset this activity whenever a new activity starts
  useEffect(() => {
    resetActivity();
  }, [activityGql.title, goal?._id]);

  const { curStepName, numPumps, selectedExperience, experiencesList } = state;
  function setCurStepName(stepName: StepNames) {
    setState((prevState) => ({ ...prevState, curStepName: stepName }));
  }

  function setNumPumps(numPumps: number) {
    setState((prevState) => ({ ...prevState, numPumps: numPumps }));
  }

  function setSelectedEntity(selectedEntity: string) {
    setState((prevState) => ({ ...prevState, selectedEntity: selectedEntity }));
  }

  function setExperiencesList(experiences: Experience[]) {
    setState((prevState) => ({
      ...prevState,
      experiencesList: experiences,
    }));
  }

  function setAudienceEmotionsList(
    audienceEmotionsList: AudienceEmtionsMember[]
  ) {
    setState((prevState) => ({
      ...prevState,
      audienceEmotionsList: audienceEmotionsList,
    }));
  }

  function setRevisionIntention(revisionIntention: string) {
    setState((prevState) => ({
      ...prevState,
      revisionIntention: revisionIntention,
    }));
  }

  function getStep(stepData: StepData): ActivityStep {
    switch (curStepName) {
      case StepNames.INTRO:
      case StepNames.INTRO_2:
        return introStep(stepData);
      case StepNames.SELECT_NARRATIVE_OR_EMOTION:
        return selectNarrativeOrEmotion(stepData);
      case StepNames.NARRATIVE_WEAK_STEP_ONE:
        return narrativeWeakStepOne(stepData);
      case StepNames.NARRATIVE_WEAK_STEP_TWO:
        return narrativeWeakStepTwo(stepData);
      case StepNames.NARRATIVE_WEAK_STEP_THREE:
        return narrativeWeakStepThree(stepData);
      case StepNames.NARRATIVE_WEAK_STEP_FOUR:
        return narrativeWeakStepFour(stepData);
      case StepNames.NARRATIVE_WEAK_STEP_FIVE:
        return narrativeWeakStepFive(stepData);
      case StepNames.NARRATIVE_WEAK_STEP_SIX:
        return narrativeWeakStepSix(stepData);
      case StepNames.NARRATIVE_WEAK_STEP_SEVEN:
        return narrativeWeakStepSeven(stepData);
      case StepNames.EMOTION_WEAK_STEP_ONE:
        return emotionWeakStepOne(stepData);
      case StepNames.EMOTION_WEAK_STEP_TWO:
        return emotionWeakStepTwo(stepData);
      case StepNames.EMOTION_WEAK_STEP_THREE:
        return emotionWeakStepThree(stepData);
      case StepNames.OUTRO:
      case StepNames.OUTRO_2:
        return outroStep(stepData);
      case StepNames.FREE_INPUT_STEP:
        return freeInputStep(stepData);
      default:
        return introStep(stepData);
    }
  }

  const NUM_EXPERIENCES = 3;
  const NUM_PUMP_EXPERIENCES = 3;

  function resetActivity(targetStep?: StepNames) {
    setState({
      curStepName: targetStep
        ? targetStep
        : state.curStepName === StepNames.INTRO
        ? StepNames.INTRO_2
        : StepNames.INTRO,
      emotionScore: 0,
      proposedEmotionRevision: '',
      narrativeScore: 0,
      numPumps: 0,
      selectedExperience: '',
      experiencesList: [],
      audienceEmotionsList: [],
      narrativityStory: '',
      proposedNarrativityRevision: '',
    });
    setCannedResponse('');
  }

  function handleEntityDetectionResponse(
    response: MultistepPromptRes,
    stepData: StepData
  ) {
    const result = validateJsonResponse<EntityDetectionPromptResponse>(
      response.answer,
      entityDetectionPromptResponseSchema
    );

    const orderByInterest = (a: Experience, b: Experience) => {
      return b.interest - a.interest;
    };
    const mergedList: Experience[] = [...experiencesList];
    result.experiences.forEach((experience) => {
      const alreadyExists = experiencesList.find(
        (existingExperience) =>
          existingExperience.experience === experience.experience
      );
      if (alreadyExists) {
        return;
      } else {
        mergedList.push(experience);
      }
    });

    const sortedExperiencesList = mergedList.sort(orderByInterest);
    setExperiencesList(sortedExperiencesList);
    if (sortedExperiencesList.length === 0) {
      setWaitingForUserAnswer(true);
      sendMessage(
        {
          message: `I didn't find any people or places in your responses. Please try again.`,
          sender: Sender.SYSTEM,
          displayType: MessageDisplayType.TEXT,
          activityStep: narrativeWeakStepTwo(stepData),
        },
        false,
        googleDocId
      );
    } else {
      sendMessage(
        {
          message: result.response,
          sender: Sender.SYSTEM,
          displayType: MessageDisplayType.TEXT,
          activityStep: narrativeWeakStepTwo(stepData),
        },
        false,
        googleDocId
      );
      setCurStepName(StepNames.NARRATIVE_WEAK_STEP_THREE);
    }
  }

  function handleAnalyzePromptResponse(
    response: MultistepPromptRes,
    stepData: StepData,
    nextStage?: StepNames
  ) {
    try {
      const result = validateJsonResponse<HookPromptResponse>(
        response.answer,
        analyzePromptResponseSchema
      );
      const narrativeCannedResponseList =
        narrativityCannedResponses[result.narrativity.rating];
      const narrativeCannedResponse =
        narrativeCannedResponseList[
          Math.floor(Math.random() * narrativeCannedResponseList.length)
        ];
      const emotionCannedResponseList =
        emotionCannedResponses[result.emotion.rating];
      const emotionCannedResponse =
        emotionCannedResponseList[
          Math.floor(Math.random() * emotionCannedResponseList.length)
        ];
      const manualCannedResponse = `${narrativeCannedResponse}\n\n${emotionCannedResponse}`;
      const generatedCannedResponse = result.overall.justification;
      const cannedResponse = generatedCannedResponse || manualCannedResponse;
      setCannedResponse(cannedResponse);
      userId &&
        updateUserActivityState(
          userId,
          googleDocId,
          activityGql._id,
          cannedResponse
        );
      sendMessage(
        {
          message: cannedResponse,
          sender: Sender.SYSTEM,
          displayType: MessageDisplayType.TEXT,
          activityStep: introStep(stepData),

          openAiInfo: {
            openAiPrompt: response.openAiData[0].openAiPrompt,
            openAiResponse: response.openAiData[0].openAiResponse,
          },
        },
        false,
        googleDocId
      );

      if (nextStage) {
        setState({
          ...state,
          curStepName: nextStage,
          emotionScore: result.emotion.rating,
          narrativeScore: result.narrativity.rating,
        });
        return;
      }
      setState({
        ...state,
        curStepName: StepNames.SELECT_NARRATIVE_OR_EMOTION,
        emotionScore: result.emotion.rating,
        narrativeScore: result.narrativity.rating,
      });
    } catch (e) {
      console.log(e);
      throw new Error('failed to handle prompt response');
    }
  }

  function handleAudienceAndEmotionsPromptResponse(
    res: MultistepPromptRes,
    stepData: StepData
  ) {
    if (!audienceAnalysisPrompt) {
      return;
    }
    const { executePrompt } = stepData;
    const result = validateJsonResponse<AudienceAndEmotionsPromptResponse>(
      res.answer,
      audienceMemberAndEmotionsPromptResponseSchema
    );
    const { audienceEmotionsList } = state;
    const tempAudienceEmotionsList: AudienceEmtionsMember[] = [
      ...audienceEmotionsList,
    ];
    result.audience.forEach((audience) => {
      const exists = audienceEmotionsList.find(
        (existingAudience) => existingAudience.name === audience.name
      );
      if (exists) {
        return;
      } else {
        tempAudienceEmotionsList.push(audience);
      }
    });
    setAudienceEmotionsList(tempAudienceEmotionsList);
    if (tempAudienceEmotionsList.length === 1) {
      setWaitingForUserAnswer(true);
      sendMessage(
        {
          message: `Okay. Are there any other audiences or stakeholders who are important to this? How should they feel?`,
          sender: Sender.SYSTEM,
          displayType: MessageDisplayType.TEXT,
          activityStep: emotionWeakStepOne(stepData),

          openAiInfo: {
            openAiPrompt: res.openAiData[0].openAiPrompt,
            openAiResponse: res.openAiData[0].openAiResponse,
          },
        },
        false,
        googleDocId
      );
    } else {
      // We have all our audience and emotions, now analyze them all
      const updatedAudienceAnalysisPrompt: GQLPrompt = addContextToPromptSteps(
        audienceAnalysisPrompt,
        [
          {
            promptText: `Here are the audiences and emotions the user listed: ${tempAudienceEmotionsList
              .map(
                (audience) =>
                  `${audience.name} should feel ${audience.emotions.join(', ')}`
              )
              .join(', ')}`,
            includeEssay: false,
            promptRole: PromptRoles.SYSTEM,
          },
        ]
      );
      executePrompt(
        () => updatedAudienceAnalysisPrompt,
        (response: MultistepPromptRes) => {
          sendMessage(
            {
              message: response.answer,
              sender: Sender.SYSTEM,
              displayType: MessageDisplayType.TEXT,
              activityStep: emotionWeakStepOne(stepData),

              openAiInfo: {
                openAiPrompt: response.openAiData[0].openAiPrompt,
                openAiResponse: response.openAiData[0].openAiResponse,
              },
            },
            false,
            googleDocId
          );
          setCurStepName(StepNames.EMOTION_WEAK_STEP_TWO);
        }
      );
    }
  }

  function introStep(stepData: StepData): ActivityStep {
    const { executePrompt } = stepData;
    return {
      text: "Feel free to edit the intro to your paper, and tell me when it's ready for me to review.",
      stepType: ActivityStepTypes.MULTIPLE_CHOICE_QUESTIONS,
      mcqChoices: [MCQ_READY_FOR_REVIEW],
      handleResponse: () => {
        if (!analyzeHookPrompt) {
          return;
        }
        executePrompt(
          () => analyzeHookPrompt,
          (response) => handleAnalyzePromptResponse(response, stepData)
        );
      },
    };
  }

  function selectNarrativeOrEmotion(stepData: StepData): ActivityStep {
    const selections = [];
    const weakNarrative = state.narrativeScore < WEAK_THRESHOLD;
    const weakEmotion = state.emotionScore < WEAK_THRESHOLD;
    if (weakNarrative && weakEmotion) {
      const narrativeWeaker = state.narrativeScore < state.emotionScore;
      if (narrativeWeaker) {
        selections.push(
          MCQ_IMPROVE_NARRATIVITY,
          MCQ_IMPROVE_EMOTION,
          MCQ_ASK_MY_OWN_QUESTION
        );
      } else {
        selections.push(
          MCQ_IMPROVE_EMOTION,
          MCQ_IMPROVE_NARRATIVITY,
          MCQ_ASK_MY_OWN_QUESTION
        );
      }
    }
    if (weakNarrative && !weakEmotion) {
      selections.push(
        MCQ_IMPROVE_NARRATIVITY,
        MCQ_IMPROVE_EMOTION,
        MCQ_ASK_MY_OWN_QUESTION
      );
    }
    if (!weakNarrative && weakEmotion) {
      selections.push(
        MCQ_IMPROVE_EMOTION,
        MCQ_IMPROVE_NARRATIVITY,
        MCQ_ASK_MY_OWN_QUESTION
      );
    }
    if (!weakNarrative && !weakEmotion) {
      // order doesn't matter since neither are weak.
      selections.push(
        MCQ_IMPROVE_NARRATIVITY,
        MCQ_IMPROVE_EMOTION,
        MCQ_ASK_MY_OWN_QUESTION
      );
    }

    return {
      text: 'What would you like to work on?',
      stepType: ActivityStepTypes.MULTIPLE_CHOICE_QUESTIONS,
      mcqChoices: selections,
      handleResponse: (response: string) => {
        if (response === MCQ_IMPROVE_NARRATIVITY) {
          setCurStepName(StepNames.NARRATIVE_WEAK_STEP_ONE);
        } else if (response === MCQ_IMPROVE_EMOTION) {
          setCurStepName(StepNames.EMOTION_WEAK_STEP_ONE);
        } else {
          setCurStepName(StepNames.FREE_INPUT_STEP);
        }
      },
    };
  }

  function narrativeWeakStepOne(stepData: StepData): ActivityStep {
    return {
      text: 'Would you like to brainstorm some stories or do you already have a story in mind?',
      stepType: ActivityStepTypes.MULTIPLE_CHOICE_QUESTIONS,
      mcqChoices: [BRAINSTORM_STORIES, STORY_IN_MIND],
      handleResponse: (response: string) => {
        if (response === BRAINSTORM_STORIES) {
          setCurStepName(StepNames.NARRATIVE_WEAK_STEP_TWO);
        } else if (response === STORY_IN_MIND) {
          setCurStepName(StepNames.NARRATIVE_WEAK_STEP_FOUR);
        }
      },
    };
  }

  // Start extracting entities or go to brainstorming step
  const narrativeWeakStepTwo = (stepData: StepData): ActivityStep => {
    const { executePrompt } = stepData;
    return {
      text: `Let's brainstorm then. What are a few examples of people or places you connect to this? How and why did your stories with them shape your attitudes?`,
      stepType: ActivityStepTypes.FREE_RESPONSE_QUESTION,
      mcqChoices: [HELP_ME_BRAINSTORM],
      handleResponse(response: string) {
        if (!helpBrainstormPrompt || !entityDetectionPrompt) {
          return;
        }
        if (response === HELP_ME_BRAINSTORM) {
          executePrompt(
            () => helpBrainstormPrompt,
            (res: MultistepPromptRes) => {
              setWaitingForUserAnswer(true);
              sendMessage(
                {
                  message: res.answer,
                  sender: Sender.SYSTEM,
                  displayType: MessageDisplayType.TEXT,
                  activityStep: narrativeWeakStepTwo(stepData),

                  openAiInfo: {
                    openAiPrompt: res.openAiData[0].openAiPrompt,
                    openAiResponse: res.openAiData[0].openAiResponse,
                  },
                },
                false,
                googleDocId
              );
              sendMessage(
                {
                  message: `If these helped at all, please brainstorm some people or places you connect with the topic. Otherwise, I can help brainstorm a few more ideas.`,
                  sender: Sender.SYSTEM,
                  displayType: MessageDisplayType.TEXT,
                  mcqChoices: [HELP_ME_BRAINSTORM],
                  activityStep: narrativeWeakStepTwo(stepData),
                },
                false,
                googleDocId
              );
            }
          );
        } else {
          executePrompt(
            () => entityDetectionPrompt,
            (res: MultistepPromptRes) =>
              handleEntityDetectionResponse(res, stepData)
          );
        }
      },
    };
  };

  // Come up with more examples or work with what already have?
  const narrativeWeakStepThree = (stepData: StepData): ActivityStep => {
    return {
      text: "Would you like to brainstorm more examples or work with what you've got?",
      stepType: ActivityStepTypes.MULTIPLE_CHOICE_QUESTIONS,
      mcqChoices: [MCQ_BRAINSTORM_MORE, MCQ_WORK_WITH_WHAT_YOU_HAVE],
      handleResponse: (response: string) => {
        if (response === MCQ_BRAINSTORM_MORE) {
          setCurStepName(StepNames.NARRATIVE_WEAK_STEP_TWO);
        } else {
          setCurStepName(StepNames.NARRATIVE_WEAK_STEP_FOUR);
        }
      },
    };
  };

  // User is ready to share story.
  const narrativeWeakStepFour = (stepData: StepData): ActivityStep => {
    const { executePrompt } = stepData;
    return {
      text: `Great, can you share your story with me?`,
      stepType: ActivityStepTypes.FREE_RESPONSE_QUESTION,
      handleResponse(userInput: string) {
        if (!compareStoryToHookPrompt) {
          return;
        }
        executePrompt(
          (messages) => compareStoryToHookPrompt,
          (response: MultistepPromptRes) => {
            sendMessage(
              {
                message: response.answer,
                sender: Sender.SYSTEM,
                displayType: MessageDisplayType.TEXT,
                activityStep: narrativeWeakStepFour(stepData),

                openAiInfo: {
                  openAiPrompt: response.openAiData[0].openAiPrompt,
                  openAiResponse: response.openAiData[0].openAiResponse,
                },
              },
              false,
              googleDocId
            );
            userId &&
              updateUserActivityState(
                userId,
                googleDocId,
                activityGql._id,
                `${cannedResponse}\n\n\n${response}`
              );
            setState((prevState) => {
              return {
                ...prevState,
                curStepName: StepNames.NARRATIVE_WEAK_STEP_FIVE,
                narrativityStory: userInput,
              };
            });
          }
        );
      },
    };
  };

  // declare proposed revision or brainstorm more
  // once proposed revision is declared, go to step 6
  const narrativeWeakStepFive = (stepData: StepData): ActivityStep => {
    const { executePrompt } = stepData;
    return {
      text: `What kind of revision are you thinking of doing now? If you're not sure, we can brainstorm some more.`,
      stepType: ActivityStepTypes.FREE_RESPONSE_QUESTION,
      mcqChoices: [HELP_ME_BRAINSTORM],
      handleResponse: (res: string) => {
        if (res === HELP_ME_BRAINSTORM) {
          setCurStepName(StepNames.NARRATIVE_WEAK_STEP_TWO);
        } else {
          setState((prevState) => {
            return {
              ...prevState,
              proposedNarrativityRevision: res,
              curStepName: StepNames.NARRATIVE_WEAK_STEP_SIX,
            };
          });
        }
      },
    };
  };

  // revise paper and then review for comment again
  // reviews paper and then goes to step 7
  const narrativeWeakStepSix = (stepData: StepData): ActivityStep => {
    const { executePrompt } = stepData;
    return {
      text: `Please revise your paper and let me know when it's ready for me to review.`,
      stepType: ActivityStepTypes.MULTIPLE_CHOICE_QUESTIONS,
      mcqChoices: [MCQ_READY_FOR_REVIEW],
      handleResponse: () => {
        // Add revision and story to hook prompt
        if (!relateStoryAndRevisionToHookPrompt) {
          return;
        }
        const updatedPrompt: GQLPrompt = addContextToPromptSteps(
          relateStoryAndRevisionToHookPrompt,
          [
            // use to apply revision here too but this should get picked up now
            {
              promptText: `Here is the users narrative story that they'd like to apply to their essays hook: ${state.narrativityStory}`,
              includeEssay: false,
              promptRole: PromptRoles.SYSTEM,
            },
          ]
        );
        executePrompt(
          () => updatedPrompt,
          (response: MultistepPromptRes) => {
            sendMessage(
              {
                message: response.answer,
                sender: Sender.SYSTEM,
                displayType: MessageDisplayType.TEXT,
                activityStep: narrativeWeakStepSix(stepData),

                openAiInfo: {
                  openAiPrompt: response.openAiData[0].openAiPrompt,
                  openAiResponse: response.openAiData[0].openAiResponse,
                },
              },
              false,
              googleDocId
            );

            setCurStepName(StepNames.NARRATIVE_WEAK_STEP_SEVEN);
          }
        );
      },
    };
  };

  // prompt to restart narrative, emotion, or to re-analyze (restart activity)
  const narrativeWeakStepSeven = (stepData: StepData): ActivityStep => {
    const { executePrompt } = stepData;
    return {
      text: `What would you like to do next?`,
      stepType: ActivityStepTypes.MULTIPLE_CHOICE_QUESTIONS,
      mcqChoices: [
        MCQ_IMPROVE_NARRATIVITY,
        MCQ_IMPROVE_EMOTION,
        MCQ_SOMETHING_ELSE,
      ],
      handleResponse: (response: string) => {
        if (response === MCQ_IMPROVE_NARRATIVITY) {
          setState((prevState) => {
            return {
              ...prevState,
              curStepName: StepNames.NARRATIVE_WEAK_STEP_ONE,
              narrativityStory: '',
              proposedNarrativityRevision: '',
            };
          });
        } else if (response === MCQ_IMPROVE_EMOTION) {
          setState((prevState) => {
            return {
              ...prevState,
              curStepName: StepNames.EMOTION_WEAK_STEP_ONE,
            };
          });
        } else {
          setCurStepName(StepNames.OUTRO);
        }
      },
    };
  };

  // collect and analyze audience and emotions
  const emotionWeakStepOne = (stepData: StepData): ActivityStep => {
    return {
      text: 'Great. Consider who this piece is speaking to. Can you list the main audience or a few audiences? For each audience, what kind of emotions do you want them to feel?',
      stepType: ActivityStepTypes.FREE_RESPONSE_QUESTION,
      handleResponse: (response: string) => {
        if (!audienceAndEmotionsDetectionPrompt) {
          return;
        }
        const { executePrompt } = stepData;
        executePrompt(
          () => audienceAndEmotionsDetectionPrompt,
          (res: MultistepPromptRes) =>
            handleAudienceAndEmotionsPromptResponse(res, stepData)
        );
      },
    };
  };

  const emotionWeakStepTwo = (stepData: StepData): ActivityStep => {
    const { executePrompt } = stepData;
    return {
      text: 'What kind of revision are you thinking of doing now?',
      stepType: ActivityStepTypes.FREE_RESPONSE_QUESTION,
      handleResponse: (response: string) => {
        if (!eCommentOnProposedRevisionPrompt) {
          return;
        }
        executePrompt(
          () => eCommentOnProposedRevisionPrompt,
          (res: MultistepPromptRes) => {
            sendMessage(
              {
                message: res.answer,
                sender: Sender.SYSTEM,
                displayType: MessageDisplayType.TEXT,
                activityStep: emotionWeakStepTwo(stepData),
                openAiInfo: {
                  openAiPrompt: res.openAiData[0].openAiPrompt,
                  openAiResponse: res.openAiData[0].openAiResponse,
                },
              },
              false,
              googleDocId
            );
            setState((prevState) => {
              return {
                ...prevState,
                proposedEmotionRevision: response,
                curStepName: StepNames.EMOTION_WEAK_STEP_THREE,
              };
            });
          }
        );
      },
    };
  };

  const emotionWeakStepThree = (stepData: StepData): ActivityStep => {
    const { executePrompt } = stepData;
    return {
      text: "Let me know when you're done revising so I can look at it again.",
      stepType: ActivityStepTypes.MULTIPLE_CHOICE_QUESTIONS,
      mcqChoices: [MCQ_READY_FOR_REVIEW],
      handleResponse: () => {
        if (!eAnalyzeDocRevisionPrompt) {
          return;
        }
        executePrompt(
          () => eAnalyzeDocRevisionPrompt,
          (response: MultistepPromptRes) => {
            sendMessage(
              {
                message: response.answer,
                sender: Sender.SYSTEM,
                displayType: MessageDisplayType.TEXT,
                activityStep: emotionWeakStepThree(stepData),
                openAiInfo: {
                  openAiPrompt: response.openAiData[0].openAiPrompt,
                  openAiResponse: response.openAiData[0].openAiResponse,
                },
              },
              false,
              googleDocId
            );
            setCurStepName(StepNames.OUTRO);
          }
        );
      },
    };
  };

  const freeInputStep = (stepData: StepData): ActivityStep => {
    const { executePrompt, openSelectActivityModal } = stepData;
    return {
      text: "Okay, feel free to ask me anything you'd like",
      stepType: ActivityStepTypes.FREE_RESPONSE_QUESTION,
      handleResponse: () => {
        executePrompt(freeInputPrompt, (response: MultistepPromptRes) => {
          setWaitingForUserAnswer(true);
          sendMessage(
            {
              message: response.answer,
              sender: Sender.SYSTEM,
              displayType: MessageDisplayType.TEXT,
              activityStep: freeInputStep(stepData),

              openAiInfo: {
                openAiPrompt: response.openAiData[0].openAiPrompt,
                openAiResponse: response.openAiData[0].openAiResponse,
              },
            },
            false,
            googleDocId
          );
        });
      },
    };
  };

  const outroStep = (stepData: StepData): ActivityStep => {
    const { executePrompt, openSelectActivityModal } = stepData;
    return {
      text: 'Okay, would you like to revise and then have me analyze it again? Or would you like to work on another activity?',
      stepType: ActivityStepTypes.MULTIPLE_CHOICE_QUESTIONS,
      mcqChoices: [MCQ_ANALYZE_AGAIN, MCQ_ANOTHER_ACTIVITY, MCQ_OPEN_DIALOGUE],
      handleResponse: (response: string) => {
        if (response === MCQ_ANALYZE_AGAIN) {
          resetActivity();
        } else if (response === MCQ_ANOTHER_ACTIVITY) {
          openSelectActivityModal();
          if (curStepName === StepNames.OUTRO_2) {
            setCurStepName(StepNames.OUTRO);
          } else {
            setCurStepName(StepNames.OUTRO_2);
          }
        } else if (response === MCQ_OPEN_DIALOGUE) {
          setCurStepName(StepNames.FREE_INPUT_STEP);
        }
      },
    };
  };
  const activity: Activity = {
    ...activityGql,
    steps: [],
    getStep,
    stepName: curStepName,
    resetActivity,
    isReady: Boolean(activityPrompts),
  };

  return activity;
}