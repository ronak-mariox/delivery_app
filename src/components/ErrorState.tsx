import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors, spacing, typography} from '../theme';
import {Button} from './Button';
import {Icon} from './Icon';

interface ErrorStateProps {
  title: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorState({title, description, onRetry}: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Icon name="alert-triangle" size={28} color={colors.danger} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {!!description && <Text style={styles.description}>{description}</Text>}
      {onRetry && <Button label="Try Again" onPress={onRetry} variant="outline" fullWidth={false} style={styles.retryButton} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {alignItems: 'center', justifyContent: 'center', padding: spacing.xxl, gap: spacing.xs},
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.dangerSurface,
    borderWidth: 2,
    borderColor: colors.dangerBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  title: {...typography.bodyBold, fontSize: 15, color: colors.textPrimary, textAlign: 'center'},
  description: {...typography.label, color: colors.textSecondary, textAlign: 'center'},
  retryButton: {marginTop: spacing.md, paddingHorizontal: spacing.xxl},
});
