import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'DeactivateAccount'>;

const MEANS = ['No new delivery requests', 'Ongoing payouts will complete normally', 'Your data is retained for 90 days', 'You can reactivate anytime'];

export function DeactivateAccountScreen({navigation}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
          <Icon name="chevron-left" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Deactivate Account</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.warningBanner}>
          <Icon name="alert-triangle" size={20} color={colors.danger} />
          <View style={styles.flex}>
            <Text style={styles.warningTitle}>Account Deactivation Warning</Text>
            <Text style={styles.warningSubtitle}>This action will deactivate your Verdant Rider account. You will stop receiving delivery orders.</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>What Deactivation Means</Text>
          {MEANS.map(item => (
            <View key={item} style={styles.meansRow}>
              <Icon name="check" size={16} color={colors.textSecondary} />
              <Text style={styles.meansText}>{item}</Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Before you go, tell us why</Text>
          <Text style={styles.cardSubtitle}>Your feedback helps us improve. Continue to see options.</Text>
          <TouchableOpacity style={styles.reasonRow} activeOpacity={0.7} onPress={() => navigation.navigate('DeactivateReason')}>
            <Text style={styles.reasonText}>Select a reason</Text>
            <Icon name="chevron-right" size={16} color={colors.textMuted} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.primaryButton} activeOpacity={0.85} onPress={() => navigation.goBack()}>
          <Text style={styles.primaryButtonText}>Keep My Account</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.dangerButton} activeOpacity={0.85} onPress={() => navigation.navigate('DeactivateActiveDeliveryBlock')}>
          <Text style={styles.dangerButtonText}>Continue to Deactivation</Text>
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
  warningBanner: {flexDirection: 'row', gap: spacing.sm, backgroundColor: colors.dangerSurface, borderWidth: 1.5, borderColor: colors.danger, borderRadius: radius.lg, padding: spacing.lg},
  warningTitle: {...typography.bodyBold, fontSize: 14, color: colors.danger},
  warningSubtitle: {...typography.label, fontSize: 13, color: colors.warningText, marginTop: spacing.xs},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg, gap: spacing.sm},
  cardTitle: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary},
  cardSubtitle: {...typography.caption, fontSize: 13, color: colors.textSecondary, marginTop: -spacing.xs},
  meansRow: {flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm},
  meansText: {...typography.body, fontSize: 14, color: colors.textPrimary, flex: 1},
  reasonRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: spacing.sm},
  reasonText: {...typography.label, fontSize: 13, color: colors.textSecondary},
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
  primaryButton: {backgroundColor: colors.primary, borderRadius: radius.md, height: 48, alignItems: 'center', justifyContent: 'center'},
  primaryButtonText: {...typography.bodyBold, fontSize: 15, color: colors.white},
  dangerButton: {borderWidth: 1.5, borderColor: colors.danger, borderRadius: radius.md, height: 44, alignItems: 'center', justifyContent: 'center'},
  dangerButtonText: {...typography.bodySemibold, fontSize: 14, color: colors.danger},
});
