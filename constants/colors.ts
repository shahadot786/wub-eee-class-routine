/**
 * WUB EEE App Color Tokens
 *
 * All colour values used in the app are defined here.
 * Components should NEVER use hardcoded hex values — always reference theme tokens.
 */

import type { ThemeColors } from '@/types';

export const darkColors: ThemeColors = {
  background: '#0f172a',
  surface: '#1a2535',
  surfaceAlt: '#0a1929',
  primary: '#1f6392',
  textPrimary: '#e2f0fb',
  textSecondary: '#64748b',
  border: '#1e293b',
  live: '#22d3ee',
  badgeClassBg: '#166534',
  badgeClassText: '#4ade80',
  badgeLabBg: '#92400e',
  badgeLabText: '#fbbf24',
};

export const lightColors: ThemeColors = {
  background: '#f0f4f8',
  surface: '#ffffff',
  surfaceAlt: '#e8edf5',
  primary: '#1f6392',
  textPrimary: '#0f172a',
  textSecondary: '#94a3b8',
  border: '#e2e8f0',
  live: '#0891b2',
  badgeClassBg: '#166534',
  badgeClassText: '#15803d',
  badgeLabBg: '#92400e',
  badgeLabText: '#d97706',
};
