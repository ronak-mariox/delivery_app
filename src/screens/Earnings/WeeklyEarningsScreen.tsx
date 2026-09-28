import React, {useCallback} from 'react';
import {RefreshControl, ScrollView, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {ErrorState, IconBackButton, Loader} from '../../components';
import {colors, radius, shadows, spacing, typography} from '../../theme';
import {getEarningsSummary} from '../../services/driverApi';
import {fetchLedgerForPeriod, formatMoney, groupByDay, isEarningEntry, periodLabel, useAsyncData} from './earningsShared';
import {LedgerList} from './LedgerList';

type Props = NativeStackScreenProps<RootStackParamList, 'WeeklyEarnings'>;

async function loadWeek() {
  const [summary, ledger] = await Promise.all([getEarningsSummary('week'), fetchLedgerForPeriod('week')]);
  const earnings = ledger.filter(isEarningEntry);
  return {summary, ledger: earnings, days: groupByDay(earnings, 7)};
}

export function WeeklyEarningsScreen({navigation}: Props) {
  const loader = useCallback(() => loadWeek(), []);
  const {data, loading, refreshing, error, reload} = useAsyncData(loader);

  const maxDay = data ? Math.max(...data.days.map(d => d.value), 0) : 0;
  const bestDay = data && maxDay > 0 ? data.days.find(d => d.value === maxDay) : undefined;
  const avgPerDelivery = data && data.summary.deliveries > 0 ? data.summary.totalEarnings / data.summary.deliveries : 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <IconBackButton onPress={() => navigation.goBack()} />
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Weekly Earnings</Text>
            <Text style={styles.headerSubtitle}>{`Last 7 days · ${periodLabel('week')}`}</Text>
          </View>
        </View>
      </View>

      {loading && <Loader fullscreen label="Loading weekly earnings…" />}

      {!loading && !data && <ErrorState title="Could not load earnings" description={error ?? undefined} onRetry={() => reload()} />}

      {!loading && data && (
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.body}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => reload(true)} />}>
          <View style={styles.card}>
            <View style={styles.compareRow}>
              <View>
                <Text style={styles.compareLabel}>This week</Text>
                <Text style={styles.compareValueBig}>{formatMoney(data.summary.totalEarnings)}</Text>
              </View>
              <View style={styles.compareRight}>
                <Text style={styles.compareLabel}>Deliveries</Text>
                <Text style={styles.compareValueMuted}>{data.summary.deliveries}</Text>
              </View>
            </View>
            {data.summary.changeLabel ? (
              <View style={[styles.trendPill, data.summary.direction === 'down' && styles.trendPillDown]}>
                <Text style={[styles.trendPillText, data.summary.direction === 'down' && styles.trendPillTextDown]}>{data.summary.changeLabel}</Text>
              </View>
            ) : null}
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Daily earnings</Text>
            {maxDay > 0 ? (
              <View style={styles.chart}>
                {data.days.map(d => (
                  <View key={d.key} style={styles.chartColumn}>
                    {d.value > 0 && <Text style={styles.chartValue}>{Math.round(d.value)}</Text>}
                    <View style={[styles.chartBar, {height: Math.max(2, (d.value / maxDay) * 90)}, d.value === maxDay ? styles.chartBarPrimary : styles.chartBarMuted]} />
                    <Text style={styles.chartDay}>{d.label}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.chartEmpty}>No earnings recorded this week.</Text>
            )}
          </View>

          <View style={styles.tableCard}>
            <View style={styles.tableHeaderRow}>
              <Text style={[styles.tableHeaderText, styles.tableCol1]}>Category</Text>
              <Text style={[styles.tableHeaderTextGreen, styles.tableCol2]}>Amount</Text>
            </View>
            {[
              {label: 'Delivery fees', value: data.summary.breakdown.deliveryFee},
              {label: 'Distance bonus', value: data.summary.breakdown.distanceBonus},
              {label: 'On-time bonus', value: data.summary.breakdown.onTimeBonus},
              {label: 'Incentive bonus', value: data.summary.breakdown.incentiveBonus},
              {label: 'Avg per delivery', value: avgPerDelivery},
              {label: 'Best day', value: bestDay ? bestDay.value : 0, suffix: bestDay?.label},
            ].map((row, index, arr) => (
              <View key={row.label} style={[styles.tableRow, index < arr.length - 1 && styles.tableRowBorder]}>
                <Text style={[styles.tableCellMuted, styles.tableCol1]}>{row.label}</Text>
                <Text style={[styles.tableCellStrong, styles.tableCol2]}>{row.suffix ? `${row.suffix} ${formatMoney(row.value)}` : formatMoney(row.value)}</Text>
              </View>
            ))}
          </View>

          <LedgerList
            title="Earnings this week"
            entries={data.ledger}
            emptyTitle="No earnings this week"
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
  card: {backgroundColor: colors.surface, borderRadius: radius.xl, padding: spacing.lg, ...shadows.sm},
  cardTitle: {...typography.labelSemibold, fontSize: 13, color: colors.textPrimary},
  compareRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end'},
  compareRight: {alignItems: 'flex-end'},
  compareLabel: {...typography.caption, color: colors.textSecondary},
  compareValueBig: {...typography.h3, fontSize: 32, color: colors.textPrimary, letterSpacing: -1, marginTop: 2},
  compareValueMuted: {...typography.subtitle, fontSize: 22, color: colors.textSecondary, marginTop: 2},
  trendPill: {alignSelf: 'flex-start', backgroundColor: colors.primarySurface, borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: spacing.xs, marginTop: spacing.md},
  trendPillDown: {backgroundColor: colors.dangerSurface},
  trendPillText: {...typography.labelSemibold, fontSize: 13, color: colors.primary},
  trendPillTextDown: {color: colors.dangerText},
  chart: {flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 132, paddingTop: spacing.md},
  chartColumn: {flex: 1, alignItems: 'center', justifyContent: 'flex-end', gap: 4},
  chartValue: {...typography.overline, fontSize: 9, color: colors.primary},
  chartBar: {width: 18, borderRadius: 5},
  chartBarPrimary: {backgroundColor: colors.primary},
  chartBarMuted: {backgroundColor: colors.primarySurface},
  chartDay: {...typography.micro, color: colors.textSecondary, marginTop: 6},
  chartEmpty: {...typography.label, color: colors.textSecondary, marginTop: spacing.sm},
  tableCard: {backgroundColor: colors.surface, borderRadius: radius.xl, overflow: 'hidden', ...shadows.sm},
  tableHeaderRow: {flexDirection: 'row', backgroundColor: colors.background, borderBottomWidth: 1, borderBottomColor: colors.border, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm},
  tableHeaderText: {...typography.captionSemibold, fontSize: 11, color: colors.textSecondary},
  tableHeaderTextGreen: {...typography.captionSemibold, fontSize: 11, color: colors.primary, textAlign: 'right'},
  tableRow: {flexDirection: 'row', paddingHorizontal: spacing.lg, paddingVertical: spacing.md},
  tableRowBorder: {borderBottomWidth: 1, borderBottomColor: '#F3F4F6'},
  tableCellMuted: {...typography.label, fontSize: 13, color: colors.textSecondary},
  tableCellStrong: {...typography.labelSemibold, fontSize: 13, color: colors.textPrimary, textAlign: 'right'},
  tableCol1: {flex: 1.4},
  tableCol2: {flex: 1},
});
