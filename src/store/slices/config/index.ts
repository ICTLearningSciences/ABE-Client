/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as api from '../../../hooks/api';
import { AiServiceModel, ColorThemeConfig, Config } from '../../../types';
import { DEFAULT_COLOR_THEME } from '../../../constants';

export enum ConfigStatus {
  NONE = 0,
  IN_PROGRESS = 1,
  SUCCEEDED = 2,
  FAILED = 3,
}

export interface ConfigState {
  config?: Config;
  status: ConfigStatus;
}

const initialState: ConfigState = {
  status: ConfigStatus.NONE,
};

export const getConfig = createAsyncThunk('config/config', async () => {
  return await api.fetchConfig();
});

export interface UpdateConfigParams {
  key: string;
  value: string;
}

export const updateConfig = createAsyncThunk(
  'config/updateConfig',
  async (params: UpdateConfigParams) => {
    return await api.updateConfigByKey(params.key, params.value);
  }
);

export const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateConfig.pending, (state) => {
        state.status = ConfigStatus.IN_PROGRESS;
      })
      .addCase(updateConfig.fulfilled, (state, action) => {
        state.config = action.payload;
        state.status = ConfigStatus.SUCCEEDED;
      })
      .addCase(getConfig.pending, (state) => {
        state.status = ConfigStatus.IN_PROGRESS;
      })
      .addCase(getConfig.fulfilled, (state, action) => {
        const availableAiServiceModels =
          action.payload.availableAiServiceModels;
        const firstAvailableAiServiceModel: AiServiceModel | undefined =
          availableAiServiceModels && availableAiServiceModels.length > 0
            ? {
                serviceName: availableAiServiceModels[0].serviceName,
                model: availableAiServiceModels[0].models[0],
              }
            : undefined;
        const defaultAiModel =
          action.payload.defaultAiModel || firstAvailableAiServiceModel;

        const colorTheme: ColorThemeConfig = {
          ...DEFAULT_COLOR_THEME,
          ...(action.payload.colorTheme || {}),
        };

        state.config = {
          ...action.payload,
          defaultAiModel,
          colorTheme,
        };

        state.status = ConfigStatus.SUCCEEDED;
      })
      .addCase(getConfig.rejected, (state) => {
        state.status = ConfigStatus.FAILED;
      });
  },
});

export default configSlice.reducer;
