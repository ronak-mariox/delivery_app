import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {DeliveryOrder, useOrders} from '../../context/OrdersContext';

type Props = NativeStackScreenProps<RootStackParamList, 'OrderReady'>;

export function OrderReadyScreen({route, navigation}: Props) {
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

  const itemCount = order?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
  const storeName = order?.pickup.name ?? 'Store';

  return (
    <Screen backgroundColor={colors.primary} statusBarStyle="light-content" edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Text style={styles.headerStore}>{storeName}</Text>
        <Text style={styles.headerTitle}>Order is Ready!</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.banner}>
          <View style={styles.bannerIcon}>
            <Icon name="check" size={18} color={colors.white} />
          </View>
          <Text style={styles.bannerText}>Your order has been packed and is ready for pickup</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>ORDER ITEMS ({itemCount})</Text>
          {(order?.items ?? []).map((item) => (
            <View key={`${item.productId}-${item.variantId}`} style={styles.itemRow}>
              <View style={styles.itemCheck}>
                <Icon name="check" size={12} color={colors.primary} />
              </View>
              <Text style={styles.itemText}>
                {item.name} {item.variantLabel ? `(${item.variantLabel})` : ''} × {item.quantity} · ₹{item.subtotal}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.noteCard}>
          <Icon name="shield" size={16} color={colors.textSecondary} />
          <Text style={styles.noteText}>Store staff will hand over the package at checkout counter</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label="Verify Order"
          variant="secondary"
          icon="scan"
          style={styles.verifyButton}
          fullWidth={false}
          onPress={() => navigation.navigate('VerifyPickup', {orderId})}
        />
        <Button
          label="Collect Order"
          icon="arrow-right"
          iconPosition="right"
          style={styles.collectButton}
          fullWidth={false}
          onPress={() => navigation.navigate('OrderIdVerification', {orderId})}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: {flex: 1},
  header: {backgroundColor: colors.primary, paddingHorizontal: spacing.xl, paddingTop: spacing.xl, paddingBottom: spacing.xxl},
  headerStore: {...typography.label, color: 'rgba(255,255,255,0.75)'},
  headerTitle: {...typography.h3, fontSize: 24, color: colors.white, marginTop: spacing.xxs},
  body: {backgroundColor: colors.background, padding: spacing.lg, gap: spacing.md},
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.successSurface,
    borderWidth: 1.5,
    borderColor: 'rgba(28,166,114,0.3)',
    borderRadius: radius.xxl,
    padding: spacing.lg,
  },
  bannerIcon: {width: 36, height: 36, borderRadius: 18, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center'},
  bannerText: {...typography.bodyMedium, color: colors.successText, flex: 1},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.xxl, padding: spacing.lg},
  cardLabel: {...typography.overline, color: colors.textSecondary, letterSpacing: 0.8, marginBottom: spacing.sm},
  itemRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.xs},
  itemCheck: {width: 20, height: 20, borderRadius: 10, backgroundColor: colors.successSurface, alignItems: 'center', justifyContent: 'center'},
  itemText: {...typography.body, color: colors.textPrimary, flex: 1},
  noteCard: {flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.md},
  noteText: {...typography.label, color: colors.textSecondary, flex: 1},
  footer: {flexDirection: 'row', gap: spacing.sm, padding: spacing.lg, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border},
  verifyButton: {flex: 1},
  collectButton: {flex: 2},
});
