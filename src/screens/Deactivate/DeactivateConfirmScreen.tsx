import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'DeactivateConfirm'>;

export function DeactivateConfirmScreen({navigation}: Props) {
  const [confirmed, setConfirmed] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
          <Icon name="chevron-left" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Confirm Deactivation</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryCardTitle}>Deactivation Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>ACCOUNT</Text>
            <Text style={styles.summaryValue}>Ravi Kumar · +91 98765 43210</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>REASON</Text>
            <Text style={styles.summaryValue}>Taking a long break</Text>
          </View>
          <View style={styles.summaryRowLast}>
            <Text style={styles.summaryLabel}>EFFECTIVE</Text>
            <Text style={styles.summaryValue}>Immediately after confirmation</Text>
          </View>
        </View>

        <View style={styles.payoutCard}>
          <View>
            <Text style={styles.payoutLabel}>Pending payout</Text>
            <Text style={styles.payoutValue}>Rs. 1,284</Text>
          </View>
          <View style={styles.payoutRight}>
            <Text style={styles.payoutDateLabel}>Processing date</Text>
            <Text style={styles.payoutDate}>Monday, Sep 9</Text>
            <Text style={styles.payoutHint}>Will be processed</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.checkboxRow} activeOpacity={0.8} onPress={() => setConfirmed(v => !v)}>
          <View style={[styles.checkbox, confirmed && styles.checkboxChecked]}>{confirmed && <Icon name="check" size={14} color={colors.white} />}</View>
          <Text style={styles.checkboxText}>I understand my account will be deactivated and I will stop receiving orders</Text>
        </TouchableOpacity>

        <View style={styles.noteBanner}>
          <Text style={styles.noteText}>Check the box above to enable deactivation. You can reactivate within 90 days.</Text>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.deactivateButton, !confirmed && styles.deactivateButtonDisabled]}
          activeOpacity={0.85}
          disabled={!confirmed}
          onPress={() => navigation.navigate('DeactivateDone')}>
          <Text style={[styles.deactivateButtonText, !confirmed && styles.deactivateButtonTextDisabled]}>Deactivate Account</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} activeOpacity={0.85} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
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
  backButton: {width: 36, height: 36, borderRadius: 18, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center'},
  headerTitle: {...typography.title, fontSize: 17, color: colors.textPrimary},
  body: {padding: spacing.lg, gap: spacing.md, paddingBottom: 140},
  summaryCard: {backgroundColor: colors.dangerSurface, borderWidth: 1.5, borderColor: colors.danger, borderRadius: radius.lg, padding: spacing.lg, gap: spacing.md},
  summaryCardTitle: {...typography.bodyBold, fontSize: 14, color: colors.danger},
  summaryRow: {gap: 2, borderBottomWidth: 1, borderBottomColor: 'rgba(217,45,32,0.15)', paddingBottom: spacing.sm},
  summaryRowLast: {gap: 2},
  summaryLabel: {...typography.captionSemibold, fontSize: 11, color: colors.danger, letterSpacing: 0.5, textTransform: 'uppercase'},
  summaryValue: {...typography.bodyMedium, fontSize: 14, color: colors.textPrimary},
  payoutCard: {flexDirection: 'row', justifyContent: 'space-between', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg},
  payoutLabel: {...typography.label, fontSize: 13, color: colors.textSecondary},
  payoutValue: {...typography.h4, fontSize: 22, color: colors.primary, marginTop: 2},
  payoutRight: {alignItems: 'flex-end'},
  payoutDateLabel: {...typography.caption, fontSize: 12, color: colors.textSecondary},
  payoutDate: {...typography.bodySemibold, fontSize: 13, color: colors.textPrimary, marginTop: 2},
  payoutHint: {...typography.caption, fontSize: 11, color: colors.primary, marginTop: 2},
  checkboxRow: {flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg},
  checkbox: {width: 20, height: 20, borderRadius: 4, borderWidth: 1.5, borderColor: colors.danger, alignItems: 'center', justifyContent: 'center', marginTop: 1},
  checkboxChecked: {backgroundColor: colors.danger},
  checkboxText: {...typography.body, fontSize: 14, color: colors.textPrimary, flex: 1},
  noteBanner: {backgroundColor: '#F7F9F8', borderRadius: radius.sm, paddingHorizontal: spacing.md, paddingVertical: spacing.md},
  noteText: {...typography.caption, fontSize: 12, color: colors.textSecondary},
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    paddingBottom: spacing.xl,
  },
  deactivateButton: {backgroundColor: colors.danger, borderRadius: radius.md, height: 48, alignItems: 'center', justifyContent: 'center'},
  deactivateButtonDisabled: {backgroundColor: colors.border},
  deactivateButtonText: {...typography.bodyBold, fontSize: 15, color: colors.white},
  deactivateButtonTextDisabled: {color: colors.textMuted},
  cancelButton: {height: 40, alignItems: 'center', justifyContent: 'center'},
  cancelButtonText: {...typography.body, fontSize: 14, color: colors.textSecondary},
});
