import React, { useEffect, useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import {
  Box,
  CircularProgress,
  Divider,
  IconButton,
  Input,
  Typography,
} from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { motion } from 'framer-motion';

import ActivityTranscript from './ActivityTranscript';
import { formatISODateToReadable } from '../../../helpers';
import { GQLTimelinePoint, TimelinePointType } from '../../../types';
import {
  formatTimeDifferenceToReadable,
  getIntentionText,
} from '../../../helpers/functions';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import '../../../styles/content-revision.css';
import '../../../styles/activity-transcript.css';

interface EvidenceObject {
  [key: string]: string[];
}

export default function TimepointOutline(props: {
  timelinePoint: GQLTimelinePoint;
  hasOverflowX: boolean;
  saveTimelinePoint: (timelinePoint: GQLTimelinePoint) => Promise<void>;
}): JSX.Element {
  const { timelinePoint, hasOverflowX } = props;

  const [thesis, setThesis] = useState<boolean>(false);
  const [supportingClaims, setSupportingClaims] = useState<boolean>(false);
  const [claimEvidence, setClaimEvidence] = useState<boolean>(false);
  const [aiOutline, setAIOutline] = useState<boolean>(false);

  /* The above code is a `useEffect` hook in a TypeScript React component. It checks if the
 `timelinePoint.reverseOutline` is not equal to 'No outline available'. If it is not, it parses the
 `reverseOutline` JSON data and checks if there is a 'Thesis Statement', 'Supporting Claims', and
 'Evidence Given for Each Claim' in the parsed data. */
  useEffect(() => {
    if (timelinePoint.reverseOutline === 'No outline available') return;

    const reverseOutlineParsed = JSON.parse(timelinePoint.reverseOutline);
    setAIOutline(true);

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

  /* The above code defines a functional component named AIOutlineExpand in TypeScript for a React
  application. This component takes in props including title, outline, fontType, open, dataCy, and
  optional claimNumber. It renders a collapsible section with a title and a list of items. Clicking
  on the title toggles the visibility of the list. The component uses Material-UI components like
  Typography, Box, ExpandLessIcon, and ExpandMoreIcon to achieve this functionality. */
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
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 100 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
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
      </motion.div>
    );
  }

  /**
   * The `RevisionTimeHeader` function displays the revision time in a readable format within a React
   * component.
   * @param props - The `RevisionTimeHeader` component takes a single prop `revisionTime`, which is a
   * string representing the time of the revision. This prop is used to display information about the
   * revision time in a formatted way within the component.
   * @returns The `RevisionTimeHeader` component is being returned, which consists of a Box containing
   * two Typography components. The first Typography component displays "Revision:" and the second
   * Typography component displays the formatted revision date and time difference.
   */
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

  /* The above code is a TypeScript React component called `IntentionDisplay`. It takes in a prop
  `timelinePoint` which is of type `GQLTimelinePoint`. Inside the component, it retrieves an
  activity based on the `activityId` from the `timelinePoint` using a custom hook
  `useWithDocGoalsActivities`. It then uses another custom hook `useDynamicHeight` to manage the
  height of a textarea based on the content. */
  function IntentionDisplay(props: {
    timelinePoint: GQLTimelinePoint;
    saveTimelinePoint: (timelinePoint: GQLTimelinePoint) => Promise<void>;
  }): JSX.Element {
    const { timelinePoint, saveTimelinePoint } = props;
    const intentionText = getIntentionText(timelinePoint);
    const [editedInentionText, setEditedIntentionText] =
      useState(intentionText);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
      setEditedIntentionText(intentionText);
    }, [timelinePoint]);

    return (
      <Box className="input-container" data-cy="intention-container">
        <span className="input-wrapper">
          <div className="summary-title-container">
            <Typography className="text-2" data-cy="intention-title">
              Intention
            </Typography>
            <ActivityTranscript
              chatLog={timelinePoint.version.chatLog}
              activityId={timelinePoint.version.activity}
            />
          </div>

          <Input
            value={editedInentionText}
            disableUnderline
            endAdornment={
              editedInentionText !== intentionText ? (
                <IconButton
                  onClick={() => {
                    setSaving(true);
                    const updatedTimelinePoint: GQLTimelinePoint = {
                      ...timelinePoint,
                      version: {
                        ...timelinePoint.version,
                        sessionIntention: {
                          ...timelinePoint.version.sessionIntention,
                          description: editedInentionText,
                        },
                      },
                    };
                    saveTimelinePoint(updatedTimelinePoint).finally(() => {
                      setSaving(false);
                    });
                  }}
                >
                  {saving ? (
                    <CircularProgress />
                  ) : (
                    <SaveAsIcon className="save-icon" />
                  )}
                </IconButton>
              ) : undefined
            }
            multiline
            maxRows={4}
            className="summary-input"
            placeholder="Enter your text here..."
            data-cy="intention-textarea"
            onChange={(e) => setEditedIntentionText(e.target.value)}
          />
        </span>
      </Box>
    );
  }

  /* The above code is a TypeScript React component called `SummaryDisplay` that displays a summary input
field based on the provided `timelinePoint` prop. It uses hooks like `useWithDocGoalsActivities` and
`useDynamicHeight` to manage state and behavior of the input field. It also retrieves the
corresponding activity based on the `activityId` from the `timelinePoint`. The summary input field
is conditionally rendered based on the type of `timelinePoint`, and it allows users to enter text
and dynamically adjust the height of the input field. */

  function SummaryDisplay(props: {
    timelinePoint: GQLTimelinePoint;
    saveTimelinePoint: (timelinePoint: GQLTimelinePoint) => Promise<void>;
  }): JSX.Element {
    const { timelinePoint, saveTimelinePoint } = props;
    const targetSummary =
      timelinePoint.userInputSummary || timelinePoint.changeSummary;
    const [editedChangeSummary, setEditedChangeSummary] = useState(
      JSON.parse(JSON.stringify(targetSummary))
    );
    const [saving, setSaving] = useState(false);

    return (
      <Box className="input-container" data-cy="summary-container">
        {timelinePoint.type !== TimelinePointType.INTRO ? (
          <span className="input-wrapper">
            <div className="summary-title-container">
              <Typography className="text-2" data-cy="summary-title">
                Summary
              </Typography>
              <ActivityTranscript
                chatLog={timelinePoint.version.chatLog}
                activityId={timelinePoint.version.activity}
              />
            </div>

            <Input
              value={editedChangeSummary}
              disableUnderline
              multiline
              endAdornment={
                editedChangeSummary !== targetSummary ? (
                  <IconButton
                    onClick={() => {
                      setSaving(true);
                      const updatedTimelinePoint = {
                        ...timelinePoint,
                        userInputSummary: editedChangeSummary,
                      };
                      saveTimelinePoint(updatedTimelinePoint).finally(() => {
                        setSaving(false);
                      });
                    }}
                  >
                    {saving ? (
                      <CircularProgress />
                    ) : (
                      <SaveAsIcon className="save-icon" />
                    )}
                  </IconButton>
                ) : undefined
              }
              maxRows={4}
              className="summary-input"
              placeholder="Enter your text here..."
              onChange={(e) => setEditedChangeSummary(e.target.value)}
              data-cy="summary-textarea"
            />
          </span>
        ) : undefined}
      </Box>
    );
  }

  /* The above code is a TypeScript React component named `AIOutlineDisplay` that takes in a prop
  `reverseOutline` and renders different sections based on the values of certain states (`thesis`,
  `supportingClaims`, `claimEvidence`). Here's a breakdown of what the code is doing: */
  function AIOutlineDisplay(props: { reverseOutline: string }): JSX.Element {
    const { reverseOutline } = props;
    if (reverseOutline === 'No outline available')
      return (
        <Typography className="text-2" data-cy="no-ai-outline">
          No AI outline available
        </Typography>
      );

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
                Thesis
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
                    key={i}
                    open={true}
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
      className={
        hasOverflowX
          ? 'content-revision-container-scroll'
          : 'content-revision-container'
      }
      data-cy="content-revision-container"
    >
      <RevisionTimeHeader revisionTime={timelinePoint.versionTime} />
      <Box
        className={
          hasOverflowX
            ? 'right-content-container-scroll'
            : 'right-content-container'
        }
        data-cy="right-content-container"
      >
        <Divider className="divider" />
        <div style={{ marginRight: 10 }}>
          <IntentionDisplay
            timelinePoint={timelinePoint}
            saveTimelinePoint={props.saveTimelinePoint}
          />
        </div>
        <Divider className="divider" />
        <div style={{ marginRight: 10 }}>
          <SummaryDisplay
            timelinePoint={timelinePoint}
            saveTimelinePoint={props.saveTimelinePoint}
          />
        </div>
        <Divider className="divider" />
        {/* The above code is conditionally rendering an AIOutlineDisplay component based on the
        presence of values in the variables thesis, supportingClaims, and claimEvidence. If all
        three variables have values, the AIOutlineDisplay component is rendered with a specific
        style. If any of the variables is missing a value, a Typography component displaying "No AI
        outline available" is rendered instead. */}
        {
          // if thesis, supporting claims, and claim evidence display
          thesis && supportingClaims && claimEvidence && aiOutline ? (
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
