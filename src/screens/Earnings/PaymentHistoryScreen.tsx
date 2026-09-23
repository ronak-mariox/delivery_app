import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {IconBackButton} from '../../components';
import {colors, radius, shadows, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'PaymentHistory'>;

type Status = 'pending' | 'scheduled' | 'paid';

interface HistoryRow {
  id: string;
  period: 'This Week' | 'Last Week';
  dateLabel: string;
  subLabel: string;
  amount: string;
  status: Status;
  detail?: {deliveries: string; breakdown: string; method: string; reference: string};
}

const HISTORY: HistoryRow[] = [
  {id: 'row1', period: 'This Week', dateLabel: 'Sep 6', subLabel: 'Today', amount: '₹428', status: 'pending'},
  {id: 'row2', period: 'This Week', dateLabel: 'Sep 1–5', subLabel: 'Payout Mon Sep 8', amount: '₹856', status: 'scheduled'},
  {
    id: 'row3',
    period: 'Last Week',
    dateLabel: 'Aug 25–31',
    subLabel: 'Paid Aug 30',
    amount: '₹1,146',
    status: 'paid',
    detail: {deliveries: '16 deliveries', breakdown: 'Base ₹720 · Bonuses ₹426', method: 'UPI · HDFC ****1234', reference: 'TXN-8840291'},
  },
  {id: 'row4', period: 'Last Week', dateLabel: 'Aug 18–24', subLabel: 'Paid Aug 23', amount: '₹1,084', status: 'paid'},
];

const STATUS_META: Record<Status, {label: string; bg: string; text: string}> = {
  pending: {label: 'PENDING', bg: '#FFFAEB', text: '#B45309'},
  scheduled: {label: 'SCHEDULED', bg: '#EFF6FF', text: '#1D4ED8'},
  paid: {label: 'PAID', bg: colors.primarySurface, text: colors.primaryDark},
};

type Filter = 'All' | 'Paid' | 'Pending';
const FILTERS: Filter[] = ['All', 'Paid', 'Pending'];

function matchesFilter(row: HistoryRow, filter: Filter) {
  if (filter === 'All') {
    return true;
  }
  if (filter === 'Paid') {
    return row.status === 'paid';
  }
  return row.status === 'pending' || row.status === 'scheduled';
}

export function PaymentHistoryScreen({navigation}: Props) {
  const [filter, setFilter] = useState<Filter>('Paid');

  const thisWeek = HISTORY.filter(r => r.period === 'This Week' && matchesFilter(r, filter));
  const lastWeek = HISTORY.filter(r => r.period === 'Last Week' && matchesFilter(r, filter));

  const renderRow = (row: HistoryRow, index: number, total: number) => {
    const meta = STATUS_META[row.status];
    const content = (
      <>
        <View style={styles.rowHeader}>
          <View>
            <Text style={styles.rowDate}>{row.dateLabel}</Text>
            <Text style={styles.rowSub}>{row.subLabel}</Text>
          </View>
          <View style={styles.rowMeta}>
            <Text style={styles.rowAmount}>{row.amount}</Text>
            <View style={[styles.statusPill, {backgroundColor: meta.bg}]}>
              <Text style={[styles.statusPillText, {color: meta.text}]}>{meta.label}</Text>
            </View>
          </View>
        </View>
        {row.detail && (
          <View style={styles.detailBox}>
            <View style={styles.detailRow}>
              <Text style={styles.detailText}>{row.detail.deliveries}</Text>
              <Text style={styles.detailText}>{row.detail.breakdown}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailText}>Payment method</Text>
              <Text style={styles.detailValue}>{row.detail.method}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailText}>Reference</Text>
              <Text style={styles.detailValue}>{row.detail.reference}</Text>
            </View>
          </View>
        )}
      </>
    );

    const rowStyle = [styles.row, index < total - 1 && styles.rowBorder];

    if (row.status === 'paid') {
      return (
        <TouchableOpacity key={row.id} style={rowStyle} activeOpacity={0.7} onPress={() => navigation.navigate('PayoutSuccessful')}>
          {content}
        </TouchableOpacity>
      );
    }
    return (
      <View key={row.id} style={rowStyle}>
        {content}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconBackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Payment History</Text>
      </View>

      <View style={styles.filterRow}>
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filterPill, filter === f && styles.filterPillActive]}
            activeOpacity={0.8}
            onPress={() => setFilter(f)}>
            <Text style={[styles.filterPillText, filter === f && styles.filterPillTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {thisWeek.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>THIS WEEK</Text>
            <View style={styles.card}>{thisWeek.map((row, i) => renderRow(row, i, thisWeek.length))}</View>
          </View>
        )}

        {lastWeek.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>LAST WEEK</Text>
            <View style={styles.card}>{lastWeek.map((row, i) => renderRow(row, i, lastWeek.length))}</View>
          </View>
        )}

        <View style={styles.totalBanner}>
          <Text style={styles.totalLabel}>Total paid this month</Text>
          <Text style={styles.totalValue}>₹8,240</Text>
        </View>
      </ScrollView>
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
  section: {gap: spacing.sm},
  sectionLabel: {...typography.captionMedium, fontSize: 12, color: colors.textSecondary, letterSpacing: 0.5, textTransform: 'uppercase'},
  card: {backgroundColor: colors.surface, borderRadius: radius.xl, overflow: 'hidden', ...shadows.sm},
  row: {paddingHorizontal: spacing.lg, paddingVertical: spacing.md},
  rowBorder: {borderBottomWidth: 1, borderBottomColor: colors.border},
  rowHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start'},
  rowDate: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary},
  rowSub: {...typography.caption, color: colors.textSecondary, marginTop: 2},
  rowMeta: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm},
  rowAmount: {...typography.bodyBold, fontSize: 14, color: colors.textPrimary},
  statusPill: {borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: 3},
  statusPillText: {...typography.captionSemibold, fontSize: 11},
  detailBox: {backgroundColor: colors.background, borderRadius: radius.md, padding: spacing.md, marginTop: spacing.md, gap: spacing.xs},
  detailRow: {flexDirection: 'row', justifyContent: 'space-between'},
  detailText: {...typography.caption, color: colors.textSecondary},
  detailValue: {...typography.captionMedium, color: colors.textPrimary},
  totalBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.primarySurface,
    borderRadius: radius.xl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  totalLabel: {...typography.labelSemibold, fontSize: 13, color: colors.primaryDark},
  totalValue: {...typography.bodyBold, fontSize: 16, color: colors.primaryDark},
});
