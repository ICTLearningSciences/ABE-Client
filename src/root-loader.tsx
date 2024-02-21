import { useEffect } from 'react';
import { useAppSelector } from './store/hooks';
import { useWithState } from './store/slices/state/use-with-state';

export async function useLoader() {
  const userId = useAppSelector((state) => state.login.user?._id);

  const useState = useWithState();

  function initializeUserData(userId: string) {
    useState.loadUserActivityStates(userId);
  }

  useEffect(() => {
    if (!userId) return;
    initializeUserData(userId);
  }, [userId]);

  return { useState };
}
