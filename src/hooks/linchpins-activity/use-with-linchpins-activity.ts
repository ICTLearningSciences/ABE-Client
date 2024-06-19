/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { useEffect, useState } from 'react';
import {
  ChatMessageTypes,
  MessageDisplayType,
  Sender,
} from '../../store/slices/chat';
import { v4 as uuidv4 } from 'uuid';
import {
  Activity,
  ActivityGQL,
  ActiveActivityStep,
  ActivityStepTypes,
  GQLPrompt,
  DocGoal,
  StepMessage,
  PromptRoles,
} from '../../types';
import { StepData } from '../use-with-stronger-hook-activity';
import { addContextToPromptSteps } from '../../helpers';

export interface LinchpinActivityPrompts {
  listCrucialElementsPrompt: GQLPrompt;
  brainstormSuccessElementsPrompt: GQLPrompt;
  brainstormFailureElementsPrompt: GQLPrompt;
}

export enum LinchpinStepNames {
  INTRO = 'INTRO',
  INTRO_2 = 'INTRO_2',
  SELECT_CATEGORY = 'SELECT_CATEGORY',
  CATEGORY_SUCCESS_ELEMENTS = 'CATEGORY_SUCCESS_ELEMENTS',
  CATEGORY_FAILURE_ELEMENTS = 'CATEGORY_FAILURE_ELEMENTS',
  SELECT_IMPORTANT_ELEMENT = 'SELECT_IMPORTANT_ELEMENT',
  WHY_IMPORTANT_ELEMENT = 'WHY_IMPORTANT_ELEMENT',
  HOW_WILL_MONITOR_ELEMENT = 'HOW_WILL_MONITOR_ELEMENT',
}

export interface LinchpinActivityState {
  curStepName: LinchpinStepNames;
  discussionCategory: string;
  successElementInput: string;
  failureElementInput: string;

  importantElement: {
    elementSelected: string;
    whyImportant: string;
    howWillMonitorElement: string;
  };
}

export function useWithLinchpinsActivity(
  activityGql: ActivityGQL,
  sendMessage: (msg: ChatMessageTypes) => void,
  setWaitingForUserAnswer: (waiting: boolean) => void,
  promptsLoading: boolean,
  prompts: GQLPrompt[],
  goal?: DocGoal
): Activity {
  const allActivityMessages: StepMessage[] = (activityGql.steps || [])?.reduce(
    (acc, step) => {
      return [...acc, ...step.messages];
    },
    [] as StepMessage[]
  );
  const [activityPrompts, setActivityPrompts] =
    useState<LinchpinActivityPrompts>();

  const {
    listCrucialElementsPrompt,
    brainstormSuccessElementsPrompt,
    brainstormFailureElementsPrompt,
  } = activityPrompts || {};

  const LIST_CRUCIAL_ELEMENTS_PROMPT_ID = '6672245a4debd590a4be7783';
  const BRAINSTORM_SUCCESS_ELEMENTS_PROMPT_ID = '667224604debd590a4be77fa';
  const BRAINSTORM_FAILURE_ELEMENTS_PROMPT_ID = '667224654debd590a4be7873';

  useEffect(() => {
    if (promptsLoading) {
      return;
    }
    const listCrucialElementsPrompt = prompts.find(
      (prompt) => prompt._id === LIST_CRUCIAL_ELEMENTS_PROMPT_ID
    );
    const brainstormSuccessElementsPrompt = prompts.find(
      (prompt) => prompt._id === BRAINSTORM_SUCCESS_ELEMENTS_PROMPT_ID
    );
    const brainstormFailureElementsPrompt = prompts.find(
      (prompt) => prompt._id === BRAINSTORM_FAILURE_ELEMENTS_PROMPT_ID
    );
    if (
      !listCrucialElementsPrompt ||
      !brainstormSuccessElementsPrompt ||
      !brainstormFailureElementsPrompt
    ) {
      throw new Error('Missing prompts');
    }

    setActivityPrompts({
      listCrucialElementsPrompt,
      brainstormSuccessElementsPrompt,
      brainstormFailureElementsPrompt,
    });
  }, [prompts, promptsLoading]);

  const [state, setState] = useState<LinchpinActivityState>({
    curStepName: LinchpinStepNames.INTRO,
    discussionCategory: '',
    successElementInput: '',
    failureElementInput: '',
    importantElement: {
      elementSelected: '',
      whyImportant: '',
      howWillMonitorElement: '',
    },
  });

  useEffect(() => {
    resetActivity();
  }, [activityGql.title, goal?._id]);

  function resetActivity(targetStep?: LinchpinStepNames) {
    setState({
      curStepName: targetStep
        ? targetStep
        : state.curStepName === LinchpinStepNames.INTRO
        ? LinchpinStepNames.INTRO_2
        : LinchpinStepNames.INTRO,
      discussionCategory: '',
      successElementInput: '',
      failureElementInput: '',
      importantElement: {
        elementSelected: '',
        whyImportant: '',
        howWillMonitorElement: '',
      },
    });
  }

  function getStep(stepData: StepData): ActiveActivityStep {
    if (
      !listCrucialElementsPrompt ||
      !brainstormSuccessElementsPrompt ||
      !brainstormFailureElementsPrompt
    ) {
      throw new Error('Missing prompts');
    }
    switch (state.curStepName) {
      case LinchpinStepNames.INTRO:
      case LinchpinStepNames.INTRO_2:
        return introStep(stepData);
      case LinchpinStepNames.SELECT_CATEGORY:
        return selectCategory();
      case LinchpinStepNames.CATEGORY_SUCCESS_ELEMENTS:
        return categorySuccessElements(stepData);
      case LinchpinStepNames.CATEGORY_FAILURE_ELEMENTS:
        return categoryFailureElements(stepData);
      case LinchpinStepNames.WHY_IMPORTANT_ELEMENT:
        return whyImportantElement();
      case LinchpinStepNames.SELECT_IMPORTANT_ELEMENT:
        return selectImportantElement();
      case LinchpinStepNames.HOW_WILL_MONITOR_ELEMENT:
        return howWillMonitorElement();
      default:
        return introStep(stepData);
    }
  }

  function getMessage(messageId: string): string | undefined {
    return allActivityMessages.find((message) => message._id === messageId)
      ?.text;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function introStep(stepData: StepData): ActiveActivityStep {
    const { executePrompt } = stepData;
    const introMessage = getMessage('16b8559117dcb51adc3bf967');
    return {
      text: introMessage || "Let me know when it's ready for review.",
      stepType: ActivityStepTypes.MULTIPLE_CHOICE_QUESTIONS,
      mcqChoices: ['Ready'],
      handleResponse: async () => {
        if (!listCrucialElementsPrompt) {
          return;
        }
        await executePrompt(
          () => listCrucialElementsPrompt,
          (crucialElementsRes) => {
            sendMessage({
              id: uuidv4(),
              sender: Sender.SYSTEM,
              message: crucialElementsRes.answer,
              displayType: MessageDisplayType.TEXT,
            });
            setState({
              ...state,
              curStepName: LinchpinStepNames.SELECT_CATEGORY,
            });
          }
        );
      },
    };
  }

  function selectCategory(): ActiveActivityStep {
    const selectCategoryMessage = getMessage('16b2559117dcb51adc3bf967');
    return {
      text:
        selectCategoryMessage ||
        'Please select a category to discuss, or input your own.',
      stepType: ActivityStepTypes.FREE_RESPONSE_QUESTION,
      mcqChoices: ['TIME', 'ENEMY/OPPOSITION', 'SURROUNDINGS/TERRAIN'],
      handleResponse: async (selectedCategory) => {
        setState({
          ...state,
          discussionCategory: selectedCategory,
          curStepName: LinchpinStepNames.CATEGORY_SUCCESS_ELEMENTS,
        });
      },
    };
  }

  const MCQ_BRAINSTORM = 'BRAINSTORM';
  function categorySuccessElements(stepData: StepData): ActiveActivityStep {
    const { executePrompt } = stepData;
    const categorySuccessElementsMessage = getMessage(
      '25c8559117dcb51adc3bf967'
    );
    return {
      text:
        categorySuccessElementsMessage ||
        'What aspects of this category are crucial to succeed for your paper/mission?',
      stepType: ActivityStepTypes.FREE_RESPONSE_QUESTION,
      mcqChoices: [MCQ_BRAINSTORM],
      handleResponse: async (userRes) => {
        if (!brainstormSuccessElementsPrompt) {
          return;
        }
        const updatedPrompt = addContextToPromptSteps(
          brainstormSuccessElementsPrompt,
          [
            {
              promptRole: PromptRoles.SYSTEM,
              includeEssay: true,
              promptText: `The discussion category is: ${state.discussionCategory}`,
            },
          ]
        );
        if (userRes === MCQ_BRAINSTORM) {
          await executePrompt(
            () => updatedPrompt,
            (successElementsRes) => {
              sendMessage({
                id: uuidv4(),
                sender: Sender.SYSTEM,
                message: successElementsRes.answer,
                displayType: MessageDisplayType.TEXT,
              });
            }
          );
          sendMessage({
            id: uuidv4(),
            sender: Sender.SYSTEM,
            mcqChoices: [MCQ_BRAINSTORM],
            message:
              categorySuccessElementsMessage ||
              'What aspects of this category are crucial to succeed for your paper/mission?',
            displayType: MessageDisplayType.TEXT,
          });
          setWaitingForUserAnswer(true);
        } else {
          setState({
            ...state,
            successElementInput: userRes,
            curStepName: LinchpinStepNames.CATEGORY_FAILURE_ELEMENTS,
          });
        }
      },
    };
  }

  function categoryFailureElements(stepData: StepData): ActiveActivityStep {
    const { executePrompt } = stepData;
    const categoryFailureElementsMessage = getMessage(
      '35b8459011dcb51adc3bf967'
    );
    return {
      text:
        categoryFailureElementsMessage ||
        'What elements do you think could result in failure even if those elements are not likely to occur?',
      stepType: ActivityStepTypes.FREE_RESPONSE_QUESTION,
      mcqChoices: [MCQ_BRAINSTORM],
      handleResponse: async (userRes) => {
        if (!brainstormFailureElementsPrompt) {
          return;
        }
        const updatedPrompt = addContextToPromptSteps(
          brainstormFailureElementsPrompt,
          [
            {
              promptRole: PromptRoles.SYSTEM,
              includeEssay: true,
              promptText: `The discussion category is: ${state.discussionCategory}`,
            },
          ]
        );
        if (userRes === MCQ_BRAINSTORM) {
          await executePrompt(
            () => updatedPrompt,
            (failureElementsRes) => {
              sendMessage({
                id: uuidv4(),
                sender: Sender.SYSTEM,
                message: failureElementsRes.answer,
                displayType: MessageDisplayType.TEXT,
              });
            }
          );
          sendMessage({
            id: uuidv4(),
            sender: Sender.SYSTEM,
            mcqChoices: [MCQ_BRAINSTORM],
            message:
              categoryFailureElementsMessage ||
              'What elements do you think could result in failure even if those elements are not likely to occur?',
            displayType: MessageDisplayType.TEXT,
          });
          setWaitingForUserAnswer(true);
        } else {
          setState({
            ...state,
            failureElementInput: userRes,
            curStepName: LinchpinStepNames.SELECT_IMPORTANT_ELEMENT,
          });
        }
      },
    };
  }

  function selectImportantElement(): ActiveActivityStep {
    const selectImportantElementMessage = getMessage(
      '16b82591a7dcb51adc3bf967'
    );
    return {
      text:
        selectImportantElementMessage ||
        'Please select an element that you found to be crucial to your paper/mission, or input a new one.',
      stepType: ActivityStepTypes.FREE_RESPONSE_QUESTION,
      mcqChoices: [state.successElementInput, state.failureElementInput],
      handleResponse: async (selectedCategory) => {
        setState({
          ...state,
          discussionCategory: selectedCategory,
          curStepName: LinchpinStepNames.WHY_IMPORTANT_ELEMENT,
        });
      },
    };
  }

  function whyImportantElement(): ActiveActivityStep {
    const message = getMessage('45b3559011dcb51adc3bf967');
    return {
      text: message || 'WHY is it an important element?',
      stepType: ActivityStepTypes.FREE_RESPONSE_QUESTION,
      handleResponse: async (userRes) => {
        setState({
          ...state,
          importantElement: {
            ...state.importantElement,
            elementSelected: state.discussionCategory,
            whyImportant: userRes,
          },
          curStepName: LinchpinStepNames.HOW_WILL_MONITOR_ELEMENT,
        });
      },
    };
  }

  function howWillMonitorElement(): ActiveActivityStep {
    const message = getMessage('55b3559011dcb51adc3bf967');
    return {
      text:
        message || 'HOW are you going to monitor the status of this element?',
      stepType: ActivityStepTypes.FREE_RESPONSE_QUESTION,
      handleResponse: async (userRes) => {
        setState({
          ...state,
          importantElement: {
            ...state.importantElement,
            howWillMonitorElement: userRes,
          },
          curStepName: LinchpinStepNames.INTRO_2,
        });
      },
    };
  }

  console.log('state', state);

  const activity: Activity = {
    ...activityGql,
    steps: [],
    getStep,
    stepName: state.curStepName,
    resetActivity,
    isReady: true,
  };
  return activity;
}
