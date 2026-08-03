/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/

import { styled } from "@mui/material";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";

/* The `const ColorlibConnector` declaration is using the `styled` function from Material-UI to create
a styled component for the `StepConnector` component. This styled component is defining the styles
for the connector line used in a `Stepper` component. */
export const ColorlibConnector = styled(StepConnector)(() => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 10,
    border: 0,
    backgroundColor: "#fff",
    boxShadow: "0px 2px 15px 0px rgba(90, 82, 128, 0.2)",
    borderRadius: 5,
  },
}));

/* The `StepperSx` constant is an object that contains styling properties using the syntax provided by
Emotion's CSS prop. In this case, it is defining styles for the `Stepper` component in the React
code snippet. */
export const StepperSx = {
  "& .MuiStepConnector-root": {
    left: "calc(-50% + 15px)",
    right: "calc(50% + 15px)",
  },
  "& .MuiStepConnector-line": {
    marginTop: "35px", // To position the line lower
  },
};
