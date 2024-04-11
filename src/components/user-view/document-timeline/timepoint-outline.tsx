import React, { useEffect, useRef, useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { formatISODateToReadable } from '../../../helpers';
import { GQLTimelinePoint, TimelinePointType } from '../../../types';
import { Box, Divider, Typography } from '@mui/material';

import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import moment from 'moment';
import {
  formatTimeDifference,
  formatTimeDifferenceToReadable,
} from '../../../helpers/functions';
import { useWithDocGoalsActivities } from '../../../store/slices/doc-goals-activities/use-with-doc-goals-activites';

const getIntentionText = (timelinePoint: GQLTimelinePoint): string => {
  if (timelinePoint.version?.sessionIntention?.description) {
    return timelinePoint.version?.sessionIntention?.description || '';
  } else if (timelinePoint.version?.dayIntention?.description) {
    return timelinePoint.version?.dayIntention?.description || '';
  } else if (timelinePoint.version?.documentIntention?.description) {
    return timelinePoint.version?.documentIntention?.description || '';
  }
  return 'No Intention text';
};

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

interface EvidenceObject {
  [key: string]: string[];
}

export default function TimepointOutline(props: {
  timelinePoint: GQLTimelinePoint;
}): JSX.Element {
  const { timelinePoint } = props;
  const [thesis, setThesis] = useState<boolean>(false);
  const [supportingClaims, setSupportingClaims] = useState<boolean>(false);
  const [claimEvidence, setClaimEvidence] = useState<boolean>(false);

  // if reverseOutline is not empty, parse the reverseOutline

  useEffect(() => {
    if (timelinePoint.reverseOutline === 'No outline available') return;

    const reverseOutlineParsed = JSON.parse(timelinePoint.reverseOutline);

    if (reverseOutlineParsed['Thesis Statement'] !== '') {
      setThesis(true);
    }
    if (reverseOutlineParsed['Supporting Claims'].length > 0) {
      setSupportingClaims(true);
    }
    if (reverseOutlineParsed['Evidence Given for Each Claim'].length > 0) {
      setClaimEvidence(true);
    }
  }, [timelinePoint]);

  function RevisionTimeHeader(props: { revisionTime: string }): JSX.Element {
    const { revisionTime } = props;

    const formatTime = formatTimeDifferenceToReadable(revisionTime);

    return (
      <Box className="revision-time-header" data-cy="revision-time-header">
        <Typography className={`text-2`} data-cy="revision-title">
          Revision:
        </Typography>
        <Typography className={`text-3`} data-cy="revision-date">
          {formatISODateToReadable(revisionTime)} ({formatTime})
        </Typography>
      </Box>
    );
  }

  function IntentionDisplay(props: {
    timelinePoint: GQLTimelinePoint;
  }): JSX.Element {
    const { timelinePoint } = props;
    const { getActivitById } = useWithDocGoalsActivities();
    const activityId = timelinePoint.version.activity;
    const activity = getActivitById(activityId);

    const { value, height, textareaRef, handleChange } = useDynamicHeight(
      getIntentionText(timelinePoint)
    );

    return (
      <Box className="input-container" data-cy="intention-container">
        <span className="input-wrapper">
          <div className="summary-title-container">
            <Typography className="text-2" data-cy="summary-title">
              Intention
            </Typography>
            <Typography className="text-3">({activity.title})</Typography>
          </div>
          <textarea
            ref={textareaRef}
            value={!value ? 'No Intention text ' : value}
            onChange={handleChange}
            className="summary-input"
            placeholder="Enter your text here..."
            style={{ height: height }}
            data-cy="intention-textarea"
          />
        </span>
      </Box>
    );
  }

  function SummaryDisplay(props: {
    timelinePoint: GQLTimelinePoint;
  }): JSX.Element {
    const { timelinePoint } = props;
    const { getActivitById } = useWithDocGoalsActivities();
    const activityId = timelinePoint.version.activity;
    const activity = getActivitById(activityId);

    const { value, height, textareaRef, handleChange } = useDynamicHeight(
      timelinePoint.changeSummary
    );

    return (
      <Box className="input-container" data-cy="summary-container">
        {timelinePoint.type !== TimelinePointType.START ? (
          <span className="input-wrapper">
            <div className="summary-title-container">
              <Typography className="text-2" data-cy="summary-title">
                Summary
              </Typography>
              <Typography className="text-3">({activity.title})</Typography>
            </div>

            <textarea
              ref={textareaRef}
              value={value}
              onChange={handleChange}
              className="summary-input"
              placeholder="Enter your text here..."
              style={{ height: height }}
              data-cy="summary-textarea"
            />
          </span>
        ) : undefined}
      </Box>
    );
  }

  function AIOutlineExpand(props: {
    title: string;
    outline: string[];
    fontType: string;
    open: boolean;
    dataCy: string;
    claimNumber?: number | undefined;
  }): JSX.Element {
    const { title, outline, fontType, open, claimNumber, dataCy } = props;
    const [expanded, setExpanded] = useState<boolean>(open);

    const toggleExpand = () => {
      setExpanded(!expanded);
    };

    return (
      <Box data-cy={`${dataCy}-container`}>
        <div className="claims-title" onClick={toggleExpand}>
          {fontType === 'bold' ? (
            <Typography
              className="text-3-bold"
              style={{ marginTop: 10, maxWidth: '90%' }}
              data-cy={`${dataCy}-title`}
            >
              {!claimNumber ? title : `${claimNumber}. ${title}`}
            </Typography>
          ) : (
            <Typography className="text-3" data-cy={`${dataCy}-title`}>
              {title}
            </Typography>
          )}

          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </div>

        <div
          className={`collapsable-claims supporting-claims-container ${
            expanded ? 'expanded' : 'collapsed'
          }`}
          data-cy={`${dataCy}-accordion`}
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
      </Box>
    );
  }
  function AIOutlineDisplay(props: { reverseOutline: string }): JSX.Element {
    const { reverseOutline } = props;
    const outline = JSON.parse(reverseOutline);

    return (
      <Box className="ai-outline-container" data-cy="ai-outline-container">
        {/* This code snippet is conditionally rendering a section for the Thesis Statement based on the
        value of the `thesis` state. If `thesis` is true, it will display a `div` element containing the
        following elements: */}
        {thesis ? (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography
                className="text-2"
                data-cy="ai-outline-statement-title"
              >
                Statement
              </Typography>

              <Typography className={`text-2-bubble ai-outline-bubble`}>
                AI Outline
              </Typography>
            </div>
            <Typography
              className="text-3"
              data-cy="ai-outline-statement-content"
            >
              {outline['Thesis Statement']}
            </Typography>
          </div>
        ) : null}

        {/* This code snippet is conditionally rendering the `AIOutlineExpand`
        component based on the value of the `supportingClaims` state. */}
        {supportingClaims ? (
          <AIOutlineExpand
            title="Supporting Claims"
            outline={outline['Supporting Claims']}
            fontType="bold"
            open={true}
            dataCy="supporting-claims"
          />
        ) : null}

        {/* This code snippet is conditionally rendering a section titled "Evidence Given for each Claim"
       based on the value of the `claimEvidence` state. */}
        {claimEvidence ? (
          <div>
            <Typography
              className="text-2"
              style={{ margin: '10px 5px 0px 0px' }}
              data-cy="claim-evidence-title"
            >
              Evidence Given for Each Claim
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
                    fontType="bold"
                    title={evidenceTitle}
                    outline={evidenceArray}
                    claimNumber={i + 1}
                    dataCy={`claim-evidence-${i + 1}`}
                  />
                );
              }
            )}
          </div>
        ) : null}
      </Box>
    );
  }

  return (
    <Box
      className="content-revision-container"
      data-cy="content-revision-container"
    >
      <RevisionTimeHeader revisionTime={timelinePoint.versionTime} />
      <Box
        className="right-content-container"
        data-cy="right-content-container"
      >
        <Divider className="divider" />
        <div style={{ marginRight: 10 }}>
          <IntentionDisplay timelinePoint={timelinePoint} />
        </div>
        <Divider className="divider" />
        <div style={{ marginRight: 10 }}>
          <SummaryDisplay timelinePoint={timelinePoint} />
        </div>
        <Divider className="divider" />
        {
          // if thesis, supporting claims, and claim evidence display
          thesis && supportingClaims && claimEvidence ? (
            <div style={{ marginRight: 10 }}>
              <AIOutlineDisplay reverseOutline={timelinePoint.reverseOutline} />
            </div>
          ) : (
            <Typography className="text-2" data-cy="no-ai-outline">
              No AI outline available
            </Typography>
          )
        }
      </Box>
    </Box>
  );
}
