/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import * as config from '.';
import { useAppDispatch, useAppSelector } from '../../hooks';

export interface UseWithConfig {
  state: config.ConfigState;
  loadConfig: () => void;
  isConfigLoaded: () => boolean;
  updateConfig: (accessToken: string, key: string, value: string) => void;
  loadFailed: () => boolean;
}

export function useWithConfig(): UseWithConfig {
  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => state.config);

  function isConfigLoaded(): boolean {
    return state.status === config.ConfigStatus.SUCCEEDED;
  }

  function loadFailed(): boolean {
    return state.status === config.ConfigStatus.FAILED;
  }

  function loadConfig() {
    if (
      state.status === config.ConfigStatus.NONE ||
      state.status === config.ConfigStatus.FAILED ||
      state.status === config.ConfigStatus.SUCCEEDED
    ) {
      dispatch(config.getConfig());
    }
  }

  function updateConfig(key: string, value: string) {
    dispatch(config.updateConfig({ key, value }));
  }

  return {
    state,
    loadConfig,
    isConfigLoaded,
    updateConfig,
    loadFailed,
  };
}
