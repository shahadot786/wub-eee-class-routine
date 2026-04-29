/**
 * WUB EEE App Theme Configuration
 *
 * Re-exports color tokens and provides React Navigation compatible theme objects.
 */

export { darkColors, lightColors } from './colors';

import { darkColors, lightColors } from './colors';

/**
 * React Navigation compatible theme objects.
 * Used by ThemeProvider in _layout.tsx for NavigationContainer theming.
 */
export const NavigationDarkTheme = {
  dark: true,
  colors: {
    primary: darkColors.primary,
    background: darkColors.background,
    card: darkColors.surfaceAlt,
    text: darkColors.textPrimary,
    border: darkColors.border,
    notification: darkColors.live,
  },
  fonts: {
    regular: { fontFamily: 'System', fontWeight: '400' as const },
    medium: { fontFamily: 'System', fontWeight: '500' as const },
    bold: { fontFamily: 'System', fontWeight: '700' as const },
    heavy: { fontFamily: 'System', fontWeight: '900' as const },
  },
};

export const NavigationLightTheme = {
  dark: false,
  colors: {
    primary: lightColors.primary,
    background: lightColors.background,
    card: lightColors.surfaceAlt,
    text: lightColors.textPrimary,
    border: lightColors.border,
    notification: lightColors.live,
  },
  fonts: {
    regular: { fontFamily: 'System', fontWeight: '400' as const },
    medium: { fontFamily: 'System', fontWeight: '500' as const },
    bold: { fontFamily: 'System', fontWeight: '700' as const },
    heavy: { fontFamily: 'System', fontWeight: '900' as const },
  },
};
