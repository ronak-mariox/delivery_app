import {Platform, ViewStyle} from 'react-native';

const create = (elevation: number, opacity: number, radius: number, offsetY: number): ViewStyle =>
  Platform.select<ViewStyle>({
    ios: {
      shadowColor: '#000000',
      shadowOpacity: opacity,
      shadowRadius: radius,
      shadowOffset: {width: 0, height: offsetY},
    },
    android: {elevation},
    default: {},
  }) as ViewStyle;

export const shadows = {
  none: {},
  sm: create(1, 0.06, 2, 1),
  md: create(3, 0.08, 6, 2),
  lg: create(6, 0.12, 12, 4),
  button: create(4, 0.28, 8, 4),
} as const;
