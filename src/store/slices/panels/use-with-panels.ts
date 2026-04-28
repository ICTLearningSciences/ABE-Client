import { useAppDispatch, useAppSelector } from '../../hooks';
import { LoadStatus } from '../education-management';
import * as panelApis from '.';
import { Panel, Panelist } from './types';

interface UseWithPanels {
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
}

export function useWithPanels(): UseWithPanels {
  const dispatch = useAppDispatch();
  const panels = useAppSelector((state) => state.panels.panels);
  const panelists = useAppSelector((state) => state.panels.panelists);
  const panelsLoadStatus = useAppSelector(
    (state) => state.panels.panelsLoadStatus
  );
  const panelistsLoadStatus = useAppSelector(
    (state) => state.panels.panelistsLoadStatus
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

  return {
    panels,
    panelists,
    panelsLoadStatus,
    panelistsLoadStatus,
    fetchPanels,
    fetchPanelists,
    addOrUpdatePanel,
    addOrUpdatePanelist,
    deletePanel,
    deletePanelist,
  };
}
