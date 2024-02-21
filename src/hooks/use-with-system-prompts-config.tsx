import { fetchSystemPrompts, updateConfigByKey } from './api';
import { useWithData } from './use-with-data';

export function useWithSystemPromptsConfig() {
  const {
    data,
    editedData,
    isEdited,
    isLoading,
    isSaving,
    editData,
    saveAndReturnData,
    reloadData,
  } = useWithData<string[]>(fetch);

  function fetch() {
    return fetchSystemPrompts();
  }

  function editOrAddSystemPrompt(i: number, data: string) {
    if (!editedData) {
      return;
    }
    const newData = [...editedData];
    newData[i] = data;
    editData(newData);
  }

  function deleteSystemPrompt(i: number) {
    if (!editedData) {
      return;
    }
    const newData = [...editedData];
    newData.splice(i, 1);
    editData(newData);
  }

  function saveWrapper(value: string[]) {
    return updateConfigByKey('openaiSystemPrompt', value);
  }

  function save() {
    if (!editedData) {
      return;
    }
    saveAndReturnData({ action: saveWrapper }, editedData);
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
    editOrAddSystemPrompt,
    save,
    deleteSystemPrompt,
  };
}
