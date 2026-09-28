import React, {useCallback} from 'react';
import {RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, EmptyState, ErrorState, Loader, ProgressBar, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {Incentive, listIncentives} from '../../services/driverApi';
import {formatDate, formatMoney, incentiveProgressRatio, isIncentiveActive, isIncentiveCompleted, isIncentiveExpired, isIncentiveUpcoming, useAsyncData} from './earningsShared';

type Props = NativeStackScreenProps<RootStackParamList, 'Incentives'>;

export function IncentivesScreen({navigation}: Props) {
  const loader = useCallback(() => listIncentives(), []);
  const {data, loading, refreshing, error, reload} = useAsyncData(loader);

  const incentives = data ?? [];
  const active = incentives.filter(i => isIncentiveActive(i));
  const upcoming = incentives.filter(i => isIncentiveUpcoming(i));
  const completed = incentives.filter(isIncentiveCompleted);
  const expired = incentives.filter(i => isIncentiveExpired(i) && !isIncentiveCompleted(i));
  const potential = active.reduce((sum, i) => sum + (i.rewardAmount ?? 0), 0);

  const openIncentive = (incentive: Incentive) => {
    if (isIncentiveCompleted(incentive)) {
      navigation.navigate('IncentiveBonusEarned', {incentiveId: incentive.id});
    } else if (isIncentiveExpired(incentive)) {
      navigation.navigate('IncentiveExpired');
    } else {
      navigation.navigate('IncentiveDetail', {incentiveId: incentive.id});
    }
  };

  const renderCard = (incentive: Incentive, tone: 'green' | 'orange' | 'muted') => {
    const ratio = incentiveProgressRatio(incentive);
    const current = incentive.progress?.currentProgress ?? 0;
    return (
      <TouchableOpacity
        key={incentive.id}
        activeOpacity={0.85}
        style={[styles.incentiveCard, tone === 'green' && styles.incentiveCardGreen, tone === 'orange' && styles.incentiveCardOrange, tone === 'muted' && styles.incentiveCardMuted]}
        onPress={() => openIncentive(incentive)}>
        <View style={styles.incentiveRow}>
          <View style={styles.incentiveTextBlock}>
            <Text style={[styles.incentiveTitle, tone === 'green' && styles.incentiveTitleGreen, tone === 'orange' && styles.incentiveTitleOrange]}>{incentive.title}</Text>
            {incentive.description ? <Text style={styles.incentiveDesc}>{incentive.description}</Text> : null}
            <Text style={styles.incentiveMeta}>{isIncentiveCompleted(incentive) ? `Completed ${formatDate(incentive.progress?.completedAt)}` : `Ends ${formatDate(incentive.expiresAt)}`}</Text>
          </View>
          <View style={[styles.rewardPill, tone === 'orange' && styles.rewardPillOrange, tone === 'muted' && styles.rewardPillMuted]}>
            <Text style={styles.rewardPillText}>{formatMoney(incentive.rewardAmount)}</Text>
          </View>
        </View>
        <View style={styles.progressMetaRow}>
          <Text style={styles.progressMetaText}>{`${current} of ${incentive.targetDeliveries} deliveries`}</Text>
          <Text style={styles.progressMetaText}>{`${Math.round(ratio * 100)}%`}</Text>
        </View>
        <ProgressBar
          progress={ratio}
          height={8}
          trackColor={tone === 'orange' ? '#FDE8C8' : tone === 'muted' ? '#F3F4F6' : '#C6EAD9'}
          fillColor={tone === 'orange' ? colors.warning : tone === 'muted' ? colors.borderStrong : colors.primary}
          style={styles.progressBarSpacing}
        />
      </TouchableOpacity>
    );
  };

  return (
    <Screen backgroundColor={colors.primary} statusBarStyle="light-content" edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Incentives</Text>
        <Text style={styles.headerSubtitle}>{active.length > 0 ? `${formatMoney(potential)} bonus potential right now` : 'Bonuses for hitting delivery targets'}</Text>
      </View>

      {loading && (
        <View style={styles.stateWrap}>
          <Loader fullscreen label="Loading incentives…" />
        </View>
      )}

      {!loading && !data && (
        <View style={styles.stateWrap}>
          <ErrorState title="Could not load incentives" description={error ?? undefined} onRetry={() => reload()} />
        </View>
      )}

      {!loading && data && (
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.body}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => reload(true)} />}>
          <Text style={styles.sectionLabel}>ACTIVE INCENTIVES</Text>
          {active.length === 0 ? (
            <View style={styles.emptyCard}>
              <EmptyState icon="star" title="No active incentives" description="New bonus opportunities will appear here." />
            </View>
          ) : (
            active.map(i => renderCard(i, incentiveProgressRatio(i) >= 0.5 ? 'green' : 'orange'))
          )}

          {upcoming.length > 0 && (
            <>
              <Text style={[styles.sectionLabel, styles.sectionLabelSpaced]}>UPCOMING INCENTIVES</Text>
              {upcoming.map(item => (
                <View key={item.id} style={styles.upcomingRow}>
                  <View style={styles.flex}>
                    <Text style={styles.upcomingTitle}>{item.title}</Text>
                    <Text style={styles.upcomingSubtitle}>{`Starts ${formatDate(item.startAt)}`}</Text>
                  </View>
                  <Text style={styles.upcomingAmount}>{formatMoney(item.rewardAmount)}</Text>
                </View>
              ))}
            </>
          )}

          {completed.length > 0 && (
            <>
              <Text style={[styles.sectionLabel, styles.sectionLabelSpaced]}>COMPLETED</Text>
              {completed.map(i => renderCard(i, 'green'))}
            </>
          )}

          {expired.length > 0 && (
            <>
              <Text style={[styles.sectionLabel, styles.sectionLabelSpaced]}>EXPIRED</Text>
              {expired.map(i => renderCard(i, 'muted'))}
            </>
          )}

          <View style={styles.actionsRow}>
            <Button label="View Progress" variant="outline" style={styles.flex} onPress={() => navigation.navigate('IncentiveProgress')} />
            <Button label="Bonus History" variant="ghost" textColor={colors.textSecondary} style={styles.flex} onPress={() => navigation.navigate('BonusHistory')} />
          </View>
        </ScrollView>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: {flex: 1},
  header: {backgroundColor: colors.primary, paddingHorizontal: spacing.xl, paddingTop: spacing.xl, paddingBottom: spacing.xxl, gap: 4},
  headerTitle: {...typography.h4, fontSize: 22, color: colors.white},
  headerSubtitle: {...typography.body, color: 'rgba(255,255,255,0.8)'},
  stateWrap: {flex: 1, backgroundColor: colors.background},
  body: {padding: spacing.lg, gap: spacing.sm, backgroundColor: colors.background, paddingBottom: spacing.xxxl, flexGrow: 1},
  sectionLabel: {...typography.captionSemibold, fontSize: 13, color: colors.textSecondary, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: spacing.xs},
  sectionLabelSpaced: {marginTop: spacing.lg},
  emptyCard: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.xxl},
  incentiveCard: {borderRadius: radius.xxl, borderWidth: 1.5, padding: spacing.lg, marginBottom: spacing.sm, backgroundColor: colors.surface, borderColor: colors.border},
  incentiveCardGreen: {backgroundColor: colors.primarySurface, borderColor: colors.primary},
  incentiveCardOrange: {backgroundColor: colors.warningSurface, borderColor: colors.warning},
  incentiveCardMuted: {backgroundColor: '#F9FAFB', borderColor: colors.border},
  incentiveRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start'},
  incentiveTextBlock: {flex: 1, paddingRight: spacing.md},
  incentiveTitle: {...typography.bodyBold, fontSize: 15, color: colors.textPrimary},
  incentiveTitleGreen: {color: colors.primaryDark},
  incentiveTitleOrange: {color: '#B54708'},
  incentiveDesc: {...typography.label, fontSize: 13, color: colors.textPrimary, marginTop: 3},
  incentiveMeta: {...typography.caption, color: colors.textSecondary, marginTop: 3},
  rewardPill: {backgroundColor: colors.primary, borderRadius: radius.sm, paddingHorizontal: spacing.sm, paddingVertical: 4},
  rewardPillOrange: {backgroundColor: colors.warning},
  rewardPillMuted: {backgroundColor: colors.textMuted},
  rewardPillText: {...typography.bodyBold, fontSize: 13, color: colors.white},
  progressMetaRow: {flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.sm},
  progressMetaText: {...typography.caption, color: colors.textSecondary},
  progressBarSpacing: {marginTop: spacing.xs},
  upcomingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginBottom: spacing.sm,
  },
  upcomingTitle: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary},
  upcomingSubtitle: {...typography.caption, color: colors.textSecondary, marginTop: 1},
  upcomingAmount: {...typography.bodyBold, fontSize: 14, color: colors.textSecondary},
  actionsRow: {flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md},
});
