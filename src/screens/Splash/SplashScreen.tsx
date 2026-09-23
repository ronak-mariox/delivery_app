import React, {useEffect} from 'react';
import {Image, StatusBar, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {colors, spacing, typography} from '../../theme';
import {useDriverAuth} from '../../context/DriverAuthContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

const MIN_SPLASH_MS = 1400;

export function SplashScreen({navigation}: Props) {
  const {isAuthenticated, isLoading} = useDriverAuth();

  useEffect(() => {
    // Wait for the auth context to finish restoring any stored session
    // before deciding where to go, then hold the splash for a minimum time.
    if (isLoading) {
      return;
    }
    const timer = setTimeout(() => {
      navigation.replace(isAuthenticated ? 'Home' : 'Welcome');
    }, MIN_SPLASH_MS);
    return () => clearTimeout(timer);
  }, [isLoading, isAuthenticated, navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <Image source={require('../../assets/images/splash-logo.png')} style={styles.logo} resizeMode="contain" />
      <View style={styles.footer}>
        <View style={styles.dots}>
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
        <Text style={styles.version}>v1.0.0</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', gap: spacing.xl},
  logo: {width: 260, height: 104},
  footer: {position: 'absolute', bottom: 64, alignItems: 'center', gap: spacing.md},
  dots: {flexDirection: 'row', gap: 6},
  dot: {width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.35)'},
  dotActive: {width: 24, backgroundColor: colors.white},
  version: {...typography.caption, color: 'rgba(255,255,255,0.5)'},
});
