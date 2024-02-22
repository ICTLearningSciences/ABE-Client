/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
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
