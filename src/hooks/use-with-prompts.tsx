/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { GQLPrompt, GQLResPrompts } from '../types';
import { storePrompts } from './api';
import { useWithPromptsData } from './use-with-prompts-data';

export interface UseWithPrompts {
  prompts: GQLPrompt[];
  isLoading: boolean;
  isSaving: boolean;
  isEdited: boolean;
  reloadData: () => void;
  editOrAddPrompt: (prompt: GQLPrompt) => void;
  handleSavePrompts: () => void;
}

export function useWithPrompts(): UseWithPrompts {
  const {
    editedData: promptsData,
    isLoading,
    isSaving,
    isEdited,
    reloadData,
    editData,
    saveAndReturnData,
  } = useWithPromptsData();
  function addPrompt(prompt: GQLPrompt) {
    if (!promptsData) {
      return;
    }
    editData({ prompts: [...promptsData.prompts, prompt] });
  }

  function editOrAddPrompt(updatedPrompt: GQLPrompt) {
    if (!promptsData) {
      return;
    }
    const newPromptsData: GQLResPrompts = JSON.parse(
      JSON.stringify(promptsData)
    );
    if (!newPromptsData) {
      return;
    }
    const promptIndex = newPromptsData.prompts.findIndex(
      (prompt) => prompt._id === updatedPrompt._id
    );
    if (promptIndex === -1) {
      addPrompt(updatedPrompt);
    } else {
      newPromptsData.prompts[promptIndex] = updatedPrompt;
      editData(newPromptsData);
    }
  }

  function handleSavePrompts() {
    if (!promptsData) {
      return;
    }
    saveAndReturnData({ action: storePrompts }, promptsData);
  }

  return {
    prompts: promptsData?.prompts || [],
    isLoading,
    isSaving,
    isEdited,
    reloadData,
    editOrAddPrompt,
    handleSavePrompts,
  };
}
