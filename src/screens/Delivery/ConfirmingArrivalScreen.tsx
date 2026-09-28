import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {DeliveryOrder, useOrders} from '../../context/OrdersContext';

type Props = NativeStackScreenProps<RootStackParamList, 'ConfirmingArrival'>;

export function ConfirmingArrivalScreen({route, navigation}: Props) {
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

  const storeName = order?.pickup.name ?? 'the store';
  const itemCount = order?.items.length ?? 0;

  return (
    <Screen edges={['top', 'bottom']} contentContainerStyle={styles.container}>
      <View style={styles.iconOuter}>
        <View style={[styles.ring, styles.ringOuter]} />
        <View style={[styles.ring, styles.ringMid]} />
        <View style={styles.iconInner}>
          <Icon name="check" size={32} color={colors.white} />
        </View>
      </View>

      <Text style={styles.title}>Confirming Your Arrival</Text>
      <Text style={styles.subtitle}>Notifying {storeName}…</Text>

      <View style={styles.dots}>
        <View style={styles.dot} />
        <View style={styles.dot} />
        <View style={[styles.dot, styles.dotActive]} />
      </View>

      <View style={styles.card}>
        <View style={styles.orderIdRow}>
          <Text style={styles.orderIdLabel}>Order ID</Text>
          <Text style={styles.orderIdValue}>#{order?.orderNumber ?? orderId}</Text>
        </View>
        <View style={styles.infoRow}>
          <Icon name="store" size={14} color={colors.textSecondary} />
          <Text style={styles.infoText}>{storeName}</Text>
        </View>
        {order && (
          <View style={styles.infoRow}>
            <Icon name="package" size={14} color={colors.textSecondary} />
            <Text style={styles.infoText}>
              {itemCount} item{itemCount === 1 ? '' : 's'} · ₹{order.pricing.grandTotal} · {order.paymentMethod === 'cod' ? 'COD' : 'Paid Online'}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.noteRow}>
        <Icon name="info" size={14} color={colors.textSecondary} />
        <Text style={styles.noteText}>This will log your arrival time for the record</Text>
      </View>

      <View style={styles.confirmButtonWrap}>
        <Button label="Confirm I've Arrived" onPress={() => navigation.replace('ArrivedAtStore', {orderId})} />
      </View>
      <TouchableOpacity style={styles.cancelButton} activeOpacity={0.7} onPress={() => navigation.goBack()}>
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xxl},
  iconOuter: {width: 100, height: 100, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xl},
  ring: {position: 'absolute', borderRadius: 100, borderWidth: 3, borderColor: colors.primary},
  ringOuter: {width: 100, height: 100, opacity: 0.1},
  ringMid: {width: 88, height: 88, opacity: 0.2},
  iconInner: {width: 64, height: 64, borderRadius: 32, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center'},
  title: {...typography.h4, fontSize: 22, color: colors.textPrimary, textAlign: 'center'},
  subtitle: {...typography.body, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.xs, marginBottom: spacing.lg},
  dots: {flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.xxl},
  dot: {width: 8, height: 8, borderRadius: 4, backgroundColor: colors.border},
  dotActive: {width: 24, backgroundColor: colors.primary},
  card: {width: '100%', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.xxl, padding: spacing.lg, gap: spacing.sm, marginBottom: spacing.lg},
  orderIdRow: {flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: colors.border, paddingBottom: spacing.sm},
  orderIdLabel: {...typography.label, color: colors.textSecondary},
  orderIdValue: {...typography.bodyBold, fontSize: 13, color: colors.textPrimary},
  infoRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.xs},
  infoText: {...typography.label, color: colors.textSecondary},
  noteRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginBottom: spacing.xl},
  noteText: {...typography.caption, color: colors.textSecondary, textAlign: 'center', flexShrink: 1},
  confirmButtonWrap: {width: '100%', paddingHorizontal: spacing.xl, marginTop: spacing.lg},
  cancelButton: {paddingVertical: spacing.sm},
  cancelText: {...typography.body, color: colors.textSecondary, textDecorationLine: 'underline'},
});
