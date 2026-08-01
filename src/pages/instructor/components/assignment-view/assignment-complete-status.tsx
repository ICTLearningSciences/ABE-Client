/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/

import { Box, Typography } from "@mui/material";
import { CheckCircle, RadioButtonUnchecked } from "@mui/icons-material";

export function AssignmentCompleteStatus({
  isAssignmentComplete,
}: {
  isAssignmentComplete: boolean;
}) {
  return (
    <Box
      sx={{
        ml: "auto",
        display: "flex",
        alignItems: "center",
        gap: 1,
      }}
    >
      {isAssignmentComplete ? (
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
            All Activities Complete
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
            Complete All Activities
          </Typography>
        </>
      )}
    </Box>
  );
}
