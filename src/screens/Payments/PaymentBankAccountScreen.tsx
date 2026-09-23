import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'PaymentBankAccount'>;

export function PaymentBankAccountScreen({navigation}: Props) {
  const [revealed, setRevealed] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
          <Icon name="chevron-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bank Account</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.bankRow}>
            <View style={styles.bankBadge}>
              <Text style={styles.bankBadgeText}>HDFC</Text>
            </View>
            <View style={styles.flex}>
              <Text style={styles.bankName}>HDFC Bank</Text>
              <Text style={styles.bankBranch}>Koramangala Branch</Text>
            </View>
            <View style={styles.verifiedRow}>
              <Icon name="check-circle" size={15} color={colors.primary} />
              <Text style={styles.verifiedText}>VERIFIED</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Account Holder</Text>
            <Text style={styles.infoValue}>RAVI KUMAR</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Account Type</Text>
            <Text style={styles.infoValue}>Savings</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>IFSC Code</Text>
            <Text style={styles.infoValue}>HDFC0001234</Text>
          </View>
          <View style={[styles.infoRow, styles.infoRowLast]}>
            <Text style={styles.infoLabel}>Account Number</Text>
            <View style={styles.acctRow}>
              <Text style={styles.acctValue}>{revealed ? '5021234567' : '****1234'}</Text>
              <TouchableOpacity onPress={() => setRevealed(v => !v)} hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
                <Icon name={revealed ? 'eye-off' : 'eye'} size={16} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.noteBanner}>
          <Text style={styles.noteText}>Last verified Aug 14, 2024 · Penny drop completed</Text>
        </View>

        <TouchableOpacity style={styles.outlineButton} activeOpacity={0.85} onPress={() => navigation.navigate('PaymentEditBankDetails')}>
          <Text style={styles.outlineButtonText}>Edit Bank Details</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.dangerButton} activeOpacity={0.85} onPress={() => navigation.navigate('PaymentAddBankAccount')}>
          <Text style={styles.dangerButtonText}>Change Bank Account</Text>
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
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.xl, padding: spacing.lg},
  bankRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingBottom: spacing.md, borderBottomWidth: 1, borderBottomColor: '#F3F4F6'},
  bankBadge: {width: 52, height: 52, borderRadius: 26, backgroundColor: colors.border, alignItems: 'center', justifyContent: 'center'},
  bankBadgeText: {...typography.bodyBold, fontSize: 13, color: colors.textSecondary},
  bankName: {...typography.h4, fontSize: 16, color: colors.textPrimary},
  bankBranch: {...typography.label, fontSize: 13, color: colors.textSecondary, marginTop: 1},
  verifiedRow: {flexDirection: 'row', alignItems: 'center', gap: 4},
  verifiedText: {...typography.bodyBold, fontSize: 12, color: colors.primary},
  infoRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: '#F3F4F6'},
  infoRowLast: {borderBottomWidth: 0},
  infoLabel: {...typography.label, fontSize: 13, color: colors.textSecondary},
  infoValue: {...typography.labelSemibold, fontSize: 13, color: colors.textPrimary},
  acctRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm},
  acctValue: {...typography.labelSemibold, fontSize: 13, color: colors.textPrimary, fontFamily: 'Courier'},
  noteBanner: {backgroundColor: colors.primarySurface, borderRadius: radius.md, paddingHorizontal: spacing.md, paddingVertical: spacing.md},
  noteText: {...typography.label, fontSize: 13, color: '#13845A'},
  outlineButton: {borderWidth: 1.5, borderColor: colors.primary, borderRadius: radius.lg, paddingVertical: spacing.md, alignItems: 'center'},
  outlineButtonText: {...typography.bodySemibold, fontSize: 15, color: colors.primary},
  dangerButton: {paddingVertical: spacing.md, alignItems: 'center'},
  dangerButtonText: {...typography.bodyMedium, fontSize: 15, color: colors.danger},
});
