import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon, IconBackButton} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'DeliveriesCompleted'>;

const SEPT_DAYS = [6, 5, 4, 3, 2, 8];

const MILESTONES = [
  {label: '100 deliveries', sub: 'Aug 28 · +₹200 milestone bonus', state: 'done' as const},
  {label: '150 deliveries', sub: '8 more to go · +₹300 bonus', state: 'pending' as const},
  {label: '200 deliveries', sub: '58 more to go · +₹500 bonus', state: 'pending' as const},
];

export function DeliveriesCompletedScreen({navigation}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconBackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Deliveries Completed</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.statsRow}>
          <View style={styles.statTile}>
            <Text style={styles.statValue}>6</Text>
            <Text style={styles.statLabel}>Today</Text>
          </View>
          <TouchableOpacity style={styles.statTile} activeOpacity={0.8} onPress={() => navigation.navigate('WeeklyPerformance')}>
            <Text style={styles.statValue}>18</Text>
            <Text style={styles.statLabel}>This Week</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.statTile} activeOpacity={0.8} onPress={() => navigation.navigate('MonthlyPerformance')}>
            <Text style={styles.statValue}>142</Text>
            <Text style={styles.statLabel}>This Month</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>September Deliveries</Text>
          <View style={styles.chart}>
            {SEPT_DAYS.map((v, i) => (
              <View key={i} style={styles.chartColumn}>
                <View style={[styles.chartBar, i === SEPT_DAYS.length - 1 ? styles.chartBarToday : styles.chartBarPast, {height: Math.max(4, v * 8)}]} />
              </View>
            ))}
            {Array.from({length: 24}).map((_, i) => (
              <View key={`empty-${i}`} style={styles.chartColumn}>
                <View style={[styles.chartBar, styles.chartBarEmpty]} />
              </View>
            ))}
          </View>
          <View style={styles.axisRow}>
            <Text style={styles.axisLabel}>1</Text>
            <Text style={styles.axisLabel}>10</Text>
            <Text style={styles.axisLabel}>20</Text>
            <Text style={styles.axisLabel}>30</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Milestones</Text>
          {MILESTONES.map((m, index) => (
            <View key={m.label} style={[styles.milestoneRow, index < MILESTONES.length - 1 && styles.milestoneRowBorder]}>
              <View style={[styles.milestoneIcon, m.state === 'done' && styles.milestoneIconDone]}>
                {m.state === 'done' ? <Icon name="check" size={12} color={colors.primary} /> : <View style={styles.milestoneDot} />}
              </View>
              <View style={styles.milestoneText}>
                <Text style={[styles.milestoneLabel, m.state === 'pending' && styles.milestoneLabelPending]}>{m.label}</Text>
                <Text style={styles.milestoneSub}>{m.sub}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Best Periods</Text>
          <View style={styles.rowBetween}>
            <Text style={styles.rowLabel}>Best day</Text>
            <Text style={styles.rowValue}>Sep 2 — 9 deliveries</Text>
          </View>
          <View style={styles.rowBetween}>
            <Text style={styles.rowLabel}>Best hour</Text>
            <Text style={styles.rowValue}>12–1 PM (avg 2.1/hr)</Text>
          </View>
        </View>

        <View style={styles.footerBanner}>
          <Text style={styles.footerBannerText}>42 km today · 7 km avg per delivery</Text>
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
  statsRow: {flexDirection: 'row', gap: spacing.sm},
  statTile: {flex: 1, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, paddingVertical: spacing.md, alignItems: 'center'},
  statValue: {...typography.h4, fontSize: 22, color: colors.primary},
  statLabel: {...typography.caption, fontSize: 11, color: colors.textSecondary, marginTop: 2},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.xl, padding: spacing.lg},
  cardTitle: {...typography.bodySemibold, fontSize: 13, color: colors.textPrimary},
  chart: {flexDirection: 'row', alignItems: 'flex-end', height: 90, paddingTop: spacing.md, gap: 2},
  chartColumn: {flex: 1, alignItems: 'center', justifyContent: 'flex-end'},
  chartBar: {width: 6, borderRadius: 2},
  chartBarPast: {backgroundColor: colors.primarySurface},
  chartBarToday: {backgroundColor: colors.primary},
  chartBarEmpty: {height: 2, backgroundColor: colors.border},
  axisRow: {flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.xs},
  axisLabel: {...typography.micro, color: colors.textMuted},
  milestoneRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.sm},
  milestoneRowBorder: {borderBottomWidth: 1, borderBottomColor: '#F3F4F6'},
  milestoneIcon: {width: 22, height: 22, borderRadius: 11, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center'},
  milestoneIconDone: {backgroundColor: colors.primarySurface},
  milestoneDot: {width: 8, height: 8, borderRadius: 4, backgroundColor: colors.borderStrong},
  milestoneText: {flex: 1},
  milestoneLabel: {...typography.labelSemibold, fontSize: 13, color: colors.textPrimary},
  milestoneLabelPending: {color: colors.textMuted},
  milestoneSub: {...typography.caption, fontSize: 11, color: colors.textMuted, marginTop: 1},
  rowBetween: {flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.sm},
  rowLabel: {...typography.label, fontSize: 13, color: colors.textSecondary},
  rowValue: {...typography.labelSemibold, fontSize: 13, color: colors.textPrimary},
  footerBanner: {backgroundColor: colors.primarySurface, borderRadius: radius.md, paddingHorizontal: spacing.md, paddingVertical: spacing.md},
  footerBannerText: {...typography.labelSemibold, fontSize: 13, color: colors.primaryDark},
});
