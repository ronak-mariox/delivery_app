import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, EmptyState, Icon, IconBackButton, InfoBanner} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {useDriverAuth} from '../../context/DriverAuthContext';
import {ContactSupport} from '../Profile/ContactSupport';
import {maskAccountNumber} from '../Profile/driverDisplay';

type Props = NativeStackScreenProps<RootStackParamList, 'PaymentHub'>;

export function PaymentHubScreen({navigation}: Props) {
  const {driver} = useDriverAuth();
  const bank = driver?.bankDetails;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconBackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Payment Details</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {bank ? (
          <>
            <TouchableOpacity style={styles.bankCard} activeOpacity={0.85} onPress={() => navigation.navigate('PaymentBankAccount')}>
              <View style={styles.cardTopRow}>
                <View style={styles.cardTopLeft}>
                  <Icon name="credit-card" size={24} color={colors.textPrimary} />
                  <Text style={styles.cardTitle}>Bank Account</Text>
                </View>
                <View style={styles.primaryPill}>
                  <Text style={styles.primaryPillText}>PAYOUT ACCOUNT</Text>
                </View>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Account holder</Text>
                <Text style={styles.detailValue}>{bank.accountHolderName || '—'}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Account number</Text>
                <Text style={styles.detailValue}>{maskAccountNumber(bank.accountNumber)}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>IFSC</Text>
                <Text style={styles.detailValue}>{bank.ifsc || '—'}</Text>
              </View>
              <View style={styles.viewRow}>
                <Text style={styles.viewRowText}>View details</Text>
                <Icon name="chevron-right" size={16} color={colors.primary} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.upiCard} activeOpacity={0.85} onPress={() => navigation.navigate('PaymentUpiDetails')}>
              <View style={styles.upiIcon}>
                <Icon name="smartphone" size={20} color={colors.primary} />
              </View>
              <View style={styles.flex}>
                <Text style={styles.upiTitle}>UPI ID</Text>
                <Text style={styles.upiValue}>{bank.upiId || 'Not linked'}</Text>
              </View>
              <Icon name="chevron-right" size={16} color={colors.textMuted} />
            </TouchableOpacity>
          </>
        ) : (
          <EmptyState icon="credit-card" title="No payout account" description="Bank details were not captured during registration." />
        )}

        <InfoBanner
          tone="primary"
          icon="wallet"
          title="Payouts"
          description="Earnings are settled to this bank account in scheduled payout batches. Track each payout in your payout history."
        />
        <Button label="View Payout History" variant="outline" icon="bar-chart" fullWidth onPress={() => navigation.navigate('PaymentHistory')} />

        <ContactSupport description="To change your bank account or UPI ID, contact support." />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  flex: {flex: 1},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingTop: 52,
    paddingBottom: spacing.md,
  },
  headerTitle: {...typography.title, fontSize: 18, color: colors.textPrimary, flex: 1},
  body: {padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxxl},
  bankCard: {backgroundColor: colors.surface, borderWidth: 2, borderColor: colors.primary, borderRadius: radius.xl, padding: spacing.lg, gap: spacing.sm},
  cardTopRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  cardTopLeft: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm},
  cardTitle: {...typography.bodySemibold, fontSize: 15, color: colors.textPrimary},
  primaryPill: {backgroundColor: colors.primarySurface, borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: 4},
  primaryPillText: {...typography.captionSemibold, fontSize: 10, color: colors.primary},
  detailRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.md},
  detailLabel: {...typography.label, fontSize: 13, color: colors.textSecondary},
  detailValue: {...typography.labelSemibold, fontSize: 13, color: colors.textPrimary, flexShrink: 1, textAlign: 'right'},
  viewRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 2, marginTop: spacing.xs},
  viewRowText: {...typography.labelSemibold, fontSize: 13, color: colors.primary},
  upiCard: {flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.xl, padding: spacing.lg},
  upiIcon: {width: 40, height: 40, borderRadius: radius.md, backgroundColor: colors.primarySurface, alignItems: 'center', justifyContent: 'center'},
  upiTitle: {...typography.caption, fontSize: 12, color: colors.textSecondary},
  upiValue: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary, marginTop: 2},
});
