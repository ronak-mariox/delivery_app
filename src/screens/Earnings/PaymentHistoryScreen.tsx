import React, {useCallback, useState} from 'react';
import {RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, ErrorState, IconBackButton, Loader} from '../../components';
import {colors, radius, shadows, spacing, typography} from '../../theme';
import {getApiErrorMessage} from '../../services/api';
import {getEarningsHistory, getPayoutStatus, LedgerEntry, Paged} from '../../services/driverApi';
import {formatLongDate, formatMoney, useAsyncData} from './earningsShared';
import {LedgerList} from './LedgerList';

type Props = NativeStackScreenProps<RootStackParamList, 'PaymentHistory'>;

type Filter = 'All' | 'Paid' | 'Pending';
const FILTERS: Filter[] = ['All', 'Paid', 'Pending'];
const PAGE_SIZE = 30;

function matchesFilter(entry: LedgerEntry, filter: Filter) {
  if (filter === 'All') {
    return true;
  }
  if (filter === 'Paid') {
    return entry.status === 'paid';
  }
  return entry.status === 'pending' || entry.status === 'settled';
}

async function loadHistory() {
  const [payout, history] = await Promise.all([getPayoutStatus(), getEarningsHistory(1, PAGE_SIZE)]);
  return {payout, history};
}

export function PaymentHistoryScreen({navigation}: Props) {
  const [filter, setFilter] = useState<Filter>('All');
  const [extraPages, setExtraPages] = useState<Paged<LedgerEntry>[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState<string | null>(null);

  const loader = useCallback(async () => {
    setExtraPages([]);
    setLoadMoreError(null);
    return loadHistory();
  }, []);
  const {data, loading, refreshing, error, reload} = useAsyncData(loader);

  const lastPage = extraPages.length > 0 ? extraPages[extraPages.length - 1] : data?.history;
  const hasMore = Boolean(lastPage && lastPage.page < lastPage.totalPages);
  const entries = [...(data?.history.items ?? []), ...extraPages.flatMap(p => p.items)];
  const visible = entries.filter(e => matchesFilter(e, filter));

  const loadMore = async () => {
    if (!lastPage || loadingMore) {
      return;
    }
    setLoadingMore(true);
    setLoadMoreError(null);
    try {
      const next = await getEarningsHistory(lastPage.page + 1, PAGE_SIZE);
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
        <Text style={styles.headerTitle}>Payment History</Text>
      </View>

      {loading && <Loader fullscreen label="Loading payment history…" />}

      {!loading && !data && <ErrorState title="Could not load payment history" description={error ?? undefined} onRetry={() => reload()} />}

      {!loading && data && (
        <>
          <View style={styles.filterRow}>
            {FILTERS.map(f => (
              <TouchableOpacity key={f} style={[styles.filterPill, filter === f && styles.filterPillActive]} activeOpacity={0.8} onPress={() => setFilter(f)}>
                <Text style={[styles.filterPillText, filter === f && styles.filterPillTextActive]}>{f}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <ScrollView
            style={styles.flex}
            contentContainerStyle={styles.body}
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => reload(true)} />}>
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
              <Text style={styles.payoutNote}>Payouts are sent automatically to your registered bank account or UPI.</Text>
            </View>

            <LedgerList
              entries={visible}
              emptyTitle={filter === 'All' ? 'No transactions yet' : `No ${filter.toLowerCase()} transactions`}
              emptyDescription="Your earnings and payouts will appear here."
              onPressOrder={orderId => navigation.navigate('DeliveryEarnings', {orderId})}
              footer={
                hasMore || loadMoreError ? (
                  <View style={styles.loadMore}>
                    {loadMoreError ? <Text style={styles.loadMoreError}>{loadMoreError}</Text> : null}
                    <Button label="Load more" variant="ghost" loading={loadingMore} onPress={loadMore} />
                  </View>
                ) : null
              }
            />
          </ScrollView>
        </>
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
  headerTitle: {...typography.title, fontSize: 17, color: colors.textPrimary},
  filterRow: {flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.lg, paddingTop: spacing.md},
  filterPill: {backgroundColor: colors.border, borderRadius: radius.pill, paddingHorizontal: spacing.lg, paddingVertical: spacing.xs},
  filterPillActive: {backgroundColor: colors.primary},
  filterPillText: {...typography.labelSemibold, fontSize: 13, color: colors.textSecondary},
  filterPillTextActive: {color: colors.white},
  body: {padding: spacing.lg, paddingTop: spacing.md, gap: spacing.md, paddingBottom: spacing.xxxl},
  payoutCard: {backgroundColor: colors.surface, borderRadius: radius.xl, padding: spacing.lg, gap: spacing.sm, ...shadows.sm},
  payoutTitle: {...typography.labelSemibold, fontSize: 13, color: colors.textPrimary},
  payoutRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  payoutLabel: {...typography.label, fontSize: 13, color: colors.textSecondary},
  payoutValue: {...typography.labelSemibold, fontSize: 13, color: colors.textPrimary},
  payoutValueStrong: {...typography.bodyBold, fontSize: 14, color: colors.primary},
  payoutNote: {...typography.caption, color: colors.textMuted, marginTop: spacing.xxs},
  loadMore: {alignItems: 'center', paddingVertical: spacing.sm, borderTopWidth: 1, borderTopColor: '#F3F4F6', gap: spacing.xs},
  loadMoreError: {...typography.caption, color: colors.dangerText, textAlign: 'center', paddingHorizontal: spacing.lg},
});
