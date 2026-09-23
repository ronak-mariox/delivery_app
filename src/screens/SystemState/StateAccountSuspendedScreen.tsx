import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon} from '../../components';
import {colors, radius, shadows, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'StateAccountSuspended'>;

const SUSPENSION_ROWS = [
  {label: 'Reason', value: 'Insurance document expired'},
  {label: 'Suspended on', value: 'Sep 13, 2026'},
  {label: 'Action required', value: 'Upload valid insurance', danger: true},
];

const RECOVERY_STEPS = ['Upload updated insurance document', 'Wait for verification (24–48 hours)', 'Account restored automatically'];

const RED = '#D92D20';

export function StateAccountSuspendedScreen({navigation}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <View style={styles.iconCircle}>
          <Icon name="alert-triangle" size={32} color={colors.white} />
        </View>
        <Text style={styles.heroTitle}>Account Suspended</Text>
        <Text style={styles.heroSubtitle}>Your account has been temporarily suspended.</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.suspensionCard}>
          <Text style={styles.suspensionTitle}>Suspension Details</Text>
          {SUSPENSION_ROWS.map(row => (
            <View key={row.label} style={styles.suspensionRow}>
              <Text style={styles.suspensionLabel}>{row.label}</Text>
              <Text style={[styles.suspensionValue, row.danger && {color: RED}]}>{row.value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.stepsCard}>
          <Text style={styles.stepsTitle}>Recovery Steps</Text>
          {RECOVERY_STEPS.map((step, index) => (
            <View key={step} style={styles.stepRow}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>

        <View style={styles.safeBanner}>
          <Icon name="info" size={16} color={colors.primaryDark} />
          <Text style={styles.safeText}>Your pending earnings of ₹1,284 are safe and will be paid out as scheduled.</Text>
        </View>

        <View style={styles.actions}>
          <Button label="Upload Insurance Now" onPress={() => navigation.navigate('VehicleInsurance')} />
          <Button label="Contact Support" variant="outline" onPress={() => navigation.navigate('SupportHub')} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  flex: {flex: 1},
  hero: {backgroundColor: RED, alignItems: 'center', paddingTop: 52, paddingBottom: spacing.xxl, paddingHorizontal: spacing.xxl},
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  heroTitle: {...typography.h4, fontSize: 20, color: colors.white},
  heroSubtitle: {...typography.label, fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: spacing.xxs},
  body: {padding: spacing.xl, gap: spacing.lg, paddingBottom: spacing.xxxl},
  suspensionCard: {backgroundColor: colors.surface, borderWidth: 1.5, borderColor: RED, borderRadius: radius.xl, padding: spacing.lg, ...shadows.sm},
  suspensionTitle: {...typography.bodyBold, fontSize: 12, color: RED, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: spacing.sm},
  suspensionRow: {flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.xs},
  suspensionLabel: {...typography.label, fontSize: 13, color: colors.textSecondary},
  suspensionValue: {...typography.labelSemibold, fontSize: 13, color: colors.textPrimary},
  stepsCard: {backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.xl, padding: spacing.lg},
  stepsTitle: {...typography.bodySemibold, fontSize: 13, color: colors.textPrimary, marginBottom: spacing.sm},
  stepRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.sm},
  stepNumber: {width: 24, height: 24, borderRadius: 12, backgroundColor: colors.primarySurface, alignItems: 'center', justifyContent: 'center'},
  stepNumberText: {...typography.captionSemibold, color: colors.primary},
  stepText: {flex: 1, ...typography.label, fontSize: 13, color: colors.textSecondary},
  safeBanner: {flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, backgroundColor: colors.primarySurface, borderRadius: radius.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.md},
  safeText: {flex: 1, ...typography.caption, color: colors.primaryDark, lineHeight: 18},
  actions: {gap: spacing.sm, marginTop: spacing.xs},
});
