import React from 'react';
import {
  ActivityIndicator,
  GestureResponderEvent,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {colors, radius, shadows, spacing, typography} from '../theme';
import {Icon, IconName} from './Icon';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'md' | 'lg';

interface ButtonProps {
  label: string;
  onPress?: (event: GestureResponderEvent) => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: IconName;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  textColor?: string;
  testID?: string;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'lg',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = true,
  style,
  textColor: textColorOverride,
  testID,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const containerStyles = [
    styles.base,
    size === 'lg' ? styles.sizeLg : styles.sizeMd,
    variantStyles[variant],
    fullWidth && styles.fullWidth,
    variant === 'primary' && !isDisabled && shadows.button,
    isDisabled && styles.disabled,
    style,
  ];

  const textColor =
    textColorOverride ??
    (variant === 'primary' ? colors.textInverse : variant === 'outline' || variant === 'ghost' ? colors.primary : colors.textPrimary);

  return (
    <TouchableOpacity
      testID={testID}
      accessibilityRole="button"
      accessibilityState={{disabled: isDisabled}}
      activeOpacity={0.85}
      disabled={isDisabled}
      onPress={onPress}
      style={containerStyles}
      hitSlop={{top: 4, bottom: 4, left: 4, right: 4}}>
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <View style={styles.content}>
          {icon && iconPosition === 'left' && <Icon name={icon} size={18} color={textColor} />}
          <Text style={[styles.label, {color: textColor}]} numberOfLines={1}>
            {label}
          </Text>
          {icon && iconPosition === 'right' && <Icon name={icon} size={18} color={textColor} />}
        </View>
      )}
    </TouchableOpacity>
  );
}

const variantStyles: Record<ButtonVariant, ViewStyle> = {
  primary: {backgroundColor: colors.primary},
  secondary: {backgroundColor: colors.background, borderWidth: 1.5, borderColor: colors.border},
  outline: {backgroundColor: colors.transparent, borderWidth: 1.5, borderColor: colors.primary},
  ghost: {backgroundColor: colors.transparent},
};

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sizeMd: {height: 48, paddingHorizontal: spacing.lg},
  sizeLg: {height: 52, paddingHorizontal: spacing.xl},
  fullWidth: {width: '100%'},
  disabled: {opacity: 0.5},
  content: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm},
  label: {...typography.bodySemibold, fontSize: 15},
});
