import React, { RefObject, useEffect, useRef, useState } from 'react';
import { useWithDocumentTimeline } from '../../../hooks/use-with-document-timeline';
import { useAppSelector } from '../../../store/hooks';
import { Button, CircularProgress } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { ColumnDiv, RowDiv } from '../../../styled-components';
import TimepointDocumentText from './timepoint-document-text';
import TimepointOutline from './timepoint-outline';
import TimelineFooter from './timeline-footer';
import withAuthorizationOnly from '../../../hooks/wrap-with-authorization-only';
import { UseWithGoogleDocs } from '../../../hooks/use-with-google-docs';

function DocumentTimelinePage(): JSX.Element {
  const footerTimelineRef = useRef<HTMLElement | null>(null);
  const userId = useAppSelector((state) => state.login.user?._id);
  const { docId } = useParams<Record<string, string>>();
  const [hasOverflowX, setHasOverflowX] = useState<boolean>(false);
  const { googleDocs, updateGoogleDoc } = UseWithGoogleDocs();
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
  const navigate = useNavigate();

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
        <Button onClick={() => navigate('/docs')}>Return</Button>
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
        <Button onClick={() => navigate('/docs')}>Return</Button>
      </div>
    );
  }

  if (!documentTimeline || !curTimelinePoint || loadInProgress) {
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

  const timelinePoints = documentTimeline.timelinePoints;

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
              updateGoogleDoc={updateGoogleDoc}
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

export default withAuthorizationOnly(DocumentTimelinePage);
