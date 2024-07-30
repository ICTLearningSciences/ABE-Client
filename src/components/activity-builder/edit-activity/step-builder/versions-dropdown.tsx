import React from 'react';
import { IconButton, Menu, MenuItem } from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import { StepVersion } from '../activity-flow-container';
import { formatISODate } from '../../../../helpers';
export function VersionsDropdown(props: {
  versions: StepVersion[];
  onSelect: (version: StepVersion) => void;
}): JSX.Element {
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
        <HistoryIcon />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
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
