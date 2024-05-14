/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { useEffect, useState } from 'react';
import { useAppSelector } from '../store/hooks';
import { useWithChat } from '../store/slices/chat/use-with-chat';
import { Activity, ActivityGQL, ActivityStepTypes, DocGoal } from '../types';
import {
  ChatMessageTypes,
  MessageDisplayType,
  Sender,
  UserInputType,
} from '../store/slices/chat';
import useWithStrongerHookActivity from './use-with-stronger-hook-activity';
import { DisplayIcons } from '../helpers/display-icon-helper';
import { useWithPromptActivity } from './use-with-prompt-activity';
import { UseWithPrompts } from './use-with-prompts';
import { v4 as uuidv4 } from 'uuid';
import {
  LIMITS_TO_YOUR_ARGUMENT_ID,
  STRONGER_CONCLUSION_ID,
  STRONGER_HOOK_ID,
  THESIS_SUPPORT_ID,
} from '../constants';
import { useWithState } from '../store/slices/state/use-with-state';
import { useWithStrongerConclusionActivity } from './stronger-conclusion-activity/use-with-stronger-conclusion-activity';
import { useWithLimitsToArgumentActivity } from './limits-to-argument-activity/use-with-limits-to-argument-activity';
import { useWithThesisSupportActivity } from './increasing-thesis-support-activity/use-with-thesis-support-activity';
import { useWithExecutePrompt } from './use-with-execute-prompts';

export const MCQ_RETRY_FAILED_REQUEST = 'Retry';

export const emptyActivity: Activity = {
  _id: '',
  title: '',
  introduction: '',
  responsePendingMessage: '',
  responseReadyMessage: '',
  disabled: false,
  steps: [],
  description: '',
  displayIcon: DisplayIcons.DEFAULT,
  getStep: () => {
    return {
      text: '',
      stepType: ActivityStepTypes.FREE_RESPONSE_QUESTION,
      handleResponse: () => {
        return;
      },
    };
  },
  stepName: '',
  resetActivity: () => {
    return;
  },
  isReady: true,
};

export function useWithActivityHandler(
  useWithPrompts: UseWithPrompts,
  editDocGoal: () => void,
  resetActivityCounter: number,
  selectedGoal?: DocGoal,
  selectedActivity?: ActivityGQL
) {
  const {
    state,
    sendMessage,
    sendMessages,
    clearChatLog,
    coachResponsePending,
  } = useWithChat();
  const { executePrompt, abortController } = useWithExecutePrompt(true);
  const { newSession, updateSessionIntention } = useWithState();
  const googleDocId: string = useAppSelector(
    (state) => state.state.googleDocId
  );
  const messages = state.chatLogs[googleDocId] || [];
  const [waitingForUserAnswer, setWaitingForUserAnswer] =
    useState<boolean>(false);
  const { prompts, isLoading: promptsLoading } = useWithPrompts;

  const strongerHookActivity = useWithStrongerHookActivity(
    selectedActivity || emptyActivity,
    sendMessage,
    setWaitingForUserAnswer,
    promptsLoading,
    prompts,
    selectedGoal
  );
  const strongerConclusionActivity = useWithStrongerConclusionActivity(
    selectedActivity || emptyActivity,
    sendMessage,
    setWaitingForUserAnswer,
    promptsLoading,
    prompts,
    selectedGoal
  );
  const thesisSupportActivity = useWithThesisSupportActivity(
    selectedActivity || emptyActivity,
    sendMessage,
    setWaitingForUserAnswer,
    promptsLoading,
    prompts,
    selectedGoal
  );
  const limitsToArgumentActivity = useWithLimitsToArgumentActivity(
    selectedActivity || emptyActivity,
    sendMessage,
    setWaitingForUserAnswer,
    promptsLoading,
    prompts,
    selectedGoal
  );
  const promptActivity = useWithPromptActivity(
    selectedActivity || emptyActivity,
    sendMessage,
    setWaitingForUserAnswer
  );

  const activity =
    selectedActivity?._id === STRONGER_HOOK_ID
      ? strongerHookActivity
      : selectedActivity?._id === STRONGER_CONCLUSION_ID
      ? strongerConclusionActivity
      : selectedActivity?._id === LIMITS_TO_YOUR_ARGUMENT_ID
      ? limitsToArgumentActivity
      : selectedActivity?._id === THESIS_SUPPORT_ID
      ? thesisSupportActivity
      : selectedActivity?.prompt
      ? promptActivity
      : undefined;

  function resetActivity() {
    // cancel any pending requests
    if (abortController) {
      try {
        abortController.controller.abort();
        abortController.source.cancel();
      } catch (e) {
        console.log(e);
      }
    }
    newSession();
    coachResponsePending(false);
    setWaitingForUserAnswer(false);
    if (activity) {
      activity.resetActivity();
    }
  }

  function sendMessageHelper(message: ChatMessageTypes) {
    sendMessage(message, false, googleDocId);
  }

  function sendIntroMessages() {
    const activityIntroduction = activity?.introduction;
    const goalIntroduction = selectedGoal?.introduction;
    const messagesToSend: ChatMessageTypes[] = [];
    if (activityIntroduction) {
      messagesToSend.push({
        id: uuidv4(),
        message: activityIntroduction,
        sender: Sender.SYSTEM,
        displayType: MessageDisplayType.TEXT,
      });
    }
    if (goalIntroduction) {
      messagesToSend.push({
        id: uuidv4(),
        message: goalIntroduction,
        sender: Sender.SYSTEM,
        displayType: MessageDisplayType.TEXT,
      });
    }
    sendMessages(messagesToSend, true, googleDocId);
  }

  useEffect(() => {
    if (resetActivityCounter === 0) return;
    clearChatLog(googleDocId);
    sendIntroMessages();
    resetActivity();
  }, [resetActivityCounter]);

  useEffect(() => {
    if (activity?._id && selectedGoal?._id) {
      // newSession();
    }
  }, [activity?._id, selectedGoal?._id]);

  // Handles initial load
  useEffect(() => {
    if (!googleDocId) {
      return;
    }
    clearChatLog(googleDocId);
    resetActivity();
    sendIntroMessages();
  }, [selectedActivity, selectedGoal]);

  // Handles new step
  useEffect(() => {
    if (!activity) return;
    const currentStep = activity.getStep({
      executePrompt,
      openSelectActivityModal: editDocGoal,
      sendMessage: sendMessageHelper,
      setWaitingForUserAnswer,
      updateSessionIntention,
    });
    sendMessage(
      {
        id: uuidv4(),
        message: currentStep.text,
        sender: Sender.SYSTEM,
        displayType: MessageDisplayType.TEXT,
        mcqChoices: currentStep.mcqChoices,
        activityStep: currentStep,
        selectedGoal: selectedGoal,
      },
      false,
      googleDocId
    );
    setWaitingForUserAnswer(true);
  }, [activity?.stepName]);

  // Handles user response to activity step via messages
  useEffect(() => {
    if (!activity) return;
    const currentStep = activity.getStep({
      executePrompt,
      openSelectActivityModal: editDocGoal,
      sendMessage: sendMessageHelper,
      setWaitingForUserAnswer,
      updateSessionIntention,
    });
    if (!currentStep) return;
    if (!messages.length) return;
    if (!waitingForUserAnswer) return;
    const mostRecentMessage = messages[messages.length - 1];
    const userMessage = mostRecentMessage.sender === Sender.USER;
    const userInputType: UserInputType =
      currentStep.stepType === ActivityStepTypes.FREE_RESPONSE_QUESTION
        ? UserInputType.FREE_INPUT
        : UserInputType.MCQ;
    if (userMessage) {
      const userAnswer = mostRecentMessage;
      if (currentStep.handleResponse) {
        currentStep.handleResponse(userAnswer.message, userInputType);
      }
      setWaitingForUserAnswer(false);
    }
  }, [waitingForUserAnswer, messages, activity?.stepName]);

  return {
    activityReady: activity?.isReady || !selectedActivity,
  };
}
