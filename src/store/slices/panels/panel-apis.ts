import { execGql } from '../../../hooks/api';
import { Connection } from '../../../types';
import { ACCESS_TOKEN_KEY, localStorageGet } from '../../local-storage';
import { Panel, Panelist } from './types';

export const fullPanelData = `
clientId
panelName
panelDescription
panelists
`;

export const fetchPanelsQuery = `
query FetchPanels($limit: Int, $filter: String, $filterObject: Object, $sortAscending: Boolean, $sortBy: String){
  fetchPanels(limit: $limit, filter: $filter, filterObject: $filterObject, sortAscending: $sortAscending, sortBy: $sortBy) {
    edges {
      node {
        ${fullPanelData}
      }
    }
  }
}
`;

export const deletePanelMutation = `mutation DeletePanel($panelClientId: String!) {
          deletePanel(panelClientId: $panelClientId) {
            ${fullPanelData}
          }
        }
      `;

export const addOrUpdatePanelMutation = `mutation AddOrUpdatePanel($panel: PanelInputType!) {
    addOrUpdatePanel(panel: $panel) {
            ${fullPanelData}
    }
   }`;

export const fullPanelistData = `
        clientId
        panelistName
        panelistDescription
        promptSegment
        roleSegment
        profilePicture
        introductionMessage
        ragConfig {
          ragQuery
          topN
          filters
        }`;

export const fetchPanelistsQuery = `
        query FetchPanelists($limit: Int, $filter: String, $filterObject: Object, $sortAscending: Boolean, $sortBy: String){
          fetchPanelists(limit: $limit, filter: $filter, filterObject: $filterObject, sortAscending: $sortAscending, sortBy: $sortBy) {
            edges {
              node {
                ${fullPanelistData}
              }
            }
          }
        }
        `;

export const deletePanelistMutation = `mutation DeletePanelist($panelistClientId: String!) {
    deletePanelist(panelistClientId: $panelistClientId) {
        ${fullPanelistData}
    }
    }`;

export const addOrUpdatePanelistMutation = `mutation AddOrUpdatePanelist($panelist: PanelistInputType!) {
          addOrUpdatePanelist(panelist: $panelist) {
            ${fullPanelistData}
          }
         }`;

export async function fetchPanels(): Promise<Panel[]> {
  const accessToken = localStorageGet(ACCESS_TOKEN_KEY) || '';
  const res = await execGql<Connection<Panel>>(
    {
      query: fetchPanelsQuery,
      variables: {
        limit: 9999,
      },
    },
    {
      dataPath: 'fetchPanels',
      accessToken: accessToken,
    }
  );
  return res.edges.map((edge) => edge.node);
}

export async function deletePanel(panelClientId: string): Promise<Panel> {
  const accessToken = localStorageGet(ACCESS_TOKEN_KEY) || '';
  const res = await execGql<Panel>(
    {
      query: deletePanelMutation,
      variables: {
        panelClientId: panelClientId,
      },
    },
    {
      dataPath: 'deletePanel',
      accessToken: accessToken,
    }
  );
  return res;
}

export async function addOrUpdatePanel(panel: Panel): Promise<Panel> {
  const accessToken = localStorageGet(ACCESS_TOKEN_KEY) || '';
  const res = await execGql<Panel>(
    {
      query: addOrUpdatePanelMutation,
      variables: {
        panel: panel,
      },
    },
    {
      dataPath: 'addOrUpdatePanel',
      accessToken: accessToken,
    }
  );
  return res;
}

export async function fetchPanelists(): Promise<Panelist[]> {
  const accessToken = localStorageGet(ACCESS_TOKEN_KEY) || '';
  const res = await execGql<Connection<Panelist>>(
    {
      query: fetchPanelistsQuery,
    },
    {
      dataPath: 'fetchPanelists',
      accessToken: accessToken,
    }
  );
  return res.edges.map((edge) => edge.node);
}

export async function deletePanelist(
  panelistClientId: string
): Promise<Panelist> {
  const accessToken = localStorageGet(ACCESS_TOKEN_KEY) || '';
  const res = await execGql<Panelist>(
    {
      query: deletePanelistMutation,
      variables: {
        panelistClientId: panelistClientId,
      },
    },
    {
      dataPath: 'deletePanelist',
      accessToken: accessToken,
    }
  );
  return res;
}

export async function addOrUpdatePanelist(
  panelist: Panelist
): Promise<Panelist> {
  const accessToken = localStorageGet(ACCESS_TOKEN_KEY) || '';
  const res = await execGql<Panelist>(
    {
      query: addOrUpdatePanelistMutation,
      variables: {
        panelist: panelist,
      },
    },
    {
      dataPath: 'addOrUpdatePanelist',
      accessToken: accessToken,
    }
  );
  return res;
}
