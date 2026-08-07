/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/

import React, { useState, useEffect, useMemo } from "react";
import { Box, CircularProgress, Grid, Typography } from "@mui/material";
import type {
  LoadingError,
  LoadingStatusType,
} from "../../../hooks/loading-reducer";
import type {
  DehydratedGQLDocumentTimeline,
  GQLDocumentTimeline,
} from "../../../types";
import { AssignmentHeader } from "./assignment-document-timelines-components/assignment-header";
import { TimelineView } from "./assignment-document-timelines-components/timeline-view";
import { DocumentTextView } from "./assignment-document-timelines-components/document-text-view";
import { TabbedInfoPanel } from "./assignment-document-timelines-components/tabbed-info-panel";
import type {
  Assignment,
  StudentData,
} from "../../../store/slices/education-management/types";
import {
  getStudentAssignmentDocs,
  getStudentsByAssignmentCompletionStatus,
  getAssignmentsByStudentCompletionStatus,
} from "../../../helpers";
import type { RootState } from "../../../store/store";
import { useAppSelector } from "../../../store/hooks";
import { useWithEducationalManagement } from "../../../store/slices/education-management/use-with-educational-management";
import { applyTextDiff } from "../helpers";

interface AssignmentDocumentTimelinesProps {
  sectionId: string;
  student: StudentData;
  assignment: Assignment;
  studentDocIds: string[];
  documentStates: Record<
    string,
    {
      timeline?: DehydratedGQLDocumentTimeline;
      status: LoadingStatusType;
      error?: LoadingError;
    }
  >;
  loadInProgress: boolean;
  errorMessage?: string;
  selectedDocId: string;
  getHydratedTimeline: (docId: string) => GQLDocumentTimeline | undefined;
  onBackToStudentInfo: () => void;
  onDocumentChange: (docId: string) => void;
  isSidebarCollapsed: boolean;
  handleViewStudentTimelines: (studentId: string, assignmentId: string) => void;
}

export const AssignmentDocumentTimelines: React.FC<
  AssignmentDocumentTimelinesProps
> = ({
  student,
  sectionId,
  assignment,
  documentStates,
  studentDocIds,
  loadInProgress,
  errorMessage,
  selectedDocId,
  getHydratedTimeline,
  onBackToStudentInfo,
  handleViewStudentTimelines,
  onDocumentChange,
  isSidebarCollapsed,
}) => {
  const documentIds = studentDocIds;
  const currentDocState = selectedDocId
    ? documentStates[selectedDocId]
    : undefined;
  const [selectedTimelineIndex, setSelectedTimelineIndex] = useState(0);
  const allStudents = useAppSelector(
    (state: RootState) => state.educationManagement.students,
  );
  const studentsInSection = allStudents.filter((student: StudentData) =>
    student.enrolledSections.includes(sectionId),
  );
  const studentAssignmentCompletionStatuses =
    getStudentsByAssignmentCompletionStatus(studentsInSection, assignment);
  const studentAssignmentDocs = useMemo(
    () => getStudentAssignmentDocs(student, assignment._id),
    [student, assignment._id],
  );
  const { sections, assignments } = useWithEducationalManagement();
  const section = sections.find((section) => section._id === sectionId);
  const assignmentsInSection = useMemo(
    () =>
      section
        ? assignments.filter((assignment) =>
            section.assignments.some(
              (sa) => sa.assignmentId === assignment._id,
            ),
          )
        : [],
    [section, assignments],
  );
  const assignmentCompletionStatuses = useMemo(
    () =>
      getAssignmentsByStudentCompletionStatus(student, assignmentsInSection),
    [student, assignmentsInSection],
  );
  console.log(
    "studentAssignmentCompletionStatuses",
    studentAssignmentCompletionStatuses,
  );
  const currentTimeline = useMemo(() => {
    if (selectedDocId && currentDocState?.status === "SUCCESS") {
      return getHydratedTimeline(selectedDocId);
    }
    return undefined;
  }, [currentDocState?.status, getHydratedTimeline, selectedDocId]);

  const timelinePoints = currentTimeline?.timelinePoints || [];
  const currentTimelinePoint =
    timelinePoints[selectedTimelineIndex] || undefined;
  const previousTimelinePoint =
    timelinePoints[selectedTimelineIndex - 1] || undefined;

  const currentText =
    currentTimelinePoint?.version?.markdownText ||
    currentTimelinePoint?.version?.plainText ||
    "";
  const previousText =
    previousTimelinePoint?.version?.markdownText ||
    previousTimelinePoint?.version?.plainText ||
    "";
  const diffContent = applyTextDiff(previousText, currentText);

  useEffect(() => {
    setSelectedTimelineIndex(0);
  }, [selectedDocId]);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
      key={selectedDocId}
      data-cy="activity-document-timelines"
    >
      <AssignmentHeader
        studentAssignmentCompletionStatuses={
          studentAssignmentCompletionStatuses
        }
        assignmentCompletionStatuses={assignmentCompletionStatuses}
        handleViewStudentTimelines={handleViewStudentTimelines}
        assignment={assignment}
        assignments={assignmentsInSection}
        onAssignmentChange={handleViewStudentTimelines}
        student={student}
        onBackToStudentInfo={onBackToStudentInfo}
        docData={studentAssignmentDocs}
        selectedDocId={selectedDocId}
        onDocumentChange={onDocumentChange}
      />
      <TimelineView
        timelinePoints={timelinePoints}
        selectedTimelineIndex={selectedTimelineIndex}
        onTimelinePointSelect={setSelectedTimelineIndex}
        isSidebarCollapsed={isSidebarCollapsed}
      />

      {errorMessage && (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography color="error">{errorMessage}</Typography>
        </Box>
      )}

      {loadInProgress && selectedDocId ? (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <CircularProgress size={32} sx={{ mb: 2 }} />
          <Typography>Loading document timeline...</Typography>
        </Box>
      ) : !currentTimeline ? (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography color="text.secondary">
            {documentIds.length === 0 || !selectedDocId
              ? "Student has no documents for this assignment"
              : "No timeline data available for this document"}
          </Typography>
        </Box>
      ) : (
        <>
          <Grid container spacing={3} sx={{ flex: 1, mb: 1, height: "60%" }}>
            <Grid size={6} style={{ height: "100%" }}>
              <DocumentTextView
                timelinePoint={currentTimelinePoint}
                diffContent={diffContent}
              />
            </Grid>
            <Grid size={6} style={{ height: "100%" }}>
              <TabbedInfoPanel
                timelinePoint={currentTimelinePoint}
                studentName={student.name}
              />
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};
