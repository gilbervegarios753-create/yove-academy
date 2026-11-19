import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { OfflineSyncService, OfflineEvent } from '../services/offlineSyncService';

interface OfflineContextType {
  isOnline: boolean;
  pendingCount: number;
  isSyncing: boolean;
  canInstallPwa: boolean;
  installPwa: () => void;
  queueEvent: (type: OfflineEvent['type'], payload: any) => void;
  triggerSync: () => Promise<void>;
  lastSyncedAt: Date | null;
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined);

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const OfflineProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [canInstallPwa, setCanInstallPwa] = useState<boolean>(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);

  useEffect(() => {
    // Initialize offline queue
    OfflineSyncService.initQueue();
    setPendingCount(OfflineSyncService.getPendingCount());

    // Listen to network status changes
    const handleOnline = () => {
      setIsOnline(true);
      // Auto-trigger sync when returning online
      triggerSync();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // PWA BeforeInstallPrompt listener
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setCanInstallPwa(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Message listener from Service Worker
    const handleServiceWorkerMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'SYNC_TRIGGERED') {
        triggerSync();
      }
    };

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('message', handleServiceWorkerMessage);
      }
    };
  }, []);

  const queueEvent = (type: OfflineEvent['type'], payload: any) => {
    OfflineSyncService.addEvent(type, payload);
    setPendingCount(OfflineSyncService.getPendingCount());

    // If online, attempt background sync immediately
    if (navigator.onLine) {
      triggerSync();
    }
  };

  const triggerSync = async () => {
    if (isSyncing || !navigator.onLine) return;
    setIsSyncing(true);

    try {
      const res = await OfflineSyncService.syncQueue();
      if (res.synced > 0) {
        setLastSyncedAt(new Date());
      }
    } catch (e) {
      console.error('Error during offline sync:', e);
    } finally {
      setIsSyncing(false);
      setPendingCount(OfflineSyncService.getPendingCount());
    }
  };

  const installPwa = async () => {
    if (!deferredPrompt) return;
    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setCanInstallPwa(false);
        setDeferredPrompt(null);
      }
    } catch (err) {
      console.error('PWA install error:', err);
    }
  };

  return (
    <OfflineContext.Provider
      value={{
        isOnline,
        pendingCount,
        isSyncing,
        canInstallPwa,
        installPwa,
        queueEvent,
        triggerSync,
        lastSyncedAt
      }}
    >
      {children}
    </OfflineContext.Provider>
  );
};

export const useOffline = () => {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error('useOffline must be used within an OfflineProvider');
  }
  return context;
};
