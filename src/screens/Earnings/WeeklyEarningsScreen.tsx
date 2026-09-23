import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon, IconBackButton, ProgressBar} from '../../components';
import {colors, radius, shadows, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'WeeklyEarnings'>;

const CHART_DATA = [
  {day: 'Mon', thisWeek: 45, lastWeek: 40},
  {day: 'Tue', thisWeek: 58, lastWeek: 46},
  {day: 'Wed', thisWeek: 82, lastWeek: 62},
  {day: 'Thu', thisWeek: 48, lastWeek: 68},
  {day: 'Fri', thisWeek: 76, lastWeek: 90},
  {day: 'Sat', thisWeek: 116, lastWeek: 0},
  {day: 'Sun', thisWeek: 0, lastWeek: 0},
];

const COMPARE_ROWS = [
  {label: 'Deliveries', thisWeek: '18', lastWeek: '16'},
  {label: 'Hours online', thisWeek: '34h', lastWeek: '30h'},
  {label: 'Avg/delivery', thisWeek: '₹71.3', lastWeek: '₹71.6'},
  {label: 'Best day', thisWeek: 'Sat ₹428', lastWeek: 'Fri ₹312'},
];

export function WeeklyEarningsScreen({navigation}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <IconBackButton onPress={() => navigation.goBack()} />
          <Text style={styles.headerTitle}>Weekly Earnings</Text>
        </View>
        <View style={styles.datePager}>
          <TouchableOpacity hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
            <Icon name="chevron-left" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          <Text style={styles.dateText}>Sep 1–7, 2026</Text>
          <TouchableOpacity hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
            <Icon name="chevron-right" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.compareRow}>
            <View>
              <Text style={styles.compareLabel}>This week</Text>
              <Text style={styles.compareValueBig}>₹1,284</Text>
            </View>
            <View style={styles.compareRight}>
              <Text style={styles.compareLabel}>Last week</Text>
              <Text style={styles.compareValueMuted}>₹1,146</Text>
            </View>
          </View>
          <View style={styles.trendPill}>
            <Text style={styles.trendPillText}>+₹138 (+12%)</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendSwatch, {backgroundColor: colors.primary}]} />
              <Text style={styles.legendText}>This week</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendSwatch, {backgroundColor: colors.borderStrong}]} />
              <Text style={styles.legendText}>Last week</Text>
            </View>
          </View>
          <View style={styles.chart}>
            {CHART_DATA.map(d => (
              <View key={d.day} style={styles.chartColumn}>
                <View style={styles.chartBarPair}>
                  <View style={[styles.chartBar, styles.chartBarPrimary, {height: Math.max(2, d.thisWeek)}]} />
                  <View style={[styles.chartBar, styles.chartBarMuted, {height: Math.max(2, d.lastWeek)}]} />
                </View>
                <Text style={styles.chartDay}>{d.day}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.tableCard}>
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.tableHeaderText, styles.tableCol1]} />
            <Text style={[styles.tableHeaderTextGreen, styles.tableCol2]}>This Week</Text>
            <Text style={[styles.tableHeaderText, styles.tableCol3]}>Last Week</Text>
          </View>
          {COMPARE_ROWS.map((row, index) => (
            <View key={row.label} style={[styles.tableRow, index < COMPARE_ROWS.length - 1 && styles.tableRowBorder]}>
              <Text style={[styles.tableCellMuted, styles.tableCol1]}>{row.label}</Text>
              <Text style={[styles.tableCellStrong, styles.tableCol2]}>{row.thisWeek}</Text>
              <Text style={[styles.tableCellMuted, styles.tableCol3]}>{row.lastWeek}</Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <View style={styles.goalRow}>
            <Text style={styles.goalTitle}>Weekly Goal</Text>
            <Text style={styles.goalValue}>₹1,284 / ₹2,000</Text>
          </View>
          <ProgressBar progress={0.64} height={10} style={styles.goalBar} />
          <Text style={styles.goalCaption}>64% of target reached</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  flex: {flex: 1},
  header: {backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border, paddingHorizontal: spacing.xl, paddingTop: 52, paddingBottom: spacing.lg},
  headerRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.md},
  headerTitle: {...typography.title, fontSize: 17, color: colors.textPrimary},
  datePager: {flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.lg, paddingTop: spacing.md},
  dateText: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary},
  body: {padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxxl},
  card: {backgroundColor: colors.surface, borderRadius: radius.xl, padding: spacing.lg, ...shadows.sm},
  compareRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end'},
  compareRight: {alignItems: 'flex-end'},
  compareLabel: {...typography.caption, color: colors.textSecondary},
  compareValueBig: {...typography.h3, fontSize: 32, color: colors.textPrimary, letterSpacing: -1, marginTop: 2},
  compareValueMuted: {...typography.subtitle, fontSize: 22, color: colors.textSecondary, marginTop: 2},
  trendPill: {alignSelf: 'flex-start', backgroundColor: colors.primarySurface, borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: spacing.xs, marginTop: spacing.md},
  trendPillText: {...typography.labelSemibold, fontSize: 13, color: colors.primary},
  legendRow: {flexDirection: 'row', gap: spacing.lg},
  legendItem: {flexDirection: 'row', alignItems: 'center', gap: 5},
  legendSwatch: {width: 10, height: 10, borderRadius: 2},
  legendText: {...typography.caption, fontSize: 11, color: colors.textSecondary},
  chart: {flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 132, paddingTop: spacing.md},
  chartColumn: {flex: 1, alignItems: 'center', justifyContent: 'flex-end'},
  chartBarPair: {flexDirection: 'row', alignItems: 'flex-end', gap: 3},
  chartBar: {width: 8, borderRadius: 3},
  chartBarPrimary: {backgroundColor: colors.primary},
  chartBarMuted: {backgroundColor: colors.borderStrong},
  chartDay: {...typography.micro, color: colors.textSecondary, marginTop: 6},
  tableCard: {backgroundColor: colors.surface, borderRadius: radius.xl, overflow: 'hidden', ...shadows.sm},
  tableHeaderRow: {flexDirection: 'row', backgroundColor: colors.background, borderBottomWidth: 1, borderBottomColor: colors.border, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm},
  tableHeaderText: {...typography.captionSemibold, fontSize: 11, color: colors.textSecondary},
  tableHeaderTextGreen: {...typography.captionSemibold, fontSize: 11, color: colors.primary},
  tableRow: {flexDirection: 'row', paddingHorizontal: spacing.lg, paddingVertical: spacing.md},
  tableRowBorder: {borderBottomWidth: 1, borderBottomColor: '#F3F4F6'},
  tableCellMuted: {...typography.label, fontSize: 13, color: colors.textSecondary},
  tableCellStrong: {...typography.labelSemibold, fontSize: 13, color: colors.textPrimary},
  tableCol1: {flex: 1.4},
  tableCol2: {flex: 1},
  tableCol3: {flex: 1},
  goalRow: {flexDirection: 'row', justifyContent: 'space-between'},
  goalTitle: {...typography.labelSemibold, fontSize: 13, color: colors.textPrimary},
  goalValue: {...typography.caption, color: colors.textSecondary},
  goalBar: {marginTop: spacing.sm},
  goalCaption: {...typography.caption, color: colors.textSecondary, marginTop: spacing.sm},
});
