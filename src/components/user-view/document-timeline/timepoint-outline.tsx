import React, { useEffect, useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { Box, CircularProgress, IconButton, Typography } from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { motion } from 'framer-motion';

import ActivityTranscript from './ActivityTranscript';
import { equals, formatISODateToReadable } from '../../../helpers';
import {
  GQLTimelinePoint,
  UserDoc,
  AiGenerationStatus,
  StoreUserDoc,
  TimelinePointType,
} from '../../../types';
import {
  formatTimeDifferenceToReadable,
  getIntentionText,
} from '../../../helpers/functions';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import {
  AIOutlineContainer,
  ContentBg,
  ContentContainer,
  ContentRevisionContainer,
  ContentRevisionTextColor2,
  ContentRevisionTextColor3,
  InputContainer,
  InputWrapper,
  RevisionTimeHeaderBox,
  StyledDivider,
  SummaryInput,
  SummaryTitleContainer,
  SupportingClaimsContainer,
  Text2Styles,
  Text2Typography,
  Text3,
  Text3Bold,
  Text3List,
} from '../../../styles/content-revision-styles';

interface EvidenceObject {
  [key: string]: string[];
}

export const TimepointOutline = React.memo(
  function TimepointOutline(props: {
    timelinePoint: GQLTimelinePoint;
    timelineGenerationInProgress: boolean;
    googleDoc?: UserDoc;
    hasOverflowX: boolean;
    saveTimelinePoint: (timelinePoint: GQLTimelinePoint) => Promise<void>;
    updateUserDoc: (googleDoc: StoreUserDoc) => Promise<UserDoc>;
  }): JSX.Element {
    const {
      timelinePoint,
      hasOverflowX,
      googleDoc,
      updateUserDoc,
      timelineGenerationInProgress,
    } = props;

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

      try {
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
      } catch (e) {
        console.error('Error parsing reverse outline', e);
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
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
              }}
              onClick={toggleExpand}
            >
              {fontType === 'bold' ? (
                <Text3Bold
                  style={{ marginTop: 10, maxWidth: '90%' }}
                  data-cy={`${dataCy}-title`}
                >
                  {!claimNumber ? title : `${claimNumber}. ${title}`}
                </Text3Bold>
              ) : (
                <Text3 data-cy={`${dataCy}-title`}>{title}</Text3>
              )}

              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </div>

            <SupportingClaimsContainer
              collapsed={!expanded}
              className={expanded ? 'expanded' : 'collapsed'}
              data-cy={`${dataCy}-accordion`}
            >
              {outline.map((claim: string, i: number) => {
                return (
                  <Box
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginLeft: '10px',
                    }}
                  >
                    <FiberManualRecordIcon
                      sx={{
                        fontSize: '0.5rem !important',
                        color: ContentRevisionTextColor3,
                      }}
                    />
                    <Text3List key={i}>{claim}</Text3List>
                  </Box>
                );
              })}
            </SupportingClaimsContainer>
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
        <RevisionTimeHeaderBox data-cy="revision-time-header">
          <Text2Typography data-cy="revision-title">Revision:</Text2Typography>
          <Text3 data-cy="revision-date">
            {formatISODateToReadable(revisionTime)} ({formatTime})
          </Text3>
        </RevisionTimeHeaderBox>
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
        <InputContainer data-cy="intention-container">
          <InputWrapper>
            <SummaryTitleContainer>
              <Text2Typography data-cy="intention-title">
                Intention
              </Text2Typography>
            </SummaryTitleContainer>

            <SummaryInput
              value={editedInentionText}
              disableUnderline
              disabled={
                timelinePoint.type === TimelinePointType.INTRO ||
                timelineGenerationInProgress
              }
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
              placeholder="Enter your text here..."
              data-cy="intention-textarea"
              onChange={(e) => setEditedIntentionText(e.target.value)}
            />
          </InputWrapper>
        </InputContainer>
      );
    }

    function AssignmentDescriptionDisplay(props: {
      assignmentDescription: string;
      saveTimelineDescription: (description: string) => Promise<void>;
    }): JSX.Element {
      const { assignmentDescription, saveTimelineDescription } = props;
      const [editedAssignmentDescription, setEditedAssignmentDescription] =
        useState(assignmentDescription);
      const [saving, setSaving] = useState(false);

      useEffect(() => {
        setEditedAssignmentDescription(assignmentDescription);
      }, [assignmentDescription]);

      return (
        <InputContainer data-cy="assignment-container">
          <InputWrapper>
            <div className="assignment-description-container">
              <Text2Typography data-cy="assignment-description">
                Assignment Description
              </Text2Typography>
            </div>

            <SummaryInput
              value={editedAssignmentDescription}
              disableUnderline
              disabled={
                timelinePoint.type === TimelinePointType.INTRO ||
                timelineGenerationInProgress
              }
              endAdornment={
                editedAssignmentDescription !== assignmentDescription ? (
                  <IconButton
                    onClick={() => {
                      setSaving(true);
                      saveTimelineDescription(
                        editedAssignmentDescription
                      ).finally(() => {
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
              placeholder="Enter your assignment description here..."
              data-cy="assignment-textarea"
              onChange={(e) => setEditedAssignmentDescription(e.target.value)}
            />
          </InputWrapper>
        </InputContainer>
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

      if (
        timelinePoint.changeSummaryStatus === AiGenerationStatus.IN_PROGRESS
      ) {
        return (
          <AIOutlineContainer
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Text2Typography data-cy="ai-summary-in-progress">
              Generating AI Summary...
            </Text2Typography>
            <CircularProgress
              style={{
                alignSelf: 'center',
                justifySelf: 'center',
              }}
            />
          </AIOutlineContainer>
        );
      }

      return (
        <InputContainer data-cy="summary-container">
          {timelinePoint.type !== TimelinePointType.INTRO ? (
            <InputWrapper>
              <StyledDivider />

              <SummaryTitleContainer>
                <Text2Typography data-cy="summary-title">
                  Summary
                </Text2Typography>
                <ActivityTranscript
                  chatLog={timelinePoint.version.chatLog}
                  activityId={timelinePoint.version.activity}
                />
              </SummaryTitleContainer>

              <SummaryInput
                value={editedChangeSummary}
                disableUnderline
                multiline
                disabled={timelineGenerationInProgress}
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
                placeholder="Enter your text here..."
                onChange={(e) => setEditedChangeSummary(e.target.value)}
                data-cy="summary-textarea"
              />
            </InputWrapper>
          ) : undefined}
        </InputContainer>
      );
    }

    /* The above code is a TypeScript React component named `AIOutlineDisplay` that takes in a prop
  `reverseOutline` and renders different sections based on the values of certain states (`thesis`,
  `supportingClaims`, `claimEvidence`). Here's a breakdown of what the code is doing: */
    function AIOutlineDisplay(props: { reverseOutline: string }): JSX.Element {
      const { reverseOutline } = props;

      if (reverseOutline === 'No outline available')
        return (
          <Text2Typography data-cy="no-ai-outline">
            No AI outline available
          </Text2Typography>
        );

      const outline = JSON.parse(reverseOutline);

      return (
        <AIOutlineContainer data-cy="ai-outline-container">
          {/* This code snippet is conditionally rendering a section for the Thesis Statement based on the
        value of the `thesis` state. If `thesis` is true, it will display a `div` element containing the
        following elements: */}
          {thesis ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text2Typography data-cy="ai-outline-statement-title">
                  Thesis
                </Text2Typography>

                <Typography
                  style={{
                    ...Text2Styles,
                    color: ContentBg,
                    borderRadius: 5,
                    padding: '0px 10px',
                    backgroundColor: ContentRevisionTextColor2,
                  }}
                >
                  AI Outline
                </Typography>
              </div>
              <Text3 data-cy="ai-outline-statement-content">
                {outline['Thesis Statement']}
              </Text3>
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
              <Text2Typography
                style={{ margin: '10px 5px 0px 0px' }}
                data-cy="claim-evidence-title"
              >
                Evidence Given for Each Claim
              </Text2Typography>
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
        </AIOutlineContainer>
      );
    }

    return (
      <ContentRevisionContainer
        hasOverflowX={hasOverflowX}
        data-cy="content-revision-container"
      >
        <RevisionTimeHeader revisionTime={timelinePoint.versionTime} />
        <ContentContainer
          hasOverflowX={hasOverflowX}
          data-cy="right-content-container"
        >
          <div style={{ marginRight: 10 }}>
            <StyledDivider />
            <AssignmentDescriptionDisplay
              assignmentDescription={googleDoc?.assignmentDescription || ''}
              saveTimelineDescription={async (description: string) => {
                if (!googleDoc) return;
                const updatedGoogleDoc = {
                  user: googleDoc.user,
                  googleDocId: googleDoc.googleDocId,
                  assignmentDescription: description,
                };
                await updateUserDoc(updatedGoogleDoc);
              }}
            />
          </div>
          <StyledDivider />
          <div style={{ marginRight: 10 }}>
            <IntentionDisplay
              timelinePoint={timelinePoint}
              saveTimelinePoint={props.saveTimelinePoint}
            />
          </div>
          <div style={{ marginRight: 10 }}>
            <SummaryDisplay
              timelinePoint={timelinePoint}
              saveTimelinePoint={props.saveTimelinePoint}
            />
          </div>
          <StyledDivider />
          {/* The above code is conditionally rendering an AIOutlineDisplay component based on the
        presence of values in the variables thesis, supportingClaims, and claimEvidence. If all
        three variables have values, the AIOutlineDisplay component is rendered with a specific
        style. If any of the variables is missing a value, a Typography component displaying "No AI
        outline available" is rendered instead. */}

          {
            // if thesis, supporting claims, and claim evidence display
            thesis &&
            supportingClaims &&
            claimEvidence &&
            aiOutline &&
            timelinePoint.reverseOutlineStatus ===
              AiGenerationStatus.COMPLETED &&
            timelinePoint.type !== TimelinePointType.INTRO ? (
              <div style={{ marginRight: 10 }}>
                <AIOutlineDisplay
                  reverseOutline={timelinePoint.reverseOutline}
                />
              </div>
            ) : timelinePoint.reverseOutlineStatus ===
              AiGenerationStatus.COMPLETED ? (
              <Text2Typography data-cy="no-ai-outline">
                No AI outline available
              </Text2Typography>
            ) : (
              <AIOutlineContainer
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  marginRight: 10,
                }}
              >
                <Text2Typography data-cy="ai-outline-in-progress">
                  Generating AI Outline...
                </Text2Typography>
                <CircularProgress
                  style={{
                    alignSelf: 'center',
                    justifySelf: 'center',
                  }}
                />
              </AIOutlineContainer>
            )
          }
        </ContentContainer>
      </ContentRevisionContainer>
    );
  },
  (prevProps, nextProps) => {
    const timelinePointChanges = !equals<GQLTimelinePoint>(
      prevProps.timelinePoint,
      nextProps.timelinePoint
    );
    const googleDocChanges =
      prevProps.googleDoc &&
      nextProps.googleDoc &&
      !equals<UserDoc>(prevProps.googleDoc, nextProps.googleDoc);
    const generationInProgressChanges =
      prevProps.timelineGenerationInProgress !==
      nextProps.timelineGenerationInProgress;
    return (
      !timelinePointChanges && !googleDocChanges && !generationInProgressChanges
    );
  }
);
