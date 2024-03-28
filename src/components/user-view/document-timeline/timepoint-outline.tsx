import React from 'react';
import { formatISODateToReadable } from '../../../helpers';
import { GQLTimelinePoint, TimelinePointType } from '../../../types';

export default function TimepointOutline(props: {
  timelinePoint: GQLTimelinePoint;
}): JSX.Element {
  const { timelinePoint } = props;

  function RevisionTimeHeader(props: { revisionTime: string }): JSX.Element {
    const { revisionTime } = props;
    return (
      <span>
        <h3> Rev: {formatISODateToReadable(revisionTime)}</h3>
      </span>
    );
  }

  function IntentionDisplay(props: { intention: string }): JSX.Element {
    const { intention } = props;
    return (
      <span>
        <h3>Intention:</h3>
        <span
          style={{
            color: intention ? 'black' : 'gray',
          }}
        >
          {intention || 'No intention provided'}
        </span>
      </span>
    );
  }

  function AIOutlineDisplay(props: { reverseOutline: string }): JSX.Element {
    const { reverseOutline } = props;
    return (
      <span>
        <h3>AI Outline:</h3>
        <pre
          style={{
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word',
          }}
        >
          {reverseOutline}
        </pre>
      </span>
    );
  }

  return (
    <div
      style={{
        // height:"90%",
        width: '90%',
        overflow: 'auto',
        overflowWrap: 'break-word',
        margin: '10px',
        padding: '10px',
        marginBottom: 0,
        border: '1px solid black',
        boxShadow: '0px 0px 3px 0px rgba(0,0,0,0.75)',
      }}
    >
      <RevisionTimeHeader revisionTime={timelinePoint.versionTime} />
      <IntentionDisplay intention={timelinePoint.intent} />
      {timelinePoint.type !== TimelinePointType.START ? (
        <span>
          <h3>Summary:</h3> {timelinePoint.changeSummary}
        </span>
      ) : undefined}
      {/* <span><h3>Related Feedback:</h3> {timelinePoint.relatedFeedback}</span> */}
      <AIOutlineDisplay reverseOutline={timelinePoint.reverseOutline} />
    </div>
  );
}
