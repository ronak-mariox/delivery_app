import React, {useState} from 'react';
import {ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'PaymentHub'>;

const PAYOUTS = [
  {date: 'Sep 9', amount: '₹1,284'},
  {date: 'Sep 2', amount: '₹1,146'},
  {date: 'Aug 26', amount: '₹1,084'},
];

export function PaymentHubScreen({navigation}: Props) {
  const [autoPayout, setAutoPayout] = useState(true);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
          <Icon name="chevron-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Details</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.upiCard} activeOpacity={0.85} onPress={() => navigation.navigate('PaymentUpiDetails')}>
          <View style={styles.upiTopRow}>
            <View style={styles.upiTopLeft}>
              <Icon name="credit-card" size={24} color={colors.textPrimary} />
              <Text style={styles.upiTitle}>UPI</Text>
            </View>
            <View style={styles.primaryPill}>
              <Text style={styles.primaryPillText}>PRIMARY</Text>
            </View>
          </View>
          <View style={styles.upiRow}>
            <Text style={styles.upiLabel}>UPI ID</Text>
            <Text style={styles.upiValue}>ravi.kumar@hdfc</Text>
          </View>
          <View style={styles.upiRow}>
            <Text style={styles.upiLabel}>Bank</Text>
            <Text style={styles.upiValue}>HDFC Bank ****1234</Text>
          </View>
          <View style={styles.upiRow}>
            <Text style={styles.upiLabel}>Status</Text>
            <View style={styles.verifiedRow}>
              <Icon name="check-circle" size={14} color={colors.primary} />
              <Text style={styles.verifiedText}>VERIFIED</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.addRow} activeOpacity={0.85} onPress={() => navigation.navigate('PaymentAddBankAccount')}>
          <Text style={styles.addRowText}>Add Payment Method</Text>
          <View style={styles.addIcon}>
            <Icon name="plus" size={18} color={colors.primary} />
          </View>
        </TouchableOpacity>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Payout Settings</Text>
          <View style={styles.settingsRow}>
            <Text style={styles.settingsLabel}>Payout cycle</Text>
            <Text style={styles.settingsValue}>Weekly (every Monday)</Text>
          </View>
          <View style={styles.settingsRow}>
            <Text style={styles.settingsLabel}>Minimum payout</Text>
            <Text style={styles.settingsValue}>₹100</Text>
          </View>
          <View style={[styles.settingsRow, styles.settingsRowLast]}>
            <Text style={styles.settingsLabel}>Auto-payout</Text>
            <Switch
              value={autoPayout}
              onValueChange={setAutoPayout}
              trackColor={{false: colors.border, true: colors.primary}}
              thumbColor={colors.white}
            />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Recent Payouts</Text>
          {PAYOUTS.map((payout, index) => (
            <View key={payout.date} style={[styles.payoutRow, index < PAYOUTS.length - 1 && styles.payoutRowBorder]}>
              <Text style={styles.payoutDate}>{payout.date}</Text>
              <Text style={styles.payoutAmount}>{payout.amount}</Text>
              <View style={styles.paidPill}>
                <Text style={styles.paidPillText}>PAID</Text>
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.outlineButton} activeOpacity={0.85} onPress={() => navigation.navigate('PaymentUpiDetails')}>
          <Text style={styles.outlineButtonText}>Edit Payment Method</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.ghostButton} activeOpacity={0.85} onPress={() => navigation.navigate('PaymentHistory')}>
          <Text style={styles.ghostButtonText}>View Payout History</Text>
        </TouchableOpacity>
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
  headerTitle: {...typography.title, fontSize: 18, color: colors.textPrimary},
  body: {padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxxl},
  upiCard: {backgroundColor: colors.surface, borderWidth: 2, borderColor: colors.primary, borderRadius: radius.xl, padding: spacing.lg, gap: spacing.sm},
  upiTopRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  upiTopLeft: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm},
  upiTitle: {...typography.bodySemibold, fontSize: 15, color: colors.textPrimary},
  primaryPill: {backgroundColor: colors.primarySurface, borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: 4},
  primaryPillText: {...typography.captionSemibold, fontSize: 11, color: colors.primary},
  upiRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  upiLabel: {...typography.label, fontSize: 13, color: colors.textSecondary},
  upiValue: {...typography.labelSemibold, fontSize: 13, color: colors.textPrimary},
  verifiedRow: {flexDirection: 'row', alignItems: 'center', gap: 4},
  verifiedText: {...typography.labelSemibold, fontSize: 13, color: colors.primary},
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.xl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  addRowText: {...typography.body, fontSize: 14, color: colors.textPrimary},
  addIcon: {width: 36, height: 36, borderRadius: 18, backgroundColor: colors.primarySurface, alignItems: 'center', justifyContent: 'center'},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.xl, overflow: 'hidden'},
  cardTitle: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary, padding: spacing.lg, paddingBottom: spacing.sm, borderBottomWidth: 1, borderBottomColor: '#F3F4F6'},
  settingsRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: '#F3F4F6'},
  settingsRowLast: {borderBottomWidth: 0},
  settingsLabel: {...typography.label, fontSize: 13, color: colors.textSecondary},
  settingsValue: {...typography.labelSemibold, fontSize: 13, color: colors.textPrimary},
  payoutRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingVertical: spacing.md},
  payoutRowBorder: {borderBottomWidth: 1, borderBottomColor: '#F3F4F6'},
  payoutDate: {...typography.label, fontSize: 13, color: colors.textSecondary},
  payoutAmount: {...typography.bodyBold, fontSize: 14, color: colors.textPrimary},
  paidPill: {backgroundColor: colors.primarySurface, borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: 3},
  paidPillText: {...typography.captionSemibold, fontSize: 11, color: colors.primary},
  outlineButton: {borderWidth: 1.5, borderColor: colors.primary, borderRadius: radius.lg, paddingVertical: spacing.md, alignItems: 'center'},
  outlineButtonText: {...typography.bodySemibold, fontSize: 15, color: colors.primary},
  ghostButton: {paddingVertical: spacing.md, alignItems: 'center'},
  ghostButtonText: {...typography.bodyMedium, fontSize: 15, color: colors.textSecondary},
});
