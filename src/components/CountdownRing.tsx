import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors, typography} from '../theme';

interface CountdownRingProps {
  seconds: number;
  size?: number;
  color?: string;
}

export function CountdownRing({seconds, size = 52, color = colors.primary}: CountdownRingProps) {
  return (
    <View style={[styles.ring, {width: size, height: size, borderRadius: size / 2, borderColor: color}]}>
      <Text style={[styles.text, {color, fontSize: size * 0.32}]}>{seconds}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  ring: {borderWidth: 3, alignItems: 'center', justifyContent: 'center'},
  text: {...typography.h4, fontWeight: '800'},
});
