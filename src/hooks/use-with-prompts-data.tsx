import { GQLPrompt, GQLResPrompts } from '../types';
import { fetchPrompts } from './api';
import { useWithData } from './use-with-data';

export function useWithPromptsData() {
  const {
    data,
    editedData,
    isEdited,
    isLoading,
    isSaving,
    error,
    editData,
    saveAndReturnData,
    reloadData,
  } = useWithData<GQLResPrompts>(fetch);

  function fetch() {
    return fetchPrompts();
  }

  return {
    data,
    editedData,
    isLoading,
    isSaving,
    editData,
    reloadData,
    saveAndReturnData,
    isEdited,
  };
}
