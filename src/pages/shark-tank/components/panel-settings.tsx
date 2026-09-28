/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { Restore, Tune } from "@mui/icons-material";
import { Grid, Typography, MenuItem, Button } from "@mui/material";
import type {
  Panelist,
  PanelResponseConfiguration,
  ResponseLength,
} from "../../../store/slices/panels/types";
import { useWithPanels } from "../../../store/slices/panels/use-with-panels";
import { CssTextField } from ".";
import CssCard from "./css-card";
import { getDefaultSinglePromptConfiguration } from "../../../helpers";
import type {
  PromptActivityStep,
  SinglePromptConfiguration,
} from "../../../exported-files";

function PanelSettings(props: { panelist?: Panelist }): React.ReactNode {
  const { activity, activePanelConfig, setActivePanelConfig } = useWithPanels();
  const id = props.panelist?.clientId || "";

  function onUpdate(update: Partial<PanelResponseConfiguration>) {
    const config = { ...activePanelConfig };
    config[id] = { ...config[id], id, ...update };
    setActivePanelConfig(config);
  }

  function resetToDefault() {
    const config = { ...activePanelConfig };
    delete config[id];
    setActivePanelConfig({ ...config });
  }

  function defaultWebSearch() {
    const useWebSearch = getDefaultSinglePromptConfiguration().webSearch;
    if (activity) {
      const steps = activity.flowsList.reduce(
        (acc: PromptActivityStep[], cur) => {
          return [...acc, ...cur.steps.filter((s) => s.stepType === "PROMPT")];
        },
        [],
      );
      const configs = steps.reduce((acc: SinglePromptConfiguration[], cur) => {
        return [...acc, ...cur.promptConfigurations];
      }, []);
      const yes = configs.filter((c) => c.webSearch);
      if (yes.length === configs.length) return "Yes";
      if (yes.length === 0) return "No";
      return "Sometimes";
    }
    return useWebSearch ? "Yes" : "No";
  }

  function defaultChatHistory() {
    const useChatLog =
      getDefaultSinglePromptConfiguration().includeChatLogContext;
    if (activity) {
      const steps = activity.flowsList.reduce(
        (acc: PromptActivityStep[], cur) => {
          return [...acc, ...cur.steps.filter((s) => s.stepType === "PROMPT")];
        },
        [],
      );
      const configs = steps.reduce((acc: SinglePromptConfiguration[], cur) => {
        return [...acc, ...cur.promptConfigurations];
      }, []);
      const yes = configs.filter((c) => c.includeChatLogContext);
      if (yes.length === configs.length) return "Yes";
      if (yes.length === 0) return "No";
      return "Sometimes";
    }
    return useChatLog ? "Yes" : "No";
  }

  return (
    <CssCard
      alt
      title={`${props.panelist?.panelistName || "Panel"} Response Settings`}
      icon={<Tune />}
    >
      <Grid container spacing={1}>
        <Grid size={{ xs: 12, xl: 6 }}>
          <Typography>Response Length</Typography>
          <CssTextField
            select
            fullWidth
            value={`${activePanelConfig[id]?.responseLength}`}
            onChange={(e) => {
              onUpdate({ responseLength: e.target.value as ResponseLength });
            }}
          >
            <MenuItem value={undefined}>Default (Low)</MenuItem>
            <MenuItem value="low">Low (10-30 words)</MenuItem>
            <MenuItem value="med">Medium (50-100 words)</MenuItem>
            <MenuItem value="high">High (No limit)</MenuItem>
          </CssTextField>
        </Grid>
        <Grid size={{ xs: 12, xl: 6 }}>
          <Typography>Difficulty Level</Typography>
          <CssTextField
            select
            fullWidth
            value={`${activePanelConfig[id]?.difficultyLevel}`}
            onChange={(e) => {
              onUpdate({ difficultyLevel: e.target.value as ResponseLength });
            }}
          >
            <MenuItem value={undefined}>Default (Medium)</MenuItem>
            <MenuItem value="low">Low</MenuItem>
            <MenuItem value="med">Medium</MenuItem>
            <MenuItem value="high">High</MenuItem>
          </CssTextField>
        </Grid>
        {!props.panelist && (
          <Grid size={6}>
            <Typography>Use Web Search</Typography>
            <CssTextField
              select
              fullWidth
              value={`${Boolean(activePanelConfig[id]?.disableWebSearch)}`}
              onChange={(e) => {
                onUpdate({ disableWebSearch: e.target.value === "true" });
              }}
            >
              <MenuItem value="false">Default ({defaultWebSearch()})</MenuItem>
              <MenuItem value="true">Disable</MenuItem>
            </CssTextField>
          </Grid>
        )}
        {!props.panelist && (
          <Grid size={6}>
            <Typography>Use Chat Log</Typography>
            <CssTextField
              select
              fullWidth
              value={`${Boolean(activePanelConfig[id]?.disableChatLog)}`}
              onChange={(e) => {
                onUpdate({ disableChatLog: e.target.value === "true" });
              }}
            >
              <MenuItem value="false">
                Default ({defaultChatHistory()})
              </MenuItem>
              <MenuItem value="true">Disable</MenuItem>
            </CssTextField>
          </Grid>
        )}
        <Grid size={12}>
          <Button
            variant="contained"
            fullWidth
            startIcon={<Restore />}
            onClick={resetToDefault}
          >
            Reset To Default
          </Button>
        </Grid>
      </Grid>
    </CssCard>
  );
}

export default PanelSettings;
