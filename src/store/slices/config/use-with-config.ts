/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import * as config from '.';
import { AvailableAiServiceModels } from '../../../types';
import { useAppDispatch, useAppSelector } from '../../hooks';

export interface UseWithConfig {
  state: config.ConfigState;
  availableAiServiceModels: AvailableAiServiceModels[];
  loadConfig: (subdomain?: string) => void;
  isConfigLoaded: () => boolean;
  updateConfig: (accessToken: string, key: string, value: string) => void;
  loadFailed: () => boolean;
}

export function useWithConfig(): UseWithConfig {
  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => state.config);
  const userEmail = useAppSelector((state) => state.login.user?.email);
  const approvedEmailsForAiModels = state.config?.approvedEmailsForAiModels;
  const isApprovedEmail =
    userEmail && approvedEmailsForAiModels?.includes(userEmail);
  const _aiServiceModelConfigs = state.config?.aiServiceModelConfigs || [];
  // If not approved email, filter out the models that are onlyAdminUse
  const aiServiceModelConfigs = isApprovedEmail
    ? _aiServiceModelConfigs
    : _aiServiceModelConfigs.map((config) => ({
        ...config,
        modelList: config.modelList.filter((model) => !model.onlyAdminUse),
      }));

  function isConfigLoaded(): boolean {
    return state.status === config.ConfigStatus.SUCCEEDED;
  }

  function loadFailed(): boolean {
    return state.status === config.ConfigStatus.FAILED;
  }

  function loadConfig(subdomain?: string) {
    if (
      state.status === config.ConfigStatus.NONE ||
      state.status === config.ConfigStatus.FAILED ||
      state.status === config.ConfigStatus.SUCCEEDED
    ) {
      dispatch(config.getConfig(subdomain));
    }
  }

  function updateConfig(key: string, value: string) {
    dispatch(config.updateConfig({ key, value }));
  }

  return {
    state,
    availableAiServiceModels: aiServiceModelConfigs.map((config) => ({
      serviceName: config.serviceName,
      models: config.modelList.map((model) => model.name),
    })),
    loadConfig,
    isConfigLoaded,
    updateConfig,
    loadFailed,
  };
}
