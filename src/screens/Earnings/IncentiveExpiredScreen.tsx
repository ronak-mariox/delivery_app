import React, {useCallback} from 'react';
import {RefreshControl, ScrollView, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, EmptyState, ErrorState, Icon, Loader, ProgressBar} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {listIncentives} from '../../services/driverApi';
import {formatDateTime, formatMoney, incentiveProgressRatio, isIncentiveCompleted, isIncentiveExpired, useAsyncData} from './earningsShared';

type Props = NativeStackScreenProps<RootStackParamList, 'IncentiveExpired'>;

export function IncentiveExpiredScreen({navigation}: Props) {
  const loader = useCallback(async () => (await listIncentives()).filter(i => isIncentiveExpired(i) && !isIncentiveCompleted(i)), []);
  const {data, loading, refreshing, error, reload} = useAsyncData(loader);
  const goToDashboard = () => navigation.reset({index: 0, routes: [{name: 'EarningsDashboard'}]});

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <View style={styles.iconCircle}>
          <Icon name="ban" size={28} color={colors.textMuted} />
        </View>
        <Text style={styles.heroTitle}>Expired Incentives</Text>
        <Text style={styles.heroSubtitle}>{data && data.length > 0 ? `${data.length} ${data.length === 1 ? 'incentive has' : 'incentives have'} ended without payout.` : 'Incentives that ended before you reached the target.'}</Text>
      </View>

      {loading && <Loader fullscreen label="Loading incentives…" />}

      {!loading && !data && <ErrorState title="Could not load incentives" description={error ?? undefined} onRetry={() => reload()} />}

      {!loading && data && (
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.body}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => reload(true)} />}>
          {data.length === 0 && (
            <View style={styles.emptyCard}>
              <EmptyState icon="check-circle" title="No expired incentives" description="You have not missed any incentive targets." />
            </View>
          )}

          {data.map(incentive => {
            const current = incentive.progress?.currentProgress ?? 0;
            const target = incentive.targetDeliveries;
            const ratio = incentiveProgressRatio(incentive);
            const short = Math.max(0, target - current);
            const partial = incentive.progress?.status === 'partial' ? incentive.progress.payoutAmount : null;
            const rows = [
              {label: 'Reward', value: formatMoney(incentive.rewardAmount)},
              {label: 'Your progress', value: `${current}/${target} deliveries`},
              {label: 'Expired', value: formatDateTime(incentive.expiresAt)},
            ];
            return (
              <View key={incentive.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{incentive.title}</Text>
                  <View style={styles.expiredPill}>
                    <Text style={styles.expiredPillText}>EXPIRED</Text>
                  </View>
                </View>
                {rows.map((row, index) => (
                  <View key={row.label} style={[styles.summaryRow, index < rows.length - 1 && styles.summaryRowBorder]}>
                    <Text style={styles.summaryLabel}>{row.label}</Text>
                    <Text style={styles.summaryValue}>{row.value}</Text>
                  </View>
                ))}
                <View style={styles.progressMetaRow}>
                  <Text style={styles.progressMetaText}>{`${current} of ${target} completed`}</Text>
                  <Text style={styles.progressMetaText}>{`${Math.round(ratio * 100)}%`}</Text>
                </View>
                <ProgressBar progress={ratio} height={8} trackColor="#F3F4F6" fillColor={colors.borderStrong} style={styles.progressBarSpacing} />
                {short > 0 && (
                  <View style={styles.missBanner}>
                    <Text style={styles.missText}>
                      {`You were ${short} ${short === 1 ? 'delivery' : 'deliveries'} short of the ${formatMoney(incentive.rewardAmount)} bonus.`}
                      {partial ? ` A partial bonus of ${formatMoney(partial)} was paid.` : ''}
                    </Text>
                  </View>
                )}
              </View>
            );
          })}

          <View style={styles.actionsRow}>
            <Button label="View Active Incentives" variant="primary" style={styles.flex} onPress={() => navigation.navigate('Incentives')} />
            <Button label="Back to Dashboard" variant="secondary" style={styles.flex} onPress={goToDashboard} />
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  flex: {flex: 1},
  hero: {backgroundColor: '#F3F4F6', borderBottomWidth: 1, borderBottomColor: colors.border, alignItems: 'center', paddingTop: 48, paddingBottom: spacing.xxl, paddingHorizontal: spacing.lg},
  iconCircle: {width: 64, height: 64, borderRadius: 32, backgroundColor: colors.border, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md},
  heroTitle: {...typography.h4, fontSize: 20, color: colors.textLabel},
  heroSubtitle: {...typography.label, fontSize: 13, color: colors.textMuted, marginTop: spacing.xs, textAlign: 'center'},
  body: {padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxxl},
  emptyCard: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.xl},
  card: {backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: colors.border, borderRadius: radius.xl, padding: spacing.lg},
  cardHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.sm},
  cardTitle: {...typography.bodyBold, fontSize: 14, color: colors.textLabel, flex: 1},
  summaryRow: {flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.sm, marginTop: spacing.xs},
  summaryRowBorder: {borderBottomWidth: 1, borderBottomColor: colors.border},
  summaryLabel: {...typography.label, fontSize: 13, color: colors.textMuted},
  summaryValue: {...typography.labelSemibold, fontSize: 13, color: colors.textLabel},
  expiredPill: {backgroundColor: colors.border, borderWidth: 1, borderColor: colors.borderStrong, borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: 3},
  expiredPillText: {...typography.captionSemibold, fontSize: 11, color: colors.textMuted},
  progressMetaRow: {flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.md},
  progressMetaText: {...typography.caption, color: colors.textMuted},
  progressBarSpacing: {marginTop: spacing.xs},
  missBanner: {backgroundColor: colors.warningSurface, borderWidth: 1, borderColor: '#FDE8C8', borderRadius: radius.lg, padding: spacing.md, marginTop: spacing.md},
  missText: {...typography.label, fontSize: 13, color: '#78350F'},
  actionsRow: {flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md},
});
