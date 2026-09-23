import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors, typography} from '../theme';

interface AvatarProps {
  initials: string;
  size?: number;
  backgroundColor?: string;
  textColor?: string;
}

export function Avatar({initials, size = 44, backgroundColor = colors.primary, textColor = colors.textInverse}: AvatarProps) {
  return (
    <View
      style={[
        styles.base,
        {width: size, height: size, borderRadius: size / 2, backgroundColor},
      ]}>
      <Text style={[typography.bodyBold, {color: textColor, fontSize: size * 0.36}]}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {alignItems: 'center', justifyContent: 'center'},
});
