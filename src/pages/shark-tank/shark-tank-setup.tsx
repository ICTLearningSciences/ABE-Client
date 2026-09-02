/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/

import * as React from "react";
import FlipMove from "react-flip-move";
import * as motion from "motion/react-client";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  CheckBox,
  CheckBoxOutlineBlank,
  DescriptionOutlined,
  InfoOutlined,
  ListAlt,
  Message,
  PeopleOutlined,
  Person,
  PlayCircleOutlineOutlined,
  Restore,
  Settings,
  Tune,
} from "@mui/icons-material";

import { Header } from "./components/header";
import { useNavigateWithParams } from "../../hooks/use-navigate-with-params";
import { useAppSelector } from "../../store/hooks";
import { useWithPanels } from "../../store/slices/panels/use-with-panels";
import withAuthorizationOnly from "./wrap-with-authorization-only";
import type { ActivityBuilder } from "../../exported-files";

import "./shark-tank.css";
import { CssTextField } from "./components";
import CssCard from "./components/css-card";
import PanelSettings from "./components/panel-settings";
import type { ResponseLength } from "../../store/slices/panels/types";

function SharkTankSetup(): React.ReactNode {
  const {
    panels,
    panelists,
    activity,
    activePanel,
    activePanelConfig,
    setActivity,
    setActivePanel,
    setActivePanelConfig,
    toggleActivePanelist,
  } = useWithPanels();
  const activePanelists = useAppSelector(
    (state) => state.panels.activePanelists,
  );
  const activities: ActivityBuilder[] = useAppSelector((state) =>
    state.docGoalsActivities.builtActivities.filter(
      (a: ActivityBuilder) =>
        a.attachedPanel && a.title === "CFT Panel Activity",
    ),
  );
  const activitiesLoadStatus = useAppSelector(
    (state) => state.docGoalsActivities.builtActivitiesLoadStatus,
  );
  const navigate = useNavigateWithParams();
  const [showConfig, setShowConfig] = React.useState<string>();

  React.useEffect(() => {
    if (!activity && activities.length > 0) {
      setActivity(activities[activities.length - 1]._id);
    }
  }, [activity, activities]);

  function startSession(): void {
    navigate("/shark-tank/chat");
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const PanelMemberItem = React.forwardRef<any>((props: any, ref) => (
    <motion.div
      ref={ref}
      className="row spacing"
      whileHover={{ scale: 1.01, filter: "brightness(1.1)" }}
    >
      <Tooltip title="Configure Response Settings">
        <IconButton
          color={props.clientId in activePanelConfig ? "secondary" : "primary"}
          onClick={() => setShowConfig(props.clientId)}
        >
          <Settings />
        </IconButton>
      </Tooltip>
      <ListItem
        className="box"
        style={{
          padding: 5,
          borderColor: activePanelists?.includes(props.clientId)
            ? "#5c8a69"
            : "",
          backgroundImage: activePanelists?.includes(props.clientId)
            ? "linear-gradient(to right, #79a07530, #64574730)"
            : "",
        }}
        onClick={() => toggleActivePanelist(props.clientId)}
      >
        <ListItemIcon style={{ color: "white", marginLeft: 5 }}>
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
      <Tooltip
        title={`${activePanelists?.includes(props.clientId) ? "Disable" : "Enable"} Panelist`}
      >
        <IconButton
          color="primary"
          onClick={() => toggleActivePanelist(props.clientId)}
        >
          {activePanelists?.includes(props.clientId) ? (
            <CheckBox />
          ) : (
            <CheckBoxOutlineBlank />
          )}
        </IconButton>
      </Tooltip>
    </motion.div>
  ));

  return (
    <main className="root">
      <Header title="Configure Session" />
      <div className="page">
        <Typography variant="h4" style={{ fontWeight: "bold", marginTop: 20 }}>
          Configure Session
        </Typography>
        <Typography color="secondary">
          Choose your activity and panelists.
        </Typography>
        {activitiesLoadStatus === 1 ? (
          <CircularProgress
            size={40}
            style={{ alignSelf: "center", marginTop: 20 }}
          />
        ) : (
          <Grid container style={{ width: "90%", marginTop: 20 }}>
            <Grid size={8} style={{ padding: 10 }}>
              <CssCard title="Panel Name" icon={<InfoOutlined />}>
                <div className="box">
                  <Typography>{activePanel?.panelName}</Typography>
                </div>
              </CssCard>
              <CssCard title="Description" icon={<DescriptionOutlined />}>
                <div className="box">
                  <Typography>{activePanel?.panelDescription}</Typography>
                </div>
              </CssCard>
              <CssCard title="Panelists" icon={<PeopleOutlined />}>
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
                disabled={!activePanelists || activePanelists.length === 0}
              >
                Start Session
              </Button>
            </Grid>

            <Grid size={4} style={{ padding: 10 }}>
              <CssCard alt title="Select Activity" icon={<ListAlt />}>
                <List className="column spacing">
                  {activities.map((a) => {
                    const panel = panels.find(
                      (p) => p.clientId === a.attachedPanel,
                    );
                    if (!panel) return <></>;
                    return (
                      <motion.div
                        id={a._id}
                        key={a._id}
                        whileHover={{ scale: 1.01, filter: "brightness(1.1)" }}
                        className="box column spacing"
                        style={{
                          backgroundColor: "rgb(100, 100, 100)",
                        }}
                      >
                        <div
                          className="row"
                          style={{ justifyContent: "space-between" }}
                        >
                          <Typography
                            color="secondary"
                            style={{ fontWeight: "bold" }}
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
                          onClick={() => {
                            setActivity(a._id);
                            setActivePanel(panel.clientId);
                          }}
                          disabled={activity?._id === a._id}
                        >
                          {activity?._id === a._id ? "Selected" : "Select"}
                        </Button>
                      </motion.div>
                    );
                  })}
                </List>
              </CssCard>
              <PanelSettings />
            </Grid>
          </Grid>
        )}
      </div>
      {showConfig && (
        <Dialog open={true} onClose={() => setShowConfig(undefined)}>
          <DialogTitle>
            {panelists.find((p) => p.clientId === showConfig)?.panelistName}{" "}
            Response Settings
          </DialogTitle>
          <DialogContent style={{ color: "white" }}>
            <CssCard alt title="Response Length" icon={<Message />}>
              <CssTextField
                select
                value={
                  activePanelConfig[showConfig]?.responseLength ||
                  activePanelConfig[""]?.responseLength
                }
                onChange={(e) => {
                  const config = { ...activePanelConfig };
                  config[showConfig] = {
                    ...config[""],
                    ...config[showConfig],
                    id: showConfig,
                    responseLength: e.target.value as ResponseLength,
                  };
                  setActivePanelConfig({ ...config });
                }}
              >
                <MenuItem value="low">Low (10-30 words)</MenuItem>
                <MenuItem value="med">Medium (50-100 words)</MenuItem>
                <MenuItem value="high">High (No limit)</MenuItem>
              </CssTextField>
            </CssCard>
            <CssCard alt title="Difficulty Level" icon={<Tune />}>
              <CssTextField
                select
                value={
                  activePanelConfig[showConfig]?.difficultyLevel ||
                  activePanelConfig[""]?.difficultyLevel
                }
                onChange={(e) => {
                  const config = { ...activePanelConfig };
                  config[showConfig] = {
                    ...config[""],
                    ...config[showConfig],
                    id: showConfig,
                    difficultyLevel: e.target.value as ResponseLength,
                  };
                  setActivePanelConfig({ ...config });
                }}
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="med">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </CssTextField>
            </CssCard>
            <Button
              variant="contained"
              fullWidth
              startIcon={<Restore />}
              onClick={() => {
                const config = { ...activePanelConfig };
                delete config[showConfig];
                setActivePanelConfig({ ...config });
              }}
            >
              Reset To Default
            </Button>
          </DialogContent>
        </Dialog>
      )}
    </main>
  );
}

const Page = withAuthorizationOnly(SharkTankSetup);
export default Page;
