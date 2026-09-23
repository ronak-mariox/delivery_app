import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {colors, radius} from '../theme';
import {Icon} from './Icon';

interface IconBackButtonProps {
  onPress: () => void;
  tone?: 'light' | 'dark';
}

export function IconBackButton({onPress, tone = 'light'}: IconBackButtonProps) {
  const isDark = tone === 'dark';
  return (
    <TouchableOpacity
      style={[styles.button, isDark && styles.buttonDark]}
      onPress={onPress}
      hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
      accessibilityLabel="Go back"
      accessibilityRole="button">
      <Icon name="chevron-left" size={18} color={isDark ? colors.white : colors.textPrimary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDark: {backgroundColor: 'rgba(255,255,255,0.15)', borderColor: 'rgba(255,255,255,0.3)'},
});
