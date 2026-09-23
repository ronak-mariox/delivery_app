import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {colors, radius, spacing, typography} from '../theme';

export interface ChipOption {
  label: string;
  value: string;
}

interface ChipGroupProps {
  options: ChipOption[];
  value: string;
  onChange: (value: string) => void;
  equalWidth?: boolean;
  pill?: boolean;
}

export function ChipGroup({options, value, onChange, equalWidth = true, pill = false}: ChipGroupProps) {
  return (
    <View style={styles.row}>
      {options.map(opt => {
        const selected = opt.value === value;
        return (
          <TouchableOpacity
            key={opt.value}
            activeOpacity={0.8}
            onPress={() => onChange(opt.value)}
            style={[
              styles.chip,
              pill && styles.chipPill,
              equalWidth && styles.chipEqual,
              selected && styles.chipSelected,
            ]}>
            <Text style={[styles.chipText, selected && styles.chipTextSelected]} numberOfLines={1}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm},
  chip: {
    height: 44,
    paddingHorizontal: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipPill: {height: 36, borderRadius: radius.pill},
  chipEqual: {flexGrow: 1, flexBasis: 0},
  chipSelected: {borderColor: colors.primary, backgroundColor: colors.primarySurface},
  chipText: {...typography.labelSemibold, color: colors.textSecondary, fontWeight: '400'},
  chipTextSelected: {color: colors.primary, fontWeight: '600'},
});
