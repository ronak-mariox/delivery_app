import React, {useCallback} from 'react';
import {RefreshControl, ScrollView, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, ErrorState, Icon, IconBackButton, Loader, ProgressBar} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {getEarningsSummary, getIncentive, IncentiveCondition} from '../../services/driverApi';
import {formatDateTime, formatMoney, incentiveProgressRatio, incentiveTimeLeft, isIncentiveCompleted, isIncentiveExpired, useAsyncData} from './earningsShared';

type Props = NativeStackScreenProps<RootStackParamList, 'IncentiveDetail'> & {route: {params: {incentiveId: string}}};

type ConditionState = 'met' | 'inProgress' | 'pending';

function conditionState(condition: IncentiveCondition, currentProgress: number, completed: boolean): ConditionState {
  if (completed) {
    return 'met';
  }
  if (/deliver/i.test(condition.type)) {
    if (currentProgress >= condition.threshold) {
      return 'met';
    }
    return currentProgress > 0 ? 'inProgress' : 'pending';
  }
  return 'pending';
}

async function loadDetail(incentiveId: string) {
  const [incentive, today] = await Promise.all([getIncentive(incentiveId), getEarningsSummary('today')]);
  return {incentive, today};
}

export function IncentiveDetailScreen({route, navigation}: Props) {
  const {incentiveId} = route.params;
  const loader = useCallback(() => loadDetail(incentiveId), [incentiveId]);
  const {data, loading, refreshing, error, reload} = useAsyncData(loader);

  const incentive = data?.incentive;
  const completed = incentive ? isIncentiveCompleted(incentive) : false;
  const expired = incentive ? !completed && isIncentiveExpired(incentive) : false;
  const ratio = incentive ? incentiveProgressRatio(incentive) : 0;
  const current = incentive?.progress?.currentProgress ?? 0;
  const target = incentive?.targetDeliveries ?? 0;
  const remaining = Math.max(0, target - current);
  const statusLabel = completed ? 'COMPLETED' : expired ? 'EXPIRED' : 'ACTIVE';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconBackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle} numberOfLines={1}>
          {incentive?.title ?? 'Incentive'}
        </Text>
        {incentive && (
          <View style={[styles.statusPill, completed && styles.statusPillCompleted, expired && styles.statusPillExpired]}>
            <Text style={[styles.statusPillText, expired && styles.statusPillTextExpired]}>{statusLabel}</Text>
          </View>
        )}
      </View>

      {loading && <Loader fullscreen label="Loading incentive…" />}

      {!loading && !data && <ErrorState title="Could not load incentive" description={error ?? undefined} onRetry={() => reload()} />}

      {!loading && data && incentive && (
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.body}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => reload(true)} />}>
          <View style={[styles.heroCard, expired && styles.heroCardExpired]}>
            <Text style={styles.heroAmount}>{formatMoney(incentive.rewardAmount)}</Text>
            <Text style={styles.heroLabel}>Bonus reward</Text>
            <View style={styles.timerPill}>
              <Icon name="clock" size={14} color={colors.white} />
              <Text style={styles.timerPillText}>{completed ? `Completed ${formatDateTime(incentive.progress?.completedAt)}` : incentiveTimeLeft(incentive.expiresAt)}</Text>
            </View>
          </View>

          {incentive.description ? <Text style={styles.description}>{incentive.description}</Text> : null}

          <View style={styles.card}>
            <Text style={styles.progressTitle}>{`${current} of ${target} deliveries completed`}</Text>
            <Text style={styles.progressSubtitle}>
              {completed ? 'Target reached' : expired ? `Ended ${remaining} ${remaining === 1 ? 'delivery' : 'deliveries'} short` : `${remaining} more ${remaining === 1 ? 'delivery' : 'deliveries'} needed`}
            </Text>
            <ProgressBar progress={ratio} height={12} fillColor={expired ? colors.borderStrong : colors.primary} style={styles.progressBar} />
            <View style={styles.progressAxisRow}>
              <Text style={styles.progressAxisText}>0</Text>
              <Text style={styles.progressAxisText}>{`${Math.round(ratio * 100)}%`}</Text>
              <Text style={styles.progressAxisText}>{target}</Text>
            </View>
          </View>

          {incentive.conditions?.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Conditions</Text>
              {incentive.conditions.map((condition, index) => {
                const state = conditionState(condition, current, completed);
                return (
                  <View key={`${condition.type}-${index}`} style={[styles.conditionRow, index < incentive.conditions.length - 1 && styles.conditionRowBorder]}>
                    <View style={[styles.conditionIcon, state === 'met' && styles.conditionIconMet, state === 'inProgress' && styles.conditionIconInProgress, state === 'pending' && styles.conditionIconPending]}>
                      {state === 'met' ? (
                        <Icon name="check" size={11} color={colors.primary} />
                      ) : (
                        <View style={[styles.conditionDot, state === 'inProgress' && styles.conditionDotInProgress, state === 'pending' && styles.conditionDotPending]} />
                      )}
                    </View>
                    <Text style={[styles.conditionText, state === 'inProgress' && styles.conditionTextInProgress, state === 'pending' && styles.conditionTextPending]}>
                      {condition.label}
                      {condition.threshold ? ` (${condition.threshold})` : ''}
                    </Text>
                  </View>
                );
              })}
            </View>
          )}

          <View style={styles.card}>
            <Text style={styles.cardTitle}>{completed ? 'Earnings with this bonus' : 'Earnings if completed'}</Text>
            <View style={styles.earningsRow}>
              <Text style={styles.earningsLabel}>Earnings today</Text>
              <Text style={styles.earningsValue}>{formatMoney(data.today.totalEarnings)}</Text>
            </View>
            <View style={styles.earningsRow}>
              <Text style={styles.earningsLabel}>+ This bonus</Text>
              <Text style={styles.earningsValue}>{formatMoney(incentive.rewardAmount)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{formatMoney(data.today.totalEarnings + (incentive.rewardAmount ?? 0))}</Text>
            </View>
          </View>

          {completed ? (
            <Button label="View Bonus" icon="arrow-right" iconPosition="right" onPress={() => navigation.navigate('IncentiveBonusEarned', {incentiveId: incentive.id})} />
          ) : expired ? (
            <Button label="Expired Incentives" variant="secondary" onPress={() => navigation.navigate('IncentiveExpired')} />
          ) : (
            <Button label="Continue Delivering" icon="arrow-right" iconPosition="right" onPress={() => navigation.navigate('Home')} />
          )}
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
  statusPill: {backgroundColor: colors.primarySurface, borderWidth: 1, borderColor: colors.primary, borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: 3},
  statusPillCompleted: {backgroundColor: colors.primary},
  statusPillExpired: {backgroundColor: colors.border, borderColor: colors.borderStrong},
  statusPillText: {...typography.captionSemibold, fontSize: 11, color: colors.primary},
  statusPillTextExpired: {color: colors.textMuted},
  body: {padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxxl},
  heroCard: {backgroundColor: colors.primary, borderRadius: radius.xxl, paddingVertical: spacing.xxl, paddingHorizontal: spacing.xl, alignItems: 'center'},
  heroCardExpired: {backgroundColor: colors.dark600},
  heroAmount: {...typography.display, fontSize: 40, color: colors.white, fontWeight: '800'},
  heroLabel: {...typography.label, fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2},
  timerPill: {flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: spacing.xs, marginTop: spacing.md},
  timerPillText: {...typography.labelSemibold, fontSize: 13, color: colors.white},
  description: {...typography.label, fontSize: 13, color: colors.textSecondary},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.xl, padding: spacing.lg},
  progressTitle: {...typography.bodyBold, fontSize: 14, color: colors.textPrimary},
  progressSubtitle: {...typography.caption, color: colors.textSecondary, marginTop: 2},
  progressBar: {marginTop: spacing.md},
  progressAxisRow: {flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.xs},
  progressAxisText: {...typography.caption, fontSize: 11, color: colors.textSecondary},
  cardTitle: {...typography.bodyBold, fontSize: 13, color: colors.textPrimary, marginBottom: spacing.sm},
  conditionRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.xs},
  conditionRowBorder: {borderBottomWidth: 1, borderBottomColor: '#F3F4F6'},
  conditionIcon: {width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center'},
  conditionIconMet: {backgroundColor: colors.primarySurface},
  conditionIconInProgress: {backgroundColor: colors.warningSurface},
  conditionIconPending: {backgroundColor: '#F3F4F6'},
  conditionDot: {width: 8, height: 8, borderRadius: 4},
  conditionDotInProgress: {backgroundColor: colors.warning},
  conditionDotPending: {backgroundColor: colors.borderStrong},
  conditionText: {...typography.label, fontSize: 13, color: colors.textPrimary, flex: 1},
  conditionTextInProgress: {color: colors.warningText},
  conditionTextPending: {color: colors.textMuted},
  earningsRow: {flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.xs},
  earningsLabel: {...typography.label, fontSize: 13, color: colors.textSecondary},
  earningsValue: {...typography.label, fontSize: 13, color: colors.textSecondary},
  totalRow: {flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.sm, marginTop: spacing.xs},
  totalLabel: {...typography.bodyBold, fontSize: 15, color: colors.primary},
  totalValue: {...typography.bodyBold, fontSize: 15, color: colors.primary},
});
