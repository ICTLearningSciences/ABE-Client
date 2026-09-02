/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/

import React from "react";
import { Button, IconButton, Menu, MenuItem, Tooltip } from "@mui/material";
import { Close, OpenInNew, Pageview } from "@mui/icons-material";
import { useWithChat, useWithState } from "../../../exported-files";
import type { Source } from "../../../ai-services/ai-service-types";
import type { ChatMessageTypes } from "../../../store/slices/chat";

export function ReferencesButton(props: {
  reference?: Source;
  onSelectReference?: (ref?: Source) => void;
  message?: ChatMessageTypes;
}): React.ReactNode {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { state } = useWithState();
  const { curDocId } = state;
  const { state: chatState } = useWithChat();
  const messages = curDocId
    ? props.message
      ? [props.message]
      : chatState.chatLogs[curDocId] || []
    : [];

  const sources = [];
  if (curDocId) {
    for (const msg of messages) {
      if ("sources" in msg) {
        for (const source of msg.sources || []) {
          sources.push(source);
        }
      }
    }
  }

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = (ref?: Source) => {
    if (props.onSelectReference) props.onSelectReference(ref);
    else if (ref) openInNew(ref.url);
    handleClose();
  };

  const openInNew = (url: string) => {
    if (window) {
      window.open(url, "_blank");
      handleClose();
    }
  };

  return (
    <div>
      <Button
        variant={props.reference ? "contained" : "outlined"}
        startIcon={<Pageview />}
        onClick={handleClick}
        disabled={sources.length === 0}
      >
        References
      </Button>
      {props.reference && (
        <Tooltip title="Close reference">
          <IconButton color="primary" onClick={() => open(undefined)}>
            <Close />
          </IconButton>
        </Tooltip>
      )}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        style={{ zIndex: 9999 }}
      >
        {sources.map((r, i) => (
          <MenuItem
            key={i}
            className="row"
            style={{ justifyContent: "space-between", minWidth: 200 }}
            onClick={() => open(r)}
          >
            {r.title}
            <IconButton onClick={() => openInNew(r.url)}>
              <OpenInNew />
            </IconButton>
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
