import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, CountdownRing, Icon, IconBackButton} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {DeliveryOrder, useOrders} from '../../context/OrdersContext';

type Props = NativeStackScreenProps<RootStackParamList, 'OrderRequestDetails'>;

export function OrderRequestDetailsScreen({route, navigation}: Props) {
  const {orderId, secondsLeft: initialSeconds} = route.params;
  const {getOrder} = useOrders();
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds ?? 18);
  const [order, setOrder] = useState<DeliveryOrder | null>(null);

  useEffect(() => {
    let cancelled = false;
    getOrder(orderId)
      .then((o) => {
        if (!cancelled) {setOrder(o);}
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [orderId, getOrder]);

  useEffect(() => {
    if (secondsLeft <= 0) {
      navigation.reset({index: 0, routes: [{name: 'RequestTimedOut', params: {orderId}}]});
      return;
    }
    const timer = setTimeout(() => setSecondsLeft(s => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft, navigation, orderId]);

  const itemCount = order?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
  const earnings = order?.driverEarnings;
  const total = earnings?.total ?? order?.pricing.deliveryFee ?? 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconBackButton onPress={() => navigation.goBack()} />
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Order #{order?.orderNumber ?? orderId}</Text>
          <Text style={styles.headerSubtitle}>
            {order?.pickup.name ?? 'Store'} · {itemCount || '—'} items
          </Text>
        </View>
        <CountdownRing seconds={secondsLeft} color={colors.warning} size={48} />
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.earningsCard}>
          <View>
            <Text style={styles.earningsLabel}>ESTIMATED EARNINGS</Text>
            <Text style={styles.earningsValue}>₹{total}</Text>
            <Text style={styles.earningsBreakdown}>
              {earnings
                ? `Base ₹${earnings.base} + Distance ₹${earnings.distance} + Bonus ₹${earnings.onTimeBonus + earnings.incentiveBonus}`
                : `Delivery fee ₹${order?.pricing.deliveryFee ?? 0}`}
            </Text>
          </View>
          <View style={styles.earningsRight}>
            <Text style={styles.earningsSubLabel}>{order?.address.city ?? ''}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>ROUTE</Text>
          <View style={styles.routeRow}>
            <View style={styles.routeLine}>
              <View style={styles.routeDotPickup}>
                <Icon name="map-pin" size={14} color={colors.primary} />
              </View>
              <View style={styles.routeConnector} />
              <View style={styles.routeDotDrop}>
                <Icon name="map-pin" size={14} color={colors.danger} />
              </View>
            </View>
            <View style={styles.routeText}>
              <Text style={styles.routeTitle}>{order?.pickup.name ?? 'Store'}</Text>
              <Text style={styles.routeSubtitle}>{order?.pickup.address ?? 'Pickup address'}</Text>
              <View style={styles.routeSpacer} />
              <Text style={styles.routeTitle}>Customer Drop-off</Text>
              <Text style={styles.routeSubtitle}>
                {order ? `${order.address.line1}, ${order.address.city}` : 'Delivery address'}
              </Text>
              {order?.address.landmark ? <Text style={styles.routeMetaMuted}>Near {order.address.landmark}</Text> : null}
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>ORDER CONTENTS</Text>
          {(order?.items ?? []).map((item, index) => (
            <View key={`${item.productId}-${item.variantId}`} style={[styles.itemRow, index > 0 && styles.itemRowBorder]}>
              <View style={styles.itemDot} />
              <Text style={styles.itemName} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.itemQty}>×{item.quantity}</Text>
              <Text style={styles.itemPrice}>₹{item.subtotal}</Text>
            </View>
          ))}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Order Value</Text>
            <Text style={styles.totalValue}>₹{order?.pricing.grandTotal ?? 0}</Text>
          </View>
        </View>

        <View style={styles.paymentBanner}>
          <Icon name="credit-card" size={16} color={colors.primary} />
          <Text style={styles.paymentText}>
            Payment:{' '}
            <Text style={styles.paymentTextStrong}>
              {order?.paymentMethod === 'cod'
                ? `Cash on Delivery · Collect ₹${order.pricing.grandTotal} from customer`
                : order?.paymentStatus === 'paid'
                ? 'Paid online · Nothing to collect'
                : 'Online payment · Nothing to collect'}
            </Text>
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label="Reject"
          variant="secondary"
          style={styles.rejectButton}
          onPress={() => navigation.navigate('RejectConfirmSheet', {orderId})}
        />
        <Button label="Accept Order" style={styles.acceptButton} onPress={() => navigation.navigate('AcceptingOrder', {orderId})} />
      </View>
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
  headerText: {flex: 1},
  headerTitle: {...typography.title, fontSize: 15, color: colors.textPrimary},
  headerSubtitle: {...typography.caption, color: colors.textSecondary, marginTop: 1},
  body: {padding: spacing.lg, gap: spacing.md},
  earningsCard: {flexDirection: 'row', justifyContent: 'space-between', backgroundColor: colors.primary, borderRadius: radius.xxl, padding: spacing.lg},
  earningsLabel: {...typography.overline, fontSize: 11, color: 'rgba(255,255,255,0.7)', letterSpacing: 0.5},
  earningsValue: {...typography.display, fontSize: 32, color: colors.white, marginTop: 2},
  earningsBreakdown: {...typography.caption, color: 'rgba(255,255,255,0.7)', marginTop: 2},
  earningsRight: {alignItems: 'flex-end'},
  earningsSubLabel: {...typography.caption, fontSize: 11, color: 'rgba(255,255,255,0.7)'},
  card: {backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.xl, padding: spacing.lg},
  cardLabel: {...typography.overline, fontSize: 12, color: colors.textMuted, letterSpacing: 0.5, marginBottom: spacing.sm},
  routeRow: {flexDirection: 'row', gap: spacing.md},
  routeLine: {alignItems: 'center'},
  routeDotPickup: {width: 28, height: 28, borderRadius: 14, backgroundColor: colors.primarySurface, borderWidth: 2, borderColor: colors.primary, alignItems: 'center', justifyContent: 'center'},
  routeConnector: {width: 2, flex: 1, backgroundColor: colors.border, minHeight: 32},
  routeDotDrop: {width: 28, height: 28, borderRadius: 14, backgroundColor: colors.dangerSurface, borderWidth: 2, borderColor: colors.danger, alignItems: 'center', justifyContent: 'center'},
  routeText: {flex: 1},
  routeTitle: {...typography.bodyBold, fontSize: 14, color: colors.textPrimary},
  routeSubtitle: {...typography.caption, color: colors.textSecondary, marginTop: 1},
  routeMetaMuted: {...typography.caption, fontSize: 11, color: colors.textMuted, marginTop: 2},
  routeSpacer: {height: spacing.lg},
  itemRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.sm},
  itemRowBorder: {borderTopWidth: 1, borderTopColor: '#F3F4F6'},
  itemDot: {width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary},
  itemName: {flex: 1, ...typography.label, color: colors.textLabel},
  itemQty: {...typography.caption, color: colors.textMuted, marginRight: spacing.sm},
  itemPrice: {...typography.captionSemibold, color: colors.textPrimary},
  totalRow: {flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingTop: spacing.sm, marginTop: spacing.xs},
  totalLabel: {...typography.bodySemibold, fontSize: 13, color: colors.textLabel},
  totalValue: {...typography.bodyBold, fontSize: 13, color: colors.textPrimary},
  paymentBanner: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.primarySurface, borderWidth: 1, borderColor: colors.primaryBorder, borderRadius: radius.md, padding: spacing.md},
  paymentText: {...typography.label, color: '#13845A'},
  paymentTextStrong: {fontWeight: '700'},
  footer: {flexDirection: 'row', gap: spacing.sm, padding: spacing.lg, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border},
  rejectButton: {flex: 1, height: 56},
  acceptButton: {flex: 2, height: 56},
});
