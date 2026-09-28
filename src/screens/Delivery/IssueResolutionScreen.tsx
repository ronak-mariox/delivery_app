import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {DeliveryOrder, OrderStatusEvent, useOrders} from '../../context/OrdersContext';

type Props = NativeStackScreenProps<RootStackParamList, 'IssueResolution'>;

const STATUS_LABEL: Record<string, string> = {
  placed: 'Order placed',
  accepted: 'Order accepted',
  preparing: 'Preparing',
  ready_for_pickup: 'Ready for pickup',
  out_for_delivery: 'Out for delivery',
  delivered: 'Delivered',
  cancelled: 'Order cancelled',
};

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], {hour: 'numeric', minute: '2-digit'});
}

export function IssueResolutionScreen({route, navigation}: Props) {
  const {orderId, order: passedOrder} = route.params;
  const {getOrder} = useOrders();
  const [order, setOrder] = useState<DeliveryOrder | null>(passedOrder ?? null);

  useEffect(() => {
    if (passedOrder) {return;}
    let cancelled = false;
    getOrder(orderId)
      .then((o) => {
        if (!cancelled) {setOrder(o);}
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [orderId, passedOrder, getOrder]);

  const isCancelled = order?.status === 'cancelled';
  const isUnassigned = !isCancelled && !order?.driverId;
  const timeline: OrderStatusEvent[] = order?.statusHistory ?? [];

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Icon name={isCancelled ? 'x' : 'check'} size={32} color={colors.white} />
        </View>
        <Text style={styles.headerTitle}>{isCancelled ? 'Issue Resolved — Cancelled' : 'Issue Resolved'}</Text>
        <Text style={styles.headerSubtitle}>{`Order #${order?.orderNumber ?? orderId}`}</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {!!order && (
          <View style={styles.card}>
            <Text style={styles.cardLabel}>RESOLUTION</Text>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Outcome</Text>
              <Text style={styles.rowValue}>
                {isCancelled
                  ? 'Order was cancelled'
                  : isUnassigned
                  ? 'Order returned to the pickup queue'
                  : STATUS_LABEL[order.status] ?? order.status}
              </Text>
            </View>
            {isCancelled && !!order.cancelReason && (
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Reason</Text>
                <Text style={styles.rowValue}>{order.cancelReason}</Text>
              </View>
            )}
          </View>
        )}

        {timeline.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.actionsTitle}>Order timeline</Text>
            {timeline.map((event, index) => (
              <View key={`${event.status}-${event.at}`} style={styles.actionRow}>
                <View style={styles.actionDotCol}>
                  <View style={styles.actionDot}>
                    <Icon name="check" size={12} color={colors.primary} />
                  </View>
                  {index < timeline.length - 1 && <View style={styles.actionConnector} />}
                </View>
                <View style={styles.actionText}>
                  <Text style={styles.actionTitle}>{STATUS_LABEL[event.status] ?? event.status}</Text>
                  <Text style={styles.actionTime}>{formatTime(event.at)}</Text>
                  {!!event.note && <Text style={styles.actionNote}>{event.note}</Text>}
                </View>
              </View>
            ))}
          </View>
        )}

        <Button label="Back to Home" onPress={() => navigation.reset({index: 0, routes: [{name: 'Home'}]})} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {backgroundColor: colors.primary, alignItems: 'center', gap: spacing.xs, paddingTop: spacing.xxl, paddingBottom: spacing.xxl, paddingHorizontal: spacing.xl},
  headerIcon: {width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xs},
  headerTitle: {...typography.h3, fontSize: 24, color: colors.white},
  headerSubtitle: {...typography.body, color: '#A7F3D0'},
  flex: {flex: 1},
  body: {padding: spacing.lg, gap: spacing.md},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg},
  cardLabel: {...typography.captionSemibold, fontSize: 12, color: colors.textSecondary, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: spacing.sm},
  row: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingVertical: spacing.xxs, gap: spacing.md},
  rowLabel: {...typography.label, fontSize: 13, color: colors.textSecondary},
  rowValue: {...typography.bodyMedium, fontSize: 13, color: colors.textPrimary, textAlign: 'right', flexShrink: 1},
  actionsTitle: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary, marginBottom: spacing.md},
  actionRow: {flexDirection: 'row', gap: spacing.md},
  actionDotCol: {alignItems: 'center'},
  actionDot: {width: 24, height: 24, borderRadius: 12, backgroundColor: colors.primarySurface, borderWidth: 2, borderColor: colors.primary, alignItems: 'center', justifyContent: 'center'},
  actionConnector: {width: 2, flex: 1, minHeight: 20, backgroundColor: colors.border, marginTop: 2},
  actionText: {flex: 1, paddingBottom: spacing.md},
  actionTitle: {...typography.bodyMedium, fontSize: 14, color: colors.textPrimary},
  actionTime: {...typography.caption, fontSize: 12, color: colors.textSecondary, marginTop: 1},
  actionNote: {...typography.caption, fontSize: 12, color: colors.textSecondary, marginTop: 2, fontStyle: 'italic'},
});
