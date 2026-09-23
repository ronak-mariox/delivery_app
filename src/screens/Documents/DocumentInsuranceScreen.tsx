import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon} from '../../components';
import {colors, radius, shadows, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'DocumentInsurance'>;

const VALIDITY_ROWS = [
  {label: 'Valid From', value: 'Sep 14, 2024'},
  {label: 'Valid To', value: 'Sep 13, 2026'},
  {label: 'Coverage Type', value: 'Own Damage + Third Party'},
];

export function DocumentInsuranceScreen({navigation}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
          <Icon name="chevron-left" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Insurance Document</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.policyCard}>
          <View style={styles.policyTopRow}>
            <Text style={styles.policyLabel}>Policy Number</Text>
            <View style={styles.expiringPill}>
              <Icon name="alert-triangle" size={12} color={colors.warning} />
              <Text style={styles.expiringPillText}>EXPIRING SOON</Text>
            </View>
          </View>
          <Text style={styles.policyNumber}>MBI-2024-KA01AB1234</Text>

          <View style={styles.detailsRow}>
            <View>
              <Text style={styles.detailLabel}>Provider</Text>
              <Text style={styles.detailValue}>New India Assurance</Text>
            </View>
            <View>
              <Text style={styles.detailLabel}>Days Left</Text>
              <Text style={styles.detailValueWarning}>7 days</Text>
            </View>
          </View>
          <View style={styles.detailsRow}>
            <View>
              <Text style={styles.detailLabel}>Validity</Text>
              <Text style={styles.detailValue}>Sep 14, 2024 – Sep 13, 2026</Text>
            </View>
            <View>
              <Text style={styles.detailLabel}>Coverage</Text>
              <Text style={styles.detailValue}>OD + Third Party</Text>
            </View>
          </View>
        </View>

        <View style={styles.previewBox}>
          <Icon name="file-text" size={32} color={colors.textMuted} />
          <Text style={styles.previewTitle}>Insurance Document Preview</Text>
          <Text style={styles.previewSubtitle}>Tap "View Document" to open</Text>
        </View>

        <View style={styles.card}>
          {VALIDITY_ROWS.map((row, index) => (
            <View key={row.label} style={[styles.infoRow, index < VALIDITY_ROWS.length - 1 && styles.infoRowBorder]}>
              <Text style={styles.infoLabel}>{row.label}</Text>
              <Text style={styles.infoValue}>{row.value}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.uploadButton} activeOpacity={0.85} onPress={() => navigation.navigate('DocumentUpload')}>
          <Icon name="upload" size={16} color={colors.white} />
          <Text style={styles.uploadButtonText}>Upload New Insurance</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.outlineButton} activeOpacity={0.85}>
          <Text style={styles.outlineButtonText}>View Document</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.downloadRow} activeOpacity={0.7}>
          <Icon name="download" size={16} color={colors.textSecondary} />
          <Text style={styles.downloadText}>Download</Text>
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
  policyCard: {backgroundColor: colors.surface, borderWidth: 2, borderColor: colors.warning, borderRadius: radius.xxl, padding: spacing.lg, gap: spacing.sm},
  policyTopRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  policyLabel: {...typography.caption, fontSize: 12, color: colors.textSecondary},
  expiringPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.warningSurface,
    borderWidth: 1,
    borderColor: colors.warning,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  expiringPillText: {...typography.captionSemibold, fontSize: 10, color: colors.warning},
  policyNumber: {...typography.h4, fontSize: 16, color: colors.textPrimary},
  detailsRow: {flexDirection: 'row', justifyContent: 'space-between'},
  detailLabel: {...typography.caption, fontSize: 11, color: colors.textMuted},
  detailValue: {...typography.label, fontSize: 12, color: colors.textPrimary, marginTop: 3},
  detailValueWarning: {...typography.labelSemibold, fontSize: 13, color: colors.warning, marginTop: 3},
  previewBox: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  previewTitle: {...typography.bodyMedium, fontSize: 13, color: colors.textMuted},
  previewSubtitle: {...typography.caption, fontSize: 11, color: '#D1D5DB'},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, overflow: 'hidden', ...shadows.sm},
  infoRow: {flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingVertical: spacing.md},
  infoRowBorder: {borderBottomWidth: 1, borderBottomColor: '#F3F4F6'},
  infoLabel: {...typography.label, fontSize: 13, color: colors.textSecondary},
  infoValue: {...typography.labelSemibold, fontSize: 13, color: colors.textPrimary},
  uploadButton: {flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, backgroundColor: colors.primary, borderRadius: radius.lg, height: 50},
  uploadButtonText: {...typography.bodySemibold, fontSize: 15, color: colors.white},
  outlineButton: {borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.lg, height: 48, alignItems: 'center', justifyContent: 'center'},
  outlineButtonText: {...typography.bodyMedium, fontSize: 14, color: colors.textPrimary},
  downloadRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, height: 48},
  downloadText: {...typography.bodyMedium, fontSize: 14, color: colors.textSecondary},
});
