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

function DocumentTimelinePage(): JSX.Element {
  const footerTimelineRef = useRef<HTMLElement | null>(null);
  const userId = useAppSelector((state) => state.login.user?._id);
  const { docId } = useParams<Record<string, string>>();
  const [hasOverflowX, setHasOverflowX] = useState<boolean>(false);

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
    return <CircularProgress />;
  }

  const timelinePoints = documentTimeline.timelinePoints;


  return (
    <ColumnDiv style={{ position: 'relative', height: '100%', width: '100%' }}>
      <RowDiv
        style={{
          height: '93%',
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
            saveTimelinePoint={saveTimelinePoint}
          />
        </div>
      </RowDiv>
      <div
        className={hasOverflowX ? 'footer-timeline-scroll' : 'footer-timeline'}
        data-cy="footer-timeline"
      >
        <TimelineFooter
          currentTimelinePoint={curTimelinePoint}
          timelinePoints={timelinePoints}
          onSelectTimepoint={selectTimelinePoint}
          footerTimelineRef={footerTimelineRef as RefObject<HTMLElement>}
          setHasOverflowX={setHasOverflowX}
        />
      </div>
    </ColumnDiv>
  );
}

export default withAuthorizationOnly(DocumentTimelinePage);
