import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { darkColors, lightColors } from '@/constants/colors';
import type { ThemeColors, ThemeMode } from '@/types';

// ─── Context Shape ───────────────────────────────────────────────

interface ThemeContextValue {
  colors: ThemeColors;
  mode: ThemeMode;
  resolvedMode: 'light' | 'dark';
  setMode: (mode: ThemeMode) => void;
  isReady: boolean;
}

const ThemeContext = createContext<ThemeContextValue>({
  colors: darkColors,
  mode: 'auto',
  resolvedMode: 'dark',
  setMode: () => {},
  isReady: false,
});

// ─── Storage Key ─────────────────────────────────────────────────

const STORAGE_KEY = 'themeMode';

// ─── Provider ────────────────────────────────────────────────────

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useSystemColorScheme();
  const [mode, setModeState] = useState<ThemeMode>('auto');
  const [isReady, setIsReady] = useState(false);

  // Load saved preference
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((saved) => {
      if (saved === 'light' || saved === 'dark' || saved === 'auto') {
        setModeState(saved);
      }
      setIsReady(true);
    });
  }, []);

  // Persist on change
  const setMode = useCallback((newMode: ThemeMode) => {
    setModeState(newMode);
    AsyncStorage.setItem(STORAGE_KEY, newMode);
  }, []);

  // Resolve actual mode
  const resolvedMode: 'light' | 'dark' = useMemo(() => {
    if (mode === 'auto') {
      return systemScheme === 'light' ? 'light' : 'dark';
    }
    return mode;
  }, [mode, systemScheme]);

  const colors = resolvedMode === 'dark' ? darkColors : lightColors;

  const value = useMemo<ThemeContextValue>(
    () => ({ colors, mode, resolvedMode, setMode, isReady }),
    [colors, mode, resolvedMode, setMode, isReady],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

// ─── Hook ────────────────────────────────────────────────────────

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
