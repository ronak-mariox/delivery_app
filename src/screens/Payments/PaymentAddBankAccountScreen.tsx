import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'PaymentAddBankAccount'>;

const ACCOUNT_TYPES = ['Savings', 'Current'];

export function PaymentAddBankAccountScreen({navigation}: Props) {
  const [revealed, setRevealed] = useState(false);
  const [accountType, setAccountType] = useState('Savings');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
          <Icon name="chevron-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Bank Account</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View>
            <Text style={styles.label}>Account Holder Name</Text>
            <View style={styles.fieldValid}>
              <Text style={styles.fieldText}>RAVI KUMAR</Text>
              <Icon name="check" size={16} color={colors.primary} />
            </View>
          </View>

          <View>
            <Text style={styles.label}>Account Number</Text>
            <View style={styles.fieldValid}>
              <Text style={styles.fieldText}>{revealed ? '5021234567' : '****1234'}</Text>
              <TouchableOpacity onPress={() => setRevealed(v => !v)} hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
                <Icon name={revealed ? 'eye-off' : 'eye'} size={16} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>

          <View>
            <Text style={styles.label}>Confirm Account Number</Text>
            <View style={styles.fieldValid}>
              <Text style={styles.fieldText}>{revealed ? '5021234567' : '****1234'}</Text>
              <Icon name="check" size={16} color={colors.primary} />
            </View>
          </View>

          <View>
            <Text style={styles.label}>IFSC Code</Text>
            <View style={styles.fieldValid}>
              <Text style={styles.fieldText}>HDFC0001234</Text>
              <Icon name="check" size={16} color={colors.primary} />
            </View>
            <View style={styles.confirmBanner}>
              <Icon name="check" size={16} color="#13845A" />
              <Text style={styles.confirmBannerText}>HDFC Bank, Koramangala Branch</Text>
            </View>
          </View>

          <View>
            <Text style={styles.label}>Account Type</Text>
            <View style={styles.typeRow}>
              {ACCOUNT_TYPES.map(type => {
                const active = type === accountType;
                return (
                  <TouchableOpacity
                    key={type}
                    style={[styles.typeButton, active && styles.typeButtonActive]}
                    activeOpacity={0.8}
                    onPress={() => setAccountType(type)}>
                    <Text style={[styles.typeButtonText, active && styles.typeButtonTextActive]}>{type}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        <View style={styles.warningBanner}>
          <Icon name="info" size={14} color={colors.warning} />
          <Text style={styles.warningText}>A ₹1 penny drop verification will be initiated. The amount will be refunded within 24 hours.</Text>
        </View>

        <TouchableOpacity style={styles.primaryButton} activeOpacity={0.85} onPress={() => navigation.navigate('PaymentBankVerificationStatus')}>
          <Text style={styles.primaryButtonText}>Add Bank Account</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} activeOpacity={0.85} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
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
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.xl, padding: spacing.lg, gap: spacing.md},
  label: {...typography.captionSemibold, fontSize: 12, color: colors.textPrimary, marginBottom: spacing.xs},
  fieldValid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F7FFF9',
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  fieldText: {...typography.body, fontSize: 14, color: colors.textPrimary},
  confirmBanner: {flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.primarySurface, borderRadius: radius.sm, paddingHorizontal: spacing.md, paddingVertical: spacing.xs, marginTop: spacing.xs},
  confirmBannerText: {...typography.captionMedium, fontSize: 12, color: '#13845A'},
  typeRow: {flexDirection: 'row', gap: spacing.sm},
  typeButton: {flex: 1, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.md, paddingVertical: spacing.sm, alignItems: 'center'},
  typeButtonActive: {backgroundColor: colors.primary, borderColor: colors.primary},
  typeButtonText: {...typography.bodyMedium, fontSize: 14, color: colors.textPrimary},
  typeButtonTextActive: {color: colors.white, fontWeight: '600'},
  warningBanner: {flexDirection: 'row', gap: spacing.sm, backgroundColor: colors.warningSurface, borderWidth: 1, borderColor: colors.warning, borderRadius: radius.md, padding: spacing.md},
  warningText: {...typography.label, fontSize: 13, color: colors.warningText, flex: 1},
  primaryButton: {backgroundColor: colors.primary, borderRadius: radius.lg, paddingVertical: spacing.md, alignItems: 'center'},
  primaryButtonText: {...typography.bodySemibold, fontSize: 15, color: colors.white},
  cancelButton: {paddingVertical: spacing.md, alignItems: 'center'},
  cancelButtonText: {...typography.bodyMedium, fontSize: 15, color: colors.textSecondary},
});
