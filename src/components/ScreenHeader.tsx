import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {colors, spacing, typography} from '../theme';
import {Icon} from './Icon';

interface ScreenHeaderProps {
  title: string;
  onBack?: () => void;
  tone?: 'light' | 'dark';
}

export function ScreenHeader({title, onBack, tone = 'light'}: ScreenHeaderProps) {
  const isDark = tone === 'dark';
  return (
    <View style={[styles.container, isDark ? styles.containerDark : styles.containerLight]}>
      {onBack ? (
        <TouchableOpacity
          onPress={onBack}
          style={styles.backButton}
          hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
          accessibilityLabel="Go back"
          accessibilityRole="button">
          <Icon name="chevron-left" size={22} color={isDark ? colors.textInverse : colors.textPrimary} />
        </TouchableOpacity>
      ) : (
        <View style={styles.backButton} />
      )}
      <Text style={[styles.title, {color: isDark ? colors.textInverse : colors.textPrimary}]} numberOfLines={1}>
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  containerLight: {backgroundColor: colors.surface, borderBottomColor: colors.border},
  containerDark: {backgroundColor: colors.dark900, borderBottomColor: colors.dark800},
  backButton: {width: 36, height: 36, alignItems: 'center', justifyContent: 'center'},
  title: {...typography.titleSm},
});
