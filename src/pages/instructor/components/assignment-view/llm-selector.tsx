import React from 'react';
import { FormControl, FormLabel, MenuItem } from '@mui/material';
import { Select } from '@mui/material';
import {
  aiServiceModelStringParse,
  aiServiceModelToString,
} from '../../../../helpers';
import { useWithConfig } from '../../../../store/slices/config/use-with-config';
import { AiServiceModel } from '../../../../types';
import { useAppSelector } from '../../../../store/hooks';

export function LLMSelector(props: {
  selectedLLM?: AiServiceModel;
  handleLLMChange: (defaultLLM: AiServiceModel) => void;
  loading: boolean;
}) {
  const { selectedLLM, handleLLMChange, loading } = props;
  const { availableAiServiceModels } = useWithConfig();
  const globalDefaultAiServiceModel = useAppSelector(
    (state) => state.config.config?.defaultAiModel
  );

  return (
    <FormControl fullWidth sx={{ mt: 1 }}>
      <FormLabel>Default LLM</FormLabel>
      <Select
        value={
          selectedLLM
            ? aiServiceModelToString(selectedLLM)
            : globalDefaultAiServiceModel
            ? aiServiceModelToString(globalDefaultAiServiceModel)
            : ''
        }
        onChange={(e) =>
          handleLLMChange(aiServiceModelStringParse(e.target.value))
        }
        data-cy="assignment-modal-default-llm-select"
        disabled={loading}
      >
        {availableAiServiceModels.map((service) => {
          return service.models.map((model) => {
            const serviceString = aiServiceModelToString({
              serviceName: service.serviceName,
              model: model,
            });
            return (
              <MenuItem key={serviceString} value={serviceString}>
                {serviceString}
              </MenuItem>
            );
          });
        })}
      </Select>
    </FormControl>
  );
}
