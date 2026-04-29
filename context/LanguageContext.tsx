import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import bn, { type TranslationKey } from '@/i18n/bn';
import en from '@/i18n/en';
import type { Language } from '@/types';

// ─── String Maps ─────────────────────────────────────────────────

const strings: Record<Language, Record<TranslationKey, string>> = { bn, en };

// ─── Context Shape ───────────────────────────────────────────────

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  /** Translate a key, with optional {{variable}} interpolation */
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
  isReady: boolean;
}

const LanguageContext = createContext<LanguageContextValue>({
  language: 'bn',
  setLanguage: () => {},
  t: (key) => key,
  isReady: false,
});

// ─── Storage Key ─────────────────────────────────────────────────

const STORAGE_KEY = 'language';

// ─── Provider ────────────────────────────────────────────────────

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('bn');
  const [isReady, setIsReady] = useState(false);

  // Load saved preference
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((saved) => {
      if (saved === 'bn' || saved === 'en') {
        setLanguageState(saved);
      }
      setIsReady(true);
    });
  }, []);

  // Persist on change
  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    AsyncStorage.setItem(STORAGE_KEY, lang);
  }, []);

  // Translation function with interpolation
  const t = useCallback(
    (key: TranslationKey, vars?: Record<string, string | number>): string => {
      let text = strings[language]?.[key] ?? strings.bn[key] ?? key;

      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          text = text.replace(new RegExp(`\\{\\{${k}\\}\\}`, 'g'), String(v));
        }
      }

      return text;
    },
    [language],
  );

  const value = useMemo<LanguageContextValue>(
    () => ({ language, setLanguage, t, isReady }),
    [language, setLanguage, t, isReady],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

// ─── Hook ────────────────────────────────────────────────────────

export function useLanguage(): LanguageContextValue {
  return useContext(LanguageContext);
}
