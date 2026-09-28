import React, {useCallback, useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import Svg, {Circle} from 'react-native-svg';
import {RootStackParamList} from '../../navigation/types';
import {ErrorState, Icon, Loader, Screen} from '../../components';
import {getApiErrorMessage} from '../../services/api';
import {getPerformanceSummary, PerformanceSummary} from '../../services/driverApi';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Performance'>;

const SIZE = 130;
const STROKE = 12;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function ratingLabel(rating: number | null) {
  if (rating === null) {
    return 'No ratings yet';
  }
  if (rating >= 4.5) {
    return 'Excellent';
  }
  if (rating >= 4) {
    return 'Good';
  }
  if (rating >= 3) {
    return 'Fair';
  }
  return 'Needs improvement';
}

function rateColor(rate: number) {
  if (rate >= 90) {
    return colors.primary;
  }
  if (rate >= 75) {
    return colors.warning;
  }
  return colors.danger;
}

export function PerformanceScreen({navigation}: Props) {
  const [summary, setSummary] = useState<PerformanceSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setSummary(await getPerformanceSummary());
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const renderBody = () => {
    if (loading) {
      return <Loader fullscreen />;
    }
    if (error || !summary) {
      return (
        <View style={styles.stateWrap}>
          <ErrorState title="Couldn't load performance" description={error ?? undefined} onRetry={load} />
        </View>
      );
    }

    const filled = ((summary.rating ?? 0) / 5) * CIRCUMFERENCE;

    return (
      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.scoreCard}>
          <Text style={styles.scoreLabel}>Customer Rating</Text>
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
              <Text style={styles.ringValue}>{summary.rating === null ? '—' : summary.rating.toFixed(1)}</Text>
              <Text style={styles.ringLabel}>out of 5.0</Text>
            </View>
          </View>
          <Text style={styles.excellentText}>{ratingLabel(summary.rating)}</Text>
          <Text style={styles.ratingCount}>
            {summary.ratingCount} {summary.ratingCount === 1 ? 'rating' : 'ratings'}
          </Text>
        </View>

        <View style={styles.grid}>
          <TouchableOpacity style={styles.gridTile} activeOpacity={0.8} onPress={() => navigation.navigate('AcceptanceRate')}>
            <Text style={styles.gridLabel}>Acceptance Rate</Text>
            <Text style={[styles.gridValue, {color: rateColor(summary.acceptanceRate)}]}>{summary.acceptanceRate}%</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.gridTile} activeOpacity={0.8} onPress={() => navigation.navigate('CompletionRate')}>
            <Text style={styles.gridLabel}>Completion Rate</Text>
            <Text style={[styles.gridValue, {color: rateColor(summary.completionRate)}]}>{summary.completionRate}%</Text>
          </TouchableOpacity>
          <View style={styles.gridTile}>
            <Text style={styles.gridLabel}>On-time Rate</Text>
            <Text style={[styles.gridValue, {color: rateColor(summary.onTimeRate)}]}>{summary.onTimeRate}%</Text>
          </View>
          <TouchableOpacity style={styles.gridTile} activeOpacity={0.8} onPress={() => navigation.navigate('CustomerRating')}>
            <Text style={styles.gridLabel}>Customer Rating</Text>
            <View style={styles.ratingRow}>
              <Text style={styles.gridValue}>{summary.rating === null ? '—' : summary.rating.toFixed(1)}</Text>
              <Icon name="star" size={16} color={colors.primary} filled />
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.deliveriesTile} activeOpacity={0.8} onPress={() => navigation.navigate('DeliveriesCompleted')}>
          <View style={styles.deliveriesIcon}>
            <Icon name="package" size={20} color={colors.primary} />
          </View>
          <View style={styles.flexOne}>
            <Text style={styles.gridLabel}>Deliveries Completed</Text>
            <Text style={styles.deliveriesValue}>{summary.totalDeliveries}</Text>
          </View>
          <Icon name="chevron-right" size={18} color={colors.textMuted} />
        </TouchableOpacity>
      </ScrollView>
    );
  };

  return (
    <Screen backgroundColor={colors.dark900} statusBarStyle="light-content" edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Performance</Text>
        <Text style={styles.headerSubtitle}>Your overall stats across all deliveries</Text>
      </View>
      {renderBody()}
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: {flex: 1},
  flexOne: {flex: 1},
  stateWrap: {flex: 1, backgroundColor: colors.background, justifyContent: 'center'},
  header: {backgroundColor: colors.dark900, paddingHorizontal: spacing.xl, paddingTop: spacing.xl, paddingBottom: spacing.xxl, gap: 4},
  headerTitle: {...typography.h4, fontSize: 22, color: colors.white},
  headerSubtitle: {...typography.body, color: 'rgba(255,255,255,0.6)'},
  body: {padding: spacing.lg, gap: spacing.md, backgroundColor: colors.background, paddingBottom: spacing.xxxl, flexGrow: 1},
  scoreCard: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.xl, padding: spacing.xl, alignItems: 'center'},
  scoreLabel: {...typography.labelSemibold, fontSize: 13, color: colors.textSecondary, marginBottom: spacing.sm},
  ringWrap: {width: SIZE, height: SIZE, alignItems: 'center', justifyContent: 'center'},
  ringCenter: {position: 'absolute', alignItems: 'center'},
  ringValue: {...typography.h4, fontSize: 22, color: colors.textPrimary},
  ringLabel: {...typography.caption, fontSize: 11, color: colors.textSecondary, marginTop: 1},
  excellentText: {...typography.bodyBold, fontSize: 14, color: colors.primary, marginTop: spacing.sm},
  ratingCount: {...typography.caption, fontSize: 11, color: colors.textMuted, marginTop: 2},
  grid: {flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm},
  gridTile: {flexBasis: '48%', flexGrow: 1, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.md},
  gridLabel: {...typography.caption, fontSize: 11, color: colors.textSecondary},
  gridValue: {...typography.h4, fontSize: 22, color: colors.primary, marginTop: spacing.xs},
  ratingRow: {flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: spacing.xs},
  deliveriesTile: {flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.md},
  deliveriesIcon: {width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primarySurface, alignItems: 'center', justifyContent: 'center'},
  deliveriesValue: {...typography.h4, fontSize: 22, color: colors.textPrimary, marginTop: 2},
});
