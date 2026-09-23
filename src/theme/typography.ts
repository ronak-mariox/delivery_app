import {Platform, TextStyle} from 'react-native';

// Design uses Inter; falls back to each platform's system sans (San Francisco /
// Roboto) which shares Inter's neutral grotesque proportions closely enough
// that no custom font linking is required for this pass.
export const fontFamily = Platform.select({ios: 'System', android: 'sans-serif', default: 'System'});

export const fontWeights = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
} as const satisfies Record<string, TextStyle['fontWeight']>;

type Weight = keyof typeof fontWeights;

const scale = (size: number, weight: Weight, lineHeight?: number): TextStyle => ({
  fontFamily,
  fontSize: size,
  fontWeight: fontWeights[weight],
  lineHeight: lineHeight ?? Math.round(size * 1.5),
});

export const typography = {
  display: scale(36, 'bold'),
  h1: scale(28, 'extrabold'),
  h2: scale(26, 'extrabold'),
  h3: scale(24, 'extrabold'),
  h4: scale(20, 'bold'),
  title: scale(18, 'bold'),
  titleSm: scale(17, 'bold'),
  subtitle: scale(16, 'bold'),
  bodyLg: scale(15, 'regular'),
  bodyLgMedium: scale(15, 'semibold'),
  body: scale(14, 'regular'),
  bodyMedium: scale(14, 'medium'),
  bodySemibold: scale(14, 'semibold'),
  bodyBold: scale(14, 'bold'),
  label: scale(13, 'medium'),
  labelSemibold: scale(13, 'semibold'),
  caption: scale(12, 'regular'),
  captionMedium: scale(12, 'medium'),
  captionSemibold: scale(12, 'semibold'),
  overline: scale(11, 'semibold'),
  micro: scale(9, 'regular'),
} as const;

export type TypographyVariant = keyof typeof typography;
