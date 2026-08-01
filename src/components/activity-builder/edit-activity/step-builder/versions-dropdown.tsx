/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/

import React from "react";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { History } from "@mui/icons-material";
import type { StepVersion } from "../activity-flow-container";
import { formatISODate } from "../../../../helpers";

export function VersionsDropdown(props: {
  versions: StepVersion[];
  onSelect: (version: StepVersion) => void;
}): React.ReactNode {
  const { versions, onSelect } = props;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div>
      <IconButton disabled={versions.length === 0} onClick={handleClick}>
        <History />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {versions.map((version) => (
          <MenuItem
            key={version.versionTime}
            onClick={() => {
              onSelect(version);
              handleClose();
            }}
          >
            {formatISODate(version.versionTime)}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
