/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/

import { useCallback, useEffect, useState } from 'react';
import { BuiltActivityHandler } from '../classes/activity-builder-activity/built-activity-handler';
import { ChatMessageTypes } from '../store/slices/chat';
import { useWithChat } from '../store/slices/chat/use-with-chat';
import { useWithState } from '../store/slices/state/use-with-state';
import { useWithChatLogSubscribers } from './use-with-chat-log-subscribers';
import { useWithExecutePrompt } from './use-with-execute-prompts';
import { ActivityBuilder } from '../components/activity-builder/types';
import { equals } from '../helpers';
import { getDocServiceFromLoginService } from '../types';
import { useAppSelector } from '../store/hooks';
import { useWithEducationalManagement } from '../store/slices/education-management/use-with-educational-management';
import { useNavigateWithParams } from './use-navigate-with-params';
import { useWithPath } from './use-with-path';
import { useWithPanels } from '../store/slices/panels/use-with-panels';

export function useWithBuiltActivityHandler(
  resetActivityCounter: number,
  editDocGoal: () => void,
  selectedActivityBuilder?: ActivityBuilder
) {
  const { activePanelist, setActivePanelist } = useWithPanels();
  const { sendMessage, clearChatLog, coachResponsePending } = useWithChat();
  const { state, updateSessionIntention, newSession } = useWithState();
  const curDocId = state.curDocId;
  const user = useAppSelector((state) => state.login.user);
  const docService = getDocServiceFromLoginService(user?.loginService);
  const { executePromptSteps } = useWithExecutePrompt();
  const { addNewSubscriber, removeAllSubscribers } =
    useWithChatLogSubscribers();
  const {
    myData: myEducationalData,
    studentActivityCompleted,
    goToPreviousView,
  } = useWithEducationalManagement();
  const { panels, panelists } = useWithPanels();
  const { defaultHome, isOnCourseManagementPages, isOnStudentCoursesPages } =
    useWithPath();
  const viewState = useAppSelector(
    (state) => state.educationManagement.viewState
  );
  const navigate = useNavigateWithParams();
  const [builtActivityHandler, setBuiltActivityHandler] =
    useState<BuiltActivityHandler>();
  const updatesFound = !equals(
    selectedActivityBuilder,
    builtActivityHandler?.builtActivityData
  );
  const [initialize, setInitialize] = useState<BuiltActivityHandler>();

  useEffect(() => {
    if (builtActivityHandler) {
      builtActivityHandler.executePrompt = executePromptSteps;
    }
  }, [executePromptSteps]);

  useEffect(() => {
    if (!curDocId) {
      if (builtActivityHandler) {
        builtActivityHandler.resetActivity();
        setBuiltActivityHandler(undefined);
      }
      //hack to ensure that sendMessageHelper is fully loaded with googleDocId
      return;
    }
    if (!selectedActivityBuilder?._id) {
      removeAllSubscribers();
      setBuiltActivityHandler(undefined);
      clearChatLog(curDocId);
    } else if (!builtActivityHandler) {
      const attachedPanel = selectedActivityBuilder?.attachedPanel
        ? panels.find(
            (p) => p.clientId === selectedActivityBuilder?.attachedPanel
          )
        : undefined;
      const attachedPanelists = attachedPanel
        ? panelists.filter((p) => attachedPanel.panelists.includes(p.clientId))
        : undefined;
      const newActivityHandler = new BuiltActivityHandler(
        sendMessageHelper,
        () => {
          clearChatLog(curDocId);
        },
        (waiting: boolean) => {
          console.log(waiting);
        },
        coachResponsePending,
        updateSessionIntentionHelper,
        executePromptSteps,
        curDocId,
        editDocGoal,
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
        onFilteredPanelistsChanged
      );
      setInitialize(newActivityHandler);
    } else if (
      builtActivityHandler.builtActivityData?._id !==
        selectedActivityBuilder._id ||
      updatesFound
    ) {
      builtActivityHandler.setBuiltActivityData(selectedActivityBuilder);
      builtActivityHandler.resetActivity();
    }
  }, [
    curDocId,
    selectedActivityBuilder?._id,
    Boolean(builtActivityHandler),
    updatesFound,
    defaultHome,
  ]);

  useEffect(() => {
    if (initialize) {
      initialize.initializeActivity();
      setBuiltActivityHandler(initialize);
      addNewSubscriber(initialize);
      setInitialize(undefined);
    }
  }, [initialize]);

  useEffect(() => {
    if (!builtActivityHandler) {
      return;
    }
    newSession();
    builtActivityHandler.resetActivity();
  }, [resetActivityCounter]);

  useEffect(() => {
    if (builtActivityHandler) {
      builtActivityHandler.filteredToPanelists = activePanelist
        ? [activePanelist.clientId]
        : [];
    }
  }, [activePanelist]);

  const handleStudentActivityComplete = useCallback(() => {
    if (
      !myEducationalData ||
      !viewState.selectedCourseId ||
      !viewState.selectedSectionId ||
      !viewState.selectedAssignmentId ||
      !selectedActivityBuilder?._id
    ) {
      return;
    }
    studentActivityCompleted(
      myEducationalData.userId,
      viewState.selectedCourseId,
      viewState.selectedSectionId,
      viewState.selectedAssignmentId,
      selectedActivityBuilder._id
    );
  }, [
    myEducationalData,
    viewState.selectedCourseId,
    viewState.selectedSectionId,
    viewState.selectedAssignmentId,
    selectedActivityBuilder?._id,
    studentActivityCompleted,
  ]);

  function sendMessageHelper(msg: ChatMessageTypes, clearChat?: boolean) {
    sendMessage(msg, clearChat || false, curDocId);
  }

  function updateSessionIntentionHelper(intention: string) {
    updateSessionIntention({
      description: intention,
    });
  }

  function onFilteredPanelistsChanged(filteredPanelistIds: string[]): void {
    if (filteredPanelistIds.length > 0) {
      setActivePanelist(filteredPanelistIds[0]);
    } else {
      setActivePanelist(undefined);
    }
  }

  return {
    activityReady: Boolean(builtActivityHandler),
  };
}
