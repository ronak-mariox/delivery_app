import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {DeliveryOrder, useOrders} from '../../context/OrdersContext';
import {useDriverAuth} from '../../context/DriverAuthContext';

type Props = NativeStackScreenProps<RootStackParamList, 'OrderPickedUp'>;

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatTime(iso?: string): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleTimeString([], {hour: 'numeric', minute: '2-digit'});
}

export function OrderPickedUpScreen({route, navigation}: Props) {
  const {orderId} = route.params;
  const {getOrder} = useOrders();
  const {driver} = useDriverAuth();
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

  const firstName = driver?.fullName?.split(' ')[0];

  const distanceKm =
    order?.pickup.latitude != null &&
    order?.pickup.longitude != null &&
    order?.address.latitude != null &&
    order?.address.longitude != null
      ? haversineKm(order.pickup.latitude, order.pickup.longitude, order.address.latitude, order.address.longitude)
      : null;

  return (
    <Screen backgroundColor={colors.primary} statusBarStyle="light-content" edges={['top', 'bottom']}>
      <View style={styles.header}>
        <View style={styles.checkRing}>
          <Icon name="check" size={28} color={colors.white} />
        </View>
        <Text style={styles.headerTitle}>Order Picked Up!</Text>
        <Text style={styles.headerSubtitle}>{firstName ? `Great job, ${firstName}! ` : ''}Time to deliver.</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>PICKUP SUMMARY</Text>
          <Row label="Pickup time" value={formatTime(order?.pickupConfirmedAt)} />
          <Row label="Verification" value="Completed" />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>DELIVERY DETAILS</Text>
          <Row label="Customer area" value={order?.address.city ?? '—'} />
          {distanceKm != null && <Row label="Distance" value={`${distanceKm.toFixed(1)} km`} />}
          <Row
            label="Payment"
            value={order?.paymentMethod === 'cod' ? `COD · ₹${order.pricing.grandTotal}` : 'Paid Online'}
            valueColor={colors.primary}
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label="Navigate to Customer"
          icon="arrow-right"
          iconPosition="right"
          onPress={() => navigation.navigate('CustomerDeliveryDetails', {orderId})}
        />
      </View>
    </Screen>
  );
}

function Row({label, value, valueColor}: {label: string; value: string; valueColor?: string}) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={[styles.rowValue, valueColor && {color: valueColor}]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {flex: 1},
  header: {backgroundColor: colors.primary, alignItems: 'center', paddingBottom: spacing.xxl},
  checkRing: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 2.5,
    borderColor: 'rgba(255,255,255,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  headerTitle: {...typography.h4, fontSize: 22, color: colors.white},
  headerSubtitle: {...typography.body, color: 'rgba(255,255,255,0.85)', marginTop: spacing.xxs},
  body: {backgroundColor: colors.background, padding: spacing.lg, gap: spacing.md},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg},
  cardLabel: {...typography.overline, color: colors.textSecondary, letterSpacing: 0.4, marginBottom: spacing.sm},
  row: {flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.xs},
  rowLabel: {...typography.label, color: colors.textSecondary},
  rowValue: {...typography.labelSemibold, color: colors.textPrimary},
  footer: {padding: spacing.lg, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border},
});
