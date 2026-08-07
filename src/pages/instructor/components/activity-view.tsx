/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/

import React, { useState } from "react";
import { Typography, Box } from "@mui/material";
import { CheckCircle, RadioButtonUnchecked } from "@mui/icons-material";
import ViewUserGoogleDocs from "../../../components/admin-view/admin-view-docs";
import DocView from "../../../components/doc-view";
import { useWithEducationalManagement } from "../../../store/slices/education-management/use-with-educational-management";
import { ColumnDiv } from "../../../styled-components";
import { useWithWindowSize } from "../../../hooks/use-with-window-size";

export function ActivityView(props: {
  activityId: string;
  assignmentId: string;
}): React.ReactNode {
  const { activityId, assignmentId } = props;
  const [selectedDocId, setSelectedDocId] = useState<string>();

  const educationManagement = useWithEducationalManagement();
  const { isMobile } = useWithWindowSize();

  const haveICompletedActivity = educationManagement.haveICompletedActivity(
    assignmentId,
    activityId,
  );

  if (!selectedDocId) {
    return (
      <ViewUserGoogleDocs
        goToDoc={(docId: string) => {
          setSelectedDocId(docId);
        }}
        onHistoryClicked={() => {
          console.log("history clicked");
        }}
        isEducationalSetting={true}
      />
    );
  }

  return (
    <ColumnDiv style={{ width: "100%", height: "100%", position: "relative" }}>
      <Box
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          display: "flex",
          alignItems: "center",
          gap: 1,
          p: 2,
        }}
      >
        {haveICompletedActivity ? (
          <>
            <CheckCircle
              sx={{
                color: "green",
                fontSize: "28px",
              }}
            />
            <Typography
              variant="body2"
              sx={{
                color: "green",
                fontWeight: 500,
              }}
            >
              {isMobile ? "" : "Complete"}
            </Typography>
          </>
        ) : (
          <>
            <RadioButtonUnchecked
              sx={{
                color: "grey.400",
                fontSize: "28px",
              }}
            />
            <Typography
              variant="body2"
              sx={{
                color: "grey.400",
                fontWeight: 500,
              }}
            >
              {isMobile ? "" : "Incomplete"}
            </Typography>
          </>
        )}
      </Box>
      <DocView docId={selectedDocId} disableActivitySelector={true} />
    </ColumnDiv>
  );
}
