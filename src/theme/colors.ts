export const colors = {
  primary: '#1CA672',
  primaryDark: '#13845A',
  primarySurface: '#E8F7F1',
  primarySurfaceAlt: '#F0FDF7',
  primaryBorder: '#A7E3C8',

  background: '#F7F9F8',
  surface: '#FFFFFF',
  overlay: 'rgba(0,0,0,0.5)',

  border: '#E5E7EB',
  borderStrong: '#D1D5DB',

  textPrimary: '#1F2937',
  textSecondary: '#667085',
  textMuted: '#9CA3AF',
  textLabel: '#374151',
  textInverse: '#FFFFFF',

  dark900: '#1F2937',
  dark800: '#374151',
  dark700: '#4B5563',
  dark600: '#6B7280',

  warning: '#F79009',
  warningSurface: '#FFF9EC',
  warningBorder: '#FDE68A',
  warningText: '#92400E',

  danger: '#EF4444',
  dangerSurface: '#FEF2F2',
  dangerBorder: '#FECACA',
  dangerText: '#B91C1C',

  info: '#3B82F6',
  infoSurface: '#EFF6FF',

  success: '#1CA672',
  successSurface: '#DCFCE7',
  successText: '#13845A',

  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
} as const;

export type ThemeColors = typeof colors;
