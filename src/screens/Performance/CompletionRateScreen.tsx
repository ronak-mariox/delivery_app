import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import Svg, {Circle} from 'react-native-svg';
import {RootStackParamList} from '../../navigation/types';
import {IconBackButton} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'CompletionRate'>;

const WEEK_DATA = [
  {day: 'Mon', value: 100},
  {day: 'Tue', value: 97},
  {day: 'Wed', value: 100},
  {day: 'Thu', value: 100},
  {day: 'Fri', value: 97},
  {day: 'Sat', value: 96},
  {day: 'Sun', value: 0},
];

const SIZE = 130;
const STROKE = 12;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const PCT = 0.98;

export function CompletionRateScreen({navigation}: Props) {
  const filled = PCT * CIRCUMFERENCE;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconBackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Completion Rate</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.gaugeCard}>
          <View style={styles.ringWrap}>
            <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
              <Circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} stroke={colors.primarySurface} strokeWidth={STROKE} fill="none" />
              <Circle
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={RADIUS}
                stroke={colors.primary}
                strokeWidth={STROKE}
                strokeDasharray={`${filled} ${CIRCUMFERENCE - filled}`}
                strokeLinecap="round"
                fill="none"
                transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
              />
            </Svg>
            <View style={styles.ringCenter} pointerEvents="none">
              <Text style={styles.ringValue}>98%</Text>
              <Text style={styles.ringLabel}>completion</Text>
            </View>
          </View>
          <Text style={styles.excellentText}>Excellent</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>This Month Breakdown</Text>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Total assigned</Text>
            <Text style={styles.rowValue}>147</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Completed</Text>
            <Text style={styles.rowValueGreen}>144</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Customer cancellation</Text>
            <Text style={styles.rowValue}>2 (not your fault)</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Undeliverable</Text>
            <Text style={styles.rowValue}>1 (documented)</Text>
          </View>
          <View style={[styles.row, styles.rowNoBorder]}>
            <Text style={styles.rowLabel}>Your completion rate</Text>
            <Text style={styles.rowValueGreen}>98.0%</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Rate Trend (Mon–Sun)</Text>
          <View style={styles.chart}>
            {WEEK_DATA.map(d => (
              <View key={d.day} style={styles.chartColumn}>
                {d.value > 0 && <Text style={styles.chartValue}>{d.value}%</Text>}
                <View style={[styles.chartBar, {height: Math.max(4, d.value * 0.5)}]} />
                <Text style={styles.chartDay}>{d.day}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.infoBanner}>
          <Text style={styles.infoTitle}>Why Rate Matters</Text>
          <Text style={styles.infoBullet}>• Affects order priority ranking</Text>
          <Text style={styles.infoBullet}>• Required minimum: 85%</Text>
          <Text style={styles.infoBullet}>• Your status: Excellent (98%)</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Deductions</Text>
          <View style={styles.deductionRow}>
            <Text style={styles.deductionLabel}>Aug 30 · Undeliverable — documented</Text>
            <Text style={styles.deductionSub}>No rate impact</Text>
          </View>
          <View style={[styles.deductionRow, styles.deductionRowNoBorder]}>
            <Text style={styles.deductionLabel}>Aug 26 · Customer cancelled</Text>
            <Text style={styles.deductionSub}>No rate impact</Text>
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
  gaugeCard: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.xl, alignItems: 'center', paddingVertical: spacing.xl},
  ringWrap: {width: SIZE, height: SIZE, alignItems: 'center', justifyContent: 'center'},
  ringCenter: {position: 'absolute', alignItems: 'center'},
  ringValue: {...typography.h4, fontSize: 20, color: colors.textPrimary},
  ringLabel: {...typography.caption, fontSize: 10, color: colors.textSecondary, marginTop: 1},
  excellentText: {...typography.bodyBold, fontSize: 14, color: colors.primary, marginTop: spacing.sm},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.xl, padding: spacing.lg},
  cardTitle: {...typography.bodySemibold, fontSize: 13, color: colors.textPrimary},
  row: {flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: '#F3F4F6'},
  rowNoBorder: {borderBottomWidth: 0},
  rowLabel: {...typography.label, fontSize: 13, color: colors.textSecondary},
  rowValue: {...typography.bodyBold, fontSize: 13, color: colors.textPrimary},
  rowValueGreen: {...typography.bodyBold, fontSize: 13, color: colors.primary},
  chart: {flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 90, paddingTop: spacing.md},
  chartColumn: {flex: 1, alignItems: 'center', justifyContent: 'flex-end', gap: 4},
  chartValue: {...typography.micro, color: colors.textSecondary},
  chartBar: {width: 18, borderRadius: 5, backgroundColor: colors.primary},
  chartDay: {...typography.micro, color: colors.textSecondary, marginTop: 4},
  infoBanner: {backgroundColor: colors.primarySurface, borderWidth: 1, borderColor: colors.primaryBorder, borderRadius: radius.lg, padding: spacing.lg},
  infoTitle: {...typography.bodyBold, fontSize: 13, color: colors.primaryDark},
  infoBullet: {...typography.label, fontSize: 13, color: colors.primary, marginTop: spacing.xs},
  deductionRow: {paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: '#F3F4F6'},
  deductionRowNoBorder: {borderBottomWidth: 0},
  deductionLabel: {...typography.caption, fontSize: 12, color: colors.textSecondary},
  deductionSub: {...typography.caption, fontSize: 11, color: colors.textMuted, marginTop: 2},
});
