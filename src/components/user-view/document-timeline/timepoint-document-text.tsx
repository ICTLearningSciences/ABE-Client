import React from 'react';
import { GQLTimelinePoint } from '../../../types';

export default function TimepointDocumentText(props: {
  timelinePoint: GQLTimelinePoint;
}): JSX.Element {
  const { timelinePoint } = props;
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
      <h3 style={{ textAlign: 'center' }}>{timelinePoint.version.title}</h3>
      <pre
        style={{
          fontFamily: 'Arial',
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word',
        }}
      >
        {timelinePoint.version.plainText}
      </pre>
    </div>
  );
}
