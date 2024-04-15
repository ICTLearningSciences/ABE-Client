import React, { useEffect, useRef, useState } from 'react';
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
  const userId = useAppSelector((state) => state.login.user?._id);
  const { docId } = useParams<Record<string, string>>();
  const footerTimelineRef = useRef<HTMLDivElement>(null);
  const {
    fetchDocumentTimeline,
    loadInProgress,
    documentTimeline,
    curTimelinePoint,
    errorMessage,
    selectTimelinePoint,
  } = useWithDocumentTimeline();
  const navigate = useNavigate();

  const [hasOverflowX, setHasOverflowX] = useState<boolean>(false);

  useEffect(() => {
    if (userId && docId && !loadInProgress && !documentTimeline) {
      fetchDocumentTimeline(userId, docId);
    }
  }, [userId, docId]);

  useEffect(() => {
    const footerTimelineElement = footerTimelineRef?.current;
    if (footerTimelineElement) {
      const hasOverflow =
        footerTimelineElement.scrollWidth > footerTimelineElement.clientWidth;
      setHasOverflowX(hasOverflow);
    }
  }, []);

  if (!documentTimeline || !curTimelinePoint || loadInProgress) {
    return <CircularProgress />;
  }

  const timelinePoints = documentTimeline.timelinePoints;

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
        <div>{errorMessage.message}</div>
        <Button onClick={() => navigate('/')}>Return</Button>
      </div>
    );
  }

  if (!documentTimeline.timelinePoints.length) {
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
        <div>No History found</div>
        <Button onClick={() => navigate('/')}>Return</Button>
      </div>
    );
  }

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
          />
        </div>
      </RowDiv>
      <div
        className={hasOverflowX ? 'footer-timeline-scroll' : 'footer-timeline'}
        ref={footerTimelineRef}
        data-cy="footer-timeline"
      >
        <TimelineFooter
          currentTimelinePoint={curTimelinePoint}
          timelinePoints={timelinePoints}
          onSelectTimepoint={selectTimelinePoint}
        />
      </div>
    </ColumnDiv>
  );
}

export default withAuthorizationOnly(DocumentTimelinePage);
