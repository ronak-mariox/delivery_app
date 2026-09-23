import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors, spacing, typography} from '../theme';
import {Icon, IconName} from './Icon';

interface EmptyStateProps {
  icon?: IconName;
  title: string;
  description?: string;
}

export function EmptyState({icon = 'package', title, description}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Icon name={icon} size={28} color={colors.primary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {!!description && <Text style={styles.description}>{description}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {alignItems: 'center', justifyContent: 'center', padding: spacing.xxl, gap: spacing.xs},
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primarySurface,
    borderWidth: 2,
    borderColor: colors.primaryBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  title: {...typography.bodyBold, fontSize: 15, color: colors.textPrimary, textAlign: 'center'},
  description: {...typography.label, color: colors.textSecondary, textAlign: 'center'},
});
