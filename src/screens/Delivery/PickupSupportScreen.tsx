import React, {useEffect, useState} from 'react';
import {Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, EmptyState, Icon, IconBackButton, Loader, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {DeliveryOrder, useOrders} from '../../context/OrdersContext';

type Props = NativeStackScreenProps<RootStackParamList, 'PickupSupport'>;

export function PickupSupportScreen({route, navigation}: Props) {
  const {orderId} = route.params;
  const {getOrder} = useOrders();
  const [order, setOrder] = useState<DeliveryOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getOrder(orderId)
      .then(o => { if (!cancelled) {setOrder(o);} })
      .catch(() => {})
      .finally(() => { if (!cancelled) {setLoading(false);} });
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

  const storePhone = order.pickup.phone;
  const callStore = () => {
    if (storePhone) {
      Linking.openURL(`tel:${storePhone}`).catch(() => {});
    }
  };

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.header}>
        <IconBackButton onPress={() => navigation.goBack()} />
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Pickup Support</Text>
          <Text style={styles.headerSubtitle}>{`Order #${order.orderNumber} · ${order.pickup.name}`}</Text>
        </View>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.summaryCard}>
          <Text style={styles.cardLabel}>ORDER</Text>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Store</Text>
            <Text style={styles.rowValue} numberOfLines={1}>{order.pickup.name}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Order ID</Text>
            <Text style={styles.rowValue}>{`#${order.orderNumber}`}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.actionRow, !storePhone && styles.actionRowDisabled]}
          activeOpacity={0.85}
          disabled={!storePhone}
          onPress={callStore}>
          <Icon name="phone" size={20} color={colors.primary} />
          <View style={styles.actionText}>
            <Text style={styles.actionTitle}>Call Store</Text>
            <Text style={styles.actionSubtitle}>{storePhone ? 'Speak directly with the store' : 'No phone number on file'}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionRow} activeOpacity={0.85} onPress={() => navigation.navigate('PickupRetry', {orderId})}>
          <Icon name="refresh" size={20} color={colors.primary} />
          <View style={styles.actionText}>
            <Text style={styles.actionTitle}>Retry Pickup</Text>
            <Text style={styles.actionSubtitle}>Go back and try collecting the order again</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionRow} activeOpacity={0.85} onPress={() => navigation.navigate('SupportHub')}>
          <Icon name="headphones" size={20} color={colors.primary} />
          <View style={styles.actionText}>
            <Text style={styles.actionTitle}>Contact Support</Text>
            <Text style={styles.actionSubtitle}>Escalate to Verdant support team</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <Button label="Back" variant="secondary" onPress={() => navigation.goBack()} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  headerText: {flex: 1},
  headerTitle: {...typography.subtitle, color: colors.textPrimary},
  headerSubtitle: {...typography.caption, color: colors.textSecondary, marginTop: 1},
  flex: {flex: 1},
  body: {padding: spacing.lg, gap: spacing.md},
  summaryCard: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg},
  cardLabel: {...typography.overline, color: colors.textSecondary, letterSpacing: 0.4, marginBottom: spacing.sm},
  row: {flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.xs},
  rowLabel: {...typography.label, color: colors.textSecondary},
  rowValue: {...typography.labelSemibold, color: colors.textPrimary, flexShrink: 1, textAlign: 'right'},
  actionRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg},
  actionRowDisabled: {opacity: 0.5},
  actionText: {flex: 1},
  actionTitle: {...typography.bodyLgMedium, color: colors.textPrimary},
  actionSubtitle: {...typography.label, color: colors.textSecondary, marginTop: 1},
  footer: {padding: spacing.lg, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border},
});
