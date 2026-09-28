import React, {useCallback, useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import Svg, {Path} from 'react-native-svg';
import {RootStackParamList} from '../../navigation/types';
import {EmptyState, ErrorState, IconBackButton, Loader} from '../../components';
import {getApiErrorMessage} from '../../services/api';
import {AcceptanceRate, getAcceptanceRate} from '../../services/driverApi';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'AcceptanceRate'>;

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

function rateLabel(rate: number) {
  if (rate >= 90) {
    return 'Excellent';
  }
  if (rate >= 80) {
    return 'Good';
  }
  if (rate >= 70) {
    return 'Fair';
  }
  return 'Needs improvement';
}

export function AcceptanceRateScreen({navigation}: Props) {
  const [data, setData] = useState<AcceptanceRate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await getAcceptanceRate());
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
      return <ErrorState title="Couldn't load acceptance rate" description={error ?? undefined} onRetry={load} />;
    }
    if (data.total === 0) {
      return <EmptyState icon="bell" title="No offers yet" description="Your acceptance rate will appear once you start receiving order offers." />;
    }

    const pct = Math.max(0, Math.min(1, data.rate / 100));

    return (
      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.gaugeCard}>
          <View style={styles.gaugeWrap}>
            <Svg width={GAUGE_W} height={GAUGE_H} viewBox={`0 0 ${GAUGE_W} ${GAUGE_H}`}>
              <Path d={arcPath(1)} stroke={colors.border} strokeWidth={16} strokeLinecap="round" fill="none" />
              {pct > 0 && <Path d={arcPath(pct)} stroke={colors.primary} strokeWidth={16} strokeLinecap="round" fill="none" />}
            </Svg>
            <View style={styles.gaugeCenter} pointerEvents="none">
              <Text style={styles.gaugeValue}>{data.rate}%</Text>
            </View>
          </View>
          <Text style={styles.excellentText}>{rateLabel(data.rate)}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Accepted / Rejected Breakdown</Text>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Accepted</Text>
            <Text style={styles.rowValueGreen}>
              {data.accepted} {data.accepted === 1 ? 'order' : 'orders'}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Rejected</Text>
            <Text style={styles.rowValueRed}>
              {data.rejected} {data.rejected === 1 ? 'order' : 'orders'}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Total offers</Text>
            <Text style={styles.rowValueMuted}>{data.total}</Text>
          </View>
          <View style={[styles.row, styles.rowNoBorder]}>
            <Text style={styles.rowLabel}>Acceptance rate</Text>
            <Text style={styles.rowValueGreen}>{data.rate}%</Text>
          </View>
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
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconBackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Acceptance Rate</Text>
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
  gaugeCard: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.xl, alignItems: 'center', paddingVertical: spacing.lg},
  gaugeWrap: {width: GAUGE_W, height: GAUGE_H, alignItems: 'center'},
  gaugeCenter: {position: 'absolute', top: GAUGE_H * 0.55, alignItems: 'center'},
  gaugeValue: {...typography.display, fontSize: 32, color: colors.primary, fontWeight: '800'},
  excellentText: {...typography.bodyBold, fontSize: 14, color: colors.primary, marginTop: spacing.xs},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.xl, padding: spacing.lg},
  cardTitle: {...typography.bodySemibold, fontSize: 13, color: colors.textPrimary},
  row: {flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: '#F3F4F6'},
  rowNoBorder: {borderBottomWidth: 0},
  rowLabel: {...typography.label, fontSize: 13, color: colors.textSecondary},
  rowValueGreen: {...typography.bodyBold, fontSize: 13, color: colors.primary},
  rowValueRed: {...typography.bodyBold, fontSize: 13, color: '#D92D20'},
  rowValueMuted: {...typography.bodyBold, fontSize: 13, color: colors.textSecondary},
  tipRow: {flexDirection: 'row', gap: spacing.sm, paddingTop: spacing.sm},
  tipDash: {...typography.bodyBold, fontSize: 13, color: colors.primary},
  tipText: {...typography.label, fontSize: 13, color: colors.textSecondary, flex: 1},
});
