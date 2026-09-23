import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors, radius, shadows, spacing, typography} from '../theme';

interface StatTileProps {
  value: string;
  label: string;
  valueColor?: string;
  bordered?: boolean;
}

export function StatTile({value, label, valueColor = colors.textPrimary, bordered = true}: StatTileProps) {
  return (
    <View style={[styles.base, bordered ? styles.bordered : shadows.sm]}>
      <Text style={[styles.value, {color: valueColor}]} numberOfLines={1}>
        {value}
      </Text>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
  },
  bordered: {borderWidth: 1.5, borderColor: colors.border},
  value: {...typography.subtitle, fontSize: 16},
  label: {
    ...typography.micro,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginTop: 2,
  },
});
