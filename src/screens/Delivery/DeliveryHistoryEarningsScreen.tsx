import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {EmptyState, Icon, IconBackButton, Loader} from '../../components';
import {colors, radius, shadows, spacing, typography} from '../../theme';
import {DeliveryOrder, useOrders} from '../../context/OrdersContext';

type Props = NativeStackScreenProps<RootStackParamList, 'DeliveryHistoryEarnings'>;

function formatDateTime(iso?: string): string {
  if (!iso) {
    return '';
  }
  const d = new Date(iso);
  return `${d.toLocaleDateString([], {month: 'short', day: 'numeric'})}, ${d.toLocaleTimeString([], {hour: 'numeric', minute: '2-digit'})}`;
}

export function DeliveryHistoryEarningsScreen({route, navigation}: Props) {
  const {orderId} = route.params;
  const {getOrder} = useOrders();
  const [order, setOrder] = useState<DeliveryOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getOrder(orderId)
      .then(o => { if (!cancelled) setOrder(o); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [orderId, getOrder]);

  const earnings = order?.driverEarnings;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconBackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>{`Earnings #${order?.orderNumber ?? orderId}`}</Text>
      </View>

      {loading && <Loader label="Loading earnings…" fullscreen />}

      {!loading && !earnings && (
        <EmptyState icon="alert-triangle" title="No earnings available" description="This delivery has no earnings recorded yet." />
      )}

      {!loading && earnings && (
        <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
          <View style={styles.heroCard}>
            <Text style={styles.heroLabel}>TOTAL EARNED</Text>
            <Text style={styles.heroValue}>{`₹${earnings.total}`}</Text>
            <Text style={styles.heroSub}>{`For delivery #${order?.orderNumber ?? orderId}`}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Earnings Breakdown</Text>
            <View style={[styles.row, styles.rowBorder]}>
              <Text style={styles.rowLabel}>Base fare</Text>
              <Text style={styles.rowValue}>{`₹${earnings.base}`}</Text>
            </View>
            <View style={[styles.row, styles.rowBorder]}>
              <Text style={styles.rowLabel}>Distance</Text>
              <Text style={styles.rowValue}>{`₹${earnings.distance}`}</Text>
            </View>
            <View style={[styles.row, styles.rowBorder]}>
              <Text style={styles.rowLabel}>On-time bonus</Text>
              <Text style={styles.rowValue}>{`₹${earnings.onTimeBonus}`}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Incentive</Text>
              <Text style={styles.rowValue}>{`₹${earnings.incentiveBonus}`}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{`₹${earnings.total}`}</Text>
            </View>
          </View>

          {order && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Related Delivery</Text>
              <TouchableOpacity style={styles.relatedRow} activeOpacity={0.7} onPress={() => navigation.navigate('DeliveryHistoryDetail', {orderId})}>
                <View style={styles.flex}>
                  <Text style={styles.relatedOrderId}>#{order.orderNumber}</Text>
                  <Text style={styles.relatedRoute}>{`${order.pickup.name} → ${order.address.city}`}</Text>
                  <Text style={styles.relatedTime}>{formatDateTime(order.deliveredAt)}</Text>
                </View>
                <View style={styles.relatedLink}>
                  <Text style={styles.relatedLinkText}>View Delivery</Text>
                  <Icon name="chevron-right" size={14} color={colors.primary} />
                </View>
              </TouchableOpacity>
            </View>
          )}
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
    paddingBottom: spacing.md,
  },
  headerTitle: {...typography.title, fontSize: 17, color: colors.textPrimary},
  body: {padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxxl},
  heroCard: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.xxl, paddingVertical: spacing.xxl, alignItems: 'center'},
  heroLabel: {...typography.captionSemibold, fontSize: 11, color: colors.textSecondary, letterSpacing: 0.8, textTransform: 'uppercase'},
  heroValue: {...typography.display, fontSize: 42, color: colors.primary, fontWeight: '800', marginTop: spacing.xs},
  heroSub: {...typography.caption, color: colors.textSecondary, marginTop: 2},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.xl, padding: spacing.lg, ...shadows.sm},
  cardTitle: {...typography.bodySemibold, fontSize: 13, color: colors.textPrimary},
  row: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.sm, borderBottomColor: '#F3F4F6'},
  rowBorder: {borderBottomWidth: 1},
  rowLabel: {...typography.label, fontSize: 13, color: colors.textPrimary},
  rowValue: {...typography.labelSemibold, fontSize: 13, color: colors.textPrimary},
  totalRow: {flexDirection: 'row', justifyContent: 'space-between', paddingTop: spacing.md, marginTop: spacing.xs},
  totalLabel: {...typography.bodyBold, fontSize: 15, color: colors.textPrimary},
  totalValue: {...typography.bodyBold, fontSize: 15, color: colors.primary},
  relatedRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: spacing.sm},
  relatedOrderId: {...typography.labelSemibold, fontSize: 13, color: colors.textPrimary},
  relatedRoute: {...typography.caption, fontSize: 12, color: colors.textSecondary, marginTop: 2},
  relatedTime: {...typography.caption, fontSize: 11, color: colors.textMuted, marginTop: 2},
  relatedLink: {flexDirection: 'row', alignItems: 'center', gap: 4},
  relatedLinkText: {...typography.labelSemibold, fontSize: 13, color: colors.primary},
});
