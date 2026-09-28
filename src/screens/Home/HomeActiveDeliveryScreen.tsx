import React, {useEffect, useState} from 'react';
import {Linking, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {DeliveryOrder, useOrders} from '../../context/OrdersContext';
import {useDriverAuth} from '../../context/DriverAuthContext';
import {api} from '../../services/api';

type Props = NativeStackScreenProps<RootStackParamList, 'HomeActiveDelivery'>;

interface HomeSummary {
  todayEarnings: number;
  todayDeliveries: number;
}

export function HomeActiveDeliveryScreen({route, navigation}: Props) {
  const {orderId} = route.params;
  const {driver} = useDriverAuth();
  const {getOrder} = useOrders();
  const [order, setOrder] = useState<DeliveryOrder | null>(null);
  const [summary, setSummary] = useState<HomeSummary | null>(null);

  useEffect(() => {
    let cancelled = false;
    getOrder(orderId)
      .then((o) => {
        if (!cancelled) {setOrder(o);}
      })
      .catch(() => {});
    api
      .get<HomeSummary>('/driver/home-summary')
      .then((res) => {
        if (!cancelled) {setSummary(res.data);}
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [orderId, getOrder]);

  const isOutForDelivery = order?.status === 'out_for_delivery';
  const itemCount = order?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
  const earnings = order?.driverEarnings?.total ?? order?.pricing.deliveryFee;
  const distanceKm = (() => {
    if (!order?.pickup.latitude || !order.pickup.longitude || !order.address.latitude || !order.address.longitude) {return null;}
    return haversineKm(order.pickup.latitude, order.pickup.longitude, order.address.latitude, order.address.longitude);
  })();
  const etaMin = distanceKm != null ? Math.max(5, Math.round(distanceKm * 4)) : null;

  const contactPhone = isOutForDelivery ? order?.address.contactPhone : order?.pickup.phone;

  return (
    <Screen backgroundColor={colors.primary} statusBarStyle="light-content" edges={['top', 'bottom']}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatar}>
            <Icon name="user" size={18} color={colors.white} />
          </View>
          <View>
            <Text style={styles.headerCaption}>Delivering now</Text>
            <Text style={styles.headerName}>{driver?.fullName ?? 'Driver'}</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.activeBadge}>
            <View style={styles.activeDot} />
            <Text style={styles.activeBadgeText}>ACTIVE</Text>
          </View>
          <TouchableOpacity style={styles.bellButton} onPress={() => navigation.navigate('Notifications')}>
            <Icon name="bell" size={16} color={colors.white} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.deliveryCard}>
          <View style={styles.deliveryCardHeader}>
            <View style={styles.deliveryCardHeaderLeft}>
              <Icon name="bicycle" size={16} color={colors.white} />
              <Text style={styles.deliveryCardHeaderTitle}>Active Delivery</Text>
            </View>
            <Text style={styles.deliveryCardHeaderOrder}>Order #{order?.orderNumber ?? orderId}</Text>
          </View>

          <View style={styles.deliveryBody}>
            <View style={styles.routeRow}>
              <View style={styles.routeLine}>
                <View style={styles.routeDotPickup} />
                <View style={styles.routeConnector} />
                <View style={styles.routeDotDrop} />
              </View>
              <View style={styles.routeText}>
                <Text style={styles.routeLabel}>PICKUP</Text>
                <Text style={styles.routeTitle}>{order?.pickup.name ?? 'Store'}</Text>
                <Text style={styles.routeSubtitle}>{order?.pickup.address ?? '—'}</Text>
                <View style={styles.routeSpacer} />
                <Text style={styles.routeLabel}>DELIVER TO</Text>
                <Text style={styles.routeTitle}>{order?.address.contactName ?? 'Customer'}</Text>
                <Text style={styles.routeSubtitle}>{order ? `${order.address.line1}, ${order.address.city}` : '—'}</Text>
              </View>
            </View>

            <View style={styles.statusRow}>
              <View>
                <Text style={styles.statusLabel}>Current status</Text>
                <Text style={styles.statusValue}>{isOutForDelivery ? 'Heading to Customer' : 'Heading to Pickup'}</Text>
              </View>
              <View style={styles.statusRight}>
                <Text style={styles.statusLabel}>ETA</Text>
                <Text style={styles.etaValue}>{etaMin != null ? `${etaMin} min` : '—'}</Text>
              </View>
            </View>

            <View style={styles.metricsRow}>
              <Metric value={distanceKm != null ? `${distanceKm.toFixed(1)} km` : '—'} label="Distance" />
              <Metric value={earnings != null ? `₹${earnings}` : '—'} label="Earnings" />
              <Metric value={String(itemCount || '—')} label="Items" />
            </View>
          </View>

          <View style={styles.deliveryActions}>
            <DeliveryAction
              icon="phone"
              label="Call"
              bordered
              disabled={!contactPhone}
              onPress={() => contactPhone && Linking.openURL(`tel:${contactPhone}`).catch(() => {})}
            />
            <DeliveryAction
              icon="message-circle"
              label="Message"
              bordered
              disabled={!contactPhone}
              onPress={() => contactPhone && Linking.openURL(`sms:${contactPhone}`).catch(() => {})}
            />
            <DeliveryAction icon="alert-circle" label="Issue" danger onPress={() => navigation.navigate('SelectIssueReason', {orderId})} />
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statTile}>
            <Text style={styles.statValue}>₹{summary?.todayEarnings ?? 0}</Text>
            <Text style={styles.statLabel}>Today's Earnings</Text>
          </View>
          <View style={styles.statTile}>
            <Text style={[styles.statValue, styles.statValueDark]}>{summary?.todayDeliveries ?? 0}</Text>
            <Text style={styles.statLabel}>Today's Orders</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          label={isOutForDelivery ? 'Navigate to Customer' : 'Navigate to Pickup'}
          icon="navigation"
          onPress={() => navigation.navigate(isOutForDelivery ? 'CustomerDeliveryDetails' : 'NavigateToStore', {orderId})}
        />
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

function DeliveryAction({
  icon,
  label,
  danger,
  bordered,
  disabled,
  onPress,
}: {
  icon: React.ComponentProps<typeof Icon>['name'];
  label: string;
  danger?: boolean;
  bordered?: boolean;
  disabled?: boolean;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.deliveryAction, bordered && styles.deliveryActionBordered, disabled && styles.deliveryActionDisabled]}
      activeOpacity={0.8}
      disabled={disabled}
      onPress={onPress}>
      <Icon name={icon} size={15} color={danger ? colors.danger : colors.textSecondary} />
      <Text style={[styles.deliveryActionText, danger && styles.deliveryActionTextDanger]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  header: {backgroundColor: colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.xl, paddingTop: spacing.lg, paddingBottom: spacing.md},
  headerLeft: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm},
  avatar: {width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(255,255,255,0.15)', borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)', alignItems: 'center', justifyContent: 'center'},
  headerCaption: {...typography.caption, fontSize: 11, color: 'rgba(255,255,255,0.7)'},
  headerName: {...typography.bodyBold, fontSize: 13, color: colors.white},
  headerRight: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm},
  activeBadge: {flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: 4},
  activeDot: {width: 7, height: 7, borderRadius: 3.5, backgroundColor: '#A7F3D0'},
  activeBadgeText: {...typography.overline, fontSize: 11, color: colors.white},
  bellButton: {width: 34, height: 34, borderRadius: radius.md, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center'},
  body: {flex: 1, padding: spacing.lg, gap: spacing.md, backgroundColor: colors.background},
  deliveryCard: {backgroundColor: colors.surface, borderWidth: 2, borderColor: colors.primary, borderRadius: radius.xxl, overflow: 'hidden'},
  deliveryCardHeader: {backgroundColor: colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingVertical: spacing.sm},
  deliveryCardHeaderLeft: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm},
  deliveryCardHeaderTitle: {...typography.captionSemibold, color: colors.white},
  deliveryCardHeaderOrder: {...typography.captionSemibold, color: '#A7F3D0'},
  deliveryBody: {padding: spacing.lg, gap: spacing.md},
  routeRow: {flexDirection: 'row', gap: spacing.md},
  routeLine: {alignItems: 'center', paddingTop: 3},
  routeDotPickup: {width: 12, height: 12, borderRadius: 6, backgroundColor: colors.primary, borderWidth: 2, borderColor: colors.white},
  routeConnector: {width: 2, flex: 1, backgroundColor: colors.border, minHeight: 30},
  routeDotDrop: {width: 12, height: 12, borderRadius: 6, backgroundColor: colors.danger, borderWidth: 2, borderColor: colors.white},
  routeText: {flex: 1},
  routeLabel: {...typography.overline, fontSize: 11, color: colors.textMuted, letterSpacing: 0.4},
  routeTitle: {...typography.labelSemibold, color: colors.textPrimary, marginTop: 1},
  routeSubtitle: {...typography.caption, color: colors.textSecondary},
  routeSpacer: {height: spacing.md},
  statusRow: {flexDirection: 'row', justifyContent: 'space-between', backgroundColor: colors.primarySurface, borderRadius: radius.md, padding: spacing.md},
  statusRight: {alignItems: 'flex-end'},
  statusLabel: {...typography.caption, fontSize: 11, color: colors.textSecondary},
  statusValue: {...typography.bodyBold, fontSize: 13, color: colors.primary, marginTop: 1},
  etaValue: {...typography.title, fontSize: 16, color: colors.textPrimary, marginTop: 1},
  metricsRow: {flexDirection: 'row', gap: spacing.sm},
  metric: {flex: 1, backgroundColor: colors.background, borderRadius: radius.sm, paddingVertical: spacing.sm, alignItems: 'center'},
  metricValue: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary},
  metricLabel: {...typography.caption, fontSize: 10, color: colors.textMuted, marginTop: 1},
  deliveryActions: {flexDirection: 'row', borderTopWidth: 1, borderTopColor: colors.border},
  deliveryAction: {flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, height: 48},
  deliveryActionBordered: {borderRightWidth: 1, borderRightColor: colors.border},
  deliveryActionDisabled: {opacity: 0.4},
  deliveryActionText: {...typography.label, color: colors.textSecondary},
  deliveryActionTextDanger: {color: colors.danger, fontWeight: '600'},
  statsRow: {flexDirection: 'row', gap: spacing.sm},
  statTile: {flex: 1, backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.md},
  statValue: {...typography.h4, fontSize: 20, color: colors.primary},
  statValueDark: {color: colors.textPrimary},
  statLabel: {...typography.caption, color: colors.textMuted, marginTop: 2},
  footer: {padding: spacing.lg, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border},
});
