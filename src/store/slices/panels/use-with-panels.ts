/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/

import { useAppDispatch, useAppSelector } from "../../hooks";
import * as panelApis from ".";
import type { Panel, PanelResponseConfiguration, Panelist } from "./types";
import {
  type ActivityBuilder,
  useWithCurrentGoalActivity,
  useWithState,
} from "../../../exported-files";
import type { LoadStatus } from "../doc-goals-activities";

export interface UseWithPanels {
  panels: Panel[];
  panelists: Panelist[];
  panelsLoadStatus: LoadStatus;
  panelistsLoadStatus: LoadStatus;
  fetchPanels: () => void;
  fetchPanelists: () => void;
  addOrUpdatePanel: (panel: Panel) => void;
  addOrUpdatePanelist: (panelist: Panelist) => void;
  deletePanel: (panelClientId: string) => void;
  deletePanelist: (panelistClientId: string) => void;

  activity?: ActivityBuilder;
  activePanel?: Panel;
  activePanelists?: Panelist[];
  activePanelConfig: Record<string, PanelResponseConfiguration>;
  setActivity: (id: string) => void;
  setActivePanel: (id: string) => void;
  setActivePanelists: (ids?: string[]) => void;
  setActivePanelConfig: (d: Record<string, PanelResponseConfiguration>) => void;
  toggleActivePanelist: (id: string) => void;
}

export function useWithPanels(): UseWithPanels {
  const dispatch = useAppDispatch();
  const {
    panels,
    panelists,
    panelsLoadStatus,
    panelistsLoadStatus,
    activity,
    activePanel,
    activePanelists,
    activePanelConfig,
  } = useAppSelector((state) => state.panels);
  const builtActivities: ActivityBuilder[] = useAppSelector(
    (state) => state.docGoalsActivities.builtActivities,
  );
  const { setGoalAndActivity } = useWithCurrentGoalActivity();
  const { updateViewingUserRole } = useWithState();
  const _activity = builtActivities.find((a) => a._id === activity);
  const _panel = panels.find((p: Panel) => p.clientId === activePanel);
  const _panelists = panelists.filter((p: Panelist) =>
    activePanelists?.includes(p.clientId),
  );

  function fetchPanels() {
    dispatch(panelApis.fetchPanels());
  }
  function fetchPanelists() {
    dispatch(panelApis.fetchPanelists());
  }

  function addOrUpdatePanel(panel: Panel) {
    dispatch(panelApis.addOrUpdatePanel(panel));
  }
  function addOrUpdatePanelist(panelist: Panelist) {
    dispatch(panelApis.addOrUpdatePanelist(panelist));
  }
  function deletePanel(panelClientId: string) {
    dispatch(panelApis.deletePanel(panelClientId));
  }
  function deletePanelist(panelistClientId: string) {
    dispatch(panelApis.deletePanelist(panelistClientId));
  }

  function setActivity(id: string): void {
    const activity = builtActivities.find((a) => a._id === id);
    if (activity && activity.attachedPanel) {
      const panel = panels.find(
        (p: Panel) => p.clientId === activity.attachedPanel,
      );
      if (panel && activity) {
        setGoalAndActivity(undefined, activity);
        updateViewingUserRole("USER");
        setActivePanel(activity.attachedPanel);
        dispatch(panelApis.setActivity(activity._id));
      }
    }
  }

  function setActivePanel(id: string): void {
    const panel = panels.find((p) => p.clientId === id);
    if (panel) {
      dispatch(panelApis.setActivePanel(id));
      setActivePanelists(panel.panelists);
    }
  }

  function setActivePanelists(ids?: string[]): void {
    dispatch(panelApis.setActivePanelists(ids));
  }

  function setActivePanelConfig(
    c: Record<string, PanelResponseConfiguration>,
  ): void {
    dispatch(panelApis.setActivePanelConfig(c));
  }

  function toggleActivePanelist(id: string): void {
    if (activePanelists?.includes(id)) {
      if (activePanelists.length > 1) {
        setActivePanelists(activePanelists.filter((p) => p !== id));
      }
    } else {
      setActivePanelists([...(activePanelists || []), id]);
    }
  }

  return {
    panels,
    panelists,
    panelsLoadStatus,
    panelistsLoadStatus,
    activity: _activity,
    activePanel: _panel,
    activePanelists: _panelists,
    activePanelConfig,
    fetchPanels,
    fetchPanelists,
    addOrUpdatePanel,
    addOrUpdatePanelist,
    deletePanel,
    deletePanelist,
    setActivity,
    setActivePanel,
    setActivePanelists,
    setActivePanelConfig,
    toggleActivePanelist,
  };
}
