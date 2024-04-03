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
} from '@mui/material';
import {
  ActivityGQL,
  DocGoal,
  DocRevision,
  GoogleDoc,
  Intention,
} from '../../../types';
import { ColumnDiv, RowDiv } from '../../../styled-components';
import './doc-goal-modal.css';
import { useState } from 'react';
import ChangeIcon from '@mui/icons-material/Construction';
import { ActivitiesDisplay } from './activities-display';
import { GoalsDisplay } from './goals-display';
import { useAppSelector } from '../../../store/hooks';
import { fetchLatestDocVersion } from '../../../hooks/api';
import { useWithState } from '../../../store/slices/state/use-with-state';
import { hasHoursPassed } from '../../../helpers';
import { google } from 'googleapis';
import { GoogleDocsLoadStatus } from '../../../store/slices/state';
import { InputDocumentIntention } from './input-document-intention';
import { InputDocumentAssignment } from './input-document-assignment';
import { InputDayIntention } from './input-day-inention';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  height: '80%',
  p: 4,
  display: 'flex',
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
  setSelectedActivity: (activity?: ActivityGQL) => void;
  selectedActivity?: ActivityGQL;
  selectedGoal?: DocGoal;
  docGoals?: DocGoal[];
}): JSX.Element {
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
  const [_stage, _setStage] = useState<SelectingStage>(SelectingStage.LOADING);
  const [_selectedActivity, _setSelectedActivity] = useState<ActivityGQL>();
  const [_selectedGoal, _setSelectedGoal] = useState<DocGoal>();
  const { updateDayIntention } = useWithState();
  const [firstLoadComplete, setFirstLoadComplete] = useState(false);

  function getNextStage(googleDoc: GoogleDoc): SelectingStage {
    if (!googleDoc.documentIntention) {
      return SelectingStage.DOCUMENT_INTENTION;
    }
    if (
      !googleDoc.assignmentDescription &&
      googleDoc.assignmentDescription !== ''
    ) {
      return SelectingStage.ASSIGNMENT_DESCRIPTION;
    }

    const eightHoursSinceDocIntention = googleDoc.documentIntention.createdAt
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

    if (googleDoc.currentDayIntention && eightHoursSinceDayIntention) {
      return SelectingStage.DAY_INTENTION;
    }

    if (!googleDoc.currentDayIntention && eightHoursSinceDocIntention) {
      return SelectingStage.DAY_INTENTION;
    }

    if (!_selectedGoal) {
      return SelectingStage.GOAL;
    }
    if (!_selectedActivity) {
      return SelectingStage.ACTIVITY;
    }
    completeModal(_selectedGoal);
    return SelectingStage.GOAL;
  }

  // Manages first stage load
  useEffect(() => {
    if (!googleDoc?.googleDocId || firstLoadComplete) {
      return;
    }
    updateDayIntention(googleDoc.currentDayIntention);
    _setStage(getNextStage(googleDoc));
    setFirstLoadComplete(true);
  }, [googleDoc?.googleDocId, firstLoadComplete]);

  function closeModal() {
    _setSelectedGoal(undefined);
    _setSelectedActivity(undefined);
    _setStage(SelectingStage.GOAL);
    close();
  }

  function goalHasActivities(goal: DocGoal) {
    return goal.activities && goal.activities.length;
  }

  function completeModal(goal: DocGoal) {
    beginGoal(goal);
    beginActivity(_selectedActivity);
    closeModal();
  }

  function resetSelections() {
    _setSelectedGoal(undefined);
    _setSelectedActivity(undefined);
    _setStage(SelectingStage.GOAL);
  }

  if (!docGoals) return <></>;

  function getDisplay(docGoals: DocGoal[]) {
    if (_stage === SelectingStage.LOADING) {
      return <CircularProgress />;
    }

    if (_stage === SelectingStage.DOCUMENT_INTENTION) {
      return <InputDocumentIntention />;
    }

    if (_stage === SelectingStage.ASSIGNMENT_DESCRIPTION) {
      return <InputDocumentAssignment />;
    }

    if (_stage === SelectingStage.DAY_INTENTION) {
      return <InputDayIntention />;
    }

    if (_stage === SelectingStage.GOAL) {
      return (
        <GoalsDisplay
          docGoals={[...docGoals].reverse()}
          setSelectedGoal={(goal) => {
            _setSelectedGoal(goal);
            if (!goalHasActivities(goal)) {
              completeModal(goal);
              return;
            } else {
              _setStage(SelectingStage.ACTIVITY);
            }
          }}
          selectedGoal={_selectedGoal}
        />
      );
    } else {
      return (
        _selectedGoal?.activities && (
          <ActivitiesDisplay
            activities={_selectedGoal.activities}
            activityOrder={_selectedGoal.activityOrder}
            setSelectedActivity={_setSelectedActivity}
            selectedActivity={_selectedActivity}
          />
        )
      );
    }
  }

  return (
    <div>
      <Modal open={Boolean(open)}>
        <Box sx={style} data-cy="doc-goal-modal">
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
                  onClick={resetSelections}
                >
                  {_selectedGoal.title}
                </span>
                <IconButton onClick={resetSelections}>
                  <ChangeIcon />
                </IconButton>
              </>
            )}
          </div>
          <ColumnDiv
            style={{
              height: '100%',
              width: '100%',
              alignItems: 'center',
              justifyContent: 'space-around',
            }}
          >
            {getDisplay(docGoals)}

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
                  closeModal();
                }}
              >
                Cancel
              </Button>
              <div>
                <Button
                  variant="text"
                  style={{
                    borderRadius: '20px',
                    marginRight: '40px',
                  }}
                  onClick={() => {
                    _setSelectedGoal(undefined);
                    _setSelectedActivity(undefined);
                    _setStage(SelectingStage.GOAL);
                  }}
                  disabled={_stage === SelectingStage.GOAL}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  data-cy="activity-select-start-button"
                  style={{
                    borderRadius: '20px',
                  }}
                  disabled={_stage === SelectingStage.GOAL}
                  onClick={() => {
                    if (!_selectedGoal) return;
                    completeModal(_selectedGoal);
                  }}
                >
                  {_stage === SelectingStage.ACTIVITY ||
                  _stage === SelectingStage.GOAL
                    ? 'Start'
                    : 'Next'}
                </Button>
              </div>
            </RowDiv>
          </ColumnDiv>
        </Box>
      </Modal>
    </div>
  );
}
