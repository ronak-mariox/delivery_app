import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'VehicleInsurance'>;

export function VehicleInsuranceScreen({navigation}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
          <Icon name="chevron-left" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Insurance</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.policyCard}>
          <View style={styles.policyTopRow}>
            <View style={styles.shieldIcon}>
              <Icon name="shield" size={28} color={colors.warning} />
            </View>
            <View style={styles.expiringPill}>
              <Text style={styles.expiringPillText}>EXPIRING SOON</Text>
            </View>
          </View>
          <Text style={styles.policyLabel}>Policy Number</Text>
          <Text style={styles.policyNumber}>MBI-2024-KA01AB1234</Text>
          <View style={styles.policyDetailsRow}>
            <View>
              <Text style={styles.detailLabel}>Provider</Text>
              <Text style={styles.detailValue}>New India Assurance</Text>
            </View>
            <View>
              <Text style={styles.detailLabel}>Valid Period</Text>
              <Text style={styles.detailValue}>Sep 14, 2024 – Sep 13, 2026</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.warningBanner} activeOpacity={0.8} onPress={() => navigation.navigate('StateWarningInsurance')}>
          <Icon name="alert-triangle" size={16} color={colors.warning} />
          <Text style={styles.warningText}>
            Your insurance expires <Text style={styles.warningBold}>Sep 13, 2026</Text>. Upload new insurance before then to avoid delivery
            suspension.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.uploadButton} activeOpacity={0.85} onPress={() => navigation.navigate('VehicleVerificationStatus')}>
          <Icon name="upload" size={16} color={colors.white} />
          <Text style={styles.uploadButtonText}>Upload New Insurance</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.outlineButton} activeOpacity={0.85}>
          <Text style={styles.outlineButtonText}>View Current Document</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.reminderRow} activeOpacity={0.7}>
          <Icon name="bell" size={16} color={colors.textSecondary} />
          <Text style={styles.reminderText}>Set Reminder</Text>
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
  headerTitle: {...typography.title, fontSize: 17, color: colors.textPrimary},
  body: {padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxxl},
  policyCard: {backgroundColor: colors.surface, borderWidth: 2, borderColor: colors.warning, borderRadius: radius.xxl, padding: spacing.xl, gap: spacing.md},
  policyTopRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start'},
  shieldIcon: {width: 44, height: 44, borderRadius: radius.md, backgroundColor: colors.warningSurface, alignItems: 'center', justifyContent: 'center'},
  expiringPill: {backgroundColor: colors.warningSurface, borderWidth: 1, borderColor: colors.warning, borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: 5},
  expiringPillText: {...typography.captionSemibold, fontSize: 11, color: colors.warning},
  policyLabel: {...typography.label, fontSize: 13, color: colors.textSecondary},
  policyNumber: {...typography.h4, fontSize: 16, color: colors.textPrimary, marginTop: 2},
  policyDetailsRow: {flexDirection: 'row', justifyContent: 'space-between'},
  detailLabel: {...typography.caption, fontSize: 11, color: colors.textMuted},
  detailValue: {...typography.label, fontSize: 13, color: colors.textPrimary, marginTop: 2},
  warningBanner: {flexDirection: 'row', gap: spacing.sm, backgroundColor: colors.warningSurface, borderWidth: 1, borderColor: colors.warning, borderRadius: radius.lg, padding: spacing.md},
  warningText: {...typography.label, fontSize: 13, color: colors.warningText, flex: 1},
  warningBold: {...typography.bodyBold, fontSize: 13, color: colors.warningText},
  uploadButton: {flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, backgroundColor: colors.primary, borderRadius: radius.lg, height: 50, marginTop: spacing.sm},
  uploadButtonText: {...typography.bodySemibold, fontSize: 15, color: colors.white},
  outlineButton: {borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.lg, height: 48, alignItems: 'center', justifyContent: 'center'},
  outlineButtonText: {...typography.bodyMedium, fontSize: 14, color: colors.textPrimary},
  reminderRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, height: 48},
  reminderText: {...typography.bodyMedium, fontSize: 14, color: colors.textSecondary},
});
