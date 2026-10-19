/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/

import { useCallback, useEffect, useState } from "react";
import { BuiltActivityHandler } from "../../classes/activity-builder-activity/built-activity-handler";
import type { ChatMessageTypes } from "../../store/slices/chat";
import { useWithChat } from "../../store/slices/chat/use-with-chat";
import { useWithState } from "../../store/slices/state/use-with-state";
import { useWithChatLogSubscribers } from "../../hooks/use-with-chat-log-subscribers";
import { useWithExecutePrompt } from "../../hooks/use-with-execute-prompts";
import type { ActivityBuilder } from "../../components/activity-builder/types";
import { getDocServiceFromLoginService, type AiPromptStep } from "../../types";
import { useAppSelector } from "../../store/hooks";
import { useWithEducationalManagement } from "../../store/slices/education-management/use-with-educational-management";
import { useNavigateWithParams } from "../../hooks/use-navigate-with-params";
import { useWithPath } from "../../hooks/use-with-path";
import { useWithPanels } from "../../store/slices/panels/use-with-panels";

export interface UseWithBuiltActivityHandler {
  builtActivityHandler: BuiltActivityHandler | null;
  activityReady: boolean;
  startActivity: (
    curDocId: string,
    selectedActivityBuilder: ActivityBuilder,
  ) => void;
  resetActivity: () => void;
  sendUserMessage: (msg: ChatMessageTypes) => void;
}

export function useWithBuiltActivityHandler(): UseWithBuiltActivityHandler {
  const [builtActivityHandler, setBuiltActivityHandler] =
    useState<BuiltActivityHandler | null>(null);
  const [resetNonce, setResetNonce] = useState(0);
  const {
    activity,
    activePanelists,
    panels,
    panelists,
    activePanelConfig,
    setActivePanelists,
  } = useWithPanels();
  const { sendMessage, clearChatLog, coachResponsePending } = useWithChat();
  const { state, updateSessionIntention } = useWithState();
  const curDocId = state.curDocId;

  const user = useAppSelector((state) => state.login.user);
  const docService = getDocServiceFromLoginService(user?.loginService);
  const { executePromptSteps: _executePromptSteps } = useWithExecutePrompt();
  const defaultSharkTankAiModel = useAppSelector(
    (state) => state.config.config?.defaultSharkTankAiModel,
  );
  const executePromptStepsForSharkTank = useCallback(
    (aiPromptSteps: AiPromptStep[]) =>
      _executePromptSteps(aiPromptSteps, undefined, defaultSharkTankAiModel),
    [_executePromptSteps, defaultSharkTankAiModel],
  );
  const { addNewSubscriber, removeAllSubscribers } =
    useWithChatLogSubscribers();
  const {
    myData: myEducationalData,
    studentActivityCompleted,
    goToPreviousView,
  } = useWithEducationalManagement();
  const { defaultHome, isOnCourseManagementPages, isOnStudentCoursesPages } =
    useWithPath();
  const viewState = useAppSelector(
    (state) => state.educationManagement.viewState,
  );
  const navigate = useNavigateWithParams();

  useEffect(() => {
    if (!user?._id || !curDocId || !activity?._id) return;
    const handler = startActivity(curDocId, activity);
    setBuiltActivityHandler(handler);
    return () => {
      handler.destroy();
      removeAllSubscribers();
      coachResponsePending(false);
      setBuiltActivityHandler(null);
    };
  }, [user?._id, curDocId, activity?._id, resetNonce]);

  useEffect(() => {
    if (builtActivityHandler) {
      builtActivityHandler.filteredToPanelists =
        activePanelists?.map((a) => a.clientId) || [];
    }
  }, [activePanelists]);

  useEffect(() => {
    if (builtActivityHandler) {
      builtActivityHandler.executePrompt = executePromptStepsForSharkTank;
    }
  }, [executePromptStepsForSharkTank]);

  function startActivity(
    docId: string,
    selectedActivityBuilder: ActivityBuilder,
  ): BuiltActivityHandler {
    const attachedPanel = selectedActivityBuilder.attachedPanel
      ? panels.find((p) => p.clientId === selectedActivityBuilder.attachedPanel)
      : undefined;
    const attachedPanelists = attachedPanel
      ? panelists.filter((p) => attachedPanel.panelists.includes(p.clientId))
      : undefined;
    const newActivityHandler: BuiltActivityHandler = new BuiltActivityHandler(
      (msg: ChatMessageTypes, clearChat?: boolean) => {
        if (newActivityHandler.destroyed) return;
        sendMessage(msg, clearChat || false, docId);
      },
      () => {
        clearChatLog();
      },
      (waiting: boolean) => {
        console.log(waiting);
      },
      coachResponsePending,
      updateSessionIntentionHelper,
      executePromptStepsForSharkTank,
      docId,
      () => {},
      docService,
      handleStudentActivityComplete,
      () => {
        if (isOnCourseManagementPages || isOnStudentCoursesPages) {
          goToPreviousView();
        } else {
          navigate(defaultHome);
        }
      },
      selectedActivityBuilder,
      attachedPanel,
      attachedPanelists,
      onFilteredPanelistsChanged,
      activePanelConfig,
    );
    newActivityHandler.initializeActivity();
    newActivityHandler.filteredToPanelists =
      activePanelists?.map((a) => a.clientId) || [];
    newActivityHandler.executePrompt = executePromptStepsForSharkTank;
    addNewSubscriber(newActivityHandler);
    return newActivityHandler;
  }

  function resetActivity() {
    setResetNonce((n) => n + 1);
  }

  function sendUserMessage(message: ChatMessageTypes) {
    if (builtActivityHandler) {
      builtActivityHandler.sendUserMessage(message);
    }
  }

  function handleStudentActivityComplete() {
    if (
      !myEducationalData ||
      !viewState.selectedCourseId ||
      !viewState.selectedSectionId ||
      !viewState.selectedAssignmentId ||
      !activity?._id
    ) {
      return;
    }
    studentActivityCompleted(
      myEducationalData.userId,
      viewState.selectedCourseId,
      viewState.selectedSectionId,
      viewState.selectedAssignmentId,
      activity._id,
    );
  }

  function updateSessionIntentionHelper(intention: string) {
    updateSessionIntention({
      description: intention,
    });
  }

  function onFilteredPanelistsChanged(filteredPanelistIds: string[]): void {
    if (filteredPanelistIds.length > 0) {
      setActivePanelists(filteredPanelistIds);
    }
  }

  return {
    builtActivityHandler,
    activityReady: Boolean(builtActivityHandler),
    startActivity,
    resetActivity,
    sendUserMessage,
  };
}
