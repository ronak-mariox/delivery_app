import React, {useEffect} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, EmptyState, Loader, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {DeliveryOrder, useOrders} from '../../context/OrdersContext';

type Props = NativeStackScreenProps<RootStackParamList, 'MultipleOrders'>;

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function offerMetrics(order: DeliveryOrder) {
  const pay = order.driverEarnings?.total ?? order.pricing.deliveryFee;
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
  let distanceKm: number | null = null;
  if (
    order.pickup.latitude != null &&
    order.pickup.longitude != null &&
    order.address.latitude != null &&
    order.address.longitude != null
  ) {
    distanceKm = haversineKm(order.pickup.latitude, order.pickup.longitude, order.address.latitude, order.address.longitude);
  }
  return {pay, itemCount, distanceKm};
}

export function MultipleOrdersScreen({navigation}: Props) {
  const {availableOrders, isLoadingAvailable, refreshAvailable} = useOrders();

  useEffect(() => {
    refreshAvailable();
  }, [refreshAvailable]);

  return (
    <Screen backgroundColor={colors.dark900} edges={['top', 'bottom']} scroll={availableOrders.length > 0}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerLabel}>ORDERS AVAILABLE</Text>
          <Text style={styles.headerTitle}>Choose your next order</Text>
        </View>
        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeText}>{`${availableOrders.length} new`}</Text>
        </View>
      </View>

      {isLoadingAvailable && <Loader label="Loading orders…" fullscreen />}

      {!isLoadingAvailable && availableOrders.length === 0 && (
        <EmptyState icon="scooter" title="No orders right now" description="New orders will show up here as soon as they're ready for pickup." />
      )}

      {!isLoadingAvailable && availableOrders.length > 0 && (
        <View style={styles.body}>
          {availableOrders.map(order => {
            const {pay, itemCount, distanceKm} = offerMetrics(order);
            return (
              <View key={order.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={styles.cardHeaderLeft}>
                    <Text style={styles.storeText} numberOfLines={1}>
                      {order.pickup.name}
                    </Text>
                    <View style={styles.itemsTag}>
                      <Text style={styles.itemsTagText}>{`${itemCount} item${itemCount === 1 ? '' : 's'}`}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.cardBody}>
                  <View style={styles.routeLine}>
                    <View style={styles.routeDotPickup} />
                    <View style={styles.routeConnector} />
                    <View style={styles.routeDotDrop} />
                  </View>
                  <View style={styles.routeText}>
                    <Text style={styles.routeLine1} numberOfLines={1}>
                      {order.pickup.name}
                    </Text>
                    <Text style={styles.routeLine2} numberOfLines={1}>
                      {order.address.city}
                    </Text>
                  </View>
                </View>

                <View style={styles.metricsRow}>
                  <View style={styles.metric}>
                    <Text style={styles.metricValuePay}>{`₹${pay}`}</Text>
                    <Text style={styles.metricLabel}>Pay</Text>
                  </View>
                  <View style={styles.metricPlain}>
                    <Text style={styles.metricValue}>{distanceKm != null ? `${distanceKm.toFixed(1)} km` : '—'}</Text>
                    <Text style={styles.metricLabel}>Distance</Text>
                  </View>
                  <View style={styles.metricPlain}>
                    <Text style={styles.metricValue}>{distanceKm != null ? `${Math.max(5, Math.round(distanceKm * 4))} min` : '—'}</Text>
                    <Text style={styles.metricLabel}>Est. Time</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.acceptButton}
                    activeOpacity={0.85}
                    onPress={() => navigation.replace('AcceptingOrder', {orderId: order.id})}>
                    <Text style={styles.acceptButtonText}>Accept</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>
      )}

      <View style={styles.footer}>
        <Button
          label="Skip All — Wait for Next"
          variant="secondary"
          style={styles.skipButton}
          textColor={colors.textMuted}
          onPress={() => navigation.reset({index: 0, routes: [{name: 'Home'}]})}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {backgroundColor: colors.dark900, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', paddingHorizontal: spacing.xl, paddingTop: spacing.xl, paddingBottom: spacing.md},
  headerLabel: {...typography.overline, fontSize: 11, color: colors.dark600, letterSpacing: 0.5},
  headerTitle: {...typography.title, fontSize: 18, color: colors.white, marginTop: 2},
  headerBadge: {backgroundColor: colors.dark800, borderRadius: radius.md, paddingHorizontal: spacing.md, paddingVertical: spacing.xs},
  headerBadgeText: {...typography.bodyBold, fontSize: 14, color: colors.primary},
  body: {padding: spacing.lg, gap: spacing.md, backgroundColor: colors.dark900},
  card: {backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.xxl, overflow: 'hidden'},
  cardHeader: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#F3F4F6', paddingHorizontal: spacing.md, paddingVertical: spacing.sm},
  cardHeaderLeft: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flexShrink: 1},
  storeText: {...typography.captionSemibold, color: colors.textLabel, flexShrink: 1},
  itemsTag: {backgroundColor: colors.background, borderRadius: 4, paddingHorizontal: spacing.xs, paddingVertical: 1},
  itemsTagText: {...typography.micro, fontSize: 10, color: colors.textMuted},
  cardBody: {flexDirection: 'row', gap: spacing.sm, padding: spacing.md},
  routeLine: {alignItems: 'center', paddingTop: 3, gap: 2},
  routeDotPickup: {width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary},
  routeConnector: {width: 1, height: 18, backgroundColor: colors.border},
  routeDotDrop: {width: 8, height: 8, borderRadius: 4, backgroundColor: colors.danger},
  routeText: {flex: 1, gap: spacing.sm},
  routeLine1: {...typography.caption, fontSize: 12, color: colors.textLabel},
  routeLine2: {...typography.caption, fontSize: 12, color: colors.textLabel},
  metricsRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingHorizontal: spacing.md, paddingBottom: spacing.md},
  metric: {flex: 1, backgroundColor: colors.primarySurface, borderWidth: 1, borderColor: colors.primaryBorder, borderRadius: radius.sm, paddingVertical: spacing.xs, alignItems: 'center'},
  metricPlain: {flex: 1, backgroundColor: colors.background, borderRadius: radius.sm, paddingVertical: spacing.xs, alignItems: 'center'},
  metricValuePay: {...typography.captionSemibold, color: colors.primary},
  metricValue: {...typography.captionSemibold, color: colors.textPrimary},
  metricLabel: {...typography.micro, fontSize: 9, color: colors.textMuted, marginTop: 1},
  acceptButton: {backgroundColor: colors.primary, borderRadius: radius.sm, height: 44, paddingHorizontal: spacing.md, alignItems: 'center', justifyContent: 'center'},
  acceptButtonText: {...typography.bodyBold, fontSize: 13, color: colors.white},
  footer: {padding: spacing.lg, backgroundColor: colors.dark900, borderTopWidth: 1, borderTopColor: colors.dark800},
  skipButton: {backgroundColor: colors.dark800, borderColor: colors.dark800},
});
