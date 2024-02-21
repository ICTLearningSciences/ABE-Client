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
