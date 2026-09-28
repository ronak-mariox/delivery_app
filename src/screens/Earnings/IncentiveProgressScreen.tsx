import React, {useCallback} from 'react';
import {RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import Svg, {Circle} from 'react-native-svg';
import {RootStackParamList} from '../../navigation/types';
import {EmptyState, ErrorState, IconBackButton, Loader} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {getIncentiveProgress} from '../../services/driverApi';
import {formatDate, formatMoney, incentiveEarned, incentiveProgressRatio, isIncentiveActive, isIncentiveCompleted, isIncentiveExpired, useAsyncData} from './earningsShared';

type Props = NativeStackScreenProps<RootStackParamList, 'IncentiveProgress'>;

interface Segment {
  label: string;
  count: number;
  pct: number;
  color: string;
}

const SIZE = 130;
const STROKE = 18;
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
            fill="none"
            transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
          />
        );
      })}
    </Svg>
  );
}

export function IncentiveProgressScreen({navigation}: Props) {
  const loader = useCallback(() => getIncentiveProgress(), []);
  const {data, loading, refreshing, error, reload} = useAsyncData(loader);

  const incentives = data ?? [];
  const active = incentives.filter(i => isIncentiveActive(i));
  const completed = incentives.filter(isIncentiveCompleted);
  const expired = incentives.filter(i => isIncentiveExpired(i) && !isIncentiveCompleted(i));
  const total = active.length + completed.length + expired.length;
  const pct = (n: number) => (total > 0 ? Math.round((n / total) * 100) : 0);
  const segments: Segment[] = [
    {label: 'Completed', count: completed.length, pct: pct(completed.length), color: colors.primary},
    {label: 'In Progress', count: active.length, pct: pct(active.length), color: colors.warning},
    {label: 'Expired', count: expired.length, pct: pct(expired.length), color: colors.borderStrong},
  ];
  const potential = active.reduce((sum, i) => sum + (i.rewardAmount ?? 0), 0);
  const earned = completed.reduce((sum, i) => sum + incentiveEarned(i), 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconBackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Incentive Progress</Text>
        <Text style={styles.headerDate}>{formatDate(new Date().toISOString())}</Text>
      </View>

      {loading && <Loader fullscreen label="Loading incentive progress…" />}

      {!loading && !data && <ErrorState title="Could not load progress" description={error ?? undefined} onRetry={() => reload()} />}

      {!loading && data && total === 0 && (
        <EmptyState icon="star" title="No incentives yet" description="Your progress will show here once incentives are available." />
      )}

      {!loading && data && total > 0 && (
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.body}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => reload(true)} />}>
          <View style={styles.donutCard}>
            <View style={styles.donutWrap}>
              <Donut segments={segments} />
              <View style={styles.donutCenter} pointerEvents="none">
                <Text style={styles.donutCenterValue}>{formatMoney(potential)}</Text>
                <Text style={styles.donutCenterLabel}>potential</Text>
              </View>
            </View>
            <View style={styles.legend}>
              {segments.map(seg => (
                <View key={seg.label} style={styles.legendRow}>
                  <View style={[styles.legendDot, {backgroundColor: seg.color}]} />
                  <Text style={styles.legendLabel}>{seg.label}</Text>
                  <Text style={styles.legendPct}>{`${seg.count} · ${seg.pct}%`}</Text>
                </View>
              ))}
            </View>
          </View>

          <Text style={styles.sectionLabel}>ACTIVE INCENTIVES</Text>
          <View style={styles.tableCard}>
            <View style={styles.tableHeaderRow}>
              <Text style={[styles.tableHeaderText, styles.colName]}>Incentive</Text>
              <Text style={[styles.tableHeaderText, styles.colProgress]}>Progress</Text>
              <Text style={[styles.tableHeaderText, styles.colReward]}>Reward</Text>
              <Text style={[styles.tableHeaderText, styles.colStatus]}>Status</Text>
            </View>
            {active.length === 0 && (
              <View style={styles.tableEmptyRow}>
                <Text style={styles.tableEmptyText}>No active incentives right now.</Text>
              </View>
            )}
            {active.map((row, index) => {
              const ratio = incentiveProgressRatio(row);
              const almost = ratio >= 0.8;
              return (
                <TouchableOpacity
                  key={row.id}
                  style={[styles.tableRow, index < active.length - 1 && styles.tableRowBorder]}
                  activeOpacity={0.7}
                  onPress={() => navigation.navigate('IncentiveDetail', {incentiveId: row.id})}>
                  <Text style={[styles.tableCellStrong, styles.colName]} numberOfLines={1}>
                    {row.title}
                  </Text>
                  <Text style={[styles.tableCellMuted, styles.colProgress]}>{`${row.progress?.currentProgress ?? 0}/${row.targetDeliveries}`}</Text>
                  <Text style={[styles.tableCellReward, styles.colReward]}>{formatMoney(row.rewardAmount)}</Text>
                  <View style={[styles.colStatus, styles.statusPillWrap]}>
                    <View style={[styles.statusPill, almost && styles.statusPillAlmost]}>
                      <Text style={[styles.statusPillText, almost && styles.statusPillTextAlmost]}>{almost ? 'Almost!' : 'In Progress'}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {completed.length > 0 && (
            <>
              <Text style={[styles.sectionLabel, styles.sectionLabelSpaced]}>COMPLETED</Text>
              <View style={styles.tableCard}>
                <View style={styles.tableHeaderRow}>
                  <Text style={[styles.tableHeaderText, styles.colNameWide]}>Incentive</Text>
                  <Text style={[styles.tableHeaderText, styles.colDate]}>Completed</Text>
                  <Text style={[styles.tableHeaderText, styles.colDate]}>Earned</Text>
                </View>
                {completed.map((row, index) => (
                  <TouchableOpacity
                    key={row.id}
                    style={[styles.tableRow, index < completed.length - 1 && styles.tableRowBorder]}
                    activeOpacity={0.7}
                    onPress={() => navigation.navigate('IncentiveBonusEarned', {incentiveId: row.id})}>
                    <Text style={[styles.tableCellStrong, styles.colNameWide]} numberOfLines={1}>
                      {row.title}
                    </Text>
                    <Text style={[styles.tableCellMuted, styles.colDate]}>{formatDate(row.progress?.completedAt)}</Text>
                    <Text style={[styles.tableCellReward, styles.colDate]}>{formatMoney(incentiveEarned(row))}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}

          {expired.length > 0 && (
            <TouchableOpacity style={styles.expiredLink} activeOpacity={0.7} onPress={() => navigation.navigate('IncentiveExpired')}>
              <Text style={styles.expiredLinkText}>{`View ${expired.length} expired ${expired.length === 1 ? 'incentive' : 'incentives'}`}</Text>
            </TouchableOpacity>
          )}

          <View style={styles.summaryBanner}>
            <Text style={styles.summaryText}>
              Potential remaining: <Text style={styles.summaryStrong}>{formatMoney(potential)}</Text>
            </Text>
            <Text style={[styles.summaryText, styles.summaryTextRight]}>
              Earned: <Text style={styles.summaryStrong}>{formatMoney(earned)}</Text>
            </Text>
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
    paddingHorizontal: spacing.lg,
    paddingTop: 48,
    paddingBottom: spacing.md,
  },
  headerTitle: {...typography.title, fontSize: 17, color: colors.textPrimary, flex: 1},
  headerDate: {...typography.label, fontSize: 13, color: colors.textSecondary},
  body: {padding: spacing.lg, gap: spacing.sm, paddingBottom: spacing.xxxl},
  donutCard: {flexDirection: 'row', alignItems: 'center', gap: spacing.xl, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.xl, padding: spacing.lg},
  donutWrap: {width: SIZE, height: SIZE, alignItems: 'center', justifyContent: 'center'},
  donutCenter: {position: 'absolute', alignItems: 'center'},
  donutCenterValue: {...typography.bodyBold, fontSize: 18, color: colors.textPrimary},
  donutCenterLabel: {...typography.caption, fontSize: 11, color: colors.textSecondary},
  legend: {flex: 1, gap: spacing.sm},
  legendRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm},
  legendDot: {width: 10, height: 10, borderRadius: 5},
  legendLabel: {...typography.label, fontSize: 13, color: colors.textSecondary, flex: 1},
  legendPct: {...typography.labelSemibold, fontSize: 13, color: colors.textPrimary},
  sectionLabel: {...typography.captionSemibold, fontSize: 13, color: colors.textSecondary, letterSpacing: 0.6, textTransform: 'uppercase', marginTop: spacing.md},
  sectionLabelSpaced: {marginTop: spacing.lg},
  tableCard: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.xl, overflow: 'hidden', marginTop: spacing.sm},
  tableHeaderRow: {flexDirection: 'row', backgroundColor: '#F9FAFB', borderBottomWidth: 1, borderBottomColor: colors.border, paddingHorizontal: spacing.md, paddingVertical: spacing.sm},
  tableHeaderText: {...typography.captionSemibold, fontSize: 11, color: colors.textSecondary},
  tableRow: {flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md, paddingVertical: spacing.md},
  tableRowBorder: {borderBottomWidth: 1, borderBottomColor: '#F3F4F6'},
  tableEmptyRow: {padding: spacing.lg},
  tableEmptyText: {...typography.label, fontSize: 13, color: colors.textSecondary},
  tableCellStrong: {...typography.labelSemibold, fontSize: 13, color: colors.textPrimary},
  tableCellMuted: {...typography.label, fontSize: 12, color: colors.textSecondary},
  tableCellReward: {...typography.labelSemibold, fontSize: 13, color: colors.primary},
  colName: {flex: 1.6},
  colNameWide: {flex: 2.2},
  colProgress: {flex: 0.9},
  colReward: {flex: 0.8},
  colStatus: {flex: 1.1},
  colDate: {flex: 1},
  statusPillWrap: {alignItems: 'flex-start'},
  statusPill: {backgroundColor: colors.warningSurface, borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: 3},
  statusPillAlmost: {backgroundColor: colors.primarySurface},
  statusPillText: {...typography.captionSemibold, fontSize: 11, color: colors.warning},
  statusPillTextAlmost: {color: colors.primary},
  expiredLink: {alignItems: 'center', paddingVertical: spacing.sm},
  expiredLinkText: {...typography.labelSemibold, fontSize: 13, color: colors.textSecondary},
  summaryBanner: {flexDirection: 'row', justifyContent: 'space-between', backgroundColor: colors.primarySurface, borderRadius: radius.lg, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, marginTop: spacing.md},
  summaryText: {...typography.label, fontSize: 13, color: colors.primaryDark, flex: 1},
  summaryTextRight: {textAlign: 'right'},
  summaryStrong: {...typography.bodyBold, fontSize: 13, color: colors.primaryDark},
});
