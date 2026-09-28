import React, {useCallback} from 'react';
import {RefreshControl, ScrollView, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {ErrorState, IconBackButton, Loader} from '../../components';
import {colors, radius, shadows, spacing, typography} from '../../theme';
import {getEarningsSummary} from '../../services/driverApi';
import {fetchLedgerForPeriod, formatMoney, groupByDay, isEarningEntry, periodLabel, useAsyncData} from './earningsShared';
import {LedgerList} from './LedgerList';

type Props = NativeStackScreenProps<RootStackParamList, 'MonthlyEarnings'>;

const MONTH_DAYS = 30;

async function loadMonth() {
  const [summary, ledger] = await Promise.all([getEarningsSummary('month'), fetchLedgerForPeriod('month')]);
  const earnings = ledger.filter(isEarningEntry);
  const days = groupByDay(earnings, MONTH_DAYS);
  const workingDays = days.filter(d => d.value > 0).length;
  const topDays = [...days]
    .filter(d => d.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 3);
  return {summary, ledger: earnings, days, workingDays, topDays};
}

export function MonthlyEarningsScreen({navigation}: Props) {
  const loader = useCallback(() => loadMonth(), []);
  const {data, loading, refreshing, error, reload} = useAsyncData(loader);

  const maxDay = data ? Math.max(...data.days.map(d => d.value), 0) : 0;
  const avgPerDay = data && data.workingDays > 0 ? data.summary.totalEarnings / data.workingDays : 0;
  const avgPerDelivery = data && data.summary.deliveries > 0 ? data.summary.totalEarnings / data.summary.deliveries : 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <IconBackButton onPress={() => navigation.goBack()} />
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Monthly Earnings</Text>
            <Text style={styles.headerSubtitle}>{`Last 30 days · ${periodLabel('month')}`}</Text>
          </View>
        </View>
      </View>

      {loading && <Loader fullscreen label="Loading monthly earnings…" />}

      {!loading && !data && <ErrorState title="Could not load earnings" description={error ?? undefined} onRetry={() => reload()} />}

      {!loading && data && (
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.body}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => reload(true)} />}>
          <View style={styles.totalBlock}>
            <Text style={styles.totalValue}>{formatMoney(data.summary.totalEarnings)}</Text>
            <Text style={styles.totalLabel}>{`${data.workingDays} working days · ${data.summary.deliveries} deliveries`}</Text>
            {data.summary.changeLabel ? <Text style={styles.totalChange}>{data.summary.changeLabel}</Text> : null}
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Daily earnings</Text>
            {maxDay > 0 ? (
              <>
                <View style={styles.chart}>
                  {data.days.map(d => (
                    <View key={d.key} style={styles.chartColumn}>
                      <View style={[styles.chartBar, {height: Math.max(2, (d.value / maxDay) * 100)}, d.value === maxDay ? styles.chartBarPeak : styles.chartBarNormal]} />
                    </View>
                  ))}
                </View>
                <View style={styles.axisRow}>
                  <Text style={styles.axisLabel}>{data.days[0].label}</Text>
                  <Text style={styles.axisLabel}>{data.days[Math.floor(MONTH_DAYS / 2)].label}</Text>
                  <Text style={styles.axisLabel}>Today</Text>
                </View>
              </>
            ) : (
              <Text style={styles.chartEmpty}>No earnings recorded this month.</Text>
            )}
          </View>

          {data.topDays.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Top Performing Days</Text>
              {data.topDays.map((d, index) => (
                <View key={d.key} style={[styles.topRow, index < data.topDays.length - 1 && styles.topRowBorder]}>
                  <Text style={styles.topLabel}>{new Date(d.key).toLocaleDateString([], {month: 'short', day: 'numeric', weekday: 'short'})}</Text>
                  <View style={styles.topRight}>
                    <Text style={styles.topValue}>{formatMoney(d.value)}</Text>
                    {index === 0 && (
                      <View style={styles.bestPill}>
                        <Text style={styles.bestPillText}>Best</Text>
                      </View>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}

          <View style={styles.statGrid}>
            {[
              {label: 'Total', value: formatMoney(data.summary.totalEarnings)},
              {label: 'Deliveries', value: String(data.summary.deliveries)},
              {label: 'Avg/day', value: formatMoney(avgPerDay)},
              {label: 'Avg/delivery', value: formatMoney(avgPerDelivery)},
            ].map(stat => (
              <View key={stat.label} style={styles.statTile}>
                <Text style={styles.statLabel}>{stat.label}</Text>
                <Text style={styles.statValue}>{stat.value}</Text>
              </View>
            ))}
          </View>

          <LedgerList
            title="Earnings this month"
            entries={data.ledger}
            emptyTitle="No earnings this month"
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
  header: {backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border, paddingHorizontal: spacing.xl, paddingTop: 52, paddingBottom: spacing.lg},
  headerRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.md},
  headerText: {flex: 1},
  headerTitle: {...typography.title, fontSize: 17, color: colors.textPrimary},
  headerSubtitle: {...typography.caption, color: colors.textSecondary, marginTop: 1},
  body: {padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxxl},
  totalBlock: {alignItems: 'center', paddingVertical: spacing.sm},
  totalValue: {...typography.display, fontSize: 38, color: colors.primary, letterSpacing: -1},
  totalLabel: {...typography.label, fontSize: 13, color: colors.textSecondary, marginTop: 2},
  totalChange: {...typography.caption, color: colors.textSecondary, marginTop: 2},
  card: {backgroundColor: colors.surface, borderRadius: radius.xl, padding: spacing.lg, ...shadows.sm},
  cardTitle: {...typography.labelSemibold, fontSize: 13, color: colors.textPrimary},
  chart: {flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 120, paddingTop: spacing.md, gap: 2},
  chartColumn: {flex: 1, alignItems: 'center', justifyContent: 'flex-end'},
  chartBar: {width: '100%', borderRadius: 2},
  chartBarNormal: {backgroundColor: colors.primarySurface},
  chartBarPeak: {backgroundColor: colors.primary},
  axisRow: {flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.xs},
  axisLabel: {...typography.micro, color: colors.textSecondary},
  chartEmpty: {...typography.label, color: colors.textSecondary, marginTop: spacing.sm},
  topRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.sm},
  topRowBorder: {borderBottomWidth: 1, borderBottomColor: '#F3F4F6'},
  topLabel: {...typography.label, fontSize: 13, color: colors.textSecondary},
  topRight: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm},
  topValue: {...typography.labelSemibold, fontSize: 13, color: colors.textPrimary},
  bestPill: {backgroundColor: '#FEF3C7', borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: 2},
  bestPillText: {...typography.captionSemibold, fontSize: 10, color: '#D97706'},
  statGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm},
  statTile: {flexBasis: '48%', flexGrow: 1, backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.md, ...shadows.sm},
  statLabel: {...typography.caption, color: colors.textSecondary},
  statValue: {...typography.bodyBold, fontSize: 16, color: colors.textPrimary, marginTop: spacing.xxs},
});
