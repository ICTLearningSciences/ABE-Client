/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import axios, { CancelTokenSource } from 'axios';
import { AiServicesResponseTypes } from '../ai-services/ai-service-types';
import { AiPromptStep } from '../types';
import { asyncPromptExecute } from './use-with-synchronous-polling';
import { useState } from 'react';
import { useAppSelector } from '../store/hooks';
import { useWithConfig } from '../store/slices/config/use-with-config';
export function useWithExecutePrompt() {
  const userId: string | undefined = useAppSelector(
    (state) => state.login.user?._id
  );
  const [abortController, setAbortController] = useState<{
    controller: AbortController;
    source: CancelTokenSource;
  }>();
  const curDocId: string = useAppSelector((state) => state.state.curDocId);
  const { availableAiServiceModels } = useWithConfig();
  const defaultAiServiceModel = useAppSelector(
    (state) => state.config.config?.defaultAiModel
  );
  const configAiServiceModelOverride = useAppSelector(
    (state) => state.config.config?.overrideAiModel
  );
  const localAiServiceModelOverride = useAppSelector(
    (state) => state.state.overrideAiServiceModel
  );

  /**
   * Process to ENSURE only available models are used in prompt steps
   */
  function applyAvailableModelsToPromptSteps(
    promptSteps: AiPromptStep[]
  ): AiPromptStep[] {
    return promptSteps.map((step) => {
      step.targetAiServiceModel =
        localAiServiceModelOverride ||
        configAiServiceModelOverride ||
        step.targetAiServiceModel;
      const targetAvailableAiService = availableAiServiceModels.find(
        (model) => model.serviceName === step.targetAiServiceModel?.serviceName
      );
      const targetServiceIsAvailable = Boolean(
        targetAvailableAiService?.models.find(
          (model) => model === step.targetAiServiceModel?.model
        )
      );
      if (targetServiceIsAvailable) {
        return step;
      } else if (defaultAiServiceModel) {
        step.targetAiServiceModel = defaultAiServiceModel;
        return step;
      } else {
        throw new Error(
          'Target AI Service Model is not available. Please select a different model.'
        );
      }
    });
  }

  async function executePromptSteps(
    aiPromptSteps: AiPromptStep[],
    callback?: (response: AiServicesResponseTypes) => void
  ) {
    const abortController = new AbortController();
    const source = axios.CancelToken.source();
    setAbortController({
      controller: abortController,
      source,
    });
    const processedAiPromptSteps =
      applyAvailableModelsToPromptSteps(aiPromptSteps);

    const res = await asyncPromptExecute(
      curDocId,
      processedAiPromptSteps,
      userId || '',
      source.token
    );

    if (callback && !abortController.signal.aborted) callback(res);
    return res;
  }

  return {
    abortController,
    executePromptSteps,
  };
}
