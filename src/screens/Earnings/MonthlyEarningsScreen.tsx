import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import Svg, {Line, Path, Polyline} from 'react-native-svg';
import {RootStackParamList} from '../../navigation/types';
import {Icon, IconBackButton, ProgressBar} from '../../components';
import {colors, radius, shadows, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'MonthlyEarnings'>;

const TOP_DAYS = [
  {label: 'Sep 6 (Sat)', value: '₹428', best: true},
  {label: 'Sep 2 (Tue)', value: '₹380'},
  {label: 'Sep 5 (Fri)', value: '₹312'},
];

const STAT_GRID = [
  {label: 'Total', value: '₹8,240'},
  {label: 'Deliveries', value: '142'},
  {label: 'Avg/day', value: '₹274'},
  {label: 'Best week', value: 'W2 ₹2,140'},
];

const CHART_W = 340;
const CHART_H = 120;
const REAL_POINTS: [number, number][] = [
  [0, 100],
  [34, 42],
  [68, 78],
  [102, 20],
  [136, 60],
  [170, 44],
  [204, 56],
];
const PROJECTED_POINTS: [number, number][] = [
  [204, 56],
  [238, 68],
  [272, 50],
  [306, 62],
  [340, 46],
];

function toPoints(pts: [number, number][]) {
  return pts.map(p => p.join(',')).join(' ');
}

const AREA_PATH = `M0,${CHART_H} L${toPoints(REAL_POINTS)
  .split(' ')
  .join(' L')} L${REAL_POINTS[REAL_POINTS.length - 1][0]},${CHART_H} Z`;

export function MonthlyEarningsScreen({navigation}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <IconBackButton onPress={() => navigation.goBack()} />
          <Text style={styles.headerTitle}>Monthly Earnings</Text>
        </View>
        <View style={styles.datePager}>
          <TouchableOpacity hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
            <Icon name="chevron-left" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          <Text style={styles.dateText}>September 2026</Text>
          <TouchableOpacity hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
            <Icon name="chevron-right" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.totalBlock}>
          <Text style={styles.totalValue}>₹8,240</Text>
          <Text style={styles.totalLabel}>23 working days · 142 deliveries</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Daily Earnings — September</Text>
          <View style={styles.chartWrap}>
            <Svg width={CHART_W} height={CHART_H} viewBox={`0 0 ${CHART_W} ${CHART_H}`}>
              <Path d={AREA_PATH} fill={colors.primarySurface} stroke="none" />
              <Polyline points={toPoints(REAL_POINTS)} fill="none" stroke={colors.primary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              <Polyline
                points={toPoints(PROJECTED_POINTS)}
                fill="none"
                stroke={colors.primary}
                strokeWidth={2}
                strokeDasharray="4 4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Line x1={204} y1={0} x2={204} y2={CHART_H} stroke={colors.border} strokeWidth={1} strokeDasharray="3 3" />
            </Svg>
          </View>
          <View style={styles.axisRow}>
            <Text style={styles.axisLabel}>1</Text>
            <Text style={styles.axisLabel}>7</Text>
            <Text style={styles.axisLabel}>14</Text>
            <Text style={styles.axisLabel}>21</Text>
            <Text style={styles.axisLabel}>28</Text>
          </View>
          <Text style={styles.chartCaption}>Dashed = projected</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Top Performing Days</Text>
          {TOP_DAYS.map((d, index) => (
            <View key={d.label} style={[styles.topRow, index < TOP_DAYS.length - 1 && styles.topRowBorder]}>
              <Text style={styles.topLabel}>{d.label}</Text>
              <View style={styles.topRight}>
                <Text style={styles.topValue}>{d.value}</Text>
                {d.best && (
                  <View style={styles.bestPill}>
                    <Text style={styles.bestPillText}>Best</Text>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>

        <View style={styles.statGrid}>
          {STAT_GRID.map(stat => (
            <View key={stat.label} style={styles.statTile}>
              <Text style={styles.statLabel}>{stat.label}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <View style={styles.goalRow}>
            <Text style={styles.goalTitle}>Monthly Goal</Text>
            <Text style={styles.goalValue}>₹8,240 / ₹12,000</Text>
          </View>
          <ProgressBar progress={0.69} height={10} style={styles.goalBar} />
          <Text style={styles.goalCaption}>69% of target reached</Text>
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
  totalBlock: {alignItems: 'center', paddingVertical: spacing.sm},
  totalValue: {...typography.display, fontSize: 38, color: colors.primary, letterSpacing: -1},
  totalLabel: {...typography.label, fontSize: 13, color: colors.textSecondary, marginTop: 2},
  card: {backgroundColor: colors.surface, borderRadius: radius.xl, padding: spacing.lg, ...shadows.sm},
  cardTitle: {...typography.labelSemibold, fontSize: 13, color: colors.textPrimary},
  chartWrap: {alignItems: 'center', paddingTop: spacing.md},
  axisRow: {flexDirection: 'row', justifyContent: 'space-between', width: CHART_W, alignSelf: 'center'},
  axisLabel: {...typography.micro, color: colors.textSecondary},
  chartCaption: {...typography.caption, fontSize: 11, color: colors.textSecondary, textAlign: 'right', marginTop: spacing.xs},
  topRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.sm},
  topRowBorder: {borderBottomWidth: 1, borderBottomColor: '#F3F4F6'},
  topLabel: {...typography.label, fontSize: 13, color: colors.textSecondary},
  topRight: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm},
  topValue: {...typography.labelSemibold, fontSize: 13, color: colors.textPrimary},
  bestPill: {backgroundColor: '#FEF3C7', borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: 2},
  bestPillText: {...typography.captionSemibold, fontSize: 10, color: '#D97706'},
  statGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm},
  statTile: {flexBasis: '48%', flexGrow: 1, backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.md, ...shadows.sm},
  statLabel: {...typography.caption, color: colors.textSecondary},
  statValue: {...typography.bodyBold, fontSize: 16, color: colors.textPrimary, marginTop: spacing.xxs},
  goalRow: {flexDirection: 'row', justifyContent: 'space-between'},
  goalTitle: {...typography.labelSemibold, fontSize: 13, color: colors.textPrimary},
  goalValue: {...typography.caption, color: colors.textSecondary},
  goalBar: {marginTop: spacing.sm},
  goalCaption: {...typography.caption, color: colors.textSecondary, marginTop: spacing.sm},
});
