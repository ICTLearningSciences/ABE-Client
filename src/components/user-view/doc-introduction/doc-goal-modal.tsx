/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React, { useEffect } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Modal,
  SxProps,
  Theme,
} from '@mui/material';
import { ActivityTypes, DocGoal, UserDoc, Intention } from '../../../types';
import { ColumnDiv, RowDiv } from '../../../styled-components';
import { useState } from 'react';
import ChangeIcon from '@mui/icons-material/Construction';
import { ActivitiesDisplay } from './activities-display';
import { GoalsDisplay } from './goals-display';
import { useAppSelector } from '../../../store/hooks';
import { hasHoursPassed } from '../../../helpers';
import { InputDocumentIntention } from './input-document-intention';
import { InputDocumentAssignment } from './input-document-assignment';
import { InputDayIntention } from './input-day-inention';
import { useWithUsersDocs } from '../../../hooks/use-with-users-docs';
import { FREE_INPUT_GOAL_ID } from '../../../constants';

const style: SxProps<Theme> = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  WebkitTransform: 'translate(-50%, -50%)',
  transform: 'translate(-50%, -50%)',
  width: 'fit-content',
  height: 'fit-content',
  p: 4,
  display: 'flex',
  boxSizing: 'border-box',
  flexDirection: 'column',
  justifyContent: 'space-between',
  backgroundColor: 'white',
  borderRadius: '20px',
  border: '5px solid black',
};

export function DocGoalModal(props: {
  open: boolean;
  close: () => void;
  setSelectedGoal: (goal?: DocGoal) => void;
  setSelectedActivity: (activity?: ActivityTypes) => void;
  selectedActivity?: ActivityTypes;
  selectedGoal?: DocGoal;
  docGoals?: DocGoal[];
  isNewDoc: boolean;
}): JSX.Element {
  const {
    open,
    close,
    docGoals,
    setSelectedGoal: beginGoal,
    setSelectedActivity: beginActivity,
    isNewDoc,
  } = props;

  const enum SelectingStage {
    LOADING,
    DOCUMENT_INTENTION,
    ASSIGNMENT_DESCRIPTION,
    DAY_INTENTION,
    GOAL,
    ACTIVITY,
  }
  const curDocId = useAppSelector((state) => state.state.curDocId);
  const googleDocs = useAppSelector((state) => state.state.userDocs);
  const curDoc = googleDocs.find((doc) => doc.googleDocId === curDocId);
  const [curStageIndex, setCurStageIndex] = useState(0);
  const [stages, setStages] = useState<SelectingStage[]>([]);
  const currentStage = stages[curStageIndex];
  const [_selectedActivity, _setSelectedActivity] = useState<ActivityTypes>();
  const [_selectedGoal, _setSelectedGoal] = useState<DocGoal>();
  const [firstLoadComplete, setFirstLoadComplete] = useState(false);
  const [documentIntention, setDocumentIntention] = useState<string>(
    curDoc?.documentIntention?.description || ''
  );
  const [assignmentDescription, setAssignmentDescription] = useState<string>(
    curDoc?.assignmentDescription || ''
  );
  const [dayIntention, setDayIntention] = useState<string>('');
  const { updateUserDoc } = useWithUsersDocs();

  useEffect(() => {
    if (curDoc?.googleDocId) {
      setDocumentIntention(curDoc.documentIntention?.description || '');
      setAssignmentDescription(curDoc.assignmentDescription || '');
      setDayIntention(curDoc.currentDayIntention?.description || '');
    }
  }, [curDoc?.googleDocId]);

  function getRequiredStages(userDoc: UserDoc): SelectingStage[] {
    const stages: SelectingStage[] = [];
    if (!userDoc.documentIntention) {
      stages.push(SelectingStage.DOCUMENT_INTENTION);
    }
    if (
      !userDoc.assignmentDescription &&
      userDoc.assignmentDescription !== ''
    ) {
      stages.push(SelectingStage.ASSIGNMENT_DESCRIPTION);
    }

    const eightHoursSinceDocIntention = userDoc.documentIntention?.createdAt
      ? hasHoursPassed(
          userDoc.documentIntention.createdAt,
          new Date().toISOString(),
          8
        )
      : false;
    const eightHoursSinceDayIntention = userDoc.currentDayIntention?.createdAt
      ? hasHoursPassed(
          userDoc.currentDayIntention.createdAt,
          new Date().toISOString(),
          8
        )
      : false;

    if (
      userDoc.currentDayIntention?.description &&
      eightHoursSinceDayIntention
    ) {
      stages.push(SelectingStage.DAY_INTENTION);
    }

    if (
      !userDoc.currentDayIntention?.description &&
      eightHoursSinceDocIntention
    ) {
      stages.push(SelectingStage.DAY_INTENTION);
    }

    stages.push(SelectingStage.GOAL);
    stages.push(SelectingStage.ACTIVITY);
    return stages;
  }
  // Manages first stage load
  useEffect(() => {
    if (!curDoc?.googleDocId || firstLoadComplete) {
      return;
    }
    const requiredStages = getRequiredStages(curDoc);
    setCurStageIndex(0);
    setStages(requiredStages);
    setFirstLoadComplete(true);
  }, [curDoc?.googleDocId, firstLoadComplete]);

  function closeModal() {
    _setSelectedGoal(undefined);
    _setSelectedActivity(undefined);
    setCurStageIndex(0);
    close();
  }

  function goalHasActivities(goal: DocGoal) {
    return goal.builtActivities?.length;
  }

  function completeModal(goal: DocGoal) {
    beginGoal(goal);
    beginActivity(_selectedActivity);
    curDoc && setStages(getRequiredStages(curDoc));
    setCurStageIndex(0);
    closeModal();
  }

  function goBackToGoalStage() {
    _setSelectedGoal(undefined);
    _setSelectedActivity(undefined);
    setCurStageIndex(
      stages.findIndex((stage) => stage === SelectingStage.GOAL)
    );
  }

  function nextStage() {
    setCurStageIndex((prevValue) => {
      if (prevValue + 1 === stages.length) {
        closeModal();
        return 0;
      }
      return prevValue + 1;
    });
  }

  function prevStage() {
    setCurStageIndex((prevValue) => {
      if (prevValue === 0) {
        return 0;
      }
      return prevValue - 1;
    });
  }

  if (!docGoals || !docGoals.length) return <CircularProgress />;

  function getDisplayByStage(stage: SelectingStage) {
    if (stage === SelectingStage.LOADING) {
      return <CircularProgress />;
    }

    if (stage === SelectingStage.DOCUMENT_INTENTION) {
      return (
        <InputDocumentIntention
          documentIntention={documentIntention}
          setDocumentIntention={setDocumentIntention}
        />
      );
    }

    if (stage === SelectingStage.ASSIGNMENT_DESCRIPTION) {
      return (
        <InputDocumentAssignment
          documentAssignment={assignmentDescription}
          setDocumentAssignment={setAssignmentDescription}
        />
      );
    }

    if (stage === SelectingStage.DAY_INTENTION) {
      return (
        <InputDayIntention
          dayIntention={dayIntention}
          setDayIntention={setDayIntention}
        />
      );
    }

    if (stage === SelectingStage.GOAL) {
      return (
        <GoalsDisplay
          docGoals={[...(docGoals || [])].reverse()}
          setSelectedGoal={(goal) => {
            _setSelectedGoal(goal);
            if (!goalHasActivities(goal)) {
              completeModal(goal);
              return;
            } else {
              nextStage();
            }
          }}
          selectedGoal={_selectedGoal}
          isNewGoogleDoc={isNewDoc}
        />
      );
    } else {
      return (
        _selectedGoal?.builtActivities && (
          <ActivitiesDisplay
            activities={_selectedGoal.builtActivities}
            setSelectedActivity={_setSelectedActivity}
            selectedActivity={_selectedActivity}
          />
        )
      );
    }
  }

  function updateUserDocIntentions(curUserDoc: UserDoc) {
    const newDocumentIntention: Intention | undefined =
      documentIntention &&
      documentIntention !== curUserDoc.documentIntention?.description
        ? { description: documentIntention }
        : undefined;
    const newAssignmentDescription: string | undefined =
      assignmentDescription !== curUserDoc.assignmentDescription
        ? assignmentDescription
        : undefined;
    const newDayIntention: Intention | undefined =
      dayIntention &&
      dayIntention !== curUserDoc.currentDayIntention?.description
        ? { description: dayIntention }
        : undefined;

    updateUserDoc({
      googleDocId: curUserDoc.googleDocId,
      user: curUserDoc.user,
      ...(newDocumentIntention
        ? { documentIntention: newDocumentIntention }
        : {}),
      ...(newAssignmentDescription || newAssignmentDescription === ''
        ? { assignmentDescription: newAssignmentDescription }
        : {}),
      ...(newDayIntention ? { currentDayIntention: newDayIntention } : {}),
    });
  }

  function handleNextClick(currentStage: SelectingStage) {
    if (!curDoc) {
      return;
    }
    const nextStageIsGoal =
      curStageIndex + 1 !== stages.length &&
      stages[curStageIndex + 1] === SelectingStage.GOAL;

    if (
      nextStageIsGoal &&
      [
        SelectingStage.DOCUMENT_INTENTION,
        SelectingStage.ASSIGNMENT_DESCRIPTION,
        SelectingStage.DAY_INTENTION,
      ].includes(currentStage)
    ) {
      updateUserDocIntentions(curDoc);
    }

    if (currentStage === SelectingStage.GOAL) {
      // goal stage next button disabled
    }

    if (currentStage === SelectingStage.ACTIVITY) {
      if (!_selectedGoal) {
        // Should always be a selected goal, since activity stage requires it.
        return;
      }
      completeModal(_selectedGoal);
      return;
    }

    nextStage();
  }

  return (
    <div>
      <Modal open={Boolean(open)}>
        <Box sx={style} data-cy="doc-goal-modal">
          {firstLoadComplete ? (
            <>
              <div
                data-cy="selected-goal-display"
                style={{
                  position: 'absolute',
                  top: 20,
                  left: 20,
                }}
              >
                {_selectedGoal && (
                  <>
                    <span
                      style={{
                        fontWeight: 'bold',
                        cursor: 'pointer',
                      }}
                      onClick={goBackToGoalStage}
                    >
                      {_selectedGoal.title}
                    </span>
                    <IconButton
                      style={{
                        zIndex: 2,
                      }}
                      onClick={goBackToGoalStage}
                    >
                      <ChangeIcon />
                    </IconButton>
                  </>
                )}
              </div>
              <ColumnDiv
                style={{
                  height: 'fit-content',
                  width: 'fit-content',
                  alignItems: 'center',
                  justifyContent: 'space-around',
                }}
              >
                {curStageIndex < stages.length ? (
                  getDisplayByStage(stages[curStageIndex])
                ) : (
                  <span>current stage index out of bounds</span>
                )}

                <RowDiv
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <Button
                    data-cy="doc-goal-cancel-button"
                    variant="text"
                    style={{
                      marginRight: '40px',
                      color: 'black',
                      position: 'absolute',
                      top: 20,
                      right: 0,
                    }}
                    onClick={() => {
                      if (!props.selectedActivity) {
                        const freeInputGoal = docGoals?.find(
                          (goal) => goal._id === FREE_INPUT_GOAL_ID
                        );
                        if (freeInputGoal) {
                          beginGoal(freeInputGoal);
                        }
                      }
                      closeModal();
                    }}
                  >
                    Cancel
                  </Button>
                  <RowDiv
                    style={{
                      margin: '20px',
                    }}
                  >
                    <Button
                      data-cy="doc-goal-modal-back-button"
                      variant="text"
                      style={{
                        borderRadius: '20px',
                        marginRight: '40px',
                      }}
                      onClick={() => {
                        _setSelectedGoal(undefined);
                        _setSelectedActivity(undefined);
                        // _setStage(SelectingStage.GOAL);
                        prevStage();
                      }}
                      disabled={curStageIndex === 0}
                    >
                      Back
                    </Button>
                    <Button
                      variant="contained"
                      data-cy="doc-goal-modal-next-button"
                      style={{
                        borderRadius: '20px',
                      }}
                      disabled={
                        currentStage === SelectingStage.GOAL ||
                        (currentStage === SelectingStage.ACTIVITY &&
                          !_selectedActivity)
                      }
                      onClick={() => {
                        handleNextClick(currentStage);
                      }}
                    >
                      {currentStage === SelectingStage.ACTIVITY ||
                      currentStage === SelectingStage.GOAL
                        ? 'Start'
                        : 'Next'}
                    </Button>
                  </RowDiv>
                </RowDiv>
              </ColumnDiv>
            </>
          ) : (
            <>
              <CircularProgress />
            </>
          )}
        </Box>
      </Modal>
    </div>
  );
}
