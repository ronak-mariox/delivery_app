import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import Svg, {Circle} from 'react-native-svg';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Performance'>;

const SIZE = 130;
const STROKE = 12;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const SCORE_PCT = 0.96;

const WEEK_BARS = [92, 88, 95, 90, 94, 97, 0];

export function PerformanceScreen({navigation}: Props) {
  const filled = SCORE_PCT * CIRCUMFERENCE;

  return (
    <Screen backgroundColor={colors.dark900} statusBarStyle="light-content" edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Performance</Text>
        <Text style={styles.headerSubtitle}>Ravi Kumar · Rider since Aug 2024</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.scoreCard}>
          <Text style={styles.scoreLabel}>Overall Score</Text>
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
              <Text style={styles.ringValue}>4.8</Text>
              <Text style={styles.ringLabel}>out of 5.0</Text>
            </View>
          </View>
          <Text style={styles.excellentText}>Excellent</Text>
        </View>

        <View style={styles.grid}>
          <TouchableOpacity style={styles.gridTile} activeOpacity={0.8} onPress={() => navigation.navigate('AcceptanceRate')}>
            <Text style={styles.gridLabel}>Acceptance Rate</Text>
            <Text style={styles.gridValue}>94%</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.gridTile} activeOpacity={0.8} onPress={() => navigation.navigate('CompletionRate')}>
            <Text style={styles.gridLabel}>Completion Rate</Text>
            <Text style={styles.gridValue}>98%</Text>
          </TouchableOpacity>
          <View style={styles.gridTile}>
            <Text style={styles.gridLabel}>On-time Rate</Text>
            <Text style={[styles.gridValue, styles.gridValueWarning]}>91%</Text>
          </View>
          <TouchableOpacity style={styles.gridTile} activeOpacity={0.8} onPress={() => navigation.navigate('CustomerRating')}>
            <Text style={styles.gridLabel}>Customer Rating</Text>
            <View style={styles.ratingRow}>
              <Text style={styles.gridValue}>4.8</Text>
              <Icon name="star" size={16} color={colors.primary} filled />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Performance this week vs last week</Text>
          <View style={styles.chart}>
            {WEEK_BARS.map((v, i) => (
              <View key={i} style={styles.chartColumn}>
                <View style={[styles.chartBar, {height: Math.max(4, v * 0.4)}]} />
              </View>
            ))}
          </View>
        </View>

        <View style={styles.rankBanner}>
          <Text style={styles.rankTitle}>Top 15% of riders in Bengaluru</Text>
          <Text style={styles.rankSubtitle}>#47 of 312 riders</Text>
        </View>

        <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('StateEmpty')}>
          <Text style={styles.leaderboardLink}>View City Leaderboard</Text>
        </TouchableOpacity>

        <View style={styles.actionsRow}>
          <Button label="View Detailed Stats" variant="primary" style={styles.flexOne} onPress={() => navigation.navigate('WeeklyPerformance')} />
          <Button label="Improvement Tips" variant="outline" style={styles.flexOne} onPress={() => navigation.navigate('AcceptanceRate')} />
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: {flex: 1},
  flexOne: {flex: 1},
  header: {backgroundColor: colors.dark900, paddingHorizontal: spacing.xl, paddingTop: spacing.xl, paddingBottom: spacing.xxl, gap: 4},
  headerTitle: {...typography.h4, fontSize: 22, color: colors.white},
  headerSubtitle: {...typography.body, color: 'rgba(255,255,255,0.6)'},
  body: {padding: spacing.lg, gap: spacing.md, backgroundColor: colors.background, paddingBottom: spacing.xxxl},
  scoreCard: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.xl, padding: spacing.xl, alignItems: 'center'},
  scoreLabel: {...typography.labelSemibold, fontSize: 13, color: colors.textSecondary, marginBottom: spacing.sm},
  ringWrap: {width: SIZE, height: SIZE, alignItems: 'center', justifyContent: 'center'},
  ringCenter: {position: 'absolute', alignItems: 'center'},
  ringValue: {...typography.h4, fontSize: 22, color: colors.textPrimary},
  ringLabel: {...typography.caption, fontSize: 11, color: colors.textSecondary, marginTop: 1},
  excellentText: {...typography.bodyBold, fontSize: 14, color: colors.primary, marginTop: spacing.sm},
  grid: {flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm},
  gridTile: {flexBasis: '48%', flexGrow: 1, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.md},
  gridLabel: {...typography.caption, fontSize: 11, color: colors.textSecondary},
  gridValue: {...typography.h4, fontSize: 22, color: colors.primary, marginTop: spacing.xs},
  gridValueWarning: {color: colors.warning},
  ratingRow: {flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: spacing.xs},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.xl, padding: spacing.lg},
  cardTitle: {...typography.bodySemibold, fontSize: 13, color: colors.textPrimary},
  chart: {flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 60, paddingTop: spacing.md},
  chartColumn: {flex: 1, alignItems: 'center', justifyContent: 'flex-end'},
  chartBar: {width: 22, borderRadius: 6, backgroundColor: colors.primary},
  rankBanner: {backgroundColor: colors.primarySurface, borderWidth: 1, borderColor: colors.primaryBorder, borderRadius: radius.lg, paddingVertical: spacing.md, alignItems: 'center'},
  rankTitle: {...typography.bodyBold, fontSize: 15, color: colors.primaryDark},
  rankSubtitle: {...typography.label, fontSize: 13, color: colors.primary, marginTop: 3},
  leaderboardLink: {...typography.captionSemibold, color: colors.primary, textAlign: 'center'},
  actionsRow: {flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm},
});
