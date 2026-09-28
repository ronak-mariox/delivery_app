import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Badge, Icon, IconBackButton, InfoBanner} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {useDriverAuth} from '../../context/DriverAuthContext';
import {ContactSupport} from '../Profile/ContactSupport';
import {DOCUMENT_KEYS, DOCUMENT_META, documentUrl, kycBadge} from '../Profile/driverDisplay';

type Props = NativeStackScreenProps<RootStackParamList, 'DocumentsHub'>;

export function DocumentsHubScreen({navigation}: Props) {
  const {driver} = useDriverAuth();
  const kyc = kycBadge(driver?.kycStatus);
  const uploadedCount = DOCUMENT_KEYS.filter(key => !!documentUrl(driver, key)).length;
  const progress = Math.round((uploadedCount / DOCUMENT_KEYS.length) * 100);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconBackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Documents</Text>
        <Badge label={kyc.label} tone={kyc.tone} />
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.progressCard}>
          <View style={styles.progressTopRow}>
            <Text style={styles.progressLabel}>
              {uploadedCount} of {DOCUMENT_KEYS.length} documents uploaded
            </Text>
            <Text style={styles.progressPercent}>{progress}%</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, {width: `${progress}%`}]} />
          </View>
        </View>

        {driver?.kycStatus === 'rejected' && driver.rejectionReason ? (
          <InfoBanner tone="warning" icon="alert-triangle" title="Verification rejected" description={driver.rejectionReason} />
        ) : driver?.kycStatus !== 'verified' ? (
          <InfoBanner tone="primary" icon="clock" title="Verification in progress" description="Our team is reviewing your documents. You'll be notified once verification is complete." />
        ) : null}

        <View style={styles.listCard}>
          {DOCUMENT_KEYS.map((key, index) => {
            const meta = DOCUMENT_META[key];
            const present = !!documentUrl(driver, key);
            return (
              <TouchableOpacity
                key={key}
                style={[styles.docRow, index < DOCUMENT_KEYS.length - 1 && styles.docRowBorder]}
                activeOpacity={0.7}
                onPress={() => navigation.navigate('DocumentDetail', {docKey: key})}>
                <View style={[styles.docIcon, present ? styles.docIconPresent : styles.docIconMissing]}>
                  <Icon name={meta.icon} size={20} color={present ? colors.primary : colors.textMuted} />
                </View>
                <View style={styles.flex}>
                  <Text style={styles.docLabel}>{meta.title}</Text>
                  <View style={styles.docSubRow}>
                    <View style={[styles.statusPill, present ? styles.statusPillPresent : styles.statusPillMissing]}>
                      <Text style={[styles.statusPillText, present ? styles.statusTextPresent : styles.statusTextMissing]}>{present ? 'UPLOADED' : 'MISSING'}</Text>
                    </View>
                    <Text style={styles.docSub} numberOfLines={1}>
                      {meta.description}
                    </Text>
                  </View>
                </View>
                <Icon name="chevron-right" size={16} color={colors.textMuted} />
              </TouchableOpacity>
            );
          })}
        </View>

        <ContactSupport description="To replace or add a document, contact support." />
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
  headerTitle: {...typography.title, fontSize: 17, color: colors.textPrimary, flex: 1},
  body: {padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxxl},
  progressCard: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg},
  progressTopRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  progressLabel: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary},
  progressPercent: {...typography.bodyBold, fontSize: 13, color: colors.primary},
  progressTrack: {height: 6, borderRadius: radius.pill, backgroundColor: colors.border, marginTop: spacing.sm, overflow: 'hidden'},
  progressFill: {height: 6, backgroundColor: colors.primary, borderRadius: radius.pill},
  listCard: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, overflow: 'hidden'},
  docRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.md},
  docRowBorder: {borderBottomWidth: 1, borderBottomColor: '#F3F4F6'},
  docIcon: {width: 40, height: 40, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center'},
  docIconPresent: {backgroundColor: colors.primarySurface},
  docIconMissing: {backgroundColor: colors.background},
  docLabel: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary},
  docSubRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: 4},
  statusPill: {borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: 2},
  statusPillPresent: {backgroundColor: colors.primarySurface},
  statusPillMissing: {backgroundColor: colors.warningSurface},
  statusPillText: {...typography.captionSemibold, fontSize: 10},
  statusTextPresent: {color: colors.primary},
  statusTextMissing: {color: colors.warningText},
  docSub: {...typography.caption, fontSize: 11, color: colors.textMuted, flexShrink: 1},
});
