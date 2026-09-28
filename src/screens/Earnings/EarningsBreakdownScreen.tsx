import React, {useCallback} from 'react';
import {RefreshControl, ScrollView, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import Svg, {Circle} from 'react-native-svg';
import {RootStackParamList} from '../../navigation/types';
import {EmptyState, ErrorState, IconBackButton, Loader} from '../../components';
import {colors, radius, shadows, spacing, typography} from '../../theme';
import {getEarningsSummary, getPayoutStatus} from '../../services/driverApi';
import {formatLongDate, formatMoney, periodLabel, useAsyncData} from './earningsShared';

type Props = NativeStackScreenProps<RootStackParamList, 'EarningsBreakdown'>;

interface Segment {
  label: string;
  amount: number;
  pct: number;
  color: string;
}

const SIZE = 140;
const STROKE = 16;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function Donut({segments}: {segments: Segment[]}) {
  let cumulative = 0;
  return (
    <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
      <Circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} stroke={colors.background} strokeWidth={STROKE} fill="none" />
      {segments.map(seg => {
        const length = (seg.pct / 100) * CIRCUMFERENCE;
        const offset = CIRCUMFERENCE - cumulative;
        cumulative += length;
        return (
          <Circle
            key={seg.label}
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            stroke={seg.color}
            strokeWidth={STROKE}
            strokeDasharray={`${length} ${CIRCUMFERENCE - length}`}
            strokeDashoffset={offset}
            strokeLinecap="butt"
            fill="none"
            transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
          />
        );
      })}
    </Svg>
  );
}

async function loadBreakdown() {
  const [summary, payout] = await Promise.all([getEarningsSummary('month'), getPayoutStatus()]);
  const {breakdown} = summary;
  const total = breakdown.deliveryFee + breakdown.distanceBonus + breakdown.onTimeBonus + breakdown.incentiveBonus;
  const pct = (amount: number) => (total > 0 ? Math.round((amount / total) * 100) : 0);
  const segments: Segment[] = [
    {label: 'Delivery fees', amount: breakdown.deliveryFee, pct: pct(breakdown.deliveryFee), color: colors.primary},
    {label: 'Distance bonus', amount: breakdown.distanceBonus, pct: pct(breakdown.distanceBonus), color: colors.primaryDark},
    {label: 'On-time bonus', amount: breakdown.onTimeBonus, pct: pct(breakdown.onTimeBonus), color: colors.primaryBorder},
    {label: 'Incentive bonus', amount: breakdown.incentiveBonus, pct: pct(breakdown.incentiveBonus), color: '#A7F3D0'},
  ];
  return {summary, payout, segments, total};
}

export function EarningsBreakdownScreen({navigation}: Props) {
  const loader = useCallback(() => loadBreakdown(), []);
  const {data, loading, refreshing, error, reload} = useAsyncData(loader);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconBackButton onPress={() => navigation.goBack()} />
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Earnings Breakdown</Text>
          <Text style={styles.headerSubtitle}>{`Last 30 days · ${periodLabel('month')}`}</Text>
        </View>
      </View>

      {loading && <Loader fullscreen label="Loading breakdown…" />}

      {!loading && !data && <ErrorState title="Could not load breakdown" description={error ?? undefined} onRetry={() => reload()} />}

      {!loading && data && (
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.body}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => reload(true)} />}>
          <View style={styles.totalBlock}>
            <Text style={styles.totalValue}>{formatMoney(data.summary.totalEarnings)}</Text>
            <Text style={styles.totalLabel}>{`This month · ${data.summary.deliveries} deliveries`}</Text>
          </View>

          {data.total > 0 ? (
            <View style={styles.donutCard}>
              <View style={styles.donutWrap}>
                <Donut segments={data.segments} />
                <View style={styles.donutCenter} pointerEvents="none">
                  <Text style={styles.donutCenterLabel}>Total</Text>
                  <Text style={styles.donutCenterValue}>{formatMoney(data.total)}</Text>
                </View>
              </View>
              <View style={styles.legend}>
                {data.segments.map(seg => (
                  <View key={seg.label} style={styles.legendRow}>
                    <View style={[styles.legendDot, {backgroundColor: seg.color}]} />
                    <Text style={styles.legendLabel}>{seg.label}</Text>
                    <Text style={styles.legendPct}>{`${seg.pct}%`}</Text>
                  </View>
                ))}
              </View>
            </View>
          ) : (
            <View style={styles.emptyCard}>
              <EmptyState icon="bar-chart" title="No earnings yet this month" description="Your breakdown will appear once you complete deliveries." />
            </View>
          )}

          <View style={styles.tableCard}>
            <View style={styles.tableHeaderRow}>
              <Text style={[styles.tableHeaderText, styles.tableCol1]}>Category</Text>
              <Text style={[styles.tableHeaderText, styles.tableCol2]}>Share</Text>
              <Text style={[styles.tableHeaderText, styles.tableCol3]}>Amount</Text>
            </View>
            {data.segments.map(row => (
              <View key={row.label} style={styles.tableRow}>
                <Text style={[styles.tableCellText, styles.tableCol1]}>{row.label}</Text>
                <Text style={[styles.tableCellMuted, styles.tableCol2]}>{`${row.pct}%`}</Text>
                <Text style={[styles.tableCellStrong, styles.tableCol3]}>{formatMoney(row.amount)}</Text>
              </View>
            ))}
            <View style={[styles.tableRow, styles.tableTotalRow]}>
              <Text style={[styles.tableTotalText, styles.tableCol1]}>Total</Text>
              <Text style={[styles.tableTotalText, styles.tableCol2]}>{data.total > 0 ? '100%' : '—'}</Text>
              <Text style={[styles.tableTotalText, styles.tableCol3, styles.tableTotalGreen]}>{formatMoney(data.total)}</Text>
            </View>
          </View>

          <View style={styles.payoutCard}>
            <Text style={styles.payoutTitle}>Payout status</Text>
            <View style={styles.payoutRow}>
              <Text style={styles.payoutLabel}>Pending payout</Text>
              <Text style={styles.payoutValueStrong}>{formatMoney(data.payout.pendingAmount)}</Text>
            </View>
            <View style={styles.payoutRow}>
              <Text style={styles.payoutLabel}>Lifetime paid</Text>
              <Text style={styles.payoutValue}>{formatMoney(data.payout.lifetimePaid)}</Text>
            </View>
            <View style={styles.payoutRow}>
              <Text style={styles.payoutLabel}>Next payout</Text>
              <Text style={styles.payoutValue}>{formatLongDate(data.payout.nextPayoutDate)}</Text>
            </View>
          </View>
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
  totalBlock: {alignItems: 'center', paddingVertical: spacing.md},
  totalValue: {...typography.display, fontSize: 38, color: colors.primary, letterSpacing: -1},
  totalLabel: {...typography.label, fontSize: 13, color: colors.textSecondary, marginTop: 2},
  donutCard: {flexDirection: 'row', alignItems: 'center', gap: spacing.xxl, backgroundColor: colors.surface, borderRadius: radius.xl, padding: spacing.lg, ...shadows.sm},
  emptyCard: {backgroundColor: colors.surface, borderRadius: radius.xl, ...shadows.sm},
  donutWrap: {width: SIZE, height: SIZE, alignItems: 'center', justifyContent: 'center'},
  donutCenter: {position: 'absolute', alignItems: 'center'},
  donutCenterLabel: {...typography.caption, fontSize: 11, color: colors.textSecondary},
  donutCenterValue: {...typography.bodyBold, fontSize: 13, color: colors.textPrimary, marginTop: 2},
  legend: {flex: 1, gap: spacing.sm},
  legendRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm},
  legendDot: {width: 10, height: 10, borderRadius: 5},
  legendLabel: {...typography.caption, color: colors.textSecondary, flex: 1},
  legendPct: {...typography.captionSemibold, color: colors.textPrimary},
  tableCard: {backgroundColor: colors.surface, borderRadius: radius.xl, overflow: 'hidden', ...shadows.sm},
  tableHeaderRow: {flexDirection: 'row', backgroundColor: colors.background, borderBottomWidth: 1, borderBottomColor: colors.border, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm},
  tableHeaderText: {...typography.captionSemibold, fontSize: 11, color: colors.textSecondary},
  tableRow: {flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#F3F4F6', paddingHorizontal: spacing.lg, paddingVertical: spacing.md},
  tableCellText: {...typography.label, fontSize: 13, color: colors.textPrimary},
  tableCellMuted: {...typography.label, fontSize: 13, color: colors.textSecondary},
  tableCellStrong: {...typography.labelSemibold, fontSize: 13, color: colors.textPrimary},
  tableTotalRow: {backgroundColor: colors.primarySurface, borderBottomWidth: 0},
  tableTotalText: {...typography.bodyBold, fontSize: 13, color: colors.textPrimary},
  tableTotalGreen: {color: colors.primary},
  tableCol1: {flex: 2.2},
  tableCol2: {flex: 1},
  tableCol3: {flex: 1, textAlign: 'right'},
  payoutCard: {backgroundColor: colors.surface, borderRadius: radius.xl, padding: spacing.lg, gap: spacing.sm, ...shadows.sm},
  payoutTitle: {...typography.labelSemibold, fontSize: 13, color: colors.textPrimary},
  payoutRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  payoutLabel: {...typography.label, fontSize: 13, color: colors.textSecondary},
  payoutValue: {...typography.labelSemibold, fontSize: 13, color: colors.textPrimary},
  payoutValueStrong: {...typography.bodyBold, fontSize: 14, color: colors.primary},
});
