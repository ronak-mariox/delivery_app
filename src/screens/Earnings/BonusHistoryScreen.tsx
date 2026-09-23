import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {IconBackButton} from '../../components';
import {colors, radius, shadows, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'BonusHistory'>;

type Period = 'This Week' | 'Last Week' | 'Expired';
type Status = 'paid' | 'expired';

interface BonusRow {
  id: string;
  period: Period;
  name: string;
  date: string;
  amount: string;
  status: Status;
}

const HISTORY: BonusRow[] = [
  {id: 'r1', period: 'This Week', name: 'Peak Hour Bonus', date: 'Sep 6', amount: '₹150', status: 'paid'},
  {id: 'r2', period: 'This Week', name: 'On-time Streak', date: 'Sep 5', amount: '₹50', status: 'paid'},
  {id: 'r3', period: 'This Week', name: 'Monday Boost', date: 'Sep 2', amount: '₹80', status: 'paid'},
  {id: 'r4', period: 'Last Week', name: 'Weekend Surge', date: 'Aug 31', amount: '₹200', status: 'paid'},
  {id: 'r5', period: 'Last Week', name: 'Night Owl', date: 'Aug 29', amount: '₹80', status: 'paid'},
  {id: 'r6', period: 'Last Week', name: 'New Zone', date: 'Aug 28', amount: '₹120', status: 'paid'},
  {id: 'r7', period: 'Expired', name: 'Flash Bonus (10AM)', date: 'Aug 27 · Missed by 3 deliveries', amount: '₹100', status: 'expired'},
];

type Filter = 'All' | 'This Week' | 'This Month' | 'Expired';
const FILTERS: Filter[] = ['All', 'This Week', 'This Month', 'Expired'];

function matchesFilter(row: BonusRow, filter: Filter) {
  if (filter === 'All') {
    return true;
  }
  if (filter === 'This Week') {
    return row.period === 'This Week';
  }
  if (filter === 'This Month') {
    return row.period === 'This Week' || row.period === 'Last Week';
  }
  return row.period === 'Expired';
}

export function BonusHistoryScreen({navigation}: Props) {
  const [filter, setFilter] = useState<Filter>('This Week');

  const periods: Period[] = ['This Week', 'Last Week', 'Expired'];
  const grouped = periods
    .map(period => ({period, rows: HISTORY.filter(r => r.period === period && matchesFilter(r, filter))}))
    .filter(g => g.rows.length > 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconBackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Bonus History</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <Text style={styles.heroAmount}>₹1,248</Text>
          <Text style={styles.heroLabel}>Total bonuses earned this month</Text>
          <Text style={styles.heroSubLabel}>12 incentives completed</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {FILTERS.map(f => (
            <TouchableOpacity
              key={f}
              style={[styles.filterPill, filter === f && styles.filterPillActive]}
              activeOpacity={0.8}
              onPress={() => setFilter(f)}>
              <Text style={[styles.filterPillText, filter === f && styles.filterPillTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.card}>
          {grouped.map((group, groupIndex) => (
            <View key={group.period}>
              <View style={[styles.groupHeader, groupIndex > 0 && styles.groupHeaderBorderTop]}>
                <Text style={styles.groupHeaderText}>{group.period}</Text>
              </View>
              {group.rows.map((row, index) => (
                <View key={row.id} style={[styles.row, index < group.rows.length - 1 && styles.rowBorder]}>
                  <View style={styles.rowInfo}>
                    <Text style={[styles.rowName, row.status === 'expired' && styles.rowNameExpired]}>{row.name}</Text>
                    <Text style={styles.rowDate}>{row.date}</Text>
                  </View>
                  <Text style={[styles.rowAmount, row.status === 'expired' && styles.rowAmountExpired]}>{row.amount}</Text>
                  <View style={[styles.statusPill, row.status === 'expired' && styles.statusPillExpired]}>
                    <Text style={[styles.statusPillText, row.status === 'expired' && styles.statusPillTextExpired]}>
                      {row.status === 'paid' ? 'PAID' : 'EXPIRED'}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          ))}
          <View style={styles.footerRow}>
            <Text style={styles.footerLabel}>12 bonuses</Text>
            <Text style={styles.footerValue}>₹1,248 earned</Text>
          </View>
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
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.xl, overflow: 'hidden', ...shadows.sm},
  groupHeader: {backgroundColor: '#F9FAFB', borderBottomWidth: 1, borderBottomColor: colors.border, paddingHorizontal: spacing.md, paddingVertical: spacing.sm},
  groupHeaderBorderTop: {borderTopWidth: 1, borderTopColor: colors.border},
  groupHeaderText: {...typography.captionSemibold, fontSize: 12, color: colors.textSecondary},
  row: {flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md, paddingVertical: spacing.md, gap: spacing.sm},
  rowBorder: {borderBottomWidth: 1, borderBottomColor: '#F3F4F6'},
  rowInfo: {flex: 1},
  rowName: {...typography.labelSemibold, fontSize: 13, color: colors.textPrimary},
  rowNameExpired: {color: colors.textMuted},
  rowDate: {...typography.caption, fontSize: 11, color: colors.textMuted, marginTop: 2},
  rowAmount: {...typography.bodyBold, fontSize: 14, color: colors.primary},
  rowAmountExpired: {color: colors.textMuted},
  statusPill: {backgroundColor: colors.primarySurface, borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: 3},
  statusPillExpired: {backgroundColor: '#F3F4F6'},
  statusPillText: {...typography.captionSemibold, fontSize: 10, color: colors.primary},
  statusPillTextExpired: {color: colors.textMuted},
  footerRow: {flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#F9FAFB', borderTopWidth: 1, borderTopColor: colors.border, paddingHorizontal: spacing.md, paddingVertical: spacing.md},
  footerLabel: {...typography.label, fontSize: 13, color: colors.textSecondary},
  footerValue: {...typography.h4, fontSize: 15, color: colors.primary},
});
