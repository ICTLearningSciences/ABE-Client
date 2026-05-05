import { useAppDispatch, useAppSelector } from '../../hooks';
import { LoadStatus } from '../education-management';
import * as panelApis from '.';
import { Panel, Panelist } from './types';
import {
  ActivityBuilder,
  useWithCurrentGoalActivity,
  useWithState,
} from '../../../exported-files';
import { UserRole } from '../login';

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

  useSearch: boolean;
  usePanelMode: boolean;
  activity?: ActivityBuilder;
  activePanel?: Panel;
  activePanelist?: Panelist;
  updateSearch: (useSearch: string) => void;
  setPanelMode: (usePanelMode: boolean) => void;
  setActivity: (id: string) => void;
  setActivePanel: (id: string) => void;
  setActivePanelist: (id?: string) => void;
}

export function useWithPanels(): UseWithPanels {
  const dispatch = useAppDispatch();
  const {
    panels,
    panelists,
    panelsLoadStatus,
    panelistsLoadStatus,
    useSearch,
    usePanelMode,
    activity,
    activePanel,
    activePanelist,
  } = useAppSelector((state) => state.panels);
  const { builtActivities } = useAppSelector(
    (state) => state.docGoalsActivities
  );
  const { setGoalAndActivity } = useWithCurrentGoalActivity();
  const { updateViewingUserRole } = useWithState();
  const _activity = builtActivities.find((a) => a._id === activity);
  const _panel = panels.find((p) => p.clientId === activePanel);
  const _panelist = panelists.find((p) => p.clientId === activePanelist);

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

  function updateSearch(value: string): void {
    dispatch(panelApis.setUseSearch(value === 'true'));
  }

  function setPanelMode(tf: boolean): void {
    if (tf) {
      dispatch(panelApis.setActivePanelist(undefined));
    }
    dispatch(panelApis.setPanelMode(tf));
  }

  function setActivity(id: string): void {
    const activity = builtActivities.find((a) => a._id === id);
    if (activity && activity.attachedPanel) {
      const panel = panels.find((p) => p.clientId === activity.attachedPanel);
      if (panel && activity) {
        setGoalAndActivity(undefined, activity);
        updateViewingUserRole(UserRole.USER);
        setActivePanel(activity.attachedPanel);
        dispatch(panelApis.setActivity(activity._id));
      }
    }
  }

  function setActivePanel(id: string): void {
    dispatch(panelApis.setActivePanel(id));
  }

  function setActivePanelist(id?: string): void {
    dispatch(panelApis.setActivePanelist(id));
  }

  return {
    panels,
    panelists,
    panelsLoadStatus,
    panelistsLoadStatus,
    useSearch,
    usePanelMode,
    activity: _activity,
    activePanel: _panel,
    activePanelist: _panelist,
    fetchPanels,
    fetchPanelists,
    addOrUpdatePanel,
    addOrUpdatePanelist,
    deletePanel,
    deletePanelist,
    updateSearch,
    setPanelMode,
    setActivity,
    setActivePanel,
    setActivePanelist,
  };
}
