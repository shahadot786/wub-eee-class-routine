import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import type { NotificationPreferences } from '@/types';
import { DEFAULT_NOTIFICATION_PREFS } from '@/types';

// ─── Storage Keys ────────────────────────────────────────────────

const KEYS = {
  userBatch: 'userBatch',
  notifPrefs: 'notifPreferences',
  cacheTimestamp: 'cacheTimestamp',
} as const;

// ─── Types ───────────────────────────────────────────────────────

interface SettingsContextType {
  userBatch: string | null;
  setUserBatch: (batch: string | null) => Promise<void>;
  notifPrefs: NotificationPreferences;
  setNotifPrefs: (prefs: NotificationPreferences) => Promise<void>;
  cacheTimestamp: string | null;
  setCacheTimestamp: (timestamp: string) => Promise<void>;
  isReady: boolean;
}

// ─── Context ─────────────────────────────────────────────────────

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [userBatch, setUserBatchState] = useState<string | null>(null);
  const [notifPrefs, setNotifPrefsState] = useState<NotificationPreferences>(DEFAULT_NOTIFICATION_PREFS);
  const [cacheTimestamp, setCacheTimestampState] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  // ─── Load All Settings ───────────────────────────────────────

  useEffect(() => {
    const load = async () => {
      try {
        const [batch, prefs, timestamp] = await AsyncStorage.multiGet([
          KEYS.userBatch,
          KEYS.notifPrefs,
          KEYS.cacheTimestamp,
        ]);

        if (batch[1]) setUserBatchState(batch[1]);
        if (prefs[1]) {
          try {
            setNotifPrefsState(JSON.parse(prefs[1]));
          } catch {
            // ignore malformed JSON — keep defaults
          }
        }
        if (timestamp[1]) setCacheTimestampState(timestamp[1]);
      } finally {
        setIsReady(true);
      }
    };
    load();
  }, []);

  // ─── Setters ─────────────────────────────────────────────────

  const setUserBatch = useCallback(async (batch: string | null) => {
    setUserBatchState(batch);
    if (batch) {
      await AsyncStorage.setItem(KEYS.userBatch, batch);
    } else {
      await AsyncStorage.removeItem(KEYS.userBatch);
    }
  }, []);

  const setNotifPrefs = useCallback(async (prefs: NotificationPreferences) => {
    setNotifPrefsState(prefs);
    await AsyncStorage.setItem(KEYS.notifPrefs, JSON.stringify(prefs));
  }, []);

  const setCacheTimestamp = useCallback(async (timestamp: string) => {
    setCacheTimestampState(timestamp);
    await AsyncStorage.setItem(KEYS.cacheTimestamp, timestamp);
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        userBatch,
        setUserBatch,
        notifPrefs,
        setNotifPrefs,
        cacheTimestamp,
        setCacheTimestamp,
        isReady,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettingsContext() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettingsContext must be used within a SettingsProvider');
  }
  return context;
}
