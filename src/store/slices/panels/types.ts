/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/

import type { RagStoreConfiguration } from "../../../types";

export interface TTSConfig {
  voice: string;
  engine: string;
  language: string;
}

export interface Panelist {
  clientId: string;
  promptSegment: string;
  roleSegment: string;
  profilePicture: string;
  panelistName: string;
  panelistDescription: string;
  introductionMessage: string;
  ragConfig?: RagStoreConfiguration;
  ttsConfig: TTSConfig;
}

export interface Panel {
  clientId: string;
  panelName: string;
  panelDescription: string;
  panelists: string[];
}

export interface PanelResponseConfiguration {
  id: string;
  webSearch: boolean;
  includeChatLog: boolean;
  responseLength: ResponseLength;
  difficultyLevel: ResponseLength;
}

export type ResponseLength = "low" | "med" | "high";
