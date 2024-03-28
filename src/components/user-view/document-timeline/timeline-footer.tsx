import React from 'react';
import { GQLTimelinePoint } from '../../../types';
import { ColumnDiv, RowDiv } from '../../../styled-components';
import { formatISODateToReadable } from '../../../helpers';

export default function TimelineFooter(props: {
  timelinePoints: GQLTimelinePoint[];
  onSelectTimepoint: (timepoint: GQLTimelinePoint) => void;
  currentTimelinePoint?: GQLTimelinePoint;
}): JSX.Element {
  const { timelinePoints, currentTimelinePoint } = props;
  return (
    <RowDiv
      style={{
        width: '100%',
        height: '100%',
        justifyContent: 'space-around',
      }}
    >
      {/* <Chrono cardLess={true} disableToolbar={true}  /> */}
      {timelinePoints.map((timelinePoint, i) => {
        const isSelected =
          currentTimelinePoint?.versionTime === timelinePoint.versionTime;
        return (
          <ColumnDiv
            key={i}
            style={{
              alignItems: 'center',
            }}
          >
            <h4 style={{ padding: 0, margin: 0 }}>
              {formatISODateToReadable(timelinePoint.versionTime || '')}
            </h4>
            <div
              key={i}
              style={{
                width: 10,
                height: 10,
                borderRadius: 10,
                backgroundColor: 'black',
                margin: 5,
                cursor: isSelected ? 'default' : 'pointer',
                border: isSelected ? '4px solid lightblue' : '4px solid white',
              }}
              onClick={() => props.onSelectTimepoint(timelinePoint)}
            />
          </ColumnDiv>
        );
      })}
    </RowDiv>
  );
}
