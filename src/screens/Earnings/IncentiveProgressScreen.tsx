import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import Svg, {Circle} from 'react-native-svg';
import {RootStackParamList} from '../../navigation/types';
import {IconBackButton} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'IncentiveProgress'>;

const SEGMENTS = [
  {label: 'Completed', pct: 40, color: colors.primary},
  {label: 'In Progress', pct: 35, color: colors.warning},
  {label: 'Expired', pct: 25, color: colors.borderStrong},
];

interface ActiveRow {
  name: string;
  progress: string;
  reward: string;
  status: 'inProgress' | 'almost';
  target: 'IncentiveDetail' | 'IncentiveExpired' | null;
}

const ACTIVE_ROWS: ActiveRow[] = [
  {name: 'Peak Hour', progress: '10/15', reward: '₹150', status: 'inProgress', target: 'IncentiveDetail'},
  {name: 'Weekend Surge', progress: '6/20', reward: '₹250', status: 'inProgress', target: 'IncentiveExpired'},
  {name: 'On-time Streak', progress: '14/15', reward: '₹50', status: 'almost', target: null},
];

const COMPLETED_ROWS = [
  {name: 'Monday Boost', date: 'Sep 2', earned: '₹80'},
  {name: 'New Rider Week 2', date: 'Sep 1', earned: '₹200'},
];

const SIZE = 130;
const STROKE = 18;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function Donut() {
  let cumulative = 0;
  return (
    <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
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
            fill="none"
            transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
          />
        );
      })}
    </Svg>
  );
}

export function IncentiveProgressScreen({navigation}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconBackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Incentive Progress</Text>
        <Text style={styles.headerDate}>Sep 6, 2026</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.donutCard}>
          <View style={styles.donutWrap}>
            <Donut />
            <View style={styles.donutCenter} pointerEvents="none">
              <Text style={styles.donutCenterValue}>₹254</Text>
              <Text style={styles.donutCenterLabel}>potential</Text>
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

        <Text style={styles.sectionLabel}>ACTIVE INCENTIVES</Text>
        <View style={styles.tableCard}>
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.tableHeaderText, styles.colName]}>Incentive</Text>
            <Text style={[styles.tableHeaderText, styles.colProgress]}>Progress</Text>
            <Text style={[styles.tableHeaderText, styles.colReward]}>Reward</Text>
            <Text style={[styles.tableHeaderText, styles.colStatus]}>Status</Text>
          </View>
          {ACTIVE_ROWS.map((row, index) => {
            const content = (
              <>
                <Text style={[styles.tableCellStrong, styles.colName]}>{row.name}</Text>
                <Text style={[styles.tableCellMuted, styles.colProgress]}>{row.progress}</Text>
                <Text style={[styles.tableCellReward, styles.colReward]}>{row.reward}</Text>
                <View style={[styles.colStatus, styles.statusPillWrap]}>
                  <View style={[styles.statusPill, row.status === 'almost' && styles.statusPillAlmost]}>
                    <Text style={[styles.statusPillText, row.status === 'almost' && styles.statusPillTextAlmost]}>
                      {row.status === 'almost' ? 'Almost!' : 'In Progress'}
                    </Text>
                  </View>
                </View>
              </>
            );
            const rowStyle = [styles.tableRow, index < ACTIVE_ROWS.length - 1 && styles.tableRowBorder];
            return row.target ? (
              <TouchableOpacity key={row.name} style={rowStyle} activeOpacity={0.7} onPress={() => navigation.navigate(row.target as 'IncentiveDetail' | 'IncentiveExpired')}>
                {content}
              </TouchableOpacity>
            ) : (
              <View key={row.name} style={rowStyle}>
                {content}
              </View>
            );
          })}
        </View>

        <Text style={[styles.sectionLabel, styles.sectionLabelSpaced]}>COMPLETED THIS WEEK</Text>
        <View style={styles.tableCard}>
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.tableHeaderText, styles.colNameWide]}>Incentive</Text>
            <Text style={[styles.tableHeaderText, styles.colDate]}>Completed</Text>
            <Text style={[styles.tableHeaderText, styles.colDate]}>Earned</Text>
          </View>
          {COMPLETED_ROWS.map((row, index) => (
            <View key={row.name} style={[styles.tableRow, index < COMPLETED_ROWS.length - 1 && styles.tableRowBorder]}>
              <Text style={[styles.tableCellStrong, styles.colNameWide]}>{row.name}</Text>
              <Text style={[styles.tableCellMuted, styles.colDate]}>{row.date}</Text>
              <Text style={[styles.tableCellReward, styles.colDate]}>{row.earned}</Text>
            </View>
          ))}
        </View>

        <View style={styles.summaryBanner}>
          <Text style={styles.summaryText}>
            Total potential remaining: <Text style={styles.summaryStrong}>₹254</Text>
          </Text>
          <Text style={[styles.summaryText, styles.summaryTextRight]}>
            Earned this week: <Text style={styles.summaryStrong}>₹280</Text>
          </Text>
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
    paddingHorizontal: spacing.lg,
    paddingTop: 48,
    paddingBottom: spacing.md,
  },
  headerTitle: {...typography.title, fontSize: 17, color: colors.textPrimary, flex: 1},
  headerDate: {...typography.label, fontSize: 13, color: colors.textSecondary},
  body: {padding: spacing.lg, gap: spacing.sm, paddingBottom: spacing.xxxl},
  donutCard: {flexDirection: 'row', alignItems: 'center', gap: spacing.xl, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.xl, padding: spacing.lg},
  donutWrap: {width: SIZE, height: SIZE, alignItems: 'center', justifyContent: 'center'},
  donutCenter: {position: 'absolute', alignItems: 'center'},
  donutCenterValue: {...typography.bodyBold, fontSize: 18, color: colors.textPrimary},
  donutCenterLabel: {...typography.caption, fontSize: 11, color: colors.textSecondary},
  legend: {flex: 1, gap: spacing.sm},
  legendRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm},
  legendDot: {width: 10, height: 10, borderRadius: 5},
  legendLabel: {...typography.label, fontSize: 13, color: colors.textSecondary, flex: 1},
  legendPct: {...typography.labelSemibold, fontSize: 13, color: colors.textPrimary},
  sectionLabel: {...typography.captionSemibold, fontSize: 13, color: colors.textSecondary, letterSpacing: 0.6, textTransform: 'uppercase', marginTop: spacing.md},
  sectionLabelSpaced: {marginTop: spacing.lg},
  tableCard: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.xl, overflow: 'hidden', marginTop: spacing.sm},
  tableHeaderRow: {flexDirection: 'row', backgroundColor: '#F9FAFB', borderBottomWidth: 1, borderBottomColor: colors.border, paddingHorizontal: spacing.md, paddingVertical: spacing.sm},
  tableHeaderText: {...typography.captionSemibold, fontSize: 11, color: colors.textSecondary},
  tableRow: {flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md, paddingVertical: spacing.md},
  tableRowBorder: {borderBottomWidth: 1, borderBottomColor: '#F3F4F6'},
  tableCellStrong: {...typography.labelSemibold, fontSize: 13, color: colors.textPrimary},
  tableCellMuted: {...typography.label, fontSize: 12, color: colors.textSecondary},
  tableCellReward: {...typography.labelSemibold, fontSize: 13, color: colors.primary},
  colName: {flex: 1.6},
  colNameWide: {flex: 2.2},
  colProgress: {flex: 0.9},
  colReward: {flex: 0.8},
  colStatus: {flex: 1.1},
  colDate: {flex: 1},
  statusPillWrap: {alignItems: 'flex-start'},
  statusPill: {backgroundColor: colors.warningSurface, borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: 3},
  statusPillAlmost: {backgroundColor: colors.primarySurface},
  statusPillText: {...typography.captionSemibold, fontSize: 11, color: colors.warning},
  statusPillTextAlmost: {color: colors.primary},
  summaryBanner: {flexDirection: 'row', justifyContent: 'space-between', backgroundColor: colors.primarySurface, borderRadius: radius.lg, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, marginTop: spacing.md},
  summaryText: {...typography.label, fontSize: 13, color: colors.primaryDark, flex: 1},
  summaryTextRight: {textAlign: 'right'},
  summaryStrong: {...typography.bodyBold, fontSize: 13, color: colors.primaryDark},
});
