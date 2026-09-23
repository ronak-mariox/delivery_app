import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Screen} from '../../components';
import {colors, spacing, typography} from '../../theme';
import LogoMark from '../../assets/brand/logo-mark.svg';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

export function WelcomeScreen({navigation}: Props) {
  return (
    <Screen backgroundColor={colors.background} edges={['bottom']}>
      <View style={styles.heroWrap}>
        <Image source={require('../../assets/images/welcome-hero.png')} style={styles.hero} resizeMode="cover" />
      </View>
      <View style={styles.content}>
        <View>
          <View style={styles.brandRow}>
            <LogoMark width={36} height={36} />
            <Text style={styles.brandText}>Verdant Rider</Text>
          </View>
          <Text style={styles.heading}>Start Delivering,{'\n'}Start Earning</Text>
          <Text style={styles.subtitle}>
            Join thousands of riders delivering across the city. Flexible hours, instant payouts, full support.
          </Text>
        </View>
        <View style={styles.actions}>
          <Button label="Get Started" onPress={() => navigation.navigate('RegistrationLanding')} />
          <Button label="I Already Have an Account" variant="secondary" onPress={() => navigation.navigate('Login')} />
          <Text style={styles.terms}>
            By continuing, you agree to our <Text style={styles.termsLink}>Terms</Text> & <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heroWrap: {height: 380, backgroundColor: colors.primarySurface, overflow: 'hidden'},
  hero: {width: '100%', height: '100%'},
  content: {flex: 1, justifyContent: 'space-between', paddingHorizontal: spacing.xxl, paddingTop: spacing.huge, paddingBottom: spacing.huge},
  brandRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm},
  brandText: {...typography.title, fontSize: 18, color: colors.primary},
  heading: {...typography.h3, color: colors.textPrimary, marginTop: spacing.xl},
  subtitle: {...typography.body, color: colors.textSecondary, marginTop: spacing.sm, lineHeight: 22},
  actions: {gap: spacing.md},
  terms: {...typography.caption, color: colors.textMuted, textAlign: 'center', marginTop: spacing.xs},
  termsLink: {color: colors.primary},
});
