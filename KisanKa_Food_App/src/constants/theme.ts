/**
 * KisanKaka design system — organic grocery palette, typography and layout tokens.
 * Light and dark palettes share the same keys so `ThemeColor` stays exhaustive.
 */

import { Platform } from 'react-native';

export const Colors = {
  light: {
    // Base
    text: '#1C2419',
    textSecondary: '#5F6B58',
    textMuted: '#8A947F',
    background: '#F7F6F0',
    backgroundElement: '#EFEEE6',
    backgroundSelected: '#E3E6D8',
    surface: '#FFFFFF',
    border: '#E6E4D9',
    // Brand
    primary: '#2E7D32',
    primaryDark: '#1E5A23',
    primarySoft: '#E7F0E3',
    onPrimary: '#FFFFFF',
    // Semantic
    accent: '#E07C24',
    accentSoft: '#FBEFE2',
    danger: '#C6453C',
    dangerSoft: '#FBEAE8',
    success: '#2E7D32',
    successSoft: '#E7F0E3',
    warning: '#B7791F',
    // Components
    skeleton: '#E8E7DE',
    overlay: 'rgba(28, 36, 25, 0.45)',
    tabInactive: '#8A947F',
  },
  dark: {
    // Base
    text: '#F2F4EC',
    textSecondary: '#ADB6A3',
    textMuted: '#7C8574',
    background: '#131711',
    backgroundElement: '#1E241B',
    backgroundSelected: '#2A3325',
    surface: '#1B2017',
    border: '#2C3427',
    // Brand
    primary: '#6FBF73',
    primaryDark: '#8ED092',
    primarySoft: '#22301F',
    onPrimary: '#0E1A0F',
    // Semantic
    accent: '#F0975A',
    accentSoft: '#33261A',
    danger: '#E57373',
    dangerSoft: '#332020',
    success: '#6FBF73',
    successSoft: '#22301F',
    warning: '#D6A353',
    // Components
    skeleton: '#242B20',
    overlay: 'rgba(0, 0, 0, 0.6)',
    tabInactive: '#7C8574',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
} as const;

export const Shadows = {
  /** Soft card shadow — subtle lift on light surfaces. */
  card: Platform.select({
    ios: {
      shadowColor: '#1C2419',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
    },
    android: { elevation: 2 },
    default: {},
  }),
  /** Stronger shadow for floating elements (sticky CTAs, FABs). */
  raised: Platform.select({
    ios: {
      shadowColor: '#1C2419',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 16,
    },
    android: { elevation: 6 },
    default: {},
  }),
} as const;

/** Minimum accessible touch target size. */
export const TouchTarget = 44;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
