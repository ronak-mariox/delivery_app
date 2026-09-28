import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {EmptyState, Icon, IconBackButton} from '../../components';
import {colors, radius, shadows, spacing, typography} from '../../theme';
import {useDriverAuth} from '../../context/DriverAuthContext';
import {ContactSupport} from '../Profile/ContactSupport';
import {maskAccountNumber} from '../Profile/driverDisplay';

type Props = NativeStackScreenProps<RootStackParamList, 'PaymentBankAccount'>;

export function PaymentBankAccountScreen({navigation}: Props) {
  const {driver} = useDriverAuth();
  const bank = driver?.bankDetails;
  const [revealed, setRevealed] = useState(false);

  const rows = bank
    ? [
        {label: 'Account holder name', value: bank.accountHolderName || '—'},
        {label: 'Account number', value: revealed ? bank.accountNumber : maskAccountNumber(bank.accountNumber), toggle: true},
        {label: 'IFSC code', value: bank.ifsc || '—'},
        {label: 'UPI ID', value: bank.upiId || 'Not linked'},
      ]
    : [];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconBackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Bank Account</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {bank ? (
          <>
            <View style={styles.hero}>
              <Icon name="credit-card" size={32} color={colors.white} />
              <Text style={styles.heroLabel}>PAYOUT ACCOUNT</Text>
              <Text style={styles.heroValue}>{maskAccountNumber(bank.accountNumber)}</Text>
              <Text style={styles.heroSub}>{bank.accountHolderName}</Text>
            </View>

            <View style={styles.card}>
              {rows.map((row, index) => (
                <View key={row.label} style={[styles.row, index < rows.length - 1 && styles.rowBorder]}>
                  <View style={styles.flex}>
                    <Text style={styles.rowLabel}>{row.label}</Text>
                    <Text style={styles.rowValue}>{row.value}</Text>
                  </View>
                  {row.toggle ? (
                    <TouchableOpacity onPress={() => setRevealed(current => !current)} hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
                      <Icon name={revealed ? 'eye-off' : 'eye'} size={18} color={colors.textSecondary} />
                    </TouchableOpacity>
                  ) : null}
                </View>
              ))}
            </View>
          </>
        ) : (
          <EmptyState icon="credit-card" title="No payout account" description="Bank details were not captured during registration." />
        )}

        <ContactSupport description="To change your bank account, contact support." />
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
  heroValue: {...typography.h4, fontSize: 22, color: colors.white, letterSpacing: 2},
  heroSub: {...typography.label, color: 'rgba(255,255,255,0.85)'},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, overflow: 'hidden', ...shadows.sm},
  row: {flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.md},
  rowBorder: {borderBottomWidth: 1, borderBottomColor: '#F3F4F6'},
  rowLabel: {...typography.caption, fontSize: 12, color: colors.textSecondary},
  rowValue: {...typography.bodyMedium, fontSize: 15, color: colors.textPrimary, marginTop: 3},
});
