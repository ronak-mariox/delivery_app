import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {EmptyState, Icon, IconBackButton, InfoBanner} from '../../components';
import {colors, radius, shadows, spacing, typography} from '../../theme';
import {useDriverAuth} from '../../context/DriverAuthContext';
import {ContactSupport} from '../Profile/ContactSupport';
import {maskAccountNumber} from '../Profile/driverDisplay';

type Props = NativeStackScreenProps<RootStackParamList, 'PaymentUpiDetails'>;

export function PaymentUpiDetailsScreen({navigation}: Props) {
  const {driver} = useDriverAuth();
  const bank = driver?.bankDetails;
  const upiId = bank?.upiId;

  const rows = upiId
    ? [
        {label: 'UPI ID', value: upiId},
        {label: 'Linked to', value: bank?.accountHolderName || '—'},
        {label: 'Bank account', value: maskAccountNumber(bank?.accountNumber)},
      ]
    : [];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconBackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>UPI Details</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {upiId ? (
          <>
            <View style={styles.hero}>
              <Icon name="smartphone" size={32} color={colors.white} />
              <Text style={styles.heroLabel}>UPI ID</Text>
              <Text style={styles.heroValue}>{upiId}</Text>
            </View>

            <View style={styles.card}>
              {rows.map((row, index) => (
                <View key={row.label} style={[styles.row, index < rows.length - 1 && styles.rowBorder]}>
                  <Text style={styles.rowLabel}>{row.label}</Text>
                  <Text style={styles.rowValue}>{row.value}</Text>
                </View>
              ))}
            </View>
          </>
        ) : (
          <>
            <EmptyState icon="smartphone" title="No UPI ID linked" description="A UPI ID was not provided during registration." />
            {bank ? <InfoBanner tone="neutral" icon="info" description={`Payouts are settled to your bank account ending ${maskAccountNumber(bank.accountNumber).slice(-4)}.`} /> : null}
          </>
        )}

        <ContactSupport description="To add or change your UPI ID, contact support." />
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
  headerTitle: {...typography.title, fontSize: 17, color: colors.textPrimary, flex: 1},
  body: {padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxxl},
  hero: {backgroundColor: colors.primary, borderRadius: radius.xxl, alignItems: 'center', paddingVertical: spacing.xl, paddingHorizontal: spacing.lg, gap: spacing.xs},
  heroLabel: {...typography.overline, fontSize: 10, color: 'rgba(255,255,255,0.8)', letterSpacing: 1},
  heroValue: {...typography.title, color: colors.white},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, overflow: 'hidden', ...shadows.sm},
  row: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.md},
  rowBorder: {borderBottomWidth: 1, borderBottomColor: '#F3F4F6'},
  rowLabel: {...typography.label, fontSize: 13, color: colors.textSecondary},
  rowValue: {...typography.bodyMedium, fontSize: 14, color: colors.textPrimary, flexShrink: 1, textAlign: 'right'},
});
