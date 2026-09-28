import React, {useCallback, useState} from 'react';
import {RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, ErrorState, IconBackButton, Loader} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {getApiErrorMessage} from '../../services/api';
import {getBonusHistory, getEarningsSummary, LedgerEntry, Paged} from '../../services/driverApi';
import {formatMoney, periodStart, useAsyncData} from './earningsShared';
import {LedgerList} from './LedgerList';

type Props = NativeStackScreenProps<RootStackParamList, 'BonusHistory'>;

type Filter = 'All' | 'This Week' | 'This Month';
const FILTERS: Filter[] = ['All', 'This Week', 'This Month'];
const PAGE_SIZE = 30;

function matchesFilter(entry: LedgerEntry, filter: Filter) {
  if (filter === 'All') {
    return true;
  }
  const start = periodStart(filter === 'This Week' ? 'week' : 'month').getTime();
  return new Date(entry.createdAt).getTime() >= start;
}

async function loadBonuses() {
  const [month, history] = await Promise.all([getEarningsSummary('month'), getBonusHistory(1, PAGE_SIZE)]);
  return {month, history};
}

export function BonusHistoryScreen({navigation}: Props) {
  const [filter, setFilter] = useState<Filter>('All');
  const [extraPages, setExtraPages] = useState<Paged<LedgerEntry>[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState<string | null>(null);

  const loader = useCallback(async () => {
    setExtraPages([]);
    setLoadMoreError(null);
    return loadBonuses();
  }, []);
  const {data, loading, refreshing, error, reload} = useAsyncData(loader);

  const lastPage = extraPages.length > 0 ? extraPages[extraPages.length - 1] : data?.history;
  const hasMore = Boolean(lastPage && lastPage.page < lastPage.totalPages);
  const entries = [...(data?.history.items ?? []), ...extraPages.flatMap(p => p.items)];
  const visible = entries.filter(e => matchesFilter(e, filter));
  const visibleTotal = visible.reduce((sum, e) => sum + e.amount, 0);

  const loadMore = async () => {
    if (!lastPage || loadingMore) {
      return;
    }
    setLoadingMore(true);
    setLoadMoreError(null);
    try {
      const next = await getBonusHistory(lastPage.page + 1, PAGE_SIZE);
      setExtraPages(prev => [...prev, next]);
    } catch (err) {
      setLoadMoreError(getApiErrorMessage(err));
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconBackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Bonus History</Text>
      </View>

      {loading && <Loader fullscreen label="Loading bonus history…" />}

      {!loading && !data && <ErrorState title="Could not load bonus history" description={error ?? undefined} onRetry={() => reload()} />}

      {!loading && data && (
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.body}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => reload(true)} />}>
          <View style={styles.heroCard}>
            <Text style={styles.heroAmount}>{formatMoney(data.month.breakdown.incentiveBonus)}</Text>
            <Text style={styles.heroLabel}>Total bonuses earned in the last 30 days</Text>
            <Text style={styles.heroSubLabel}>{`${data.history.total} ${data.history.total === 1 ? 'bonus' : 'bonuses'} all time`}</Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
            {FILTERS.map(f => (
              <TouchableOpacity key={f} style={[styles.filterPill, filter === f && styles.filterPillActive]} activeOpacity={0.8} onPress={() => setFilter(f)}>
                <Text style={[styles.filterPillText, filter === f && styles.filterPillTextActive]}>{f}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <LedgerList
            entries={visible}
            emptyTitle="No bonuses yet"
            emptyDescription="Completed incentives will show up here."
            footer={
              <>
                {hasMore || loadMoreError ? (
                  <View style={styles.loadMore}>
                    {loadMoreError ? <Text style={styles.loadMoreError}>{loadMoreError}</Text> : null}
                    <Button label="Load more" variant="ghost" loading={loadingMore} onPress={loadMore} />
                  </View>
                ) : null}
                {visible.length > 0 && (
                  <View style={styles.footerRow}>
                    <Text style={styles.footerLabel}>{`${visible.length} ${visible.length === 1 ? 'bonus' : 'bonuses'}`}</Text>
                    <Text style={styles.footerValue}>{`${formatMoney(visibleTotal)} earned`}</Text>
                  </View>
                )}
              </>
            }
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
    paddingTop: 48,
    paddingBottom: spacing.md,
  },
  headerTitle: {...typography.title, fontSize: 17, color: colors.textPrimary},
  body: {padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxxl},
  heroCard: {backgroundColor: colors.primary, borderRadius: radius.xl, paddingHorizontal: spacing.xl, paddingVertical: spacing.lg},
  heroAmount: {...typography.h3, fontSize: 28, color: colors.white, fontWeight: '800'},
  heroLabel: {...typography.label, fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2},
  heroSubLabel: {...typography.caption, color: 'rgba(255,255,255,0.7)', marginTop: 2},
  filterRow: {flexDirection: 'row', gap: spacing.sm, paddingRight: spacing.lg},
  filterPill: {backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: spacing.xs},
  filterPillActive: {backgroundColor: colors.primarySurface, borderColor: colors.primary},
  filterPillText: {...typography.labelSemibold, fontSize: 13, color: colors.textSecondary},
  filterPillTextActive: {color: colors.primary},
  loadMore: {alignItems: 'center', paddingVertical: spacing.sm, borderTopWidth: 1, borderTopColor: '#F3F4F6', gap: spacing.xs},
  loadMoreError: {...typography.caption, color: colors.dangerText, textAlign: 'center', paddingHorizontal: spacing.lg},
  footerRow: {flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#F9FAFB', borderTopWidth: 1, borderTopColor: colors.border, paddingHorizontal: spacing.md, paddingVertical: spacing.md},
  footerLabel: {...typography.label, fontSize: 13, color: colors.textSecondary},
  footerValue: {...typography.h4, fontSize: 15, color: colors.primary},
});
