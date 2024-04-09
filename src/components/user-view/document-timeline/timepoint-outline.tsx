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

  const onSummaryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSummaryText(event.target.value);
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

  function IntentionDisplay(props: { intention: string }): JSX.Element {
    const { intention } = props;
    return (
      <Box>
        <Typography className={`text-2`}>Intention</Typography>
        {intention ? (
          <TextField
            id="standard-basic"
            value={intention}
            label="Standard"
            variant="standard"
          />
        ) : (
          <Typography className={`text-3-disable`}>
            {'No intention provided'}
          </Typography>
        )}
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
              minRows={3}
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

  function AIOutlineAccordion(props: {
    title: string;
    outline: string[];
    type: string;
    open: boolean;
    claim?: string;
  }): JSX.Element {
    const { title, outline, type, claim, open } = props;

    const bold = (
      <Box>
        <Typography className="text-3">
          <b>{claim}</b>
        </Typography>
        <Typography className="text-3">{title}</Typography>
      </Box>
    );
    return (
      <Box className="content-revision-accordion">
        <Accordion defaultExpanded={open}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            {type === 'bold' ? (
              bold
            ) : (
              <Typography className="text-3-bold">{title}</Typography>
            )}
          </AccordionSummary>
          <AccordionDetails>
            {outline.map((claim: string, i: number) => {
              return (
                <Typography key={i} className="text-3-list">
                  - {claim}
                </Typography>
              );
            })}
          </AccordionDetails>
        </Accordion>
      </Box>
    );
  }
  function AIOutlineDisplay(props: { reverseOutline: string }): JSX.Element {
    const { reverseOutline } = props;
    const outline = JSON.parse(reverseOutline);

    return (
      <Box className="ai-outline-container">
        <div>
          <Typography className="text-2" style={{ marginTop: 10 }}>
            Thesis Statement
          </Typography>
          <Typography className="text-3">
            {outline['Thesis Statement']}
          </Typography>
        </div>

        <div>
          <AIOutlineAccordion
            title="Supporting Claims"
            outline={outline['Supporting Claims']}
            type="no-bold"
            open={true}
          />
          <Typography className="text-2" style={{ margin: '10px 0px' }}>
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
                <AIOutlineAccordion
                  open={false}
                  key={i}
                  type="bold"
                  claim={claimKey}
                  // use the first key as the title
                  title={evidenceTitle}
                  outline={evidenceArray} // Fix: Convert the expression to 'unknown'
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
      <IntentionDisplay intention={timelinePoint.intent} />
      <SummaryDisplay timelinePoint={timelinePoint} />
      <Typography className="text-2" style={{ marginBottom: 10 }}>
        AI Outline
      </Typography>
      <Divider className="divider" />

      <AIOutlineDisplay reverseOutline={timelinePoint.reverseOutline} />
    </Box>
  );
}
