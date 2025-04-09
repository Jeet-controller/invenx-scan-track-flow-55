
import { useState, useEffect } from 'react';
import { OfflineStorage } from '../services/OfflineStorage';

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(OfflineStorage.isOnline());
  const [hasPendingChanges, setHasPendingChanges] = useState<boolean>(
    OfflineStorage.getPendingSyncItems().length > 0
  );

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    // Check for pending changes at regular intervals
    const checkPendingChanges = () => {
      setHasPendingChanges(OfflineStorage.getPendingSyncItems().length > 0);
    };

    const interval = setInterval(checkPendingChanges, 5000);

    OfflineStorage.registerNetworkListeners(handleOnline, handleOffline);

    return () => {
      OfflineStorage.unregisterNetworkListeners(handleOnline, handleOffline);
      clearInterval(interval);
    };
  }, []);

  return { isOnline, hasPendingChanges };
}
