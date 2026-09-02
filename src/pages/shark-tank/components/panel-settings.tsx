/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { Tune } from "@mui/icons-material";
import { Grid, Typography, MenuItem } from "@mui/material";
import type { ResponseLength } from "../../../store/slices/panels/types";
import { useWithPanels } from "../../../store/slices/panels/use-with-panels";
import { CssCard, CssTextField } from ".";

function PanelSettings(): React.ReactNode {
  const { activePanelConfig, setActivePanelConfig } = useWithPanels();

  return (
    <CssCard alt title="Panel Response Settings" icon={<Tune />}>
      <Grid container spacing={1}>
        <Grid size={{ xs: 12, xl: 6 }}>
          <Typography>Response Length</Typography>
          <CssTextField
            select
            fullWidth
            value={activePanelConfig[""].responseLength}
            onChange={(e) =>
              setActivePanelConfig({
                ...activePanelConfig,
                "": {
                  ...activePanelConfig[""],
                  id: "",
                  responseLength: e.target.value as ResponseLength,
                },
              })
            }
          >
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
            value={activePanelConfig[""].difficultyLevel}
            onChange={(e) =>
              setActivePanelConfig({
                ...activePanelConfig,
                "": {
                  ...activePanelConfig[""],
                  id: "",
                  difficultyLevel: e.target.value as ResponseLength,
                },
              })
            }
          >
            <MenuItem value="low">Low</MenuItem>
            <MenuItem value="med">Medium</MenuItem>
            <MenuItem value="high">High</MenuItem>
          </CssTextField>
        </Grid>
        <Grid size={6}>
          <Typography>Use Web Search</Typography>
          <CssTextField
            select
            fullWidth
            value={`${activePanelConfig[""].webSearch}`}
            onChange={(e) =>
              setActivePanelConfig({
                ...activePanelConfig,
                "": {
                  ...activePanelConfig[""],
                  id: "",
                  webSearch: e.target.value === "true",
                },
              })
            }
          >
            <MenuItem value="true">Yes</MenuItem>
            <MenuItem value="false">No</MenuItem>
          </CssTextField>
        </Grid>
        <Grid size={6}>
          <Typography>Include Chat Log</Typography>
          <CssTextField
            select
            fullWidth
            value={`${activePanelConfig[""].includeChatLog}`}
            onChange={(e) =>
              setActivePanelConfig({
                ...activePanelConfig,
                "": {
                  ...activePanelConfig[""],
                  id: "",
                  includeChatLog: e.target.value === "true",
                },
              })
            }
          >
            <MenuItem value="true">Yes</MenuItem>
            <MenuItem value="false">No</MenuItem>
          </CssTextField>
        </Grid>
      </Grid>
    </CssCard>
  );
}

export default PanelSettings;
