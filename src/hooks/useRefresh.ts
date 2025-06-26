import { useState, useCallback } from 'react';

export const useRefresh = () => {
  const [refreshCounter, setRefreshCounter] = useState(0);

  const refresh = useCallback(() => {
    setRefreshCounter(counter => counter + 1);
  }, []);

  return {
    refreshCounter,
    refresh,
  };
};