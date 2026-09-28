import React, {useRef} from 'react';
import {NativeSyntheticEvent, StyleSheet, TextInput, TextInputKeyPressEventData, View} from 'react-native';
import {colors, radius, typography} from '../theme';

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
}

export function OtpInput({length = 6, value, onChange}: OtpInputProps) {
  const inputs = useRef<Array<TextInput | null>>([]);
  const digits = Array.from({length}, (_, i) => value[i] ?? '');

  const handleChangeText = (text: string, index: number) => {
    const clean = text.replace(/[^0-9]/g, '');
    if (!clean) {
      const next = value.slice(0, index) + value.slice(index + 1);
      onChange(next);
      return;
    }
    const char = clean[clean.length - 1];
    const next = value.slice(0, index) + char + value.slice(index + 1);
    onChange(next.slice(0, length));
    if (index < length - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !digits[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.row}>
      {digits.map((digit, index) => {
        const isActive = index === value.length;
        return (
          <TextInput
            key={index}
            ref={r => {
              inputs.current[index] = r;
            }}
            style={[styles.box, isActive && styles.boxActive]}
            value={digit}
            onChangeText={text => handleChangeText(text, index)}
            onKeyPress={e => handleKeyPress(e, index)}
            keyboardType="number-pad"
            maxLength={1}
            textAlign="center"
            secureTextEntry
            accessibilityLabel={`OTP digit ${index + 1}`}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {flexDirection: 'row', gap: 8},
  box: {
    width: 46,
    height: 60,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.border,
    ...typography.h4,
    color: colors.textPrimary,
  },
  boxActive: {
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.15,
    shadowRadius: 0,
    shadowOffset: {width: 0, height: 0},
  },
});
