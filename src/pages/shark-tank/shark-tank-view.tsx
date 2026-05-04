/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/

import * as React from 'react';
import FlipMove from 'react-flip-move';
import * as motion from 'motion/react-client';
import {
  Button,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Typography,
} from '@mui/material';
import {
  CheckBox,
  CheckBoxOutlineBlank,
  DescriptionOutlined,
  InfoOutlined,
  ListAlt,
  PeopleOutlined,
  Person,
  PlayCircleOutlineOutlined,
  Search,
} from '@mui/icons-material';

import { CssCard, CssTextField } from './components';
import { Header } from './components/header';
import ToggleAgentMode from './components/toggle-mode';
import withAuthorizationOnly from '../../hooks/wrap-with-authorization-only';
import { useAppSelector } from '../../store/hooks';
import { useWithPanels } from '../../store/slices/panels/use-with-panels';
import { useNavigateWithParams } from '../../hooks/use-navigate-with-params';

import './shark-tank.css';

function SharkTank(): JSX.Element {
  const {
    useSearch,
    usePanelMode,
    activity,
    activePanel,
    activePanelist,
    panels,
    panelists,
    updateSearch,
    setActivity,
    setActivePanel,
    setActivePanelist,
  } = useWithPanels();
  const activities = useAppSelector((state) =>
    state.docGoalsActivities.builtActivities.filter((a) => a.attachedPanel)
  );
  const navigate = useNavigateWithParams();

  React.useEffect(() => {
    if (!activity && activities.length > 0) {
      setActivity(activities[0]._id);
    }
  }, []);

  function startSession(): void {
    navigate('/shark-tank/chat');
  }

  const PanelMemberItem = React.forwardRef<any>((props: any, ref) => (
    <motion.div
      ref={ref}
      className="row spacing"
      whileHover={
        !usePanelMode ? { scale: 1.01, filter: 'brightness(1.1)' } : {}
      }
      onClick={() => setActivePanelist(props.clientId)}
    >
      <ListItem
        className="box"
        style={{
          padding: 5,
          borderColor: activePanelist === props.clientId ? '#5c8a69' : '',
          backgroundImage:
            activePanelist === props.clientId
              ? 'linear-gradient(to right, #79a07530, #64574730)'
              : '',
        }}
      >
        <ListItemIcon style={{ color: 'white', marginLeft: 5 }}>
          <Person />
        </ListItemIcon>
        <ListItemText
          primary={
            <Typography style={{ fontSize: 12 }} color="secondary">
              {props.panelistDescription}
            </Typography>
          }
          secondary={
            <Typography style={{ fontSize: 14 }}>
              {props.panelistName}
            </Typography>
          }
        />
      </ListItem>
      {!usePanelMode && (
        <IconButton
          color="primary"
          onClick={() => setActivePanelist(props.clientId)}
        >
          {activePanelist?.clientId === props.clientId ? (
            <CheckBox />
          ) : (
            <CheckBoxOutlineBlank />
          )}
        </IconButton>
      )}
    </motion.div>
  ));

  return (
    <main className="root">
      <Header title="Configure Session" />
      <div className="page">
        <Typography variant="h4" style={{ fontWeight: 'bold', marginTop: 20 }}>
          Configure Session
        </Typography>
        <Typography color="secondary">
          Select an activity and panelists you would like to discuss with
        </Typography>

        <Grid container spacing={2} style={{ width: '90%', marginTop: 20 }}>
          <Grid xs={8}>
            <CssCard title="Panel Name" icon={<InfoOutlined />}>
              <CssTextField value={activePanel?.panelName} />
            </CssCard>
            <CssCard title="Description" icon={<DescriptionOutlined />}>
              <CssTextField value={activePanel?.panelDescription} multiline />
            </CssCard>
            <CssCard
              title="Panelists"
              icon={<PeopleOutlined />}
              headerButton={<ToggleAgentMode />}
            >
              {!usePanelMode && (
                <Typography color="secondary" style={{ textAlign: 'center' }}>
                  Which panelist do you wish to speak to?
                </Typography>
              )}
              <FlipMove className="column spacing">
                {activePanel?.panelists?.map((p, i) => (
                  <PanelMemberItem key={p} {...panelists[i]} />
                ))}
              </FlipMove>
            </CssCard>
            <Button
              variant="contained"
              fullWidth
              startIcon={<PlayCircleOutlineOutlined />}
              onClick={startSession}
              disabled={!usePanelMode && !activePanelist}
            >
              Start Session
            </Button>
          </Grid>

          <Grid xs={4}>
            <CssCard alt title="Use Web Search" icon={<Search />}>
              <CssTextField
                select
                value={useSearch ? 'true' : 'false'}
                onChange={(e) => updateSearch(e.target.value)}
              >
                <MenuItem value="true">Yes</MenuItem>
                <MenuItem value="false">No</MenuItem>
              </CssTextField>
            </CssCard>
            <CssCard alt title="Select Activity" icon={<ListAlt />}>
              <List className="column spacing">
                {activities.map((a) => {
                  const panel = panels.find(
                    (p) => p.clientId === a.attachedPanel
                  );
                  if (!panel) return <></>;
                  return (
                    <motion.div
                      id={a._id}
                      key={a._id}
                      whileHover={{ scale: 1.01, filter: 'brightness(1.1)' }}
                      className="box column spacing"
                      style={{
                        backgroundColor: 'rgb(100, 100, 100)',
                      }}
                    >
                      <div
                        className="row"
                        style={{ justifyContent: 'space-between' }}
                      >
                        <Typography
                          color="secondary"
                          style={{ fontWeight: 'bold' }}
                        >
                          {a.title}
                        </Typography>
                        <div className="row center-div">
                          <PeopleOutlined />
                          <Typography style={{ fontSize: 12, marginLeft: 5 }}>
                            {panel?.panelists.length || 0}
                          </Typography>
                        </div>
                      </div>
                      <Typography>{a.description}</Typography>
                      <Typography variant="subtitle2">
                        Panel: {panel.panelName}
                      </Typography>
                      <Button
                        variant="contained"
                        onClick={(e) => {
                          setActivity(a._id);
                          setActivePanel(panel.clientId);
                        }}
                        disabled={activity?._id === a._id}
                      >
                        {activity?._id === a._id ? 'Selected' : 'Select'}
                      </Button>
                    </motion.div>
                  );
                })}
              </List>
            </CssCard>
          </Grid>
        </Grid>
      </div>
    </main>
  );
}

export default withAuthorizationOnly(SharkTank);
