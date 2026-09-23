import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon, IconBackButton, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import LogoMark from '../../assets/brand/logo-mark.svg';

type Props = NativeStackScreenProps<RootStackParamList, 'RegistrationLanding'>;

const STEPS = ['Documents', 'Vehicle', 'Bank Details', 'Go Live'];

const BENEFITS = [
  {icon: 'bicycle' as const, title: 'Flexible Deliveries', subtitle: 'Choose your own hours and zones'},
  {icon: 'credit-card' as const, title: 'Daily Payouts', subtitle: 'Earnings transferred within 24 hours'},
  {icon: 'shield' as const, title: 'Full Insurance', subtitle: 'Covered while on every delivery'},
];

export function RegistrationLandingScreen({navigation}: Props) {
  return (
    <Screen backgroundColor={colors.primary} statusBarStyle="light-content" edges={['top', 'bottom']} scroll>
      <View style={styles.header}>
        <View style={styles.decorCircleLg} />
        <View style={styles.decorCircleSm} />
        <View style={styles.backWrap}>
          <IconBackButton tone="dark" onPress={() => navigation.goBack()} />
        </View>
        <LogoMark width={40} height={40} />
        <Text style={styles.title}>{'Join Verdant Rider\nPartner Programme'}</Text>
        <Text style={styles.subtitle}>Complete a quick registration and start earning in as little as 48 hours.</Text>
        <View style={styles.stepsRow}>
          {STEPS.map((step, index) => (
            <View key={step} style={styles.stepPill}>
              <View style={styles.stepBadge}>
                <Text style={styles.stepBadgeText}>{index + 1}</Text>
              </View>
              <Text style={styles.stepLabel}>{step}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.benefits}>
          {BENEFITS.map(b => (
            <View key={b.title} style={styles.benefitRow}>
              <View style={styles.benefitIcon}>
                <Icon name={b.icon} size={20} color={colors.primary} />
              </View>
              <View style={styles.benefitText}>
                <Text style={styles.benefitTitle}>{b.title}</Text>
                <Text style={styles.benefitSubtitle}>{b.subtitle}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.earningsCard}>
          <Text style={styles.earningsLabel}>ESTIMATED WEEKLY EARNINGS</Text>
          <Text style={styles.earningsValue}>{'₹8,000 – ₹15,000'}</Text>
          <Text style={styles.earningsHint}>Based on 6–8 hours/day, 5 days/week in your city</Text>
        </View>

        <View style={styles.actions}>
          <Button
            label="Start Registration"
            icon="user-plus"
            style={styles.startButton}
            onPress={() => navigation.navigate('EnterMobileNumber')}
          />
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.signInText}>
              Already registered? <Text style={styles.signInLink}>Sign In</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {backgroundColor: colors.primary, paddingHorizontal: spacing.xxl, paddingTop: spacing.lg, paddingBottom: spacing.xxl, overflow: 'hidden', gap: spacing.xs},
  decorCircleLg: {position: 'absolute', right: -60, top: -60, width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(255,255,255,0.06)'},
  decorCircleSm: {position: 'absolute', left: -30, top: 220, width: 140, height: 140, borderRadius: 70, backgroundColor: 'rgba(255,255,255,0.04)'},
  backWrap: {marginBottom: spacing.lg},
  title: {...typography.h2, color: colors.white, marginTop: spacing.md},
  subtitle: {...typography.body, color: 'rgba(255,255,255,0.75)', marginTop: spacing.xs},
  stepsRow: {flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginTop: spacing.lg},
  stepPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
  },
  stepBadge: {width: 16, height: 16, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.3)', alignItems: 'center', justifyContent: 'center'},
  stepBadgeText: {...typography.micro, fontSize: 9, fontWeight: '700', color: colors.white},
  stepLabel: {...typography.overline, fontSize: 11, color: 'rgba(255,255,255,0.85)'},
  body: {padding: spacing.xxl, gap: spacing.xl, backgroundColor: colors.background},
  benefits: {gap: spacing.sm},
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  benefitIcon: {width: 44, height: 44, borderRadius: radius.lg, backgroundColor: colors.primarySurface, alignItems: 'center', justifyContent: 'center'},
  benefitText: {flex: 1},
  benefitTitle: {...typography.bodySemibold, color: colors.textPrimary},
  benefitSubtitle: {...typography.caption, color: colors.textSecondary, marginTop: 2},
  earningsCard: {backgroundColor: colors.primarySurface, borderWidth: 1.5, borderColor: colors.primaryBorder, borderRadius: radius.xl, padding: spacing.lg},
  earningsLabel: {...typography.captionMedium, color: colors.primary, letterSpacing: 0.5, textTransform: 'uppercase'},
  earningsValue: {...typography.h3, fontSize: 28, color: colors.primary, marginTop: spacing.sm},
  earningsHint: {...typography.caption, color: colors.textSecondary, marginTop: spacing.xxs},
  actions: {gap: spacing.md},
  startButton: {},
  signInText: {...typography.caption, color: colors.textMuted, textAlign: 'center'},
  signInLink: {color: colors.primary, fontWeight: '600'},
});
