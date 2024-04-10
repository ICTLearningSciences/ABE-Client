import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { formatISODateToReadable } from '../../../helpers';
import { GQLTimelinePoint, TimelinePointType } from '../../../types';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Divider,
  Input,
  Paper,
  TextField,
  Typography,
} from '@mui/material';

import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

interface EvidenceObject {
  [key: string]: string[];
}

export default function TimepointOutline(props: {
  timelinePoint: GQLTimelinePoint;
}): JSX.Element {
  const { timelinePoint } = props;

  function RevisionTimeHeader(props: { revisionTime: string }): JSX.Element {
    const { revisionTime } = props;
    return (
      <Box className="revision-time-header">
        <Typography className={`text-2`}>Revision: </Typography>
        <Typography className={`text-3`}>
          {formatISODateToReadable(revisionTime)}
        </Typography>
      </Box>
    );
  }

  const useDynamicHeight = (initialValue: string) => {
    const [value, setValue] = useState(initialValue);
    const [height, setHeight] = useState('auto');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setValue(event.target.value);
    };

    useEffect(() => {
      if (textareaRef.current) {
        const { scrollHeight, clientHeight } = textareaRef.current;
        const newHeight = `${scrollHeight}px`;
        // If the content is removed and scrollHeight decreases, resize the textarea to a smaller height
        if (newHeight < height) {
          setHeight(newHeight);
        } else if (scrollHeight !== clientHeight) {
          // If the content is added and scrollHeight increases, resize the textarea to a larger height
          setHeight(newHeight);
        }
      }
    }, [value]);

    return { value, height, textareaRef, handleChange };
  };

  function IntentionDisplay(props: {
    timelinePoint: GQLTimelinePoint;
  }): JSX.Element {
    const { timelinePoint } = props;
    const { value, height, textareaRef, handleChange } = useDynamicHeight(
      timelinePoint.intent
    );

    return (
      <Box className="input-container">
        <span className="input-wrapper">
          <Typography className={`text-2`}>Intention</Typography>
          <textarea
            ref={textareaRef}
            value={!value ? 'No Intention text ' : value}
            onChange={handleChange}
            className="summary-input"
            placeholder="Enter your text here..."
            style={{ height: height }}
          />
        </span>
      </Box>
    );
  }

  function SummaryDisplay(props: {
    timelinePoint: GQLTimelinePoint;
  }): JSX.Element {
    const { timelinePoint } = props;

    const { value, height, textareaRef, handleChange } = useDynamicHeight(
      timelinePoint.changeSummary
    );

    return (
      <Box className="input-container">
        {timelinePoint.type !== TimelinePointType.START ? (
          <span className="input-wrapper">
            <Typography className="text-2"> Summary </Typography>
            <textarea
              ref={textareaRef}
              value={value}
              onChange={handleChange}
              className="summary-input"
              placeholder="Enter your text here..."
              style={{ height: height }}
            />
          </span>
        ) : undefined}
      </Box>
    );
  }

  function AIOutlineExpand(props: {
    title: string;
    outline: string[];
    type: string;
    open: boolean;
    claimNumber?: number | undefined;
  }): JSX.Element {
    const { title, outline, type, open, claimNumber } = props;
    const [expanded, setExpanded] = useState<boolean>(open);

    const toggleExpand = () => {
      setExpanded(!expanded);
    };

    return (
      <div>
        <div className="claims-title" onClick={toggleExpand}>
          {type === 'bold' ? (
            <Typography
              className="text-3-bold"
              style={{ marginTop: 10, maxWidth: '90%' }}
            >
              {!claimNumber ? title : `${claimNumber}. ${title}`}
            </Typography>
          ) : (
            <Typography className="text-3">{title}</Typography>
          )}

          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </div>

        <div
          className={`collapsable-claims supporting-claims-container ${
            expanded ? 'expanded' : 'collapsed'
          }`}
        >
          {outline.map((claim: string, i: number) => {
            return (
              <Box key={i} className="list-container">
                <FiberManualRecordIcon className="bulletpoint-icon" />
                <Typography key={i} className="text-3-list">
                  {claim}
                </Typography>
              </Box>
            );
          })}
        </div>
      </div>
    );
  }
  function AIOutlineDisplay(props: { reverseOutline: string }): JSX.Element {
    const { reverseOutline } = props;
    const outline = JSON.parse(reverseOutline);

    return (
      <Box className="ai-outline-container">
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography className="text-2">Statement</Typography>

            <Typography className={`text-2-bubble ai-outline-bubble`}>
              AI Outline
            </Typography>
          </div>
          <Typography className="text-3">
            {outline['Thesis Statement']}
          </Typography>
        </div>

        <AIOutlineExpand
          title="Supporting Claims"
          outline={outline['Supporting Claims']}
          type="bold"
          open={true}
        />

        <div>
          <Typography className="text-2" style={{ margin: '10px 5px 0px 0px' }}>
            Evidence Given for each Claim
          </Typography>
          {outline['Evidence Given for Each Claim'].map(
            (evidence: EvidenceObject, i: number) => {
              const keys = Object.keys(evidence);
              const claimKey = keys[0];
              const evidenceKey = keys[1];
              const evidenceArray = evidence[evidenceKey];
              const evidenceTitle = evidence[claimKey] as unknown as string;

              return (
                <AIOutlineExpand
                  open={true}
                  key={i}
                  type="bold"
                  title={evidenceTitle}
                  outline={evidenceArray}
                  claimNumber={i + 1}
                />
              );
            }
          )}
        </div>

        <pre
          style={{
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word',
          }}
        >
          {/* {reverseOutline} */}
        </pre>
      </Box>
    );
  }

  return (
    <Box className="content-revision-container">
      <RevisionTimeHeader revisionTime={timelinePoint.versionTime} />
      <Box className="right-content-container">
        <Divider className="divider" />
        <div style={{ marginRight: 10 }}>
          <IntentionDisplay timelinePoint={timelinePoint} />
        </div>
        <Divider className="divider" />
        <div style={{ marginRight: 10 }}>
          <SummaryDisplay timelinePoint={timelinePoint} />
        </div>
        <Divider className="divider" />
        <div style={{ marginRight: 10 }}>
          <AIOutlineDisplay reverseOutline={timelinePoint.reverseOutline} />
        </div>
      </Box>
    </Box>
  );
}
