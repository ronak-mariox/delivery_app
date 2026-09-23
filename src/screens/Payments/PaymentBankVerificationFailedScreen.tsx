import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'PaymentBankVerificationFailed'>;

const REASONS = ['Wrong account number', 'Inactive account', 'Incorrect IFSC', 'Name mismatch'];

export function PaymentBankVerificationFailedScreen({navigation}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <View style={styles.heroIcon}>
          <Icon name="x-circle" size={40} color={colors.white} />
        </View>
        <Text style={styles.heroTitle}>Bank Verification Failed</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.reasonCard}>
          <Text style={styles.reasonTitle}>Failure Reason</Text>
          <Text style={styles.reasonText}>Account number does not match the provided IFSC code. Please check and re-enter your details.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Common reasons for failure</Text>
          {REASONS.map((reason, index) => (
            <View key={reason} style={[styles.reasonRow, index < REASONS.length - 1 && styles.reasonRowBorder]}>
              <View style={styles.bullet} />
              <Text style={styles.reasonRowText}>{reason}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.primaryButton} activeOpacity={0.85} onPress={() => navigation.navigate('PaymentEditBankDetails')}>
          <Text style={styles.primaryButtonText}>Re-enter Bank Details</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.outlineButton} activeOpacity={0.85} onPress={() => navigation.navigate('PaymentAddBankAccount')}>
          <Text style={styles.outlineButtonText}>Try Different Account</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.ghostButton} activeOpacity={0.85}>
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
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, overflow: 'hidden'},
  cardTitle: {...typography.labelSemibold, fontSize: 13, color: colors.textPrimary, padding: spacing.lg, paddingBottom: spacing.sm},
  reasonRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm},
  reasonRowBorder: {borderBottomWidth: 1, borderBottomColor: '#F3F4F6'},
  bullet: {width: 6, height: 6, borderRadius: 3, backgroundColor: colors.danger},
  reasonRowText: {...typography.label, fontSize: 13, color: colors.textSecondary},
  primaryButton: {backgroundColor: colors.primary, borderRadius: radius.lg, paddingVertical: spacing.md, alignItems: 'center'},
  primaryButtonText: {...typography.bodySemibold, fontSize: 15, color: colors.white},
  outlineButton: {borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.lg, paddingVertical: spacing.md, alignItems: 'center'},
  outlineButtonText: {...typography.bodyMedium, fontSize: 15, color: colors.textPrimary},
  ghostButton: {paddingVertical: spacing.md, alignItems: 'center'},
  ghostButtonText: {...typography.bodyMedium, fontSize: 15, color: colors.textSecondary},
});
