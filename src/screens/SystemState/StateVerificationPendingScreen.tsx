import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon, ProgressBar} from '../../components';
import {colors, radius, shadows, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'StateVerificationPending'>;

const PENDING_DOCS = ['Vehicle photo', 'RC Document'];

export function StateVerificationPendingScreen({navigation}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <View style={styles.iconCircle}>
          <Icon name="clock" size={28} color={colors.white} />
        </View>
        <Text style={styles.heroTitle}>Verification In Progress</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>Your account is being reviewed by our team.</Text>

        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Documents Verified</Text>
            <Text style={styles.progressValue}>3 of 4</Text>
          </View>
          <ProgressBar progress={0.75} height={8} style={styles.progressBar} />
          <Text style={styles.progressCaption}>75% complete</Text>
        </View>

        <View style={styles.pendingCard}>
          <Text style={styles.pendingTitle}>Pending Review</Text>
          {PENDING_DOCS.map((doc, index) => (
            <View key={doc} style={[styles.pendingRow, index > 0 && styles.pendingRowBorder]}>
              <View style={styles.pendingDot} />
              <Text style={styles.pendingLabel}>{doc}</Text>
              <View style={styles.pendingBadge}>
                <Text style={styles.pendingBadgeText}>Pending</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.timelineCard}>
          <Text style={styles.timelineTitle}>Timeline Estimate</Text>
          <Text style={styles.timelineText}>Typically completed within 24–48 hours.</Text>
          <Text style={styles.timelineMeta}>Submitted: Sep 6, 2:00 PM</Text>
        </View>

        <Text style={styles.notice}>You will receive a notification when verification completes.</Text>

        <View style={styles.actions}>
          <Button label="View Documents" variant="outline" onPress={() => navigation.navigate('DocumentsHub')} />
          <Button label="Contact Support" variant="ghost" textColor={colors.textSecondary} onPress={() => navigation.navigate('SupportHub')} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  flex: {flex: 1},
  hero: {backgroundColor: colors.dark800, alignItems: 'center', paddingTop: 52, paddingBottom: spacing.xl, paddingHorizontal: spacing.xxl},
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  heroTitle: {...typography.title, fontSize: 18, color: colors.white},
  body: {padding: spacing.xl, gap: spacing.lg, paddingBottom: spacing.xxxl},
  subtitle: {...typography.body, color: colors.textSecondary, textAlign: 'center'},
  progressCard: {backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.xl, padding: spacing.lg, ...shadows.sm},
  progressHeader: {flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.md},
  progressLabel: {...typography.bodySemibold, fontSize: 13, color: colors.textPrimary},
  progressValue: {...typography.bodyBold, fontSize: 13, color: colors.primary},
  progressBar: {marginBottom: spacing.sm},
  progressCaption: {...typography.caption, fontSize: 11, color: colors.textMuted},
  pendingCard: {backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.xl, overflow: 'hidden'},
  pendingTitle: {
    ...typography.captionSemibold,
    color: colors.textSecondary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  pendingRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.md},
  pendingRowBorder: {borderTopWidth: 1, borderTopColor: colors.border},
  pendingDot: {width: 8, height: 8, borderRadius: 4, backgroundColor: colors.warning},
  pendingLabel: {flex: 1, ...typography.label, fontSize: 13, color: colors.textPrimary},
  pendingBadge: {backgroundColor: colors.warningSurface, borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: 2},
  pendingBadgeText: {...typography.captionSemibold, fontSize: 11, color: colors.warning},
  timelineCard: {backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.xl, padding: spacing.lg},
  timelineTitle: {...typography.bodySemibold, fontSize: 13, color: colors.textPrimary},
  timelineText: {...typography.label, fontSize: 13, color: colors.textSecondary, marginTop: spacing.xxs},
  timelineMeta: {...typography.caption, color: colors.textMuted, marginTop: spacing.xxs},
  notice: {...typography.caption, color: colors.textSecondary, textAlign: 'center', paddingHorizontal: spacing.lg},
  actions: {gap: spacing.sm, marginTop: spacing.xs},
});
