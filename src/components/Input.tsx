import React, {useState} from 'react';
import {StyleSheet, Text, TextInput, TextInputProps, TouchableOpacity, View} from 'react-native';
import {colors, radius, spacing, typography} from '../theme';
import {Icon, IconName} from './Icon';

interface InputProps extends TextInputProps {
  label?: string;
  icon?: IconName;
  error?: string;
  isPassword?: boolean;
}

export function Input({label, icon, error, isPassword, style, ...rest}: InputProps) {
  const [focused, setFocused] = useState(false);
  const [secure, setSecure] = useState(isPassword);

  return (
    <View style={styles.wrapper}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.field,
          focused && styles.fieldFocused,
          !!error && styles.fieldError,
        ]}>
        {icon && <Icon name={icon} size={18} color={colors.textMuted} />}
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={colors.textMuted}
          onFocus={e => {
            setFocused(true);
            rest.onFocus?.(e);
          }}
          onBlur={e => {
            setFocused(false);
            rest.onBlur?.(e);
          }}
          secureTextEntry={secure}
          {...rest}
        />
        {isPassword && (
          <TouchableOpacity
            onPress={() => setSecure(s => !s)}
            hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
            accessibilityLabel={secure ? 'Show password' : 'Hide password'}>
            <Icon name={secure ? 'eye' : 'eye-off'} size={18} color={colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>
      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {width: '100%', gap: spacing.xs},
  label: {...typography.label, color: colors.textLabel},
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    height: 50,
  },
  fieldFocused: {borderColor: colors.primary},
  fieldError: {borderColor: colors.danger},
  input: {flex: 1, ...typography.body, color: colors.textPrimary, padding: 0},
  errorText: {...typography.caption, color: colors.dangerText},
});
