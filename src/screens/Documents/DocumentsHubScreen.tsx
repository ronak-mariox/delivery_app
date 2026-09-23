import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon, IconName} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'DocumentsHub'>;

const DOC_ROWS: {
  label: string;
  status: string;
  statusColor: string;
  bg: string;
  sub: string;
  icon: IconName;
  onPress?: (navigation: Props['navigation']) => void;
}[] = [
  {
    label: 'Driving Licence',
    status: 'VERIFIED',
    statusColor: colors.primary,
    bg: colors.primarySurface,
    sub: 'Expires May 2030',
    icon: 'file-text',
    onPress: nav => nav.navigate('DocumentDrivingLicence'),
  },
  {
    label: 'RC Document',
    status: 'VERIFIED',
    statusColor: colors.primary,
    bg: colors.primarySurface,
    sub: 'Valid until Aug 2034',
    icon: 'file-text',
    onPress: nav => nav.navigate('VehicleRcDocument'),
  },
  {
    label: 'Insurance',
    status: 'EXPIRING SOON',
    statusColor: colors.warning,
    bg: colors.warningSurface,
    sub: 'Expires Sep 13, 2026',
    icon: 'alert-triangle',
    onPress: nav => nav.navigate('DocumentInsurance'),
  },
  {
    label: 'Bank Details',
    status: 'VERIFIED',
    statusColor: colors.primary,
    bg: colors.primarySurface,
    sub: 'Last updated Aug 2024',
    icon: 'file-text',
  },
];

export function DocumentsHubScreen({navigation}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
          <Icon name="chevron-left" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Documents</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <TouchableOpacity activeOpacity={0.8} style={styles.progressCard} onPress={() => navigation.navigate('StateVerificationPending')}>
          <View style={styles.progressTopRow}>
            <Text style={styles.progressLabel}>4 of 4 documents verified</Text>
            <Text style={styles.progressPercent}>100%</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={styles.progressFill} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.8} style={styles.suspendedBanner} onPress={() => navigation.navigate('StateAccountSuspended')}>
          <Icon name="alert-triangle" size={16} color={colors.warning} />
          <Text style={styles.suspendedBannerText}>Insurance expiring soon may limit your account — view impact</Text>
        </TouchableOpacity>

        <View style={styles.listCard}>
          {DOC_ROWS.map((row, index) => (
            <TouchableOpacity
              key={row.label}
              style={[styles.docRow, index < DOC_ROWS.length - 1 && styles.docRowBorder]}
              activeOpacity={row.onPress ? 0.7 : 1}
              disabled={!row.onPress}
              onPress={() => row.onPress?.(navigation)}>
              <View style={[styles.docIcon, {backgroundColor: row.bg}]}>
                <Icon name={row.icon} size={20} color={row.statusColor} />
              </View>
              <View style={styles.flex}>
                <Text style={styles.docLabel}>{row.label}</Text>
                <View style={styles.docSubRow}>
                  <View style={[styles.statusPill, {backgroundColor: row.bg}]}>
                    <Text style={[styles.statusPillText, {color: row.statusColor}]}>{row.status}</Text>
                  </View>
                  <Text style={styles.docSub}>{row.sub}</Text>
                </View>
              </View>
              {row.onPress && <Icon name="chevron-right" size={16} color={colors.textMuted} />}
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.addButton} activeOpacity={0.85} onPress={() => navigation.navigate('DocumentUpload')}>
          <Icon name="plus" size={16} color={colors.primary} />
          <Text style={styles.addButtonText}>Add Document</Text>
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
  progressCard: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg},
  progressTopRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  progressLabel: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary},
  progressPercent: {...typography.bodyBold, fontSize: 13, color: colors.primary},
  progressTrack: {height: 6, borderRadius: radius.pill, backgroundColor: colors.border, marginTop: spacing.sm, overflow: 'hidden'},
  progressFill: {height: 6, width: '100%', backgroundColor: colors.primary, borderRadius: radius.pill},
  suspendedBanner: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.warningSurface, borderWidth: 1, borderColor: '#FEC84B', borderRadius: radius.lg, padding: spacing.md},
  suspendedBannerText: {...typography.label, fontSize: 12, color: colors.warningText, flex: 1},
  listCard: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, overflow: 'hidden'},
  docRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.md},
  docRowBorder: {borderBottomWidth: 1, borderBottomColor: '#F3F4F6'},
  docIcon: {width: 40, height: 40, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center'},
  docLabel: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary},
  docSubRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: 4},
  statusPill: {borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: 2},
  statusPillText: {...typography.captionSemibold, fontSize: 10},
  docSub: {...typography.caption, fontSize: 11, color: colors.textMuted},
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: radius.lg,
    height: 50,
  },
  addButtonText: {...typography.bodySemibold, fontSize: 14, color: colors.primary},
});
