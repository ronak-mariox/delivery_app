import React, {PropsWithChildren} from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {colors, radius, shadows, spacing} from '../theme';

interface CardProps {
  style?: StyleProp<ViewStyle>;
  padded?: boolean;
  bordered?: boolean;
  elevated?: boolean;
}

export function Card({children, style, padded = true, bordered = true, elevated = false}: PropsWithChildren<CardProps>) {
  return (
    <View
      style={[
        styles.base,
        padded && styles.padded,
        bordered && styles.bordered,
        elevated && shadows.sm,
        style,
      ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {backgroundColor: colors.surface, borderRadius: radius.xxl, width: '100%'},
  padded: {padding: spacing.lg},
  bordered: {borderWidth: 1.5, borderColor: colors.border},
});
