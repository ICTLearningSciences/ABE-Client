/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/

import React from "react";
import { Construction, Replay } from "@mui/icons-material";
import { Typography, Button, Menu, MenuItem, IconButton } from "@mui/material";
import type { ActivityTypes } from "../../../types";
import { useAppSelector } from "../../../store/hooks";
import type { ActivityBuilder } from "../../../exported-files";

export function ChatHeader(props: {
  selectedActivity?: ActivityTypes;
  onReset: () => void;
  onSelectActivity: (a: ActivityTypes) => void;
}): React.ReactNode {
  const { selectedActivity } = props;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const builtActivities: ActivityBuilder[] = useAppSelector((state) =>
    state.docGoalsActivities.builtActivities.filter(
      (a: ActivityBuilder) =>
        a.attachedPanel && a.title === "CFT Panel Activity",
    ),
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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
      <IconButton color="primary" onClick={handleClick}>
        <Construction />
      </IconButton>
      <Typography style={{ flexGrow: 1 }}>{selectedActivity?.title}</Typography>
      <Button variant="outlined" startIcon={<Replay />} onClick={props.onReset}>
        Reset
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        {builtActivities.map((activity) => (
          <MenuItem
            key={activity._id}
            onClick={() => {
              props.onSelectActivity(activity);
              handleClose();
            }}
          >
            {activity.title}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
