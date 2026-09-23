import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'PaymentUpiVerificationFailed'>;

const FORMATS = ['name@hdfc', 'phone@ibl', 'name@oksbi'];

export function PaymentUpiVerificationFailedScreen({navigation}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <View style={styles.heroIcon}>
          <Icon name="x-circle" size={40} color={colors.white} />
        </View>
        <Text style={styles.heroTitle}>UPI Verification Failed</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.reasonCard}>
          <Text style={styles.reasonTitle}>Verification Error</Text>
          <Text style={styles.reasonText}>
            <Text style={styles.reasonBold}>ravi.kumar@hdfc</Text> could not be verified. The UPI ID may be incorrect or linked to a different
            bank.
          </Text>
        </View>

        <View>
          <Text style={styles.label}>Try again with correct UPI ID</Text>
          <View style={styles.errorField}>
            <Icon name="alert-circle" size={16} color={colors.danger} />
            <Text style={styles.errorFieldText}>ravi.kumar@hdfc</Text>
          </View>
          <Text style={styles.errorHint}>Check the UPI ID in your bank app</Text>
        </View>

        <View style={styles.formatsCard}>
          <Text style={styles.formatsLabel}>Common UPI ID formats</Text>
          <View style={styles.formatsRow}>
            {FORMATS.map(format => (
              <View key={format} style={styles.formatChip}>
                <Text style={styles.formatChipText}>{format}</Text>
              </View>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.primaryButton} activeOpacity={0.85} onPress={() => navigation.navigate('PaymentUpiDetails')}>
          <Text style={styles.primaryButtonText}>Retry with Correct UPI</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.outlineButton} activeOpacity={0.85} onPress={() => navigation.navigate('PaymentAddBankAccount')}>
          <Icon name="credit-card" size={18} color={colors.textPrimary} />
          <Text style={styles.outlineButtonText}>Use Bank Account Instead</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.ghostButton} activeOpacity={0.85}>
          <Icon name="phone" size={18} color={colors.textSecondary} />
          <Text style={styles.ghostButtonText}>Contact Support</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  flex: {flex: 1},
  hero: {backgroundColor: '#B42318', alignItems: 'center', gap: spacing.md, paddingTop: 56, paddingBottom: spacing.xl, paddingHorizontal: spacing.xl},
  heroIcon: {width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center'},
  heroTitle: {...typography.h4, fontSize: 20, color: colors.white, textAlign: 'center'},
  body: {padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxxl},
  reasonCard: {backgroundColor: colors.dangerSurface, borderWidth: 1.5, borderColor: colors.danger, borderRadius: radius.lg, padding: spacing.lg},
  reasonTitle: {...typography.bodyBold, fontSize: 13, color: colors.danger},
  reasonText: {...typography.label, fontSize: 13, color: colors.dangerText, marginTop: spacing.xs, lineHeight: 20.8},
  reasonBold: {...typography.bodyBold, fontSize: 13, color: colors.dangerText},
  label: {...typography.captionSemibold, fontSize: 12, color: colors.textPrimary, marginBottom: spacing.xs},
  errorField: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.danger,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  errorFieldText: {...typography.body, fontSize: 14, color: colors.danger},
  errorHint: {...typography.caption, fontSize: 12, color: colors.danger, marginTop: spacing.xs},
  formatsCard: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md},
  formatsLabel: {...typography.caption, fontSize: 12, color: colors.textSecondary},
  formatsRow: {flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm, flexWrap: 'wrap'},
  formatChip: {backgroundColor: colors.background, borderRadius: radius.sm, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs},
  formatChipText: {...typography.caption, fontSize: 12, color: colors.textMuted, fontFamily: 'Courier'},
  primaryButton: {backgroundColor: colors.primary, borderRadius: radius.lg, paddingVertical: spacing.md, alignItems: 'center'},
  primaryButtonText: {...typography.bodySemibold, fontSize: 15, color: colors.white},
  outlineButton: {flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.lg, paddingVertical: spacing.md},
  outlineButtonText: {...typography.bodyMedium, fontSize: 15, color: colors.textPrimary},
  ghostButton: {flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, paddingVertical: spacing.md},
  ghostButtonText: {...typography.bodyMedium, fontSize: 15, color: colors.textSecondary},
});
