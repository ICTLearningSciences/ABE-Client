import { RagStoreConfiguration } from '../../../types';

export interface Panelist {
  clientId: string;
  promptSegment: string;
  roleSegment: string;
  profilePicture: string;
  panelistName: string;
  panelistDescription: string;
  introductionMessage: string;
  ragConfig?: RagStoreConfiguration;
}

export interface Panel {
  clientId: string;
  panelName: string;
  panelDescription: string;
  panelists: string[];
}
