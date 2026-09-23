import React from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import {colors, spacing, typography} from '../theme';

interface LoaderProps {
  label?: string;
  fullscreen?: boolean;
}

export function Loader({label, fullscreen = false}: LoaderProps) {
  return (
    <View style={[styles.container, fullscreen && styles.fullscreen]}>
      <ActivityIndicator size="large" color={colors.primary} />
      {!!label && <Text style={styles.label}>{label}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {alignItems: 'center', justifyContent: 'center', gap: spacing.sm, padding: spacing.xl},
  fullscreen: {flex: 1, backgroundColor: colors.background},
  label: {...typography.label, color: colors.textSecondary},
});
