import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, EmptyState, Icon, IconBackButton, Loader} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {DeliveryOrder, OrderStatus, useOrders} from '../../context/OrdersContext';

type Props = NativeStackScreenProps<RootStackParamList, 'DeliveryHistoryDetail'>;

const STATUS_LABEL: Record<OrderStatus, string> = {
  placed: 'Order placed',
  accepted: 'Order accepted',
  preparing: 'Preparing',
  ready_for_pickup: 'Ready for pickup',
  out_for_delivery: 'Out for delivery',
  delivered: 'Delivered',
  cancelled: 'Order cancelled',
  rejected: 'Order rejected',
};

function formatTime(iso?: string): string {
  if (!iso) {
    return '';
  }
  return new Date(iso).toLocaleTimeString([], {hour: 'numeric', minute: '2-digit'});
}

function formatDate(iso?: string): string {
  if (!iso) {
    return '';
  }
  return new Date(iso).toLocaleDateString([], {month: 'short', day: 'numeric'});
}

export function DeliveryHistoryDetailScreen({route, navigation}: Props) {
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

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <IconBackButton onPress={() => navigation.goBack()} />
          <Text style={styles.headerTitle}>Delivery Detail</Text>
        </View>
        <Loader label="Loading delivery…" fullscreen />
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <IconBackButton onPress={() => navigation.goBack()} />
          <Text style={styles.headerTitle}>Delivery Detail</Text>
        </View>
        <EmptyState icon="alert-triangle" title="Order not found" description="This order could not be loaded." />
      </View>
    );
  }

  const isDelivered = order.status === 'delivered';
  const itemsCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconBackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Delivery #{order.orderNumber}</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={[styles.statusBanner, !isDelivered && styles.statusBannerMuted]}>
          <Text style={styles.statusBannerTitle}>{isDelivered ? 'DELIVERED' : 'CANCELLED'}</Text>
          <Text style={styles.statusBannerTime}>
            {`${formatDate(order.deliveredAt ?? order.updatedAt)}, ${formatTime(order.deliveredAt ?? order.updatedAt)}`}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Order Overview</Text>
          <View style={[styles.overviewRow, styles.overviewRowBorder]}>
            <Text style={styles.overviewLabel}>Order ID</Text>
            <View style={styles.orderIdRow}>
              <Text style={styles.overviewValue}>#{order.orderNumber}</Text>
              <Icon name="copy" size={13} color={colors.textSecondary} />
            </View>
          </View>
          <View style={[styles.overviewRow, styles.overviewRowBorder]}>
            <Text style={styles.overviewLabel}>Store</Text>
            <Text style={styles.overviewValue}>{order.pickup.address ? `${order.pickup.name}, ${order.pickup.address}` : order.pickup.name}</Text>
          </View>
          <View style={[styles.overviewRow, styles.overviewRowBorder]}>
            <Text style={styles.overviewLabel}>Customer</Text>
            <Text style={styles.overviewValue}>
              {order.address.contactName ? `${order.address.contactName}, ${order.address.city}` : order.address.city}
            </Text>
          </View>
          <View style={[styles.overviewRow, styles.overviewRowBorder]}>
            <Text style={styles.overviewLabel}>Items</Text>
            <Text style={styles.overviewValue}>{`${itemsCount} item${itemsCount === 1 ? '' : 's'}`}</Text>
          </View>
          <View style={styles.overviewRow}>
            <Text style={styles.overviewLabel}>Payment</Text>
            <Text style={styles.overviewValue}>{`${order.paymentMethod === 'cod' ? 'Cash on delivery' : 'Prepaid'} · ₹${order.pricing.grandTotal} order value`}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={() => navigation.navigate('OrderTimeline', {orderId})}>
          <View style={styles.cardTitleRow}>
            <Text style={styles.cardTitle}>Route Timeline</Text>
            <Icon name="chevron-right" size={16} color={colors.textMuted} />
          </View>
          {order.statusHistory.map((step, index) => (
            <View key={`${step.status}-${step.at}`} style={styles.timelineRow}>
              <View style={styles.timelineTrack}>
                <View style={styles.timelineDot}>
                  <Icon name="check" size={12} color={colors.primary} />
                </View>
                {index < order.statusHistory.length - 1 && <View style={styles.timelineLine} />}
              </View>
              <View style={styles.timelineText}>
                <Text style={styles.timelineLabel}>{STATUS_LABEL[step.status]}</Text>
                <Text style={styles.timelineTime}>{formatTime(step.at)}</Text>
              </View>
            </View>
          ))}
        </TouchableOpacity>

        {isDelivered && order.driverEarnings && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Earnings</Text>
            <View style={styles.earningsRow}>
              <Text style={styles.earningsLabel}>Base</Text>
              <Text style={styles.earningsValue}>{`₹${order.driverEarnings.base}`}</Text>
            </View>
            <View style={styles.earningsRow}>
              <Text style={styles.earningsLabel}>Distance</Text>
              <Text style={styles.earningsValue}>{`₹${order.driverEarnings.distance}`}</Text>
            </View>
            <View style={styles.earningsRow}>
              <Text style={styles.earningsLabel}>On-time bonus</Text>
              <Text style={styles.earningsValue}>{`₹${order.driverEarnings.onTimeBonus}`}</Text>
            </View>
            {order.driverEarnings.incentiveBonus > 0 && (
              <View style={styles.earningsRow}>
                <Text style={styles.earningsLabel}>Incentive</Text>
                <Text style={styles.earningsValue}>{`₹${order.driverEarnings.incentiveBonus}`}</Text>
              </View>
            )}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{`₹${order.driverEarnings.total}`}</Text>
            </View>
          </View>
        )}

        {!isDelivered && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Cancellation</Text>
            <Text style={styles.cancelReasonText}>
              {order.cancelReason ?? `Cancelled by ${order.cancelledBy ?? 'system'}`}
            </Text>
          </View>
        )}

        {isDelivered && order.driverEarnings && (
          <View style={styles.actionsRow}>
            <Button
              label="View Earnings Detail"
              variant="outline"
              style={styles.flex}
              onPress={() => navigation.navigate('DeliveryHistoryEarnings', {orderId})}
            />
          </View>
        )}
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
    paddingTop: 52,
    paddingBottom: spacing.md,
  },
  headerTitle: {...typography.title, fontSize: 17, color: colors.textPrimary},
  body: {padding: 0, paddingBottom: spacing.xxxl},
  statusBanner: {backgroundColor: colors.primary, alignItems: 'center', paddingVertical: spacing.md},
  statusBannerMuted: {backgroundColor: colors.textMuted},
  statusBannerTitle: {...typography.bodyBold, fontSize: 14, color: colors.white, letterSpacing: 0.5},
  statusBannerTime: {...typography.caption, color: 'rgba(255,255,255,0.85)', marginTop: 2},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.xl, padding: spacing.lg, margin: spacing.lg, marginBottom: 0},
  cardTitle: {...typography.bodySemibold, fontSize: 13, color: colors.textPrimary},
  cardTitleRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  overviewRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.sm, marginTop: spacing.xs},
  overviewRowBorder: {borderBottomWidth: 1, borderBottomColor: '#F3F4F6'},
  overviewLabel: {...typography.caption, fontSize: 12, color: colors.textSecondary},
  overviewValue: {...typography.captionMedium, fontSize: 12, color: colors.textPrimary, textAlign: 'right', flexShrink: 1, marginLeft: spacing.md},
  orderIdRow: {flexDirection: 'row', alignItems: 'center', gap: 6},
  timelineRow: {flexDirection: 'row', gap: spacing.md, marginTop: spacing.md},
  timelineTrack: {alignItems: 'center'},
  timelineDot: {width: 22, height: 22, borderRadius: 11, backgroundColor: colors.primarySurface, alignItems: 'center', justifyContent: 'center'},
  timelineLine: {width: 2, flex: 1, minHeight: 20, backgroundColor: colors.primarySurface, marginVertical: 2},
  timelineText: {paddingBottom: spacing.sm},
  timelineLabel: {...typography.labelSemibold, fontSize: 13, color: colors.textPrimary},
  timelineTime: {...typography.caption, fontSize: 12, color: colors.textSecondary, marginTop: 1},
  earningsRow: {flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.xs, marginTop: spacing.xs},
  earningsLabel: {...typography.caption, fontSize: 12, color: colors.textSecondary},
  earningsValue: {...typography.caption, fontSize: 12, color: colors.textPrimary},
  totalRow: {flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.sm, marginTop: spacing.xs},
  totalLabel: {...typography.bodyBold, fontSize: 14, color: colors.textPrimary},
  totalValue: {...typography.bodyBold, fontSize: 14, color: colors.primary},
  cancelReasonText: {...typography.label, fontSize: 13, color: colors.textSecondary, marginTop: spacing.sm},
  actionsRow: {flexDirection: 'row', gap: spacing.sm, margin: spacing.lg},
});
