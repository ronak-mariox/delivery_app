import React, {useCallback, useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {EmptyState, ErrorState, Icon, IconBackButton, Loader, ProgressBar} from '../../components';
import {getApiErrorMessage} from '../../services/api';
import {getMilestones, Milestones} from '../../services/driverApi';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'DeliveriesCompleted'>;

export function DeliveriesCompletedScreen({navigation}: Props) {
  const [data, setData] = useState<Milestones | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await getMilestones());
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
      return <ErrorState title="Couldn't load deliveries" description={error ?? undefined} onRetry={load} />;
    }

    const next = data.milestones.find(m => !m.achieved);

    return (
      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <Text style={styles.heroValue}>{data.totalDeliveries}</Text>
          <Text style={styles.heroLabel}>Total deliveries completed</Text>
        </View>

        {next ? (
          <View style={styles.nextBanner}>
            <Text style={styles.nextTitle}>Next milestone: {next.target} deliveries</Text>
            <Text style={styles.nextText}>{next.target - next.progress} more to go</Text>
            <ProgressBar progress={next.progress / next.target} height={8} trackColor={colors.surface} style={styles.nextBar} />
          </View>
        ) : (
          data.milestones.length > 0 && (
            <View style={styles.nextBanner}>
              <Text style={styles.nextTitle}>All milestones achieved</Text>
              <Text style={styles.nextText}>Outstanding work — keep it up!</Text>
            </View>
          )
        )}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Milestones</Text>
          {data.milestones.length === 0 ? (
            <EmptyState icon="star" title="No milestones yet" description="Milestones will appear as you complete deliveries." />
          ) : (
            data.milestones.map((m, index) => (
              <View key={m.target} style={[styles.milestoneRow, index < data.milestones.length - 1 && styles.milestoneRowBorder]}>
                <View style={[styles.milestoneIcon, m.achieved && styles.milestoneIconDone]}>
                  {m.achieved ? <Icon name="check" size={12} color={colors.primary} /> : <View style={styles.milestoneDot} />}
                </View>
                <View style={styles.milestoneText}>
                  <View style={styles.milestoneHeader}>
                    <Text style={[styles.milestoneLabel, !m.achieved && styles.milestoneLabelPending]}>{m.target} deliveries</Text>
                    <Text style={styles.milestoneSub}>{m.achieved ? 'Achieved' : `${m.progress}/${m.target}`}</Text>
                  </View>
                  {!m.achieved && <ProgressBar progress={m.progress / m.target} height={5} style={styles.milestoneBar} />}
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconBackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Deliveries Completed</Text>
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
  heroCard: {backgroundColor: colors.primary, borderRadius: radius.xl, paddingVertical: spacing.xl, alignItems: 'center'},
  heroValue: {...typography.display, fontSize: 40, color: colors.white, fontWeight: '800'},
  heroLabel: {...typography.caption, fontSize: 12, color: 'rgba(255,255,255,0.85)', marginTop: 2},
  nextBanner: {backgroundColor: colors.primarySurface, borderWidth: 1, borderColor: colors.primaryBorder, borderRadius: radius.lg, padding: spacing.md},
  nextTitle: {...typography.bodyBold, fontSize: 13, color: colors.primaryDark},
  nextText: {...typography.label, fontSize: 13, color: colors.primary, marginTop: 2},
  nextBar: {marginTop: spacing.sm},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.xl, padding: spacing.lg},
  cardTitle: {...typography.bodySemibold, fontSize: 13, color: colors.textPrimary},
  milestoneRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.sm},
  milestoneRowBorder: {borderBottomWidth: 1, borderBottomColor: '#F3F4F6'},
  milestoneIcon: {width: 22, height: 22, borderRadius: 11, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center'},
  milestoneIconDone: {backgroundColor: colors.primarySurface},
  milestoneDot: {width: 8, height: 8, borderRadius: 4, backgroundColor: colors.borderStrong},
  milestoneText: {flex: 1},
  milestoneHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  milestoneLabel: {...typography.labelSemibold, fontSize: 13, color: colors.textPrimary},
  milestoneLabelPending: {color: colors.textMuted},
  milestoneSub: {...typography.caption, fontSize: 11, color: colors.textMuted},
  milestoneBar: {marginTop: spacing.xs},
});
