export interface RagConfig {
    includeRag: boolean;
    ragMetadataFilter: Record<string, string | string[]>;
  }
  
  export interface Panelist {
    clientId: string;
    promptSegment: string;
    roleSegment: string;
    profilePicture: string;
    panelistName: string;
    panelistDescription: string;
    introductionMessage: string;
    ragConfig: RagConfig;
    deleted: boolean;
    createdAt: Date;
    updatedAt: Date;
  }

  export interface Panel {
    clientId: string;
    panelName: string;
    panelDescription: string;
    panelists: string[];
    ragConfig: RagConfig;
    deleted: boolean;
    createdAt: Date;
    updatedAt: Date;
  }