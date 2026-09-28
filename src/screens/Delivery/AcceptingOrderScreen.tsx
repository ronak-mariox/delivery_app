import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {DeliveryOrder, useOrders} from '../../context/OrdersContext';

type Props = NativeStackScreenProps<RootStackParamList, 'AcceptingOrder'>;

const MIN_VISIBLE_MS = 900;

export function AcceptingOrderScreen({route, navigation}: Props) {
  const {orderId} = route.params;
  const {getOrder, acceptOrder} = useOrders();
  const [preview, setPreview] = useState<DeliveryOrder | null>(null);

  useEffect(() => {
    let cancelled = false;
    getOrder(orderId)
      .then((o) => {
        if (!cancelled) {setPreview(o);}
      })
      .catch(() => {});

    const startedAt = Date.now();
    acceptOrder(orderId)
      .then(() => {
        const elapsed = Date.now() - startedAt;
        const wait = Math.max(0, MIN_VISIBLE_MS - elapsed);
        setTimeout(() => {
          if (!cancelled) {navigation.replace('OrderAccepted', {orderId});}
        }, wait);
      })
      .catch(() => {
        if (!cancelled) {navigation.replace('AssignmentFailed', {orderId});}
      });

    return () => {
      cancelled = true;
    };
  }, [navigation, orderId, getOrder, acceptOrder]);

  const distanceLabel = (() => {
    const p = preview;
    if (!p?.pickup.latitude || !p.pickup.longitude || !p.address.latitude || !p.address.longitude) {return '—';}
    const km = haversineKm(p.pickup.latitude, p.pickup.longitude, p.address.latitude, p.address.longitude);
    return `${km.toFixed(1)} km · ~${Math.max(5, Math.round(km * 4))} min`;
  })();

  return (
    <Screen backgroundColor={colors.background} edges={['top', 'bottom']} contentContainerStyle={styles.container}>
      <View style={styles.iconOuter}>
        <View style={[styles.ring, styles.ringOuter]} />
        <View style={[styles.ring, styles.ringMid]} />
        <View style={styles.iconInner}>
          <Icon name="check" size={36} color={colors.white} />
        </View>
      </View>
      <Text style={styles.title}>{'Accepting Order…'}</Text>
      <Text style={styles.subtitle}>Confirming with the platform and reserving this order for you.</Text>

      <View style={styles.card}>
        <View style={styles.cardTopRow}>
          <View>
            <Text style={styles.cardLabel}>ORDER</Text>
            <Text style={styles.cardOrderId}>#{preview?.orderNumber ?? orderId}</Text>
          </View>
          <View style={styles.cardBadge}>
            <Text style={styles.cardBadgeText}>₹{preview?.driverEarnings?.total ?? preview?.pricing.deliveryFee ?? '—'}</Text>
          </View>
        </View>
        <View style={styles.cardRows}>
          <Row label="Pickup" value={preview?.pickup.name ?? '—'} />
          <Row label="Drop" value={preview?.address.city ?? '—'} />
          <Row label="Distance" value={distanceLabel} />
        </View>
      </View>

      <View style={styles.dots}>
        <View style={[styles.dot, styles.dotActive]} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>
      <Text style={styles.footnote}>Please do not navigate away</Text>
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

function Row({label, value}: {label: string; value: string}) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xxl},
  iconOuter: {width: 120, height: 120, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xl},
  ring: {position: 'absolute', borderRadius: 100, borderWidth: 3, borderColor: colors.primary},
  ringOuter: {width: 152, height: 152, opacity: 0.07},
  ringMid: {width: 136, height: 136, opacity: 0.15},
  iconInner: {width: 72, height: 72, borderRadius: 36, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center'},
  title: {...typography.h2, color: colors.textPrimary, textAlign: 'center'},
  subtitle: {...typography.body, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.sm, marginBottom: spacing.xxl},
  card: {width: '100%', backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.xxl, padding: spacing.lg, marginBottom: spacing.xxl},
  cardTopRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start'},
  cardLabel: {...typography.overline, fontSize: 11, color: colors.textMuted, letterSpacing: 0.4},
  cardOrderId: {...typography.title, fontSize: 15, color: colors.textPrimary, marginTop: 2},
  cardBadge: {backgroundColor: colors.primarySurface, borderRadius: radius.md, paddingHorizontal: spacing.md, paddingVertical: spacing.xs},
  cardBadgeText: {...typography.title, fontSize: 18, color: colors.primary},
  cardRows: {gap: spacing.sm, marginTop: spacing.md},
  row: {flexDirection: 'row', justifyContent: 'space-between'},
  rowLabel: {...typography.caption, color: colors.textMuted},
  rowValue: {...typography.captionMedium, color: colors.textLabel},
  dots: {flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg},
  dot: {width: 8, height: 8, borderRadius: 4, backgroundColor: colors.border},
  dotActive: {width: 24, backgroundColor: colors.primary},
  footnote: {...typography.label, color: colors.textMuted},
});
