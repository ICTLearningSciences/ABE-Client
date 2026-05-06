import React from 'react';
import { Button, IconButton, Menu, MenuItem } from '@mui/material';
import { OpenInNew, Pageview } from '@mui/icons-material';

export function ReferencesButton(props: {
  onSelectReference: (url: string) => void;
}): JSX.Element {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = (url: string) => {
    props.onSelectReference(url);
    handleClose();
  };

  const openInNew = (url: string) => {
    if (window) {
      window.open(url, '_blank');
      handleClose();
    }
  };

  return (
    <div>
      <Button
        variant="contained"
        startIcon={<Pageview />}
        onClick={handleClick}
      >
        References
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem
          className="row"
          style={{ justifyContent: 'space-between', minWidth: 200 }}
          onClick={() => open('https://www.google.com')}
        >
          Google
          <IconButton onClick={() => openInNew('https://www.google.com')}>
            <OpenInNew />
          </IconButton>
        </MenuItem>
      </Menu>
    </div>
  );
}
