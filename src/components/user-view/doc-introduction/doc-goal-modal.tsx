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
import { ActivityTypes, DocGoal, GoogleDoc, Intention } from '../../../types';
import { ColumnDiv, RowDiv } from '../../../styled-components';
import './doc-goal-modal.css';
import { useState } from 'react';
import ChangeIcon from '@mui/icons-material/Construction';
import { ActivitiesDisplay } from './activities-display';
import { GoalsDisplay } from './goals-display';
import { useAppSelector } from '../../../store/hooks';
import { hasHoursPassed } from '../../../helpers';
import { InputDocumentIntention } from './input-document-intention';
import { InputDocumentAssignment } from './input-document-assignment';
import { InputDayIntention } from './input-day-inention';
import { useWithGoogleDocs } from '../../../hooks/use-with-google-docs';
import { useSearchParams } from 'react-router-dom';
import { FREE_INPUT_GOAL_ID, URL_PARAM_NEW_DOC } from '../../../constants';

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

export default function DocGoalModal(props: {
  open: boolean;
  close: () => void;
  setSelectedGoal: (goal?: DocGoal) => void;
  setSelectedActivity: (activity?: ActivityTypes) => void;
  selectedActivity?: ActivityTypes;
  selectedGoal?: DocGoal;
  docGoals?: DocGoal[];
}): JSX.Element {
  const [urlSearchParams] = useSearchParams();
  const {
    open,
    close,
    docGoals,
    setSelectedGoal: beginGoal,
    setSelectedActivity: beginActivity,
  } = props;

  const enum SelectingStage {
    LOADING,
    DOCUMENT_INTENTION,
    ASSIGNMENT_DESCRIPTION,
    DAY_INTENTION,
    GOAL,
    ACTIVITY,
  }
  const googleDocId = useAppSelector((state) => state.state.googleDocId);
  const googleDocs = useAppSelector((state) => state.state.userGoogleDocs);
  const googleDoc = googleDocs.find((doc) => doc.googleDocId === googleDocId);
  const isNewGoogleDoc = urlSearchParams.get(URL_PARAM_NEW_DOC) === 'true';
  const [curStageIndex, setCurStageIndex] = useState(0);
  const [stages, setStages] = useState<SelectingStage[]>([]);
  const currentStage = stages[curStageIndex];
  const [_selectedActivity, _setSelectedActivity] = useState<ActivityTypes>();
  const [_selectedGoal, _setSelectedGoal] = useState<DocGoal>();
  const [firstLoadComplete, setFirstLoadComplete] = useState(false);
  const [documentIntention, setDocumentIntention] = useState<string>(
    googleDoc?.documentIntention?.description || ''
  );
  const [assignmentDescription, setAssignmentDescription] = useState<string>(
    googleDoc?.assignmentDescription || ''
  );
  const [dayIntention, setDayIntention] = useState<string>('');
  const { updateGoogleDoc } = useWithGoogleDocs();

  useEffect(() => {
    if (googleDoc?.googleDocId) {
      setDocumentIntention(googleDoc.documentIntention?.description || '');
      setAssignmentDescription(googleDoc.assignmentDescription || '');
      setDayIntention(googleDoc.currentDayIntention?.description || '');
    }
  }, [googleDoc?.googleDocId]);

  function getRequiredStages(googleDoc: GoogleDoc): SelectingStage[] {
    const stages: SelectingStage[] = [];
    if (!googleDoc.documentIntention) {
      stages.push(SelectingStage.DOCUMENT_INTENTION);
    }
    if (
      !googleDoc.assignmentDescription &&
      googleDoc.assignmentDescription !== ''
    ) {
      stages.push(SelectingStage.ASSIGNMENT_DESCRIPTION);
    }

    const eightHoursSinceDocIntention = googleDoc.documentIntention?.createdAt
      ? hasHoursPassed(
          googleDoc.documentIntention.createdAt,
          new Date().toISOString(),
          8
        )
      : false;
    const eightHoursSinceDayIntention = googleDoc.currentDayIntention?.createdAt
      ? hasHoursPassed(
          googleDoc.currentDayIntention.createdAt,
          new Date().toISOString(),
          8
        )
      : false;

    if (
      googleDoc.currentDayIntention?.description &&
      eightHoursSinceDayIntention
    ) {
      stages.push(SelectingStage.DAY_INTENTION);
    }

    if (
      !googleDoc.currentDayIntention?.description &&
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
    if (!googleDoc?.googleDocId || firstLoadComplete) {
      return;
    }
    const requiredStages = getRequiredStages(googleDoc);
    setCurStageIndex(0);
    setStages(requiredStages);
    setFirstLoadComplete(true);
  }, [googleDoc?.googleDocId, firstLoadComplete]);

  function closeModal() {
    _setSelectedGoal(undefined);
    _setSelectedActivity(undefined);
    setCurStageIndex(0);
    close();
  }

  function goalHasActivities(goal: DocGoal) {
    return goal.activities && goal.activities.length;
  }

  function completeModal(goal: DocGoal) {
    beginGoal(goal);
    beginActivity(_selectedActivity);
    googleDoc && setStages(getRequiredStages(googleDoc));
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
          isNewGoogleDoc={isNewGoogleDoc}
        />
      );
    } else {
      return (
        _selectedGoal?.activities && (
          <ActivitiesDisplay
            activities={[
              ..._selectedGoal.activities,
              ..._selectedGoal.builtActivities,
            ]}
            setSelectedActivity={_setSelectedActivity}
            selectedActivity={_selectedActivity}
          />
        )
      );
    }
  }

  function updateGoogleDocIntentions(curGoogleDoc: GoogleDoc) {
    const newDocumentIntention: Intention | undefined =
      documentIntention &&
      documentIntention !== curGoogleDoc.documentIntention?.description
        ? { description: documentIntention }
        : undefined;
    const newAssignmentDescription: string | undefined =
      assignmentDescription !== curGoogleDoc.assignmentDescription
        ? assignmentDescription
        : undefined;
    const newDayIntention: Intention | undefined =
      dayIntention &&
      dayIntention !== curGoogleDoc.currentDayIntention?.description
        ? { description: dayIntention }
        : undefined;

    updateGoogleDoc({
      googleDocId: curGoogleDoc.googleDocId,
      user: curGoogleDoc.user,
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
    if (!googleDoc) {
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
      updateGoogleDocIntentions(googleDoc);
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
                  top: 30,
                  left: 30,
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
                    <IconButton onClick={goBackToGoalStage}>
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
            <CircularProgress />
          )}
        </Box>
      </Modal>
    </div>
  );
}
