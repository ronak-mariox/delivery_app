import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import Svg, {Circle} from 'react-native-svg';
import {RootStackParamList} from '../../navigation/types';
import {IconBackButton} from '../../components';
import {colors, radius, shadows, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'EarningsBreakdown'>;

const SEGMENTS = [
  {label: 'Base', pct: 50, color: colors.primary},
  {label: 'Distance', pct: 30, color: colors.primaryDark},
  {label: 'Bonuses', pct: 15, color: colors.primaryBorder},
  {label: 'Incentives', pct: 5, color: '#A7F3D0'},
];

const CATEGORY_ROWS = [
  {label: 'Base pay', deliveries: '18', amount: '₹756'},
  {label: 'Distance pay', deliveries: '18', amount: '₹374'},
  {label: 'On-time bonus', deliveries: '14', amount: '₹98'},
  {label: 'Incentive bonus', deliveries: '1', amount: '₹56'},
];

const DAY_ROWS = [
  {day: 'Mon', value: '₹180'},
  {day: 'Tue', value: '₹220'},
  {day: 'Wed', value: '₹310'},
  {day: 'Thu', value: '₹190'},
  {day: 'Fri', value: '₹280'},
  {day: 'Sat', value: '₹428'},
  {day: 'Sun', value: '₹0', faint: true},
];

const SIZE = 140;
const STROKE = 16;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function Donut() {
  let cumulative = 0;
  return (
    <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
      <Circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} stroke={colors.background} strokeWidth={STROKE} fill="none" />
      {SEGMENTS.map(seg => {
        const length = (seg.pct / 100) * CIRCUMFERENCE;
        const offset = CIRCUMFERENCE - cumulative;
        cumulative += length;
        return (
          <Circle
            key={seg.label}
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            stroke={seg.color}
            strokeWidth={STROKE}
            strokeDasharray={`${length} ${CIRCUMFERENCE - length}`}
            strokeDashoffset={offset}
            strokeLinecap="butt"
            fill="none"
            transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
          />
        );
      })}
    </Svg>
  );
}

export function EarningsBreakdownScreen({navigation}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconBackButton onPress={() => navigation.goBack()} />
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Earnings Breakdown</Text>
          <Text style={styles.headerSubtitle}>Sep 1–6, 2026</Text>
        </View>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.totalBlock}>
          <Text style={styles.totalValue}>₹1,284</Text>
          <Text style={styles.totalLabel}>This week total</Text>
        </View>

        <View style={styles.donutCard}>
          <View style={styles.donutWrap}>
            <Donut />
            <View style={styles.donutCenter} pointerEvents="none">
              <Text style={styles.donutCenterLabel}>Total</Text>
              <Text style={styles.donutCenterValue}>₹1,284</Text>
            </View>
          </View>
          <View style={styles.legend}>
            {SEGMENTS.map(seg => (
              <View key={seg.label} style={styles.legendRow}>
                <View style={[styles.legendDot, {backgroundColor: seg.color}]} />
                <Text style={styles.legendLabel}>{seg.label}</Text>
                <Text style={styles.legendPct}>{seg.pct}%</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.tableCard}>
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.tableHeaderText, styles.tableCol1]}>Category</Text>
            <Text style={[styles.tableHeaderText, styles.tableCol2]}>Deliveries</Text>
            <Text style={[styles.tableHeaderText, styles.tableCol3]}>Amount</Text>
          </View>
          {CATEGORY_ROWS.map(row => (
            <View key={row.label} style={styles.tableRow}>
              <Text style={[styles.tableCellText, styles.tableCol1]}>{row.label}</Text>
              <Text style={[styles.tableCellMuted, styles.tableCol2]}>{row.deliveries}</Text>
              <Text style={[styles.tableCellStrong, styles.tableCol3]}>{row.amount}</Text>
            </View>
          ))}
          <View style={[styles.tableRow, styles.tableTotalRow]}>
            <Text style={[styles.tableTotalText, styles.tableCol1]}>Total</Text>
            <Text style={[styles.tableTotalText, styles.tableCol2]}>18</Text>
            <Text style={[styles.tableTotalText, styles.tableCol3, styles.tableTotalGreen]}>₹1,284</Text>
          </View>
        </View>

        <View style={styles.dayCard}>
          <Text style={styles.dayTitle}>Day-by-Day</Text>
          <View style={styles.dayRow}>
            {DAY_ROWS.map(d => (
              <View key={d.day} style={styles.dayColumn}>
                <Text style={styles.dayLabel}>{d.day}</Text>
                <Text style={[styles.dayValue, d.faint && styles.dayValueFaint]}>{d.value}</Text>
              </View>
            ))}
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
    paddingTop: 52,
    paddingBottom: spacing.lg,
  },
  headerText: {flex: 1},
  headerTitle: {...typography.title, fontSize: 17, color: colors.textPrimary},
  headerSubtitle: {...typography.caption, color: colors.textSecondary, marginTop: 1},
  body: {padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxxl},
  totalBlock: {alignItems: 'center', paddingVertical: spacing.md},
  totalValue: {...typography.display, fontSize: 38, color: colors.primary, letterSpacing: -1},
  totalLabel: {...typography.label, fontSize: 13, color: colors.textSecondary, marginTop: 2},
  donutCard: {flexDirection: 'row', alignItems: 'center', gap: spacing.xxl, backgroundColor: colors.surface, borderRadius: radius.xl, padding: spacing.lg, ...shadows.sm},
  donutWrap: {width: SIZE, height: SIZE, alignItems: 'center', justifyContent: 'center'},
  donutCenter: {position: 'absolute', alignItems: 'center'},
  donutCenterLabel: {...typography.caption, fontSize: 11, color: colors.textSecondary},
  donutCenterValue: {...typography.bodyBold, fontSize: 13, color: colors.textPrimary, marginTop: 2},
  legend: {flex: 1, gap: spacing.sm},
  legendRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm},
  legendDot: {width: 10, height: 10, borderRadius: 5},
  legendLabel: {...typography.caption, color: colors.textSecondary, flex: 1},
  legendPct: {...typography.captionSemibold, color: colors.textPrimary},
  tableCard: {backgroundColor: colors.surface, borderRadius: radius.xl, overflow: 'hidden', ...shadows.sm},
  tableHeaderRow: {flexDirection: 'row', backgroundColor: colors.background, borderBottomWidth: 1, borderBottomColor: colors.border, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm},
  tableHeaderText: {...typography.captionSemibold, fontSize: 11, color: colors.textSecondary},
  tableRow: {flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#F3F4F6', paddingHorizontal: spacing.lg, paddingVertical: spacing.md},
  tableCellText: {...typography.label, fontSize: 13, color: colors.textPrimary},
  tableCellMuted: {...typography.label, fontSize: 13, color: colors.textSecondary},
  tableCellStrong: {...typography.labelSemibold, fontSize: 13, color: colors.textPrimary},
  tableTotalRow: {backgroundColor: colors.primarySurface, borderBottomWidth: 0},
  tableTotalText: {...typography.bodyBold, fontSize: 13, color: colors.textPrimary},
  tableTotalGreen: {color: colors.primary},
  tableCol1: {flex: 2.2},
  tableCol2: {flex: 1},
  tableCol3: {flex: 1, textAlign: 'right'},
  dayCard: {backgroundColor: colors.surface, borderRadius: radius.xl, padding: spacing.lg, ...shadows.sm},
  dayTitle: {...typography.labelSemibold, fontSize: 13, color: colors.textPrimary},
  dayRow: {flexDirection: 'row', justifyContent: 'space-between', paddingTop: spacing.sm},
  dayColumn: {alignItems: 'center'},
  dayLabel: {...typography.caption, fontSize: 11, color: colors.textSecondary},
  dayValue: {...typography.captionSemibold, fontSize: 12, color: colors.textPrimary, marginTop: 3},
  dayValueFaint: {color: colors.primaryBorder},
});
