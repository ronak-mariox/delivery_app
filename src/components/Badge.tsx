import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors, radius, spacing, typography} from '../theme';

export type BadgeTone = 'success' | 'warning' | 'neutral' | 'primary';

interface BadgeProps {
  label: string;
  tone?: BadgeTone;
}

export function Badge({label, tone = 'success'}: BadgeProps) {
  const palette = toneStyles[tone];
  return (
    <View style={[styles.base, {backgroundColor: palette.bg}]}>
      <Text style={[styles.text, {color: palette.text}]}>{label}</Text>
    </View>
  );
}

const toneStyles: Record<BadgeTone, {bg: string; text: string}> = {
  success: {bg: colors.successSurface, text: colors.successText},
  warning: {bg: colors.warningSurface, text: colors.warningText},
  neutral: {bg: colors.background, text: colors.textSecondary},
  primary: {bg: colors.primarySurface, text: colors.primary},
};

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
  },
  text: {...typography.captionSemibold},
});
