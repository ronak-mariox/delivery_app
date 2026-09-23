import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'PaymentUpiAdded'>;

export function PaymentUpiAddedScreen({navigation}: Props) {
  const backToPaymentDetails = () => navigation.reset({index: 0, routes: [{name: 'PaymentHub'}]});

  return (
    <View style={styles.container}>
      <View style={styles.heroHeader}>
        <View style={styles.checkCircle}>
          <Icon name="check" size={36} color={colors.white} />
        </View>
        <Text style={styles.heroTitle}>UPI ID Added!</Text>
        <Text style={styles.heroSubtitle}>ravi.kumar@hdfc verified</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.upiCard}>
          <View style={styles.upiTopRow}>
            <Text style={styles.upiId}>ravi.kumar@hdfc</Text>
            <View style={styles.primaryPill}>
              <Text style={styles.primaryPillText}>PRIMARY</Text>
            </View>
          </View>
          <View style={styles.upiRow}>
            <Text style={styles.upiLabel}>Linked bank</Text>
            <Text style={styles.upiValue}>HDFC ****1234</Text>
          </View>
          <View style={styles.upiRow}>
            <Text style={styles.upiLabel}>Status</Text>
            <View style={styles.verifiedRow}>
              <Icon name="check-circle" size={14} color={colors.primary} />
              <Text style={styles.verifiedText}>Active · Primary</Text>
            </View>
          </View>
        </View>

        <View style={styles.noteBanner}>
          <Text style={styles.noteText}>This UPI ID will be used for all payouts.</Text>
        </View>

        <View style={styles.spacer} />

        <TouchableOpacity style={styles.primaryButton} activeOpacity={0.85} onPress={backToPaymentDetails}>
          <Text style={styles.primaryButtonText}>Back to Payment Details</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.outlineButton} activeOpacity={0.85} onPress={() => navigation.navigate('PaymentUpiDetails')}>
          <Text style={styles.outlineButtonText}>Add Another UPI</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  flex: {flex: 1},
  heroHeader: {backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', gap: spacing.sm, height: 210},
  checkCircle: {width: 88, height: 88, borderRadius: 44, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center'},
  heroTitle: {...typography.h3, fontSize: 22, color: colors.white},
  heroSubtitle: {...typography.label, fontSize: 14, color: 'rgba(255,255,255,0.85)'},
  body: {padding: spacing.lg, gap: spacing.md, flexGrow: 1, paddingBottom: spacing.xxxl},
  upiCard: {backgroundColor: colors.surface, borderWidth: 2, borderColor: colors.primary, borderRadius: radius.xl, padding: spacing.lg, gap: spacing.md},
  upiTopRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  upiId: {...typography.bodyBold, fontSize: 15, color: colors.textPrimary},
  primaryPill: {backgroundColor: colors.primarySurface, borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: 4},
  primaryPillText: {...typography.captionSemibold, fontSize: 11, color: colors.primary},
  upiRow: {flexDirection: 'row', justifyContent: 'space-between'},
  upiLabel: {...typography.label, fontSize: 13, color: colors.textSecondary},
  upiValue: {...typography.labelSemibold, fontSize: 13, color: colors.textPrimary},
  verifiedRow: {flexDirection: 'row', alignItems: 'center', gap: 4},
  verifiedText: {...typography.labelSemibold, fontSize: 13, color: colors.primary},
  noteBanner: {backgroundColor: colors.primarySurface, borderRadius: radius.md, paddingHorizontal: spacing.md, paddingVertical: spacing.md},
  noteText: {...typography.label, fontSize: 13, color: '#13845A'},
  spacer: {flex: 1, minHeight: spacing.xl},
  primaryButton: {backgroundColor: colors.primary, borderRadius: radius.lg, paddingVertical: spacing.md, alignItems: 'center'},
  primaryButtonText: {...typography.bodySemibold, fontSize: 15, color: colors.white},
  outlineButton: {borderWidth: 1.5, borderColor: colors.primary, borderRadius: radius.lg, paddingVertical: spacing.md, alignItems: 'center'},
  outlineButtonText: {...typography.bodySemibold, fontSize: 15, color: colors.primary},
});
