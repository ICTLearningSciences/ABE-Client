import React, { useState } from 'react';
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
  const [summaryText, setSummaryText] = useState<string>(
    timelinePoint.changeSummary
  );
  const [intentionText, setIntentionText] = useState<string>(
    timelinePoint.intent
  );

  const onSummaryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSummaryText(event.target.value);
  };

  const onIntentionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIntentionText(event.target.value);
  };

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

  function IntentionDisplay(): JSX.Element {
    return (
      <Box>
        <Typography className={`text-2`}>Intention</Typography>
        <Input
          defaultValue={!intentionText ? 'No Intention text ' : intentionText}
          value={intentionText}
          className="summary-input"
          minRows={1}
          maxRows={10}
          multiline={true}
          onChange={onIntentionChange}
          disableUnderline
        />
      </Box>
    );
  }

  function SummaryDisplay(props: {
    timelinePoint: GQLTimelinePoint;
  }): JSX.Element {
    const { timelinePoint } = props;
    return (
      <Box>
        {timelinePoint.type !== TimelinePointType.START ? (
          <span>
            <Typography className="text-2"> Summary </Typography>
            <Input
              value={summaryText}
              className="summary-input"
              minRows={1}
              maxRows={10}
              multiline={true}
              onChange={onSummaryChange}
              disableUnderline
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

        <IntentionDisplay />
        <Divider className="divider" />

        <SummaryDisplay timelinePoint={timelinePoint} />
        <Divider className="divider" />

        <AIOutlineDisplay reverseOutline={timelinePoint.reverseOutline} />
      </Box>
    </Box>
  );
}
