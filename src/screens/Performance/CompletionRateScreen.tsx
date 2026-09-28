import React, {useCallback, useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import Svg, {Circle} from 'react-native-svg';
import {RootStackParamList} from '../../navigation/types';
import {EmptyState, ErrorState, IconBackButton, Loader} from '../../components';
import {getApiErrorMessage} from '../../services/api';
import {CompletionRate, getCompletionRate} from '../../services/driverApi';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'CompletionRate'>;

const SIZE = 130;
const STROKE = 12;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function rateLabel(rate: number) {
  if (rate >= 95) {
    return 'Excellent';
  }
  if (rate >= 85) {
    return 'Good';
  }
  if (rate >= 70) {
    return 'Fair';
  }
  return 'Needs improvement';
}

export function CompletionRateScreen({navigation}: Props) {
  const [data, setData] = useState<CompletionRate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await getCompletionRate());
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
    if (error || !data) {
      return <ErrorState title="Couldn't load completion rate" description={error ?? undefined} onRetry={load} />;
    }
    if (data.total === 0) {
      return <EmptyState title="No deliveries yet" description="Your completion rate will appear once you have been assigned orders." />;
    }

    const filled = Math.max(0, Math.min(1, data.rate / 100)) * CIRCUMFERENCE;

    return (
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
              <Text style={styles.ringValue}>{data.rate}%</Text>
              <Text style={styles.ringLabel}>completion</Text>
            </View>
          </View>
          <Text style={styles.excellentText}>{rateLabel(data.rate)}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Breakdown</Text>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Total assigned</Text>
            <Text style={styles.rowValue}>{data.total}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Delivered</Text>
            <Text style={styles.rowValueGreen}>{data.delivered}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Cancelled</Text>
            <Text style={styles.rowValue}>{data.cancelled}</Text>
          </View>
          <View style={[styles.row, styles.rowNoBorder]}>
            <Text style={styles.rowLabel}>Your completion rate</Text>
            <Text style={styles.rowValueGreen}>{data.rate}%</Text>
          </View>
        </View>

        <View style={styles.infoBanner}>
          <Text style={styles.infoTitle}>Why Rate Matters</Text>
          <Text style={styles.infoBullet}>• Affects order priority ranking</Text>
          <Text style={styles.infoBullet}>• Cancelled orders lower your rate</Text>
          <Text style={styles.infoBullet}>• Your status: {rateLabel(data.rate)}</Text>
        </View>
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconBackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Completion Rate</Text>
      </View>
      {renderBody()}
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
  infoBanner: {backgroundColor: colors.primarySurface, borderWidth: 1, borderColor: colors.primaryBorder, borderRadius: radius.lg, padding: spacing.lg},
  infoTitle: {...typography.bodyBold, fontSize: 13, color: colors.primaryDark},
  infoBullet: {...typography.label, fontSize: 13, color: colors.primary, marginTop: spacing.xs},
});
