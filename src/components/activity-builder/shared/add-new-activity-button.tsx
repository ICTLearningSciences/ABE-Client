/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/

import React, { useState } from "react";
import { IconButton, Button } from "@mui/material";
import { AddCircle, Close } from "@mui/icons-material";
import { RowDiv } from "../../../styled-components";

export type AddNewActivityStepType =
  | "SYSTEM_MESSAGE"
  | "REQUEST_USER_INPUT"
  | "PROMPT"
  | "CONDITIONAL"
  | "EDIT_DOC_PROMPT"
  | "END_ACTIVITY_MESSAGE";

function getButtonText(t: AddNewActivityStepType): string {
  if (t === "SYSTEM_MESSAGE") return "Basic Message";
  if (t === "REQUEST_USER_INPUT") return "Request User Input";
  if (t === "PROMPT") return "AI Prompt";
  if (t === "CONDITIONAL") return "If / Then Go-To";
  if (t === "EDIT_DOC_PROMPT") return "AI Edits Doc";
  if (t === "END_ACTIVITY_MESSAGE") return "End Activity Message";
  return "";
}

export function AddNewActivityButton(props: {
  insertNewActivityStep: (stepType: AddNewActivityStepType) => void;
}): React.ReactNode {
  const options = [
    "SYSTEM_MESSAGE",
    "REQUEST_USER_INPUT",
    "PROMPT",
    "CONDITIONAL",
    "EDIT_DOC_PROMPT",
    "END_ACTIVITY_MESSAGE",
  ];
  const [displayOptions, setDisplayOptions] = useState<boolean>(false);
  return (
    <div
      style={{
        width: "fit-content",
      }}
    >
      {!displayOptions && (
        <IconButton onClick={() => setDisplayOptions(true)}>
          <AddCircle />
        </IconButton>
      )}

      {displayOptions && (
        <RowDiv>
          {options.map((option, i) => {
            return (
              <Button
                key={i}
                variant="outlined"
                style={{
                  fontSize: 10,
                  marginRight: 5,
                }}
                onClick={() => {
                  props.insertNewActivityStep(option as AddNewActivityStepType);
                  setDisplayOptions(false);
                }}
              >
                {getButtonText(option as AddNewActivityStepType)}
              </Button>
            );
          })}
          <IconButton onClick={() => setDisplayOptions(false)}>
            <Close />
          </IconButton>
        </RowDiv>
      )}
    </div>
  );
}
