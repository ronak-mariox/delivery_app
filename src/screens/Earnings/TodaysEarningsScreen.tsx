import React, {useCallback} from 'react';
import {RefreshControl, ScrollView, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {ErrorState, IconBackButton, Loader} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {getEarningsSummary} from '../../services/driverApi';
import {fetchLedgerForPeriod, formatMoney, isEarningEntry, periodLabel, useAsyncData} from './earningsShared';
import {LedgerList} from './LedgerList';

type Props = NativeStackScreenProps<RootStackParamList, 'TodaysEarnings'>;

async function loadToday() {
  const [summary, ledger] = await Promise.all([getEarningsSummary('today'), fetchLedgerForPeriod('today')]);
  return {summary, ledger: ledger.filter(isEarningEntry)};
}

export function TodaysEarningsScreen({navigation}: Props) {
  const loader = useCallback(() => loadToday(), []);
  const {data, loading, refreshing, error, reload} = useAsyncData(loader);

  const avg = data && data.summary.deliveries > 0 ? data.summary.totalEarnings / data.summary.deliveries : 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconBackButton onPress={() => navigation.goBack()} />
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>{"Today's Earnings"}</Text>
          <Text style={styles.headerSubtitle}>{periodLabel('today')}</Text>
        </View>
      </View>

      {loading && <Loader fullscreen label="Loading today's earnings…" />}

      {!loading && !data && <ErrorState title="Could not load earnings" description={error ?? undefined} onRetry={() => reload()} />}

      {!loading && data && (
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.body}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => reload(true)} />}>
          <View style={styles.heroCard}>
            <Text style={styles.heroLabel}>Total earned today</Text>
            <Text style={styles.heroValue}>{formatMoney(data.summary.totalEarnings)}</Text>
            <View style={styles.heroRow}>
              <Text style={styles.heroRowTextStrong}>{`${data.summary.deliveries} ${data.summary.deliveries === 1 ? 'delivery' : 'deliveries'}`}</Text>
              <Text style={styles.heroRowTextFaint}>·</Text>
              <Text style={styles.heroRowTextStrong}>{`Avg ${formatMoney(avg)}`}</Text>
            </View>
            {data.summary.changeLabel ? <Text style={styles.heroRowTextMuted}>{data.summary.changeLabel}</Text> : null}
          </View>

          <View style={styles.breakdownCard}>
            <Text style={styles.cardTitle}>Breakdown</Text>
            {[
              {label: 'Delivery fees', value: data.summary.breakdown.deliveryFee},
              {label: 'Distance bonus', value: data.summary.breakdown.distanceBonus},
              {label: 'On-time bonus', value: data.summary.breakdown.onTimeBonus},
              {label: 'Incentive bonus', value: data.summary.breakdown.incentiveBonus},
            ].map((row, index, arr) => (
              <View key={row.label} style={[styles.breakdownRow, index < arr.length - 1 && styles.breakdownRowBorder]}>
                <Text style={styles.breakdownLabel}>{row.label}</Text>
                <Text style={styles.breakdownValue}>{formatMoney(row.value)}</Text>
              </View>
            ))}
          </View>

          <LedgerList
            title="Earnings"
            entries={data.ledger}
            emptyTitle="No earnings today"
            emptyDescription="Completed deliveries will show up here."
            onPressOrder={orderId => navigation.navigate('DeliveryEarnings', {orderId})}
          />
        </ScrollView>
      )}
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
    paddingHorizontal: spacing.xl,
    paddingTop: 52,
    paddingBottom: spacing.lg,
  },
  headerText: {flex: 1},
  headerTitle: {...typography.title, fontSize: 17, color: colors.textPrimary},
  headerSubtitle: {...typography.caption, color: colors.textSecondary, marginTop: 1},
  body: {padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxxl},
  heroCard: {backgroundColor: colors.primary, borderRadius: radius.xxl, padding: spacing.xl, gap: 2},
  heroLabel: {...typography.label, fontSize: 13, color: 'rgba(255,255,255,0.75)'},
  heroValue: {...typography.display, fontSize: 38, color: colors.white, letterSpacing: -1, marginTop: 2},
  heroRow: {flexDirection: 'row', gap: spacing.md, marginTop: spacing.sm, alignItems: 'center'},
  heroRowTextStrong: {...typography.label, fontSize: 13, color: 'rgba(255,255,255,0.85)'},
  heroRowTextFaint: {...typography.label, fontSize: 13, color: 'rgba(255,255,255,0.5)'},
  heroRowTextMuted: {...typography.caption, color: 'rgba(255,255,255,0.75)', marginTop: spacing.xs},
  breakdownCard: {backgroundColor: colors.surface, borderRadius: radius.xl, padding: spacing.lg, borderWidth: 1, borderColor: colors.border},
  cardTitle: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary, marginBottom: spacing.xs},
  breakdownRow: {flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.sm},
  breakdownRowBorder: {borderBottomWidth: 1, borderBottomColor: '#F3F4F6'},
  breakdownLabel: {...typography.label, fontSize: 13, color: colors.textSecondary},
  breakdownValue: {...typography.labelSemibold, fontSize: 13, color: colors.textPrimary},
});
