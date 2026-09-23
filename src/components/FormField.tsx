import React, {ReactNode} from 'react';
import {StyleSheet, Text, TextInput, TextInputProps, View} from 'react-native';
import {colors, radius, spacing, typography} from '../theme';
import {Icon, IconName} from './Icon';

export type FormFieldState = 'default' | 'active' | 'valid' | 'error';

interface FormFieldProps extends TextInputProps {
  label: string;
  state?: FormFieldState;
  leftIcon?: IconName;
  rightElement?: ReactNode;
  helperText?: string;
  helperTone?: 'default' | 'error' | 'success';
}

export function FormField({label, state = 'default', leftIcon, rightElement, helperText, helperTone = 'default', style, ...rest}: FormFieldProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.field, stateStyles[state]]}>
        {leftIcon && <Icon name={leftIcon} size={17} color={colors.textSecondary} />}
        <TextInput style={[styles.input, style]} placeholderTextColor={colors.textMuted} {...rest} />
        {rightElement}
      </View>
      {!!helperText && <Text style={[styles.helper, helperTone === 'error' && styles.helperError, helperTone === 'success' && styles.helperSuccess]}>{helperText}</Text>}
    </View>
  );
}

const stateStyles = StyleSheet.create({
  default: {borderColor: colors.border, backgroundColor: colors.surface},
  active: {borderColor: colors.primary, backgroundColor: colors.surface, shadowColor: colors.primary, shadowOpacity: 0.12, shadowRadius: 0, shadowOffset: {width: 0, height: 0}, elevation: 0},
  valid: {borderColor: colors.primary, backgroundColor: colors.primarySurface},
  error: {borderColor: colors.danger, backgroundColor: colors.dangerSurface},
});

const styles = StyleSheet.create({
  wrapper: {width: '100%', gap: spacing.xs},
  label: {...typography.label, color: colors.textLabel},
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1.5,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    height: 50,
  },
  input: {flex: 1, ...typography.body, color: colors.textPrimary, padding: 0},
  helper: {...typography.caption, color: colors.textMuted},
  helperError: {color: colors.dangerText},
  helperSuccess: {color: colors.primary},
});
