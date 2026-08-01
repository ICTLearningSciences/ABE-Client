/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/

import { useEffect } from "react";
import mitt from "mitt";
import type { NewDocData } from "../../../types";
import { useWithEducationalManagement } from "./use-with-educational-management";
import { useAppSelector } from "../../../store/hooks";

export type EducationalEvents = "NEW_DOC_CREATED";

export const educationalEventsEmitter = mitt<{
  ["NEW_DOC_CREATED"]: NewDocData;
}>();

export function useWithEducationalEvents() {
  const { studentActivityNewDocCreated } = useWithEducationalManagement();
  const loginState = useAppSelector((state) => state.login);
  const viewState = useAppSelector(
    (state) => state.educationManagement.viewState,
  );

  function handleNewDocCreated(newDocData: NewDocData) {
    if (
      !viewState.selectedCourseId ||
      !viewState.selectedSectionId ||
      !viewState.selectedAssignmentId ||
      !viewState.selectedActivityId ||
      !loginState.user?._id
    ) {
      return;
    }
    studentActivityNewDocCreated(
      loginState.user._id,
      viewState.selectedCourseId,
      viewState.selectedSectionId,
      viewState.selectedAssignmentId,
      viewState.selectedActivityId,
      newDocData.docId,
    );
  }

  useEffect(() => {
    educationalEventsEmitter.on("NEW_DOC_CREATED", handleNewDocCreated);
    return () => {
      educationalEventsEmitter.off("NEW_DOC_CREATED", handleNewDocCreated);
    };
  }, [viewState, loginState.user?._id, studentActivityNewDocCreated]);
}
