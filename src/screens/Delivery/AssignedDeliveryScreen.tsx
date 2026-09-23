import React, {useEffect, useState} from 'react';
import {Linking, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Avatar, Badge, Button, Card, Icon, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {DeliveryOrder, useOrders} from '../../context/OrdersContext';

type Props = NativeStackScreenProps<RootStackParamList, 'AssignedDelivery'>;

export function AssignedDeliveryScreen({route, navigation}: Props) {
  const {orderId} = route.params;
  const {getOrder} = useOrders();
  const [order, setOrder] = useState<DeliveryOrder | null>(null);

  useEffect(() => {
    let cancelled = false;
    getOrder(orderId)
      .then((o) => {
        if (!cancelled) setOrder(o);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [orderId, getOrder]);

  const itemCount = order?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
  const earnings = order?.driverEarnings?.total ?? order?.pricing.deliveryFee;
  const deliveryKm = (() => {
    if (!order?.pickup.latitude || !order.pickup.longitude || !order.address.latitude || !order.address.longitude) return null;
    return haversineKm(order.pickup.latitude, order.pickup.longitude, order.address.latitude, order.address.longitude);
  })();

  const storeName = order?.pickup.name ?? 'Store';
  const storeInitials = storeName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('') || 'ST';

  return (
    <Screen backgroundColor={colors.primary} statusBarStyle="light-content" edges={['top', 'bottom']}>
      <View style={styles.header}>
        <View style={styles.badgeWrap}>
          <View style={styles.badgePill}>
            <Text style={styles.badgeText}>NEW ASSIGNMENT</Text>
          </View>
        </View>
        <View style={styles.storeRow}>
          <Avatar initials={storeInitials} backgroundColor="rgba(255,255,255,0.25)" />
          <View style={styles.storeInfo}>
            <Text style={styles.storeName}>{storeName}</Text>
            <Text style={styles.storeMeta}>{order?.pickup.address ?? 'Pickup point'}</Text>
          </View>
          <View style={styles.onlineDot} />
        </View>
      </View>

      <View style={styles.body}>
        <TouchableOpacity activeOpacity={0.85} onPress={() => navigation.navigate('PickupDetails', {orderId})}>
          <Card style={styles.orderCard} padded={false}>
            <View style={styles.orderIdBlock}>
              <Text style={styles.orderIdLabel}>ORDER ID</Text>
              <Text style={styles.orderIdValue}>#{order?.orderNumber ?? orderId}</Text>
            </View>

            <View style={styles.addressBlock}>
              <View style={styles.addressRow}>
                <Icon name="map-pin" size={16} color={colors.textSecondary} />
                <View style={styles.addressText}>
                  <Text style={styles.addressLabel}>PICKUP</Text>
                  <Text style={styles.addressValue}>{order?.pickup.address ?? storeName}</Text>
                </View>
              </View>
              <View style={[styles.addressRow, styles.addressRowSpaced]}>
                <Icon name="map-pin" size={16} color={colors.textSecondary} />
                <View style={styles.addressText}>
                  <Text style={styles.addressLabel}>DELIVERY</Text>
                  <Text style={styles.addressValue}>{order ? `${order.address.line1}, ${order.address.city}` : 'Delivery address'}</Text>
                </View>
              </View>
            </View>

            <View style={styles.routeRow}>
              <Icon name="navigation" size={16} color={colors.textSecondary} />
              <Text style={styles.routeText}>
                {deliveryKm != null ? (
                  <>
                    Pickup to delivery <Text style={styles.routeStrong}>{deliveryKm.toFixed(1)} km</Text>
                  </>
                ) : (
                  'Distance unavailable'
                )}
              </Text>
            </View>

            <View style={styles.metricsRow}>
              <Metric value={earnings != null ? `₹${earnings}` : '—'} label="Earnings" />
              <Metric value={deliveryKm != null ? `${Math.max(5, Math.round(deliveryKm * 4))} min` : '—'} label="ETA" />
              <Metric value={String(itemCount || '—')} label="Items" />
            </View>

            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Payment:</Text>
              <Badge label={order?.paymentMethod === 'cod' ? `COD · ₹${order.pricing.grandTotal}` : 'Paid Online'} tone="success" />
            </View>
          </Card>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <View style={styles.footerButtons}>
          <Button
            label="Call Store"
            variant="outline"
            icon="phone"
            style={styles.callButton}
            fullWidth={false}
            disabled={!order?.pickup.phone}
            onPress={() => {
              if (order?.pickup.phone) Linking.openURL(`tel:${order.pickup.phone}`).catch(() => {});
            }}
          />
          <Button
            label="Navigate to Store"
            icon="navigation"
            fullWidth={false}
            style={styles.navigateButton}
            onPress={() => navigation.navigate('NavigateToStore', {orderId})}
          />
        </View>
        <Text style={styles.footerHint}>
          Order must be picked up within <Text style={styles.footerHintStrong}>30 minutes</Text>
        </Text>
      </View>
    </Screen>
  );
}

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function Metric({value, label}: {value: string; label: string}) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {backgroundColor: colors.primary, paddingHorizontal: spacing.xl, paddingTop: spacing.xl, paddingBottom: spacing.xxl, gap: spacing.lg},
  badgeWrap: {alignItems: 'center'},
  badgePill: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
  },
  badgeText: {...typography.overline, color: colors.white, letterSpacing: 1.4},
  storeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: 'rgba(0,0,0,0.15)',
    borderRadius: radius.xl,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  storeInfo: {flex: 1},
  storeName: {...typography.bodySemibold, color: colors.white},
  storeMeta: {...typography.caption, color: 'rgba(255,255,255,0.75)'},
  onlineDot: {width: 10, height: 10, borderRadius: 5, backgroundColor: '#4ADE80', borderWidth: 2, borderColor: colors.white},
  body: {flex: 1, padding: spacing.lg},
  orderCard: {overflow: 'hidden'},
  orderIdBlock: {padding: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.border},
  orderIdLabel: {...typography.overline, color: colors.textSecondary, letterSpacing: 0.8},
  orderIdValue: {...typography.h3, fontSize: 26, color: colors.textPrimary, marginTop: spacing.xxs},
  addressBlock: {padding: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.border, gap: spacing.md},
  addressRow: {flexDirection: 'row', gap: spacing.sm},
  addressRowSpaced: {},
  addressText: {flex: 1, gap: 2},
  addressLabel: {...typography.overline, color: colors.textSecondary},
  addressValue: {...typography.labelSemibold, fontSize: 14, color: colors.textPrimary},
  routeRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm, padding: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.border},
  routeText: {...typography.label, color: colors.textSecondary, flex: 1},
  routeStrong: {...typography.labelSemibold, color: colors.textPrimary},
  metricsRow: {flexDirection: 'row', gap: spacing.sm, padding: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.border},
  metric: {flex: 1, backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, paddingVertical: spacing.sm, alignItems: 'center'},
  metricValue: {...typography.bodyLgMedium, fontSize: 15, color: colors.textPrimary},
  metricLabel: {...typography.caption, color: colors.textSecondary, marginTop: 2},
  paymentRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm, padding: spacing.lg},
  paymentLabel: {...typography.label, color: colors.textSecondary},
  footer: {padding: spacing.lg, gap: spacing.sm},
  footerButtons: {flexDirection: 'row', gap: spacing.sm},
  callButton: {flex: 1},
  navigateButton: {flex: 2},
  footerHint: {...typography.caption, color: colors.textSecondary, textAlign: 'center'},
  footerHintStrong: {color: colors.warning, fontWeight: '600'},
});
