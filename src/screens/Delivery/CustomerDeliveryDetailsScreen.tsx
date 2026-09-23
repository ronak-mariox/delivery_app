import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Avatar, Badge, Button, Card, Icon} from '../../components';
import {Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {DeliveryOrder, useOrders} from '../../context/OrdersContext';

type Props = NativeStackScreenProps<RootStackParamList, 'CustomerDeliveryDetails'>;

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function initialsFor(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');
}

export function CustomerDeliveryDetailsScreen({route, navigation}: Props) {
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

  const customerName = order?.address.contactName ?? 'Customer';
  const addressLine = order
    ? [order.address.line1, order.address.line2, order.address.city].filter(Boolean).join(', ')
    : '';

  const distanceKm =
    order?.pickup.latitude != null &&
    order?.pickup.longitude != null &&
    order?.address.latitude != null &&
    order?.address.longitude != null
      ? haversineKm(order.pickup.latitude, order.pickup.longitude, order.address.latitude, order.address.longitude)
      : null;

  return (
    <Screen backgroundColor={colors.primary} statusBarStyle="light-content" edges={['top', 'bottom']} scroll>
      <View style={styles.header}>
        <Text style={styles.headerLabel}>ACTIVE DELIVERY</Text>
        <Text style={styles.headerOrder}>#{order?.orderNumber ?? orderId}</Text>
        <Text style={styles.headerSubtitle}>Delivering to Customer</Text>
      </View>

      <View style={styles.body}>
        <Card elevated bordered={false} style={styles.card}>
          <View style={styles.customerRow}>
            <Avatar initials={initialsFor(customerName)} size={56} />
            <View style={styles.customerInfo}>
              <Text style={styles.customerName}>{customerName}</Text>
              {!!addressLine && <Text style={styles.customerAddress}>{addressLine}</Text>}
            </View>
          </View>
          {distanceKm != null && (
            <View style={styles.metaRow}>
              <Icon name="navigation" size={16} color={colors.textPrimary} />
              <Text style={styles.metaText}>{distanceKm.toFixed(1)} km</Text>
            </View>
          )}
          <View style={styles.actionRow}>
            <ActionButton icon="phone" label="Call" onPress={() => navigation.navigate('CallCustomer', {orderId})} />
            <ActionButton icon="message-circle" label="Message" onPress={() => navigation.navigate('MessageCustomer', {orderId})} />
            <ActionButton icon="navigation" label="Navigate" onPress={() => navigation.navigate('CustomerStartNavigation', {orderId})} />
          </View>
        </Card>

        {!!order?.specialInstructions && (
          <Card elevated bordered={false} style={styles.card}>
            <Text style={styles.sectionTitle}>Delivery Instructions</Text>
            <View style={styles.instructionRow}>
              <Icon name="bell" size={18} color={colors.textSecondary} />
              <Text style={styles.instructionText}>{order.specialInstructions}</Text>
            </View>
          </Card>
        )}

        <Card elevated bordered={false} style={styles.card}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          {(order?.items ?? []).map(item => (
            <View key={`${item.productId}-${item.variantId}`} style={styles.itemRow}>
              <Text style={styles.itemName}>
                {item.name} {item.quantity > 1 ? `×${item.quantity}` : ''}
              </Text>
              <Text style={styles.itemPrice}>₹{item.subtotal}</Text>
            </View>
          ))}
          <View style={[styles.itemRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <View style={styles.totalValueRow}>
              <Text style={styles.totalValue}>₹{order?.pricing.grandTotal ?? '—'}</Text>
              <Badge
                label={order?.paymentMethod === 'cod' ? 'COD' : 'Paid Online'}
                tone={order?.paymentMethod === 'cod' ? 'warning' : 'success'}
              />
            </View>
          </View>
        </Card>

        {order?.driverEarnings && (
          <Card bordered style={[styles.card, styles.earningsCard]}>
            <Text style={styles.sectionTitle}>Your Earnings</Text>
            <Text style={styles.earningsValue}>₹{order.driverEarnings.total}</Text>
            <Text style={styles.earningsHint}>on delivery</Text>
            <View style={styles.earningsChips}>
              <Chip label={`Base ₹${order.driverEarnings.base}`} />
              <Chip label={`Distance ₹${order.driverEarnings.distance}`} />
              {order.driverEarnings.incentiveBonus > 0 && <Chip label={`Incentive ₹${order.driverEarnings.incentiveBonus}`} />}
            </View>
          </Card>
        )}
      </View>

      <View style={styles.footer}>
        <Button
          label="Call"
          variant="outline"
          fullWidth={false}
          style={styles.callButton}
          onPress={() => navigation.navigate('CallCustomer', {orderId})}
        />
        <Button
          label="Navigate to Customer →"
          fullWidth={false}
          style={styles.navigateButton}
          onPress={() => navigation.navigate('CustomerStartNavigation', {orderId})}
        />
      </View>
    </Screen>
  );
}

function ActionButton({
  icon,
  label,
  onPress,
}: {
  icon: React.ComponentProps<typeof Icon>['name'];
  label: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity style={styles.actionButton} activeOpacity={0.8} onPress={onPress}>
      <Icon name={icon} size={20} color={colors.primary} />
      <Text style={styles.actionButtonLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

function Chip({label}: {label: string}) {
  return (
    <View style={styles.chip}>
      <Text style={styles.chipText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {backgroundColor: colors.primary, padding: spacing.xl, paddingTop: spacing.xxl, gap: 2},
  headerLabel: {...typography.caption, color: 'rgba(255,255,255,0.75)', letterSpacing: 0.5},
  headerOrder: {...typography.h4, color: colors.white},
  headerSubtitle: {...typography.label, color: 'rgba(255,255,255,0.85)'},
  body: {padding: spacing.lg, gap: spacing.md, backgroundColor: colors.background},
  card: {gap: spacing.md},
  customerRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.md},
  customerInfo: {flex: 1},
  customerName: {...typography.title, fontSize: 18, color: colors.textPrimary},
  customerAddress: {...typography.label, color: colors.textSecondary, marginTop: 2},
  metaRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm, borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.border, paddingVertical: spacing.sm},
  metaText: {...typography.labelSemibold, color: colors.textPrimary},
  metaDot: {width: 4, height: 4, borderRadius: 2, backgroundColor: colors.textSecondary},
  actionRow: {flexDirection: 'row', gap: spacing.sm},
  actionButton: {flex: 1, borderWidth: 1.5, borderColor: colors.primary, borderRadius: radius.md, alignItems: 'center', paddingVertical: spacing.sm, gap: 4},
  actionButtonLabel: {...typography.captionSemibold, color: colors.primary},
  sectionTitle: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary},
  instructionRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm},
  instructionText: {...typography.label, color: colors.textPrimary, flex: 1},
  divider: {height: 1, backgroundColor: colors.border},
  itemRow: {flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: colors.border},
  itemName: {...typography.label, color: colors.textPrimary},
  itemPrice: {...typography.labelSemibold, color: colors.textPrimary},
  totalRow: {borderBottomWidth: 0, paddingTop: spacing.sm},
  totalLabel: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary},
  totalValueRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm},
  totalValue: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary},
  earningsCard: {backgroundColor: colors.primarySurfaceAlt, borderColor: colors.primaryBorder},
  earningsValue: {...typography.h3, fontSize: 28, color: colors.primary},
  earningsHint: {...typography.caption, color: colors.textSecondary, marginTop: -spacing.sm},
  earningsChips: {flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xs},
  chip: {backgroundColor: colors.background, borderRadius: radius.sm, paddingHorizontal: spacing.sm, paddingVertical: 4},
  chipText: {...typography.caption, color: colors.textSecondary},
  footer: {flexDirection: 'row', gap: spacing.sm, padding: spacing.lg, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border},
  callButton: {flex: 1},
  navigateButton: {flex: 2},
});
