import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon} from '../../components';
import {colors, radius, shadows, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'PayoutFailed'>;

const REASON_ROWS = [
  {label: 'Error', value: 'Bank UPI ID not verified'},
  {label: 'Error code', value: 'ERR_UPI_422'},
  {label: 'Attempted', value: 'Sep 9, 9:00 AM'},
];

const FIX_STEPS = [
  'Verify your UPI ID in settings',
  'Check if bank account is active',
  'Retry payout',
  'Contact support if issue persists',
];

export function PayoutFailedScreen({navigation}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <View style={styles.iconCircle}>
          <Icon name="x" size={34} color={colors.white} />
        </View>
        <Text style={styles.heroTitle}>Payout Failed</Text>
        <Text style={styles.heroSubtitle}>₹1,284 could not be processed.</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.reasonCard}>
          <Text style={styles.reasonTitle}>Failure Reason</Text>
          {REASON_ROWS.map((row, index) => (
            <View key={row.label} style={[styles.reasonRow, index < REASON_ROWS.length - 1 && styles.reasonRowBorder]}>
              <Text style={styles.reasonLabel}>{row.label}</Text>
              <Text style={styles.reasonValue}>{row.value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.fixSection}>
          <Text style={styles.fixTitle}>How to Fix</Text>
          <View style={styles.fixList}>
            {FIX_STEPS.map((step, index) => (
              <View key={step} style={styles.fixRow}>
                <View style={styles.fixNumber}>
                  <Text style={styles.fixNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.fixText}>{step}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.safeBanner}>
          <Text style={styles.safeText}>Your earnings are safe. This is a payment routing issue only.</Text>
        </View>

        <View style={styles.actions}>
          <Button label="Update UPI Details" variant="primary" onPress={() => navigation.navigate('BankUPIVerificationIssue')} />
          <Button label="Retry Payout" variant="outline" onPress={() => navigation.navigate('PayoutProcessing')} />
          <Button label="Contact Support" variant="ghost" textColor={colors.textSecondary} />
        </View>
      </ScrollView>
    </View>
  );
}

const RED = '#D92D20';

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  flex: {flex: 1},
  hero: {backgroundColor: RED, alignItems: 'center', paddingTop: 52, paddingBottom: spacing.xxl, paddingHorizontal: spacing.xxl},
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  heroTitle: {...typography.h4, fontSize: 24, color: colors.white},
  heroSubtitle: {...typography.body, color: 'rgba(255,255,255,0.8)', marginTop: spacing.xs},
  body: {padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxxl},
  reasonCard: {backgroundColor: colors.surface, borderWidth: 1.5, borderColor: RED, borderRadius: radius.xl, padding: spacing.lg, ...shadows.sm},
  reasonTitle: {...typography.bodySemibold, fontSize: 13, color: RED},
  reasonRow: {flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.sm, marginTop: spacing.xs},
  reasonRowBorder: {borderBottomWidth: 1, borderBottomColor: '#FEE2E2'},
  reasonLabel: {...typography.label, fontSize: 13, color: colors.textSecondary},
  reasonValue: {...typography.labelSemibold, fontSize: 13, color: colors.textPrimary},
  fixSection: {gap: spacing.sm},
  fixTitle: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary},
  fixList: {gap: spacing.sm},
  fixRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.surface, borderRadius: radius.lg, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, ...shadows.sm},
  fixNumber: {width: 24, height: 24, borderRadius: 12, backgroundColor: '#FEF3F2', alignItems: 'center', justifyContent: 'center'},
  fixNumberText: {...typography.captionSemibold, fontSize: 12, color: RED},
  fixText: {...typography.label, fontSize: 13, color: colors.textPrimary, flex: 1},
  safeBanner: {backgroundColor: '#FEF3F2', borderRadius: radius.lg, paddingHorizontal: spacing.md, paddingVertical: spacing.md},
  safeText: {...typography.labelSemibold, fontSize: 13, color: '#B42318'},
  actions: {gap: spacing.sm, marginTop: spacing.xs},
});
