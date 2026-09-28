import React, {useCallback} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, EmptyState, ErrorState, Icon, Loader} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {getEarningsSummary, getIncentive} from '../../services/driverApi';
import {formatDateTime, formatMoney, incentiveEarned, isIncentiveCompleted, useAsyncData} from './earningsShared';

type Props = NativeStackScreenProps<RootStackParamList, 'IncentiveBonusEarned'> & {route: {params: {incentiveId: string}}};

const CONFETTI = [
  {left: 30, top: 40, color: colors.primary},
  {left: 80, top: 60, color: '#FCD34D'},
  {left: 140, top: 30, color: colors.white},
  {left: 200, top: 70, color: colors.primary},
  {left: 260, top: 40, color: '#FCD34D'},
  {left: 320, top: 60, color: colors.white},
  {left: 370, top: 35, color: colors.primary},
  {left: 100, top: 110, color: '#FCD34D'},
];

async function loadBonus(incentiveId: string) {
  const [incentive, today, week] = await Promise.all([getIncentive(incentiveId), getEarningsSummary('today'), getEarningsSummary('week')]);
  return {incentive, today, week};
}

export function IncentiveBonusEarnedScreen({route, navigation}: Props) {
  const {incentiveId} = route.params;
  const loader = useCallback(() => loadBonus(incentiveId), [incentiveId]);
  const {data, loading, error, reload} = useAsyncData(loader);
  const backToIncentives = () => navigation.reset({index: 0, routes: [{name: 'Incentives'}]});

  const incentive = data?.incentive;
  const completed = incentive ? isIncentiveCompleted(incentive) : false;
  const earned = incentive ? incentiveEarned(incentive) : 0;
  const rows = incentive
    ? [
        {label: 'Incentive', value: incentive.title},
        {label: 'Earned', value: formatMoney(earned)},
        {label: 'Deliveries completed', value: `${incentive.progress?.currentProgress ?? 0} of ${incentive.targetDeliveries}`},
        {label: 'Completed at', value: formatDateTime(incentive.progress?.completedAt)},
      ]
    : [];

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        {CONFETTI.map((dot, index) => (
          <View key={index} style={[styles.confettiDot, {left: dot.left, top: dot.top, backgroundColor: dot.color}]} />
        ))}
        <Icon name="star" size={48} color={colors.white} filled />
        <Text style={styles.heroTitle}>{completed ? 'Bonus Earned!' : 'Incentive Bonus'}</Text>
        <Text style={styles.heroSubtitle}>{incentive ? (completed ? `${formatMoney(earned)} added to your earnings` : incentive.title) : ' '}</Text>
      </View>

      {loading && <Loader fullscreen label="Loading bonus…" />}

      {!loading && !data && <ErrorState title="Could not load bonus" description={error ?? undefined} onRetry={() => reload()} />}

      {!loading && data && incentive && (
        <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
          {completed ? (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Bonus Details</Text>
              {rows.map((row, index) => (
                <View key={row.label} style={[styles.detailRow, index < rows.length - 1 && styles.detailRowBorder]}>
                  <Text style={styles.detailLabel}>{row.label}</Text>
                  <Text style={styles.detailValue}>{row.value}</Text>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.card}>
              <EmptyState
                icon="star"
                title="Bonus not earned yet"
                description={`Complete ${incentive.targetDeliveries} deliveries to earn ${formatMoney(incentive.rewardAmount)}.`}
              />
            </View>
          )}

          <View style={styles.updatedCard}>
            <Text style={styles.updatedTitle}>Updated Earnings</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Incentive bonuses today</Text>
              <Text style={styles.updatedValue}>{formatMoney(data.today.breakdown.incentiveBonus)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total today</Text>
              <Text style={styles.totalValue}>{formatMoney(data.today.totalEarnings)}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>This week</Text>
              <Text style={styles.detailValueStrong}>{formatMoney(data.week.totalEarnings)}</Text>
            </View>
          </View>

          <View style={styles.actionsRow}>
            <Button label="Bonus History" variant="outline" style={styles.flex} onPress={() => navigation.navigate('BonusHistory')} />
            <Button label="Back to Incentives" variant="primary" style={styles.flex} onPress={backToIncentives} />
          </View>

          <View style={styles.footnoteBanner}>
            <Text style={styles.footnoteText}>Completing incentives improves your priority ranking for order assignments.</Text>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  flex: {flex: 1},
  hero: {backgroundColor: colors.primary, alignItems: 'center', paddingTop: 40, paddingBottom: spacing.xl, paddingHorizontal: spacing.xl, overflow: 'hidden'},
  confettiDot: {position: 'absolute', width: 6, height: 6, borderRadius: 3, opacity: 0.85},
  heroTitle: {...typography.h4, fontSize: 22, color: colors.white, marginTop: spacing.sm},
  heroSubtitle: {...typography.body, color: 'rgba(255,255,255,0.85)', marginTop: 2, textAlign: 'center'},
  body: {padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxxl},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.xl, padding: spacing.lg},
  cardTitle: {...typography.bodyBold, fontSize: 13, color: colors.textPrimary},
  detailRow: {flexDirection: 'row', justifyContent: 'space-between', gap: spacing.md, paddingVertical: spacing.sm, marginTop: spacing.xs},
  detailRowBorder: {borderBottomWidth: 1, borderBottomColor: '#F3F4F6'},
  detailLabel: {...typography.label, fontSize: 13, color: colors.textSecondary},
  detailValue: {...typography.labelSemibold, fontSize: 13, color: colors.textPrimary, flexShrink: 1, textAlign: 'right'},
  detailValueStrong: {...typography.bodyBold, fontSize: 13, color: colors.textPrimary},
  updatedCard: {backgroundColor: colors.surface, borderWidth: 2, borderColor: colors.primary, borderRadius: radius.xl, padding: spacing.lg},
  updatedTitle: {...typography.bodyBold, fontSize: 13, color: colors.primary},
  updatedValue: {...typography.label, fontSize: 13, color: colors.textPrimary},
  totalRow: {flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: colors.primarySurface, paddingTop: spacing.sm, marginTop: spacing.xs},
  totalLabel: {...typography.h4, fontSize: 16, color: colors.primary},
  totalValue: {...typography.h4, fontSize: 16, color: colors.primary},
  actionsRow: {flexDirection: 'row', gap: spacing.sm},
  footnoteBanner: {backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, paddingHorizontal: spacing.md, paddingVertical: spacing.md},
  footnoteText: {...typography.caption, color: colors.textSecondary},
});
