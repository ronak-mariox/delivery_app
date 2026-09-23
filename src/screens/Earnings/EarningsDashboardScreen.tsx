import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Card, Icon, ProgressBar, Screen, StatTile} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'EarningsDashboard'>;

const WEEK_DATA = [
  {day: 'Mon', value: 180},
  {day: 'Tue', value: 220},
  {day: 'Wed', value: 310},
  {day: 'Thu', value: 190},
  {day: 'Fri', value: 280},
  {day: 'Sat', value: 428},
  {day: 'Sun', value: 0},
];

const MAX_VALUE = Math.max(...WEEK_DATA.map(d => d.value));
const ACTIONS: {label: string; onPress: (navigation: Props['navigation']) => void}[] = [
  {label: 'View Today', onPress: navigation => navigation.navigate('TodaysEarnings')},
  {label: 'Payment History', onPress: navigation => navigation.navigate('PaymentHistory')},
  {label: 'Payout Details', onPress: navigation => navigation.navigate('EarningsBreakdown')},
];

export function EarningsDashboardScreen({navigation}: Props) {
  return (
    <Screen backgroundColor={colors.primary} statusBarStyle="light-content" edges={['top', 'bottom']} scroll>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.syncButton}
          hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
          accessibilityLabel="Sync earnings"
          onPress={() => navigation.navigate('StateServerError')}>
          <Icon name="refresh" size={18} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.greeting}>Good Evening, Ravi</Text>
        <Text style={styles.headerSubtitle}>Your earnings at a glance</Text>
        <View style={styles.weekRow}>
          <View>
            <Text style={styles.weekLabel}>This week</Text>
            <Text style={styles.weekValue}>₹1,284</Text>
          </View>
          <View style={styles.trendBadge}>
            <Text style={styles.trendText}>{'↑ 12% vs last week'}</Text>
          </View>
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.statsRow}>
          <TouchableOpacity style={styles.flex} activeOpacity={0.8} onPress={() => navigation.navigate('TodaysEarnings')}>
            <StatTile value="₹428" label="Today" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.flex} activeOpacity={0.8} onPress={() => navigation.navigate('MonthlyEarnings')}>
            <StatTile value="₹8,240" label="This Month" />
          </TouchableOpacity>
          <StatTile value="₹82" label="Pending" />
        </View>

        <Card style={styles.chartCard}>
          <Text style={styles.cardTitle}>7-Day Earnings</Text>
          <View style={styles.chart}>
            {WEEK_DATA.map(d => {
              const isPeak = d.value === MAX_VALUE;
              const height = Math.max(4, (d.value / MAX_VALUE) * 90);
              return (
                <View key={d.day} style={styles.chartColumn}>
                  {d.value > 0 && (
                    <Text style={[styles.chartValue, isPeak && styles.chartValuePeak]}>{d.value}</Text>
                  )}
                  <View style={[styles.chartBar, {height}, isPeak ? styles.chartBarPeak : styles.chartBarNormal]} />
                  <Text style={styles.chartDay}>{d.day}</Text>
                </View>
              );
            })}
          </View>
        </Card>

        <TouchableOpacity activeOpacity={0.85} onPress={() => navigation.navigate('PayoutProcessing')}>
          <Card style={styles.payoutCard}>
            <Text style={styles.payoutTitle}>Next payout: Monday, Sep 9</Text>
            <Text style={styles.payoutAmount}>Amount: ₹1,284</Text>
            <View style={styles.payoutProgressRow}>
              <Text style={styles.payoutProgressLabel}>Payout cycle progress</Text>
              <Text style={styles.payoutProgressValue}>5 / 7 days</Text>
            </View>
            <ProgressBar progress={5 / 7} height={8} trackColor={colors.border} />
          </Card>
        </TouchableOpacity>

        <View style={styles.actionsRow}>
          {ACTIONS.map(action => (
            <TouchableOpacity
              key={action.label}
              style={styles.actionButton}
              activeOpacity={0.8}
              onPress={() => action.onPress(navigation)}>
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
  greeting: {...typography.body, color: 'rgba(255,255,255,0.8)'},
  headerSubtitle: {...typography.label, color: 'rgba(255,255,255,0.65)'},
  weekRow: {flexDirection: 'row', alignItems: 'flex-end', gap: spacing.md, marginTop: spacing.xl},
  weekLabel: {...typography.label, color: 'rgba(255,255,255,0.7)'},
  weekValue: {...typography.display, color: colors.white, letterSpacing: -1, marginTop: 4},
  trendBadge: {backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: 3, marginBottom: 6},
  trendText: {...typography.captionSemibold, color: colors.white},
  body: {padding: spacing.lg, gap: spacing.md, backgroundColor: colors.background},
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
  payoutCard: {gap: spacing.sm},
  payoutTitle: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary},
  payoutAmount: {...typography.label, color: colors.textSecondary},
  payoutProgressRow: {flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.xs},
  payoutProgressLabel: {...typography.caption, color: colors.textSecondary},
  payoutProgressValue: {...typography.captionSemibold, color: colors.primary},
  actionsRow: {flexDirection: 'row', gap: spacing.sm},
  actionButton: {
    flex: 1,
    height: 41,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {...typography.captionSemibold, color: colors.primary, textAlign: 'center'},
});
