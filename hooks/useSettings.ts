import { useSettingsContext } from '@/context/SettingsContext';

/**
 * useSettings Hook
 * 
 * Now consumes the global SettingsContext to ensure all components 
 * share the same state and react to changes (like logout) immediately.
 */
export function useSettings() {
  return useSettingsContext();
}
