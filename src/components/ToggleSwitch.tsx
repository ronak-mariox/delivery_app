import React, {useEffect, useRef} from 'react';
import {Animated, Pressable, StyleSheet} from 'react-native';
import {colors} from '../theme';

interface ToggleSwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  activeTrackColor?: string;
  inactiveTrackColor?: string;
  disabled?: boolean;
}

const TRACK_WIDTH = 60;
const TRACK_HEIGHT = 32;
const THUMB_SIZE = 26;
const PADDING = 3;

export function ToggleSwitch({
  value,
  onValueChange,
  activeTrackColor = colors.white,
  inactiveTrackColor = colors.dark700,
  disabled = false,
}: ToggleSwitchProps) {
  const progress = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: value ? 1 : 0,
      duration: 180,
      useNativeDriver: false,
    }).start();
  }, [value, progress]);

  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [PADDING, TRACK_WIDTH - THUMB_SIZE - PADDING],
  });

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{checked: value, disabled}}
      disabled={disabled}
      onPress={() => onValueChange(!value)}
      style={[
        styles.track,
        {backgroundColor: value ? activeTrackColor : inactiveTrackColor, opacity: disabled ? 0.5 : 1},
      ]}>
      <Animated.View style={[styles.thumb, {transform: [{translateX}]}]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: TRACK_WIDTH,
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
    justifyContent: 'center',
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: colors.dark600,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 3,
    shadowOffset: {width: 0, height: 2},
    elevation: 2,
  },
});
