import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import Svg, {Path} from 'react-native-svg';
import {RootStackParamList} from '../../navigation/types';
import {IconBackButton} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'AcceptanceRate'>;

const WEEK_DATA = [
  {day: 'Mon', value: 96},
  {day: 'Tue', value: 94},
  {day: 'Wed', value: 97},
  {day: 'Thu', value: 91},
  {day: 'Fri', value: 95},
  {day: 'Sat', value: 93},
  {day: 'Sun', value: 0},
];

const TIPS = ['Stay in high-demand zones during peak hours', 'Disable online status when taking breaks', 'Check order details before accepting'];

const GAUGE_W = 300;
const GAUGE_H = 160;
const GAUGE_R = 130;
const CX = GAUGE_W / 2;
const CY = GAUGE_H - 10;

function polarPoint(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (Math.PI / 180) * angleDeg;
  return {x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad)};
}

function arcPath(pct: number) {
  const startAngle = 180;
  const endAngle = 180 - 180 * pct;
  const start = polarPoint(CX, CY, GAUGE_R, startAngle);
  const end = polarPoint(CX, CY, GAUGE_R, endAngle);
  const largeArc = pct > 0.5 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${GAUGE_R} ${GAUGE_R} 0 ${largeArc} 1 ${end.x} ${end.y}`;
}

export function AcceptanceRateScreen({navigation}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconBackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Acceptance Rate</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.gaugeCard}>
          <View style={styles.gaugeWrap}>
            <Svg width={GAUGE_W} height={GAUGE_H} viewBox={`0 0 ${GAUGE_W} ${GAUGE_H}`}>
              <Path d={arcPath(1)} stroke={colors.border} strokeWidth={16} strokeLinecap="round" fill="none" />
              <Path d={arcPath(0.94)} stroke={colors.primary} strokeWidth={16} strokeLinecap="round" fill="none" />
            </Svg>
            <View style={styles.gaugeCenter} pointerEvents="none">
              <Text style={styles.gaugeValue}>94%</Text>
            </View>
            <Text style={styles.gaugeThreshold}>80%</Text>
          </View>
          <Text style={styles.excellentText}>Excellent</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Last 7 Days</Text>
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

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Accepted / Rejected Breakdown</Text>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Accepted</Text>
            <Text style={styles.rowValueGreen}>17 orders</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Rejected</Text>
            <Text style={styles.rowValueRed}>1 order (too far)</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Timed out</Text>
            <Text style={styles.rowValueMuted}>0 orders</Text>
          </View>
          <View style={[styles.row, styles.rowNoBorder]}>
            <Text style={styles.rowLabel}>Acceptance rate</Text>
            <Text style={styles.rowValueGreen}>94.4%</Text>
          </View>
        </View>

        <View style={styles.infoBanner}>
          <Text style={styles.infoTitle}>Above Threshold</Text>
          <Text style={styles.infoText}>You are 14% above the minimum 80% threshold. Keep it up!</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Tips to Maintain Rate</Text>
          {TIPS.map(tip => (
            <View key={tip} style={styles.tipRow}>
              <Text style={styles.tipDash}>–</Text>
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
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
  gaugeCard: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.xl, alignItems: 'center', paddingVertical: spacing.lg},
  gaugeWrap: {width: GAUGE_W, height: GAUGE_H, alignItems: 'center'},
  gaugeCenter: {position: 'absolute', top: GAUGE_H * 0.55, alignItems: 'center'},
  gaugeValue: {...typography.display, fontSize: 32, color: colors.primary, fontWeight: '800'},
  gaugeThreshold: {position: 'absolute', right: 4, top: GAUGE_H - 24, ...typography.caption, fontSize: 9, color: colors.danger},
  excellentText: {...typography.bodyBold, fontSize: 14, color: colors.primary, marginTop: spacing.xs},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.xl, padding: spacing.lg},
  cardTitle: {...typography.bodySemibold, fontSize: 13, color: colors.textPrimary},
  chart: {flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 90, paddingTop: spacing.md},
  chartColumn: {flex: 1, alignItems: 'center', justifyContent: 'flex-end', gap: 4},
  chartValue: {...typography.micro, color: colors.textSecondary},
  chartBar: {width: 18, borderRadius: 5, backgroundColor: colors.primary},
  chartDay: {...typography.micro, color: colors.textSecondary, marginTop: 4},
  row: {flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: '#F3F4F6'},
  rowNoBorder: {borderBottomWidth: 0},
  rowLabel: {...typography.label, fontSize: 13, color: colors.textSecondary},
  rowValueGreen: {...typography.bodyBold, fontSize: 13, color: colors.primary},
  rowValueRed: {...typography.bodyBold, fontSize: 13, color: '#D92D20'},
  rowValueMuted: {...typography.bodyBold, fontSize: 13, color: colors.textSecondary},
  infoBanner: {backgroundColor: colors.primarySurface, borderWidth: 1, borderColor: colors.primaryBorder, borderRadius: radius.lg, padding: spacing.md},
  infoTitle: {...typography.bodyBold, fontSize: 13, color: colors.primaryDark},
  infoText: {...typography.label, fontSize: 13, color: colors.primary, marginTop: 2},
  tipRow: {flexDirection: 'row', gap: spacing.sm, paddingTop: spacing.sm},
  tipDash: {...typography.bodyBold, fontSize: 13, color: colors.primary},
  tipText: {...typography.label, fontSize: 13, color: colors.textSecondary, flex: 1},
});
