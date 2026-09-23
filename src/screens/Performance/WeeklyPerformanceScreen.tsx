import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import Svg, {Polyline} from 'react-native-svg';
import {RootStackParamList} from '../../navigation/types';
import {Icon, IconBackButton} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'WeeklyPerformance'>;

const DAYS = [
  {day: 'Mon', deliveries: '2', earnings: '₹180', onTime: '100%', onTimeGood: true},
  {day: 'Tue', deliveries: '3', earnings: '₹220', onTime: '100%', onTimeGood: true},
  {day: 'Wed', deliveries: '4', earnings: '₹310', onTime: '75%', onTimeGood: false},
  {day: 'Thu', deliveries: '2', earnings: '₹190', onTime: '100%', onTimeGood: true},
  {day: 'Fri', deliveries: '4', earnings: '₹280', onTime: '100%', onTimeGood: true},
  {day: 'Sat', deliveries: '6', earnings: '₹428', onTime: '83%', onTimeGood: false, highlight: true},
  {day: 'Sun', deliveries: '—', earnings: '—', onTime: '—', onTimeGood: true, empty: true},
];

const CHART_W = 340;
const CHART_H = 80;
// Values scaled: 70-100 domain mapped to y 0(top=100) - CHART_H(bottom=70)
const toY = (v: number) => CHART_H - ((v - 70) / 30) * CHART_H;
const xs = [0, 56.7, 113.3, 170, 226.7, 283.3, 340];

const ACCEPTANCE = [96, 94, 97, 91, 95, 93, 93];
const COMPLETION = [100, 97, 100, 100, 97, 96, 96];
const ONTIME = [100, 100, 75, 100, 100, 83, 83];

function toPoints(values: number[]) {
  return values.map((v, i) => `${xs[i]},${toY(v)}`).join(' ');
}

export function WeeklyPerformanceScreen({navigation}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <IconBackButton onPress={() => navigation.goBack()} />
          <Text style={styles.headerTitle}>Weekly Performance</Text>
        </View>
        <View style={styles.datePager}>
          <TouchableOpacity hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
            <Icon name="chevron-left" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
          <Text style={styles.dateText}>Sep 1–7</Text>
          <TouchableOpacity hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
            <Icon name="chevron-right" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.statsRow}>
          <View style={styles.statTile}>
            <Text style={styles.statValue}>18</Text>
            <Text style={styles.statLabel}>Deliveries</Text>
          </View>
          <View style={styles.statTile}>
            <Text style={styles.statValue}>94%</Text>
            <Text style={styles.statLabel}>Acceptance</Text>
          </View>
          <View style={styles.statTile}>
            <Text style={styles.statValue}>91%</Text>
            <Text style={styles.statLabel}>On-time</Text>
          </View>
          <View style={styles.statTile}>
            <Text style={styles.statValue}>4.8</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Performance Trend</Text>
          <View style={styles.chartWrap}>
            <Svg width={CHART_W} height={CHART_H} viewBox={`0 0 ${CHART_W} ${CHART_H}`}>
              <Polyline points={toPoints(ACCEPTANCE)} fill="none" stroke={colors.primary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              <Polyline points={toPoints(COMPLETION)} fill="none" stroke={colors.primaryDark} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              <Polyline points={toPoints(ONTIME)} fill="none" stroke={colors.warning} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </View>
          <View style={styles.axisRow}>
            {DAYS.map(d => (
              <Text key={d.day} style={styles.axisLabel}>
                {d.day}
              </Text>
            ))}
          </View>
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, {backgroundColor: colors.primary}]} />
              <Text style={styles.legendText}>Acceptance</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, {backgroundColor: colors.primaryDark}]} />
              <Text style={styles.legendText}>Completion</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, {backgroundColor: colors.warning}]} />
              <Text style={styles.legendText}>On-time</Text>
            </View>
          </View>
        </View>

        <View style={styles.tableCard}>
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.tableHeaderText, styles.colDay]}>Day</Text>
            <Text style={[styles.tableHeaderText, styles.colVal]}>Deliveries</Text>
            <Text style={[styles.tableHeaderText, styles.colVal]}>Earnings</Text>
            <Text style={[styles.tableHeaderText, styles.colVal]}>On-time</Text>
          </View>
          {DAYS.map((d, index) => (
            <View key={d.day} style={[styles.tableRow, index < DAYS.length - 1 && styles.tableRowBorder, d.highlight && styles.tableRowHighlight]}>
              <Text style={[styles.tableCellStrong, styles.colDay]}>{d.day}</Text>
              <Text style={[d.empty ? styles.tableCellMuted : styles.tableCellText, styles.colVal]}>{d.deliveries}</Text>
              <Text style={[d.empty ? styles.tableCellMuted : styles.tableCellGreen, styles.colVal]}>{d.earnings}</Text>
              <Text style={[d.empty ? styles.tableCellMuted : d.onTimeGood ? styles.tableCellGreen : styles.tableCellWarning, styles.colVal]}>{d.onTime}</Text>
            </View>
          ))}
        </View>

        <View style={styles.compareBanner}>
          <Text style={styles.compareText}>+2 deliveries · +₹138 earnings vs last week</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  flex: {flex: 1},
  header: {backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border, paddingHorizontal: spacing.xl, paddingTop: 48, paddingBottom: spacing.md},
  headerRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.md},
  headerTitle: {...typography.title, fontSize: 17, color: colors.textPrimary},
  datePager: {flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.md, paddingTop: spacing.sm},
  dateText: {...typography.labelSemibold, fontSize: 13, color: colors.textSecondary},
  body: {padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxxl},
  statsRow: {flexDirection: 'row', gap: spacing.sm},
  statTile: {flex: 1, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, paddingVertical: spacing.sm, alignItems: 'center'},
  statValue: {...typography.h4, fontSize: 18, color: colors.primary},
  statLabel: {...typography.micro, color: colors.textMuted, marginTop: 2},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.xl, padding: spacing.lg},
  cardTitle: {...typography.bodySemibold, fontSize: 13, color: colors.textPrimary},
  chartWrap: {alignItems: 'center', paddingTop: spacing.sm},
  axisRow: {flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 4},
  axisLabel: {...typography.micro, color: colors.textMuted},
  legendRow: {flexDirection: 'row', gap: spacing.md, paddingTop: spacing.sm},
  legendItem: {flexDirection: 'row', alignItems: 'center', gap: 5},
  legendDot: {width: 10, height: 10, borderRadius: 5},
  legendText: {...typography.caption, fontSize: 11, color: colors.textSecondary},
  tableCard: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.xl, overflow: 'hidden'},
  tableHeaderRow: {flexDirection: 'row', backgroundColor: '#F9FAFB', borderBottomWidth: 1, borderBottomColor: colors.border, paddingHorizontal: spacing.md, paddingVertical: spacing.sm},
  tableHeaderText: {...typography.captionSemibold, fontSize: 11, color: colors.textSecondary},
  tableRow: {flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md, paddingVertical: spacing.md},
  tableRowBorder: {borderBottomWidth: 1, borderBottomColor: '#F3F4F6'},
  tableRowHighlight: {backgroundColor: '#F0FDF9'},
  tableCellStrong: {...typography.labelSemibold, fontSize: 13, color: colors.textPrimary},
  tableCellText: {...typography.label, fontSize: 13, color: colors.textPrimary},
  tableCellMuted: {...typography.label, fontSize: 13, color: colors.textMuted},
  tableCellGreen: {...typography.label, fontSize: 13, color: colors.primary},
  tableCellWarning: {...typography.label, fontSize: 13, color: colors.warning},
  colDay: {flex: 0.7},
  colVal: {flex: 1},
  compareBanner: {backgroundColor: colors.primarySurface, borderWidth: 1, borderColor: colors.primaryBorder, borderRadius: radius.md, paddingVertical: spacing.md, alignItems: 'center'},
  compareText: {...typography.bodyBold, fontSize: 13, color: colors.primaryDark},
});
