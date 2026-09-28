import React, {useCallback} from 'react';
import {ActivityIndicator, RefreshControl, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Card, ErrorState, Icon, Loader, Screen, StatTile} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {driverName, useDriverAuth} from '../../context/DriverAuthContext';
import {getEarningsHistory, getEarningsSummary, getPayoutStatus} from '../../services/driverApi';
import {formatLongDate, formatMoney, groupByDay, useAsyncData} from './earningsShared';

type Props = NativeStackScreenProps<RootStackParamList, 'EarningsDashboard'>;

const ACTIONS: {label: string; route: 'TodaysEarnings' | 'WeeklyEarnings' | 'PaymentHistory' | 'EarningsBreakdown'}[] = [
  {label: 'View Today', route: 'TodaysEarnings'},
  {label: 'This Week', route: 'WeeklyEarnings'},
  {label: 'Payment History', route: 'PaymentHistory'},
  {label: 'Breakdown', route: 'EarningsBreakdown'},
];

function greetingForNow(): string {
  const hour = new Date().getHours();
  if (hour < 12) {
    return 'Good Morning';
  }
  if (hour < 17) {
    return 'Good Afternoon';
  }
  return 'Good Evening';
}

async function loadDashboard() {
  const [today, week, month, payout, history] = await Promise.all([
    getEarningsSummary('today'),
    getEarningsSummary('week'),
    getEarningsSummary('month'),
    getPayoutStatus(),
    getEarningsHistory(1, 100),
  ]);
  return {today, week, month, payout, weekDays: groupByDay(history.items, 7)};
}

export function EarningsDashboardScreen({navigation}: Props) {
  const {driver} = useDriverAuth();
  const loader = useCallback(() => loadDashboard(), []);
  const {data, loading, refreshing, error, reload} = useAsyncData(loader);

  if (loading) {
    return (
      <Screen backgroundColor={colors.background} edges={['top', 'bottom']}>
        <Loader fullscreen label="Loading your earnings…" />
      </Screen>
    );
  }

  if (!data) {
    return (
      <Screen backgroundColor={colors.background} edges={['top', 'bottom']}>
        <ErrorState title="Could not load earnings" description={error ?? undefined} onRetry={() => reload()} />
      </Screen>
    );
  }

  const maxDay = Math.max(...data.weekDays.map(d => d.value), 0);
  const hasWeekData = maxDay > 0;

  return (
    <Screen
      backgroundColor={colors.primary}
      statusBarStyle="light-content"
      edges={['top', 'bottom']}
      scroll
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => reload(true)} tintColor={colors.white} />}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.syncButton}
          hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
          accessibilityLabel="Sync earnings"
          disabled={refreshing}
          onPress={() => reload(true)}>
          {refreshing ? <ActivityIndicator size="small" color={colors.white} /> : <Icon name="refresh" size={18} color={colors.white} />}
        </TouchableOpacity>
        <Text style={styles.greeting}>{`${greetingForNow()}, ${driverName(driver)}`}</Text>
        <Text style={styles.headerSubtitle}>Your earnings at a glance</Text>
        <View style={styles.weekRow}>
          <View>
            <Text style={styles.weekLabel}>This week</Text>
            <Text style={styles.weekValue}>{formatMoney(data.week.totalEarnings)}</Text>
          </View>
          {data.week.changeLabel ? (
            <View style={styles.trendBadge}>
              <Text style={styles.trendText}>{data.week.changeLabel}</Text>
            </View>
          ) : null}
        </View>
      </View>

      <View style={styles.body}>
        {error ? <Text style={styles.inlineError}>{error}</Text> : null}
        <View style={styles.statsRow}>
          <TouchableOpacity style={styles.flex} activeOpacity={0.8} onPress={() => navigation.navigate('TodaysEarnings')}>
            <StatTile value={formatMoney(data.today.totalEarnings)} label="Today" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.flex} activeOpacity={0.8} onPress={() => navigation.navigate('MonthlyEarnings')}>
            <StatTile value={formatMoney(data.month.totalEarnings)} label="This Month" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.flex} activeOpacity={0.8} onPress={() => navigation.navigate('PaymentHistory')}>
            <StatTile value={formatMoney(data.payout.pendingAmount)} label="Pending" valueColor={colors.warningText} />
          </TouchableOpacity>
        </View>

        <Card style={styles.chartCard}>
          <Text style={styles.cardTitle}>7-Day Earnings</Text>
          {hasWeekData ? (
            <View style={styles.chart}>
              {data.weekDays.map(d => {
                const isPeak = d.value === maxDay;
                const height = Math.max(4, (d.value / maxDay) * 90);
                return (
                  <View key={d.key} style={styles.chartColumn}>
                    {d.value > 0 && <Text style={[styles.chartValue, isPeak && styles.chartValuePeak]}>{Math.round(d.value)}</Text>}
                    <View style={[styles.chartBar, {height}, isPeak ? styles.chartBarPeak : styles.chartBarNormal]} />
                    <Text style={styles.chartDay}>{d.label}</Text>
                  </View>
                );
              })}
            </View>
          ) : (
            <Text style={styles.chartEmpty}>No earnings recorded in the last 7 days.</Text>
          )}
        </Card>

        <TouchableOpacity activeOpacity={0.85} onPress={() => navigation.navigate('PaymentHistory')}>
          <Card style={styles.payoutCard}>
            <Text style={styles.payoutTitle}>{`Next payout: ${formatLongDate(data.payout.nextPayoutDate)}`}</Text>
            <Text style={styles.payoutAmount}>{`Pending: ${formatMoney(data.payout.pendingAmount)}`}</Text>
            <View style={styles.payoutProgressRow}>
              <Text style={styles.payoutProgressLabel}>Lifetime paid</Text>
              <Text style={styles.payoutProgressValue}>{formatMoney(data.payout.lifetimePaid)}</Text>
            </View>
          </Card>
        </TouchableOpacity>

        <View style={styles.actionsRow}>
          {ACTIONS.map(action => (
            <TouchableOpacity key={action.route} style={styles.actionButton} activeOpacity={0.8} onPress={() => navigation.navigate(action.route)}>
              <Text style={styles.actionButtonText}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {backgroundColor: colors.primary, paddingHorizontal: spacing.xxl, paddingTop: spacing.xl, paddingBottom: spacing.xxxl, gap: 2},
  syncButton: {position: 'absolute', top: spacing.xl, right: spacing.xxl, width: 34, height: 34, borderRadius: radius.md, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center'},
  greeting: {...typography.body, color: 'rgba(255,255,255,0.8)', paddingRight: 44},
  headerSubtitle: {...typography.label, color: 'rgba(255,255,255,0.65)'},
  weekRow: {flexDirection: 'row', alignItems: 'flex-end', gap: spacing.md, marginTop: spacing.xl},
  weekLabel: {...typography.label, color: 'rgba(255,255,255,0.7)'},
  weekValue: {...typography.display, color: colors.white, letterSpacing: -1, marginTop: 4},
  trendBadge: {backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: 3, marginBottom: 6},
  trendText: {...typography.captionSemibold, color: colors.white},
  body: {padding: spacing.lg, gap: spacing.md, backgroundColor: colors.background, flexGrow: 1},
  inlineError: {...typography.caption, color: colors.dangerText},
  statsRow: {flexDirection: 'row', gap: spacing.sm},
  flex: {flex: 1},
  chartCard: {gap: spacing.md},
  cardTitle: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary},
  chart: {flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 130, paddingTop: spacing.md},
  chartColumn: {flex: 1, alignItems: 'center', justifyContent: 'flex-end', gap: 4},
  chartValue: {...typography.overline, fontSize: 9, color: colors.primary},
  chartValuePeak: {fontWeight: '700'},
  chartBar: {width: 22, borderRadius: 6},
  chartBarNormal: {backgroundColor: colors.primarySurface},
  chartBarPeak: {backgroundColor: colors.primary},
  chartDay: {...typography.caption, fontSize: 10, color: colors.textSecondary, marginTop: 4},
  chartEmpty: {...typography.label, color: colors.textSecondary},
  payoutCard: {gap: spacing.sm},
  payoutTitle: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary},
  payoutAmount: {...typography.label, color: colors.textSecondary},
  payoutProgressRow: {flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.xs},
  payoutProgressLabel: {...typography.caption, color: colors.textSecondary},
  payoutProgressValue: {...typography.captionSemibold, color: colors.primary},
  actionsRow: {flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm},
  actionButton: {
    flexBasis: '47%',
    flexGrow: 1,
    height: 41,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {...typography.captionSemibold, color: colors.primary, textAlign: 'center'},
});
