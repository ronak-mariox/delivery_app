import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'PaymentUpiDetails'>;

const QUICK_SELECT = ['HDFC', 'GPay', 'PhonePe', 'Paytm'];

export function PaymentUpiDetailsScreen({navigation}: Props) {
  const [newUpi, setNewUpi] = useState('');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
          <Icon name="chevron-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>UPI Details</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.upiCard}>
          <View style={styles.upiTopRow}>
            <Text style={styles.upiId}>ravi.kumar@hdfc</Text>
            <View style={styles.verifiedPill}>
              <Icon name="check-circle" size={14} color={colors.primary} />
              <Text style={styles.verifiedPillText}>VERIFIED</Text>
            </View>
          </View>
          <View style={styles.upiRow}>
            <Text style={styles.upiLabel}>Linked Bank</Text>
            <Text style={styles.upiValue}>HDFC Bank ****1234</Text>
          </View>
          <View style={styles.upiRow}>
            <Text style={styles.upiLabel}>App</Text>
            <Text style={styles.upiValue}>HDFC Bank UPI</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Add another UPI ID</Text>
          <View style={styles.addRow}>
            <TextInput
              style={styles.input}
              placeholder="yourname@bank"
              placeholderTextColor="rgba(31,41,55,0.5)"
              value={newUpi}
              onChangeText={setNewUpi}
              autoCapitalize="none"
            />
            <TouchableOpacity style={styles.verifyButton} activeOpacity={0.85} onPress={() => navigation.navigate('PaymentUpiAdded')}>
              <Text style={styles.verifyButtonText}>Verify</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.quickSelectLabel}>Quick select</Text>
          <View style={styles.quickSelectRow}>
            {QUICK_SELECT.map(app => (
              <TouchableOpacity
                key={app}
                style={styles.quickChip}
                activeOpacity={0.8}
                onPress={() => navigation.navigate('PaymentUpiVerificationFailed')}>
                <Text style={styles.quickChipText}>{app}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.hintBanner}>
          <Text style={styles.hintText}>Your primary UPI ID is used for payouts. You can add multiple UPI IDs.</Text>
        </View>
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
  upiCard: {backgroundColor: colors.primarySurface, borderWidth: 1.5, borderColor: colors.primary, borderRadius: radius.xl, padding: spacing.lg, gap: spacing.md},
  upiTopRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  upiId: {...typography.bodyBold, fontSize: 15, color: colors.textPrimary},
  verifiedPill: {flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: colors.white, borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: 4},
  verifiedPillText: {...typography.captionSemibold, fontSize: 11, color: colors.primary},
  upiRow: {flexDirection: 'row', justifyContent: 'space-between'},
  upiLabel: {...typography.label, fontSize: 13, color: colors.textSecondary},
  upiValue: {...typography.labelSemibold, fontSize: 13, color: colors.textPrimary},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.xl, padding: spacing.lg},
  cardTitle: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary, marginBottom: spacing.md},
  addRow: {flexDirection: 'row', gap: spacing.sm},
  input: {
    flex: 1,
    backgroundColor: colors.background,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    ...typography.body,
    fontSize: 14,
    color: colors.textPrimary,
  },
  verifyButton: {backgroundColor: colors.primary, borderRadius: radius.md, paddingHorizontal: spacing.lg, alignItems: 'center', justifyContent: 'center'},
  verifyButtonText: {...typography.bodySemibold, fontSize: 14, color: colors.white},
  quickSelectLabel: {...typography.caption, fontSize: 12, color: colors.textSecondary, marginTop: spacing.md},
  quickSelectRow: {flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm, flexWrap: 'wrap'},
  quickChip: {backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: spacing.sm},
  quickChipText: {...typography.bodyMedium, fontSize: 12, color: colors.textPrimary},
  hintBanner: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, paddingHorizontal: spacing.md, paddingVertical: spacing.md},
  hintText: {...typography.label, fontSize: 13, color: colors.textSecondary, lineHeight: 20.8},
});
