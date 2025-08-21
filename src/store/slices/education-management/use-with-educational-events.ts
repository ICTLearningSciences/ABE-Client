import mitt from 'mitt';
import { NewDocData } from '../../../types';
import { useEffect } from 'react';
import { useWithEducationalManagement } from './use-with-educational-management';
import { useAppSelector } from '../../../store/hooks';

export enum EducationalEvents {
  NEW_DOC_CREATED = 'NEW_DOC_CREATED',
}

export const educationalEventsEmitter = mitt<{
  [EducationalEvents.NEW_DOC_CREATED]: NewDocData;
}>();

export function useWithEducationalEvents() {
  const { studentActivityNewDocCreated } = useWithEducationalManagement();
  const loginState = useAppSelector((state) => state.login);
  const viewState = useAppSelector(
    (state) => state.educationManagement.viewState
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
      newDocData.docId
    );
  }

  useEffect(() => {
    educationalEventsEmitter.on(
      EducationalEvents.NEW_DOC_CREATED,
      handleNewDocCreated
    );
    return () => {
      educationalEventsEmitter.off(
        EducationalEvents.NEW_DOC_CREATED,
        handleNewDocCreated
      );
    };
  }, [viewState, loginState.user?._id, studentActivityNewDocCreated]);
}
