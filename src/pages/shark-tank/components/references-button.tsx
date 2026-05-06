import React from 'react';
import { Button, IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import { Close, OpenInNew, Pageview } from '@mui/icons-material';

export interface Reference {
  name: string;
  url: string;
}
const REFERENCES: Reference[] = [
  {
    name: 'Breitbart Vaccines',
    url: 'https://www.cdc.gov/vaccines/index.html',
  },
];

export function ReferencesButton(props: {
  reference?: Reference;
  onSelectReference: (ref?: Reference) => void;
}): JSX.Element {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = (ref?: Reference) => {
    props.onSelectReference(ref);
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
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {REFERENCES.map((r, i) => (
          <MenuItem
            key={i}
            className="row"
            style={{ justifyContent: 'space-between', minWidth: 200 }}
            onClick={() => open(r)}
          >
            {r.name}
            <IconButton onClick={() => openInNew(r.url)}>
              <OpenInNew />
            </IconButton>
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
