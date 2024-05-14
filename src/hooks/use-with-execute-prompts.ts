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

export function useWithExecutePrompt() {
  const userId: string | undefined = useAppSelector(
    (state) => state.login.user?._id
  );
  const [abortController, setAbortController] = useState<{
    controller: AbortController;
    source: CancelTokenSource;
  }>();
  const googleDocId: string = useAppSelector(
    (state) => state.state.googleDocId
  );

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
    for (let i = 0; i < 3; i++) {
      try {
        const res = await asyncPromptExecute(
          googleDocId,
          aiPromptSteps,
          userId || '',
          source.token
        );
        if (callback) callback(res);
        return res;
      } catch {
        continue;
      }
    }
    throw new Error('Failed to execute prompt steps');
  }

  return {
    abortController,
    executePromptSteps,
  };
}
