/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/

import {
  type PayloadAction,
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";
import type { Panel, PanelResponseConfiguration, Panelist } from "./types";
import {
  fetchPanels as _fetchPanels,
  fetchPanelists as _fetchPanelists,
  addOrUpdatePanel as _addOrUpdatePanel,
  addOrUpdatePanelist as _addOrUpdatePanelist,
  deletePanel as _deletePanel,
  deletePanelist as _deletePanelist,
} from "./panel-apis";
import type { LoadStatus } from "../doc-goals-activities";

export interface State {
  panels: Panel[];
  panelsLoadStatus: LoadStatus;
  panelists: Panelist[];
  panelistsLoadStatus: LoadStatus;

  activity?: string;
  activePanel?: string;
  activePanelists?: string[];
  activePanelConfig: Record<string, PanelResponseConfiguration>;
}

const initialState: State = {
  panels: [],
  panelsLoadStatus: 0,
  panelists: [],
  panelistsLoadStatus: 0,

  activity: undefined,
  activePanel: undefined,
  activePanelists: undefined,
  activePanelConfig: {
    "": {
      id: "",
      useSearch: false,
      responseLength: "high",
      difficultyLevel: "low",
    },
  },
};

export const fetchPanels = createAsyncThunk("state/fetchPanels", async () => {
  return await _fetchPanels();
});

export const fetchPanelists = createAsyncThunk(
  "state/fetchPanelists",
  async () => {
    return await _fetchPanelists();
  },
);

export const addOrUpdatePanel = createAsyncThunk(
  "state/addOrUpdatePanel",
  async (panel: Panel) => {
    return await _addOrUpdatePanel(panel);
  },
);

export const addOrUpdatePanelist = createAsyncThunk(
  "state/addOrUpdatePanelist",
  async (panelist: Panelist) => {
    return await _addOrUpdatePanelist(panelist);
  },
);

export const deletePanel = createAsyncThunk(
  "state/deletePanel",
  async (panelClientId: string) => {
    return await _deletePanel(panelClientId);
  },
);

export const deletePanelist = createAsyncThunk(
  "state/deletePanelist",
  async (panelistClientId: string) => {
    return await _deletePanelist(panelistClientId);
  },
);

/** Reducer */
export const stateSlice = createSlice({
  name: "state",
  initialState,
  reducers: {
    addNewLocalPanel: (state, action: PayloadAction<Panel>) => {
      state.panels.push(action.payload);
    },
    addNewLocalPanelist: (state, action: PayloadAction<Panelist>) => {
      state.panelists.push(action.payload);
    },
    setActivity: (state, action: PayloadAction<string>) => {
      state.activity = action.payload;
    },
    setActivePanel: (state, action: PayloadAction<string>) => {
      state.activePanel = action.payload;
    },
    setActivePanelists: (
      state,
      action: PayloadAction<string[] | undefined>,
    ) => {
      state.activePanelists = action.payload;
    },
    setActivePanelConfig: (
      state,
      action: PayloadAction<Record<string, PanelResponseConfiguration>>,
    ) => {
      state.activePanelConfig = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPanels.pending, (state) => {
        state.panelsLoadStatus = 1;
      })
      .addCase(fetchPanels.fulfilled, (state, action) => {
        state.panels = action.payload;
        state.panelsLoadStatus = 2;
      })
      .addCase(fetchPanels.rejected, (state) => {
        state.panelsLoadStatus = 3;
      })

      .addCase(fetchPanelists.pending, (state) => {
        state.panelistsLoadStatus = 1;
      })
      .addCase(fetchPanelists.fulfilled, (state, action) => {
        state.panelists = action.payload;
        state.panelistsLoadStatus = 2;
      })
      .addCase(fetchPanelists.rejected, (state) => {
        state.panelistsLoadStatus = 3;
      })

      .addCase(addOrUpdatePanel.fulfilled, (state, action) => {
        const panelIndex = state.panels.findIndex(
          (p) => p.clientId === action.payload.clientId,
        );
        if (panelIndex >= 0) {
          state.panels[panelIndex] = action.payload;
        } else {
          state.panels.push(action.payload);
        }
      })
      .addCase(addOrUpdatePanelist.fulfilled, (state, action) => {
        const panelistIndex = state.panelists.findIndex(
          (p) => p.clientId === action.payload.clientId,
        );
        if (panelistIndex >= 0) {
          state.panelists[panelistIndex] = action.payload;
        } else {
          state.panelists.push(action.payload);
        }
      })

      .addCase(deletePanel.fulfilled, (state, action) => {
        state.panels = state.panels.filter(
          (p) => p.clientId !== action.payload.clientId,
        );
      })

      .addCase(deletePanelist.fulfilled, (state, action) => {
        state.panelists = state.panelists.filter(
          (p) => p.clientId !== action.payload.clientId,
        );
      });
  },
});

export const {
  addNewLocalPanel,
  addNewLocalPanelist,
  setActivity,
  setActivePanel,
  setActivePanelists,
  setActivePanelConfig,
} = stateSlice.actions;

export default stateSlice.reducer;
