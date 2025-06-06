import React, { RefObject, useEffect, useRef, useState } from 'react';
import { useWithDocumentTimeline } from '../../../hooks/use-with-document-timeline';
import { useAppSelector } from '../../../store/hooks';
import { Button, CircularProgress } from '@mui/material';
import { ColumnDiv, RowDiv } from '../../../styled-components';
import TimepointDocumentText from './timepoint-document-text';
import { TimepointOutline } from './timepoint-outline';
import TimelineFooter from './timeline-footer';
import { useWithUsersDocs } from '../../../hooks/use-with-users-docs';

export function DocumentTimelinePage(props: {
  returnToDocs: () => void;
  docIdFromParams: string;
}): JSX.Element {
  const { returnToDocs, docIdFromParams: docId } = props;
  const footerTimelineRef = useRef<HTMLElement | null>(null);
  const userId = useAppSelector((state) => state.login.user?._id);
  const [hasOverflowX, setHasOverflowX] = useState<boolean>(false);
  const { googleDocs, updateUserDoc } = useWithUsersDocs();
  const currentGoogleDoc = googleDocs.find((doc) => doc.googleDocId === docId);
  const {
    fetchDocumentTimeline,
    loadInProgress,
    documentTimeline,
    curTimelinePoint,
    errorMessage,
    selectTimelinePoint,
    saveTimelinePoint,
  } = useWithDocumentTimeline();

  useEffect(() => {
    if (userId && docId && !loadInProgress && !documentTimeline) {
      fetchDocumentTimeline(userId, docId);
    }
  }, [userId, docId]);

  if (errorMessage) {
    return (
      <div
        style={{
          height: '100%',
          display: 'flex',
          flexGrow: 1,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div>Error occured: {errorMessage.message}</div>
        <Button onClick={returnToDocs}>Return</Button>
      </div>
    );
  }

  if (!loadInProgress && !documentTimeline?.timelinePoints.length) {
    return (
      <div
        style={{
          height: '100%',
          display: 'flex',
          flexGrow: 1,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div>No History found.</div>
        <Button onClick={returnToDocs}>Return</Button>
      </div>
    );
  }
  if ((loadInProgress && !documentTimeline) || !curTimelinePoint) {
    return (
      <ColumnDiv
        style={{
          alignItems: 'center',
        }}
      >
        Generating History, this could take a bit...
        <CircularProgress
          style={{
            marginTop: 20,
          }}
        />
      </ColumnDiv>
    );
  }

  const timelinePoints = documentTimeline?.timelinePoints || [];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
      }}
    >
      <ColumnDiv
        style={{
          position: 'absolute',
          height: 'calc(100% - 10%)',
          width: '100%',
          top: 45,
        }}
      >
        <RowDiv
          style={{
            height: '90%',
            alignItems: 'flex-end',
            width: '100%',
          }}
        >
          <div
            style={{
              width: '50%',
              height: '100%',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
            }}
          >
            <TimepointDocumentText
              timelinePoint={curTimelinePoint}
              hasOverflowX={hasOverflowX}
            />
          </div>
          <div
            style={{
              width: '50%',
              height: '100%',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
            }}
          >
            <TimepointOutline
              timelinePoint={curTimelinePoint}
              hasOverflowX={hasOverflowX}
              googleDoc={currentGoogleDoc}
              saveTimelinePoint={saveTimelinePoint}
              updateUserDoc={updateUserDoc}
              timelineGenerationInProgress={loadInProgress}
            />
          </div>
        </RowDiv>
      </ColumnDiv>
      <TimelineFooter
        currentTimelinePoint={curTimelinePoint}
        timelinePoints={timelinePoints}
        onSelectTimepoint={selectTimelinePoint}
        footerTimelineRef={footerTimelineRef as RefObject<HTMLElement>}
        setHasOverflowX={setHasOverflowX}
      />
    </div>
  );
}
