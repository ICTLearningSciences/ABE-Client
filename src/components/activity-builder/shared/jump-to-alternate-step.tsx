/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/

import React, { useState } from "react";
import { Box, Button, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";

import { ColumnDiv, RowDiv } from "../../../styled-components";
import type { ActivityBuilderStep, FlowItem } from "../types";
import { FlowStepSelector } from "./flow-step-selector";
import { InfoTooltip } from "../../info-tooltip";

export function JumpToAlternateStep(props: {
  step: ActivityBuilderStep;
  flowsList: FlowItem[];
  onNewStepSelected: (stepId: string) => void;
}): React.ReactNode {
  const { step, flowsList, onNewStepSelected } = props;
  const [displayStepSelector, setDisplayStepSelector] = useState<boolean>(
    Boolean(step.jumpToStepId) && step.jumpToStepId !== "",
  );
  return (
    <ColumnDiv>
      {!displayStepSelector && (
        <RowDiv>
          <span style={{ color: "grey" }}>Jump to alternate step?</span>
          <InfoTooltip title="Configure this step to jump to a step out of order." />
          <Button
            onClick={() => {
              setDisplayStepSelector(true);
            }}
          >
            Yes
          </Button>
        </RowDiv>
      )}

      {displayStepSelector && (
        <Box
          sx={{
            mt: 2,
            borderRadius: 2,
            boxShadow: 1,
            backgroundColor: "white",
            border: "1px solid #e0e0e0",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            alignSelf: "center",
            width: "50%",
            position: "relative",
          }}
        >
          <IconButton
            style={{
              position: "absolute",
              right: 10,
              top: 10,
            }}
            onClick={() => {
              setDisplayStepSelector(false);
              onNewStepSelected("");
            }}
          >
            <Close />
          </IconButton>
          <span style={{ fontWeight: "bold" }}>Custom Step Jump</span>
          <FlowStepSelector
            flowsList={flowsList}
            rowOrColumn="row"
            disableStepsList={[step.stepId]}
            currentJumpToStepId={step.jumpToStepId}
            width="fit-content"
            onStepSelected={(stepId) => {
              onNewStepSelected(stepId);
            }}
          />
        </Box>
      )}
    </ColumnDiv>
  );
}
