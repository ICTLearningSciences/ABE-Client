/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/

import React from "react";
import {
  Typography,
  Button,
  IconButton,
  Tooltip,
  DialogContent,
} from "@mui/material";
import { History, Replay, Tune } from "@mui/icons-material";
import type { ActivityTypes } from "../../../types";
import { CssDialog } from ".";
import { ChatHistory } from "./chat-thread";
import PanelSettings from "./panel-settings";

export function ChatHeader(props: {
  selectedActivity?: ActivityTypes;
  onReset: () => void;
  onSelectActivity: (a: ActivityTypes) => void;
}): React.ReactNode {
  const { selectedActivity } = props;
  const [showSettings, setShowSettings] = React.useState<boolean>(false);
  const [showHistory, setShowHistory] = React.useState<boolean>(false);

  return (
    <div
      className="row spacing center-div"
      style={{
        position: "relative",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        backgroundImage:
          "linear-gradient(to right, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0))",
        borderBottom: "1px solid rgba(223, 215, 159, 0.3)",
        padding: 10,
      }}
    >
      <Tooltip title="Edit response settings">
        <IconButton color="primary" onClick={() => setShowSettings(true)}>
          <Tune />
        </IconButton>
      </Tooltip>
      <Typography style={{ flexGrow: 1 }}>{selectedActivity?.title}</Typography>
      <Tooltip title="Chat history">
        <IconButton
          color="primary"
          onClick={() => setShowHistory(!showHistory)}
        >
          <History />
        </IconButton>
      </Tooltip>
      <Tooltip title="Reset activity">
        <Button
          variant="outlined"
          startIcon={<Replay />}
          onClick={props.onReset}
        >
          Reset
        </Button>
      </Tooltip>

      <CssDialog open={showSettings} onClose={() => setShowSettings(false)}>
        <DialogContent>
          <PanelSettings />
        </DialogContent>
      </CssDialog>
      <ChatHistory open={showHistory} onClose={() => setShowHistory(false)} />
    </div>
  );
}
