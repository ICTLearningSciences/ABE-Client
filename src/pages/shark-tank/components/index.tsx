/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/

import { Dialog, TextField, styled } from "@mui/material";

export const CssTextField = styled(TextField)({
  "& .MuiSvgIcon-root": {
    color: "white",
  },
  "& .MuiOutlinedInput-root": {
    color: "rgb(223, 215, 159)",
    backgroundColor: "rgb(61, 67, 74)",
    border: "2px solid rgba(223, 215, 159, 0.3)",
    borderRadius: 10,
    "& fieldset": {
      border: "2px solid rgba(223, 215, 159, 0.3)",
    },
    "&:hover fieldset": {
      border: "2px solid rgba(223, 215, 159, 0.5)",
    },
    "&.Mui-focused fieldset": {
      border: "2px solid rgba(92, 138, 105, 1)",
    },
    "&.Mui-focused": {
      color: "white",
    },
  },
});

export const CssDialog = styled(Dialog)({
  "& .MuiPaper-root": {
    background:
      "radial-gradient(circle,rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.05) 100%)",
    boxShadow: "none",
  },
});
