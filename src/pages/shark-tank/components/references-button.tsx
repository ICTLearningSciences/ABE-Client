import React from 'react';
import { Button, IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import { Close, OpenInNew, Pageview } from '@mui/icons-material';
import { useWithChat, useWithState } from '../../../exported-files';
import { Source } from '../../../ai-services/ai-service-types';

export function ReferencesButton(props: {
  reference?: Source;
  onSelectReference: (ref?: Source) => void;
}): JSX.Element {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { state } = useWithState();
  const { curDocId } = state;
  const { state: chatState } = useWithChat();
  const messages = curDocId ? chatState.chatLogs[curDocId] || [] : [];
  const [sources, setSources] = React.useState<Source[]>([]);

  React.useEffect(() => {
    if (!curDocId) return;
    const sources = [];
    for (const msg of messages) {
      if ('sources' in msg) {
        for (const source of msg.sources || []) {
          sources.push(source);
        }
      }
    }
    setSources(sources);
  }, [messages]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = (ref?: Source) => {
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
        variant={props.reference ? 'contained' : 'outlined'}
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
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {sources.map((r, i) => (
          <MenuItem
            key={i}
            className="row"
            style={{ justifyContent: 'space-between', minWidth: 200 }}
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
