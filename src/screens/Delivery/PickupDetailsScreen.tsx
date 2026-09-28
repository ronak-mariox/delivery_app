import React, {useEffect, useState} from 'react';
import {Linking, ScrollView, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Badge, Button, IconBackButton} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {DeliveryOrder, useOrders} from '../../context/OrdersContext';

type Props = NativeStackScreenProps<RootStackParamList, 'PickupDetails'>;

export function PickupDetailsScreen({route, navigation}: Props) {
  const {orderId} = route.params;
  const {getOrder} = useOrders();
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

  const storeName = order?.pickup.name ?? 'Store';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconBackButton onPress={() => navigation.goBack()} />
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Pickup Details</Text>
          <Text style={styles.headerSubtitle}>Order #{order?.orderNumber ?? orderId}</Text>
        </View>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.storeName}>{storeName}</Text>
          {!!order?.pickup.address && <Text style={styles.storeAddress}>{order.pickup.address}</Text>}
          <View style={styles.actionsRow}>
            <Button
              label="Call Store"
              variant="secondary"
              icon="phone"
              size="md"
              disabled={!order?.pickup.phone}
              style={styles.actionButton}
              onPress={() => {
                if (order?.pickup.phone) {
                  Linking.openURL(`tel:${order.pickup.phone}`).catch(() => {});
                }
              }}
            />
            <Button
              label="Directions"
              variant="secondary"
              icon="map"
              size="md"
              style={styles.actionButton}
              onPress={() => navigation.navigate('NavigateToStore', {orderId})}
            />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>ORDER SUMMARY</Text>
          <View style={styles.orderIdRow}>
            <Text style={styles.orderIdLabel}>Order ID:</Text>
            <Text style={styles.orderIdValue}>#{order?.orderNumber ?? orderId}</Text>
          </View>
          {(order?.items ?? []).map((item, index) => (
            <View key={`${item.productId}-${item.variantId}`} style={[styles.itemRow, index > 0 && styles.itemRowBorder]}>
              <Text style={styles.itemName}>
                {item.name} × {item.quantity}
              </Text>
              <Text style={styles.itemPrice}>₹{item.subtotal}</Text>
            </View>
          ))}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total: ₹{order?.pricing.grandTotal ?? '—'}</Text>
            <Badge
              label={order?.paymentMethod === 'cod' ? `COD · ₹${order.pricing.grandTotal}` : 'Paid Online'}
              tone="success"
            />
          </View>
        </View>

        {!!order?.specialInstructions && (
          <View style={styles.card}>
            <Text style={styles.cardLabel}>PICKUP INSTRUCTIONS</Text>
            <Text style={styles.instructionText}>{order.specialInstructions}</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label="Need Help"
          variant="secondary"
          icon="headphones"
          style={styles.helpButton}
          fullWidth={false}
          onPress={() => navigation.navigate('SelectIssueReason', {orderId})}
        />
        <Button
          label="Navigate"
          icon="navigation"
          style={styles.navigateButton}
          fullWidth={false}
          onPress={() => navigation.navigate('NavigateToStore', {orderId})}
        />
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
    paddingHorizontal: spacing.lg,
    paddingTop: 52,
    paddingBottom: spacing.md,
  },
  headerText: {flex: 1},
  headerTitle: {...typography.titleSm, color: colors.textPrimary},
  headerSubtitle: {...typography.label, color: colors.textSecondary, marginTop: 1},
  body: {padding: spacing.lg, gap: spacing.md},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.xxl, padding: spacing.lg},
  storeName: {...typography.title, fontSize: 16, color: colors.textPrimary},
  storeAddress: {...typography.label, color: colors.textSecondary, marginTop: 2},
  actionsRow: {flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md},
  actionButton: {flex: 1, height: 40},
  cardLabel: {...typography.overline, color: colors.textSecondary, letterSpacing: 0.8, marginBottom: spacing.md},
  orderIdRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.xs, borderBottomWidth: 1, borderBottomColor: colors.border, paddingBottom: spacing.md, marginBottom: spacing.sm},
  orderIdLabel: {...typography.label, color: colors.textSecondary},
  orderIdValue: {...typography.labelSemibold, color: colors.textPrimary, flex: 1},
  itemRow: {flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.sm},
  itemRowBorder: {},
  itemName: {...typography.body, color: colors.textPrimary, flex: 1},
  itemPrice: {...typography.bodySemibold, color: colors.textPrimary},
  totalRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.md, marginTop: spacing.xs},
  totalLabel: {...typography.bodyLgMedium, fontSize: 15, color: colors.textPrimary},
  instructionText: {...typography.body, color: colors.textPrimary},
  footer: {flexDirection: 'row', gap: spacing.sm, padding: spacing.lg, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border},
  helpButton: {flex: 1},
  navigateButton: {flex: 2},
});
