/**
 * useSchedule Hook
 *
 * Orchestrates data fetching, caching, and error handling for schedule data.
 * On mount: tries to fetch from Google Sheets → caches on success → falls back to cache on failure.
 */

import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { fetchAllData } from '@/services/sheetsService';
import { getCurrentSemester, getDaysRemaining } from '@/services/semesterService';
import type { Semester, ScheduleItem, ScheduleData } from '@/types';

// ─── Cache Keys ──────────────────────────────────────────────────

const CACHE_KEY = 'cachedScheduleData';

// ─── Hook ────────────────────────────────────────────────────────

interface UseScheduleResult {
  semesters: Semester[];
  schedule: ScheduleItem[];
  currentSemester: Semester | null;
  daysRemaining: number;
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
  isFromCache: boolean;
  refresh: (force?: boolean) => Promise<void>;
}

export function useSchedule(): UseScheduleResult {
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [currentSemester, setCurrentSemester] = useState<Semester | null>(null);
  const [daysRemaining, setDaysRemaining] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [isFromCache, setIsFromCache] = useState(false);

  // ─── Apply Data ────────────────────────────────────────────────

  const applyData = useCallback((data: { semesters: Semester[]; schedule: ScheduleItem[] }) => {
    setSemesters(data.semesters);
    setSchedule(data.schedule);

    const semester = getCurrentSemester(data.semesters);
    setCurrentSemester(semester);
    setDaysRemaining(semester ? getDaysRemaining(semester) : 0);
  }, []);

  // ─── Load from Cache ──────────────────────────────────────────

  const loadFromCache = useCallback(async (): Promise<ScheduleData | null> => {
    try {
      const cached = await AsyncStorage.getItem(CACHE_KEY);
      if (!cached) return null;
      return JSON.parse(cached) as ScheduleData;
    } catch {
      return null;
    }
  }, []);

  // ─── Save to Cache ────────────────────────────────────────────

  const saveToCache = useCallback(
    async (data: { semesters: Semester[]; schedule: ScheduleItem[] }) => {
      const timestamp = new Date().toISOString();
      const cacheData: ScheduleData = {
        ...data,
        lastUpdated: timestamp,
      };
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
      setLastUpdated(timestamp);
    },
    [],
  );

  // ─── Fetch & Refresh ──────────────────────────────────────────
  /**
   * Loads data. 
   * If force=false (default), it tries cache first. 
   * If force=true, it hits the network directly.
   */
  const refresh = useCallback(async (force = false) => {
    setIsLoading(true);
    setError(null);

    // 1. Try cache first if not forcing a refresh
    if (!force) {
      const cached = await loadFromCache();
      if (cached) {
        applyData(cached);
        setLastUpdated(cached.lastUpdated);
        setIsFromCache(true);
        setIsLoading(false);
        return; // Found in cache, stop here
      }
    }

    // 2. No cache or forced refresh -> Hit the network
    setIsFromCache(false);
    try {
      const freshData = await fetchAllData();

      if (freshData) {
        applyData(freshData);
        await saveToCache(freshData);
        setIsFromCache(false);
      } else {
        // Network failed — try cache as absolute last resort (though we already checked above)
        const cached = await loadFromCache();
        if (cached) {
          applyData(cached);
          setLastUpdated(cached.lastUpdated);
          setIsFromCache(true);
        } else {
          setError('Unable to load schedule data');
        }
      }
    } catch {
      const cached = await loadFromCache();
      if (cached) {
        applyData(cached);
        setLastUpdated(cached.lastUpdated);
        setIsFromCache(true);
      } else {
        setError('Unable to load schedule data');
      }
    } finally {
      setIsLoading(false);
    }
  }, [applyData, saveToCache, loadFromCache]);

  // ─── Initial Load ─────────────────────────────────────────────

  useEffect(() => {
    refresh(false); // Normal load (prefers cache)
  }, [refresh]);

  return {
    semesters,
    schedule,
    currentSemester,
    daysRemaining,
    isLoading,
    error,
    lastUpdated,
    isFromCache,
    refresh,
  };
}
