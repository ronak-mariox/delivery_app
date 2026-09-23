import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {EmptyState, Icon, Loader, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {DeliveryOrder, OrderStatus, useOrders} from '../../context/OrdersContext';

type Props = NativeStackScreenProps<RootStackParamList, 'OrderCancelledByCustomer'>;

const STATUS_LABEL: Record<OrderStatus, string> = {
  placed: 'Order placed',
  accepted: 'Accepted',
  preparing: 'Preparing',
  ready_for_pickup: 'Ready for pickup',
  out_for_delivery: 'En route to delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  rejected: 'Rejected',
};

function formatTime(iso?: string): string {
  if (!iso) {
    return '';
  }
  return new Date(iso).toLocaleTimeString([], {hour: 'numeric', minute: '2-digit'});
}

export function OrderCancelledByCustomerScreen({route, navigation}: Props) {
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
      <Screen edges={['top', 'bottom']}>
        <Loader label="Loading…" fullscreen />
      </Screen>
    );
  }

  if (!order) {
    return (
      <Screen edges={['top', 'bottom']}>
        <EmptyState icon="alert-triangle" title="Order not found" description="This order could not be loaded." />
      </Screen>
    );
  }

  const cancelledEventIndex = order.statusHistory.map(e => e.status).lastIndexOf('cancelled');
  const cancelledAt = order.statusHistory[cancelledEventIndex]?.at ?? order.updatedAt;
  const statusBeforeCancel = cancelledEventIndex > 0 ? order.statusHistory[cancelledEventIndex - 1]?.status : undefined;
  const customerName = order.address.contactName || 'The customer';
  const canReturnToStore = !!order.pickupConfirmedAt;

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Icon name="x" size={28} color={colors.white} />
        </View>
      </View>
      <View style={styles.titleBlock}>
        <Text style={styles.title}>Order Cancelled by Customer</Text>
        <Text style={styles.subtitle}>{`${customerName} cancelled order #${order.orderNumber}.`}</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>CANCELLATION DETAILS</Text>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Cancelled at</Text>
            <Text style={styles.rowValue}>{formatTime(cancelledAt)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Reason</Text>
            <Text style={styles.rowValue}>{order.cancelReason || 'Not specified'}</Text>
          </View>
          {!!statusBeforeCancel && (
            <>
              <View style={styles.divider} />
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Your status at cancellation</Text>
                <Text style={styles.rowValueWarning}>{STATUS_LABEL[statusBeforeCancel]}</Text>
              </View>
            </>
          )}
        </View>

        <Text style={styles.sectionLabel}>Next Steps</Text>

        <TouchableOpacity
          style={styles.primaryOption}
          activeOpacity={0.85}
          onPress={() => navigation.reset({index: 0, routes: [{name: 'Home'}]})}>
          <View style={styles.primaryOptionIcon}>
            <Icon name="home" size={20} color={colors.white} />
          </View>
          <View style={styles.optionText}>
            <Text style={styles.primaryOptionTitle}>Return to home / next delivery</Text>
          </View>
        </TouchableOpacity>

        {canReturnToStore && (
          <TouchableOpacity
            style={styles.secondaryOption}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('NavigateToStore', {orderId})}>
            <View style={styles.secondaryOptionIcon}>
              <Icon name="package" size={20} color={colors.textSecondary} />
            </View>
            <View style={styles.optionText}>
              <Text style={styles.secondaryOptionTitle}>Return order to store</Text>
              <Text style={styles.secondaryOptionSubtitle}>You already collected this order</Text>
            </View>
          </TouchableOpacity>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Have questions? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('SupportHub')}>
          <Text style={styles.footerLink}>Contact Support</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {backgroundColor: colors.dark800, alignItems: 'center', justifyContent: 'center', height: 100},
  headerIcon: {width: 52, height: 52, borderRadius: 26, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center'},
  titleBlock: {alignItems: 'center', backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border, paddingVertical: spacing.lg, gap: spacing.xs},
  title: {...typography.h4, fontSize: 20, color: colors.textPrimary},
  subtitle: {...typography.body, color: colors.textSecondary},
  flex: {flex: 1},
  body: {padding: spacing.lg, gap: spacing.md},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.md},
  cardLabel: {...typography.captionMedium, fontSize: 12, color: colors.textSecondary, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: spacing.sm},
  row: {flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.xs},
  rowLabel: {...typography.label, color: colors.textSecondary},
  rowValue: {...typography.labelSemibold, color: colors.textPrimary},
  rowValueWarning: {...typography.label, fontWeight: '600', color: colors.warning},
  divider: {height: 1, backgroundColor: colors.background},
  sectionLabel: {...typography.bodySemibold, fontSize: 13, color: colors.textPrimary},
  primaryOption: {flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.primary, borderRadius: radius.md, padding: spacing.md},
  primaryOptionIcon: {width: 36, height: 36, borderRadius: radius.sm, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center'},
  primaryOptionTitle: {...typography.bodySemibold, fontSize: 14, color: colors.white},
  secondaryOption: {flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md},
  secondaryOptionIcon: {width: 36, height: 36, borderRadius: radius.sm, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center'},
  secondaryOptionTitle: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary},
  secondaryOptionSubtitle: {...typography.caption, fontSize: 12, color: colors.textSecondary, marginTop: 1},
  optionText: {flex: 1},
  footer: {flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', padding: spacing.lg, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border},
  footerText: {...typography.label, color: colors.textSecondary},
  footerLink: {...typography.labelSemibold, color: colors.primary, textDecorationLine: 'underline'},
});
