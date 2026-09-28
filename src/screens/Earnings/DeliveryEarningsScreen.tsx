import React, {useCallback} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {EmptyState, ErrorState, IconBackButton, Loader} from '../../components';
import {colors, radius, shadows, spacing, typography} from '../../theme';
import {getEarningsBreakdown} from '../../services/driverApi';
import {formatMoney, useAsyncData} from './earningsShared';
import {LedgerList} from './LedgerList';

type Props = NativeStackScreenProps<RootStackParamList, 'DeliveryEarnings'>;

export function DeliveryEarningsScreen({route, navigation}: Props) {
  const {orderId} = route.params;
  const loader = useCallback(() => getEarningsBreakdown(orderId), [orderId]);
  const {data, loading, error, reload} = useAsyncData(loader);

  const earnings = data?.driverEarnings ?? null;
  const rows = earnings
    ? [
        {label: 'Base pay', value: earnings.base},
        {label: 'Distance pay', value: earnings.distance},
        {label: 'On-time bonus', value: earnings.onTimeBonus},
        {label: 'Incentive bonus', value: earnings.incentiveBonus},
      ]
    : [];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconBackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>{`Delivery #${data?.orderNumber ?? orderId}`}</Text>
      </View>

      {loading && <Loader fullscreen label="Loading delivery earnings…" />}

      {!loading && !data && <ErrorState title="Could not load earnings" description={error ?? undefined} onRetry={() => reload()} />}

      {!loading && data && (
        <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
          {earnings ? (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Earnings Breakdown</Text>
              {rows.map((row, index) => (
                <View key={row.label} style={[styles.infoRow, index < rows.length - 1 && styles.infoRowBorder]}>
                  <Text style={styles.infoLabel}>{row.label}</Text>
                  <Text style={styles.infoValue}>{formatMoney(row.value)}</Text>
                </View>
              ))}
              <View style={styles.divider} />
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total earned</Text>
                <Text style={styles.totalValue}>{formatMoney(earnings.total)}</Text>
              </View>
            </View>
          ) : (
            <View style={styles.card}>
              <EmptyState icon="alert-triangle" title="No earnings recorded yet" description="Earnings are calculated once the delivery is completed." />
            </View>
          )}

          <LedgerList title="Ledger" entries={data.ledger} emptyTitle="No ledger entries" emptyDescription="Nothing has been credited for this delivery yet." />
        </ScrollView>
      )}
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
  headerTitle: {...typography.title, fontSize: 17, color: colors.textPrimary},
  body: {padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxxl},
  card: {backgroundColor: colors.surface, borderRadius: radius.xl, padding: spacing.lg, ...shadows.sm},
  cardTitle: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary, marginBottom: spacing.xs},
  infoRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.sm},
  infoRowBorder: {borderBottomWidth: 1, borderBottomColor: '#F3F4F6'},
  infoLabel: {...typography.label, fontSize: 13, color: colors.textSecondary},
  infoValue: {...typography.labelSemibold, fontSize: 13, color: colors.textPrimary},
  divider: {height: 1, backgroundColor: colors.border, marginTop: spacing.xs},
  totalRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.md},
  totalLabel: {...typography.bodyBold, fontSize: 14, color: colors.textPrimary},
  totalValue: {...typography.bodyBold, fontSize: 14, color: colors.primary},
});
