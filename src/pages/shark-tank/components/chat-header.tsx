import React from 'react';
import { ForumOutlined, Construction, Replay } from '@mui/icons-material';
import { Typography, Button, Menu, MenuItem } from '@mui/material';
import { ActivityTypes } from '../../../types';
import { useAppSelector } from '../../../store/hooks';

export function ChatHeader(props: {
  selectedActivity?: ActivityTypes;
  onReset: () => void;
  onSelectActivity: (a: ActivityTypes) => void;
}): JSX.Element {
  const { selectedActivity } = props;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const builtActivities = useAppSelector((state) =>
    state.docGoalsActivities.builtActivities.filter((a) => a.attachedPanel)
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
        position: 'relative',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        backgroundImage:
          'linear-gradient(to right, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0))',
        borderBottom: '1px solid rgba(223, 215, 159, 0.3)',
        padding: 10,
      }}
    >
      <ForumOutlined color="primary" />
      <Typography style={{ flexGrow: 1 }}>{selectedActivity?.title}</Typography>
      <Button
        variant="contained"
        startIcon={<Construction />}
        onClick={handleClick}
      >
        Activity
      </Button>
      <Button variant="outlined" startIcon={<Replay />} onClick={props.onReset}>
        Reset
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
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
