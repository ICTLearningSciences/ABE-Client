import { GoogleDoc } from '../types';
import { fetchGoogleDocs } from './api';
import { useWithData } from './use-with-data';

export function useWithGoogleDocsData(userId: string) {
  const { editedData, isLoading, isSaving, reloadData } =
    useWithData<GoogleDoc[]>(fetch);

  function fetch() {
    console.log(`fetching google docs: ${userId}`);
    return fetchGoogleDocs(userId);
  }

  return {
    googleDocs: editedData,
    isLoading,
    isSaving,
    reloadData,
  };
}
