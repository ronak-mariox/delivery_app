import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {DeliveryOrder, useOrders} from '../../context/OrdersContext';

type Props = NativeStackScreenProps<RootStackParamList, 'RejectConfirmSheet'>;

export function RejectConfirmSheetScreen({route, navigation}: Props) {
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

  return (
    <View style={styles.overlay}>
      <View style={styles.scrim} />
      <View style={styles.sheet}>
        <View style={styles.grabber} />
        <View style={styles.orderRow}>
          <View style={styles.orderIcon}>
            <Icon name="bicycle" size={20} color={colors.primary} />
          </View>
          <View style={styles.orderText}>
            <Text style={styles.orderTitle}>
              Order #{order?.orderNumber ?? orderId} · {order?.pickup.name ?? 'Store'}
            </Text>
            <Text style={styles.orderSubtitle}>
              {earnings != null ? `₹${earnings}` : '—'} · {itemCount || '—'} items
            </Text>
          </View>
        </View>

        <Text style={styles.title}>Reject this order?</Text>
        <Text style={styles.subtitle}>Rejecting will make this order available to other delivery partners. Please select a reason next.</Text>

        <View style={styles.actions}>
          <Button label="Keep Order" variant="secondary" style={styles.keepButton} onPress={() => navigation.goBack()} />
          <Button
            label="Reject Order"
            style={styles.rejectButton}
            onPress={() => navigation.replace('RejectReason', {orderId})}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {flex: 1, justifyContent: 'flex-end'},
  scrim: {...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(17,24,39,0.7)'},
  sheet: {backgroundColor: colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: spacing.xl, paddingBottom: spacing.huge},
  grabber: {width: 40, height: 4, borderRadius: 2, backgroundColor: colors.border, alignSelf: 'center', marginBottom: spacing.xl},
  orderRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.background, borderRadius: radius.lg, padding: spacing.md},
  orderIcon: {width: 40, height: 40, borderRadius: radius.md, backgroundColor: colors.primarySurface, alignItems: 'center', justifyContent: 'center'},
  orderText: {flex: 1},
  orderTitle: {...typography.labelSemibold, color: colors.textPrimary},
  orderSubtitle: {...typography.caption, color: colors.textSecondary, marginTop: 1},
  title: {...typography.title, fontSize: 18, color: colors.textPrimary, marginTop: spacing.xl},
  subtitle: {...typography.body, color: colors.textSecondary, marginTop: spacing.xs},
  actions: {flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xxl},
  keepButton: {flex: 1, height: 54},
  rejectButton: {flex: 1, height: 54, backgroundColor: colors.danger},
});
