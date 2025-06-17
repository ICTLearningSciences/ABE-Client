/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from 'react';
import { CircularProgress } from '@mui/material';
import { useWithCurrentGoalActivity } from '../../hooks/use-with-current-goal-activity';
import { useState } from 'react';
import { useAppSelector } from '../../store/hooks';
import { UserRole } from '../../store/slices/login';
import { useWithState } from '../../store/slices/state/use-with-state';
import { ActivityTypes } from '../../types';
import { useWithWindowSize } from '../../hooks/use-with-window-size';
import { isActivityBuilder } from '../activity-builder/types';
import { UseWithPrompts } from '../../hooks/use-with-prompts';
import { ChatActivity } from './chat-activity';
import { SingleNotificationDialog } from '../dialog';
import { UserDocumentDisplay } from './user-document-display';
import { ColumnCenterDiv, ColumnDiv } from '../../styled-components';
import { ActivityBuilderPage } from '../activity-builder/activity-builder-page';

export function EditGoogleDoc(props: {
  docId: string;
  docUrl: string;
  activityFromParams: string;
  goalFromParams: string;
  isNewDoc: boolean;
  useWithPrompts: UseWithPrompts;
}): JSX.Element {
  const {
    docId,
    docUrl,
    activityFromParams,
    goalFromParams,
    isNewDoc,
    useWithPrompts,
  } = props;
  const useCurrentGoalActivity = useWithCurrentGoalActivity();
  const {
    goalActivityState,
    setGoalAndActivity,
    isLoading: goalsLoading,
  } = useCurrentGoalActivity;

  const { width: windowWidth } = useWithWindowSize();
  const { updateViewingUserRole, state } = useWithState();
  const viewingRole = useAppSelector((state) => state.state.viewingRole);
  const viewingAdmin =
    viewingRole === UserRole.ADMIN || viewingRole === UserRole.CONTENT_MANAGER;
  const [previewingActivity, setPreviewingActivity] = useState<boolean>(false);

  function goToActivityPreview(activity: ActivityTypes) {
    setPreviewingActivity(true);
    setGoalAndActivity(undefined, activity);
    updateViewingUserRole(UserRole.USER);
  }

  if (goalsLoading) {
    return (
      <>
        <CircularProgress />
      </>
    );
  }

  const smallWindowWidth = windowWidth < 1200;
  const googleDocWidth = smallWindowWidth ? '60%' : '55%';
  const chatButtonologyWidth = viewingAdmin
    ? '100%'
    : smallWindowWidth
    ? '40%'
    : '45%';
  const curActivity =
    previewingActivity && goalActivityState?.selectedActivity
      ? goalActivityState?.selectedActivity
      : undefined;
  return (
    <div style={{ height: '100%', display: 'flex', flexGrow: 1 }}>
      {!viewingAdmin && (
        <UserDocumentDisplay
          docId={docId}
          docUrl={docUrl}
          width={googleDocWidth}
          currentActivityId={goalActivityState?.selectedActivity?._id || ''}
        />
      )}

      <div
        style={{
          width: chatButtonologyWidth,
          maxWidth: chatButtonologyWidth,
        }}
      >
        {viewingAdmin ? (
          <ColumnCenterDiv
            style={{
              width: '100%',
              height: '100%',
            }}
          >
            <ColumnDiv
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <ActivityBuilderPage
                curActivity={
                  curActivity && isActivityBuilder(curActivity)
                    ? curActivity
                    : undefined
                }
                goToActivity={goToActivityPreview}
              />
            </ColumnDiv>
          </ColumnCenterDiv>
        ) : (
          <ChatActivity
            activityFromParams={activityFromParams}
            goalFromParams={goalFromParams}
            isNewDoc={isNewDoc}
            useWithPrompts={useWithPrompts}
            useCurrentGoalActivity={useCurrentGoalActivity}
            previewingActivity={previewingActivity}
            setPreviewingActivity={setPreviewingActivity}
          />
        )}
      </div>
      <SingleNotificationDialog
        open={state.warnExpiredAccessToken}
        title="Access Token Expired"
        notification="Your access token has expired. Please refresh the page or log in again."
      />
    </div>
  );
}
