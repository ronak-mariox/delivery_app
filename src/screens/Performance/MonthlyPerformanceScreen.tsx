import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import Svg, {Polyline} from 'react-native-svg';
import {RootStackParamList} from '../../navigation/types';
import {Icon, IconBackButton} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'MonthlyPerformance'>;

const STAT_GRID = [
  {label: 'Acceptance', value: '94%', color: colors.primary},
  {label: 'Completion', value: '98%', color: colors.primary},
  {label: 'On-time', value: '91%', color: colors.warning},
  {label: 'Avg Rating', value: '4.8', color: colors.primary, star: true},
];

const CHART_W = 340;
const CHART_H = 100;
const ACTUAL: [number, number][] = [
  [0, 40],
  [24, 10],
  [48, 55],
  [72, 25],
  [96, 45],
];
const PROJECTED: [number, number][] = [
  [96, 45],
  [140, 35],
  [180, 50],
  [220, 30],
  [260, 48],
  [300, 32],
  [340, 46],
];

function toPointsStr(pts: [number, number][]) {
  return pts.map(p => p.join(',')).join(' ');
}

export function MonthlyPerformanceScreen({navigation}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <IconBackButton onPress={() => navigation.goBack()} />
          <Text style={styles.headerTitle}>Monthly Performance</Text>
        </View>
        <View style={styles.datePager}>
          <TouchableOpacity hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
            <Icon name="chevron-left" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
          <Text style={styles.dateText}>Sep 2026</Text>
          <TouchableOpacity hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
            <Icon name="chevron-right" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <View style={styles.heroCol}>
            <Text style={styles.heroValue}>142</Text>
            <Text style={styles.heroLabel}>Deliveries</Text>
          </View>
          <View style={styles.heroDivider} />
          <View style={styles.heroCol}>
            <Text style={styles.heroValue}>₹8,240</Text>
            <Text style={styles.heroLabel}>Earned</Text>
          </View>
          <View style={styles.heroDivider} />
          <View style={styles.heroCol}>
            <View style={styles.heroRatingRow}>
              <Text style={styles.heroValue}>4.8</Text>
              <Icon name="star" size={14} color={colors.white} filled />
            </View>
            <Text style={styles.heroLabel}>Rating</Text>
          </View>
        </View>

        <View style={styles.grid}>
          {STAT_GRID.map(stat => (
            <View key={stat.label} style={styles.gridTile}>
              <Text style={styles.gridLabel}>{stat.label}</Text>
              <View style={styles.gridValueRow}>
                <Text style={[styles.gridValue, {color: stat.color}]}>{stat.value}</Text>
                {stat.star && <Icon name="star" size={14} color={colors.primary} filled />}
              </View>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Daily Delivery Trend — September</Text>
          <View style={styles.chartWrap}>
            <Svg width={CHART_W} height={CHART_H} viewBox={`0 0 ${CHART_W} ${CHART_H}`}>
              <Polyline points={toPointsStr(ACTUAL)} fill="none" stroke={colors.primary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              <Polyline
                points={toPointsStr(PROJECTED)}
                fill="none"
                stroke={colors.primaryBorder}
                strokeWidth={2}
                strokeDasharray="4 4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </View>
          <View style={styles.axisRow}>
            <Text style={styles.axisLabel}>1</Text>
            <Text style={styles.axisLabel}>10</Text>
            <Text style={styles.axisLabel}>20</Text>
            <Text style={styles.axisLabel}>30</Text>
          </View>
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={styles.legendLineSolid} />
              <Text style={styles.legendText}>Actual</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={styles.legendLineDashed} />
              <Text style={styles.legendText}>Projected</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.tierHeader}>
            <Text style={styles.cardTitle}>Performance Tier</Text>
            <View style={styles.tierPill}>
              <Icon name="star" size={12} color={colors.primaryDark} filled />
              <Text style={styles.tierPillText}>Gold Rider</Text>
            </View>
          </View>
          <View style={styles.tierRow}>
            <Text style={styles.tierLabel}>Benefits</Text>
            <Text style={styles.tierValue}>Priority orders, ₹500 monthly bonus</Text>
          </View>
          <View style={styles.tierRow}>
            <Text style={styles.tierLabel}>To maintain</Text>
            <Text style={styles.tierValue}>90%+ acceptance, 4.5+ rating</Text>
          </View>
          <View style={[styles.tierRow, styles.tierRowNoBorder]}>
            <Text style={styles.tierLabel}>Next tier</Text>
            <Text style={styles.tierValue}>Platinum — needs 96% acceptance</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Comparisons</Text>
          <View style={styles.compareRow}>
            <Text style={styles.compareLabel}>vs Last Month</Text>
            <Text style={styles.compareValueGreen}>+12% earnings, +2 deliveries/day</Text>
          </View>
          <View style={styles.compareRow}>
            <Text style={styles.compareLabel}>vs City average</Text>
            <Text style={styles.compareValueGreen}>Top 15%</Text>
          </View>
          <View style={[styles.compareRow, styles.compareRowNoBorder]}>
            <Text style={styles.compareLabel}>vs Personal best</Text>
            <Text style={styles.compareValueWarning}>89% of best month (Oct 2025)</Text>
          </View>
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
  heroCard: {flexDirection: 'row', backgroundColor: colors.primary, borderRadius: radius.xl, paddingVertical: spacing.lg},
  heroCol: {flex: 1, alignItems: 'center'},
  heroValue: {...typography.h4, fontSize: 22, color: colors.white},
  heroLabel: {...typography.caption, fontSize: 11, color: 'rgba(255,255,255,0.8)', marginTop: 2},
  heroRatingRow: {flexDirection: 'row', alignItems: 'center', gap: 4},
  heroDivider: {width: 1, backgroundColor: 'rgba(255,255,255,0.3)'},
  grid: {flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm},
  gridTile: {flexBasis: '48%', flexGrow: 1, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.md},
  gridLabel: {...typography.caption, fontSize: 11, color: colors.textSecondary},
  gridValueRow: {flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: spacing.xs},
  gridValue: {...typography.h4, fontSize: 22},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.xl, padding: spacing.lg},
  cardTitle: {...typography.bodySemibold, fontSize: 13, color: colors.textPrimary},
  chartWrap: {alignItems: 'center', paddingTop: spacing.sm},
  axisRow: {flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 4},
  axisLabel: {...typography.micro, color: colors.textMuted},
  legendRow: {flexDirection: 'row', gap: spacing.md, paddingTop: spacing.sm},
  legendItem: {flexDirection: 'row', alignItems: 'center', gap: 5},
  legendLineSolid: {width: 16, height: 2, backgroundColor: colors.primary, borderRadius: 1},
  legendLineDashed: {width: 16, height: 2, backgroundColor: colors.primaryBorder, borderRadius: 1},
  legendText: {...typography.caption, fontSize: 11, color: colors.textSecondary},
  tierHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  tierPill: {flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: colors.primarySurface, borderWidth: 1, borderColor: colors.primaryBorder, borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: 3},
  tierPillText: {...typography.bodyBold, fontSize: 12, color: colors.primaryDark},
  tierRow: {paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: '#F3F4F6', marginTop: spacing.xs},
  tierRowNoBorder: {borderBottomWidth: 0},
  tierLabel: {...typography.caption, fontSize: 12, color: colors.textMuted},
  tierValue: {...typography.labelSemibold, fontSize: 13, color: colors.textPrimary, marginTop: 2},
  compareRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: '#F3F4F6'},
  compareRowNoBorder: {borderBottomWidth: 0},
  compareLabel: {...typography.caption, fontSize: 12, color: colors.textSecondary},
  compareValueGreen: {...typography.bodyBold, fontSize: 12, color: colors.primary},
  compareValueWarning: {...typography.bodyBold, fontSize: 12, color: colors.warning},
});
