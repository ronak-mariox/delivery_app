import React, {useEffect, useState} from 'react';
import {Alert, ScrollView, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon, IconBackButton, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {DeliveryOrder, useOrders} from '../../context/OrdersContext';
import {getApiErrorMessage} from '../../services/api';

type Props = NativeStackScreenProps<RootStackParamList, 'RetryDelivery'>;

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function RetryDeliveryScreen({route, navigation}: Props) {
  const {orderId} = route.params;
  const {getOrder, reportIssue} = useOrders();
  const [order, setOrder] = useState<DeliveryOrder | null>(null);
  const [escalating, setEscalating] = useState(false);

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
  const addressLine = order?.address.line1;
  const distanceKm =
    order?.pickup.latitude != null &&
    order?.pickup.longitude != null &&
    order?.address.latitude != null &&
    order?.address.longitude != null
      ? haversineKm(order.pickup.latitude, order.pickup.longitude, order.address.latitude, order.address.longitude)
      : null;

  const handleEscalate = async () => {
    setEscalating(true);
    try {
      const result = await reportIssue(orderId, {type: 'delivery_failed', description: 'Unable to retry delivery'});
      navigation.navigate('DeliveryFailed', {orderId, order: result.order});
    } catch (err) {
      Alert.alert('Could Not Escalate', getApiErrorMessage(err, 'Please try again.'));
    } finally {
      setEscalating(false);
    }
  };

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.header}>
        <IconBackButton onPress={() => navigation.goBack()} />
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Retry Delivery</Text>
          <Text style={styles.headerSubtitle}>{`Order #${order?.orderNumber ?? orderId}`}</Text>
        </View>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>DELIVERY INFO</Text>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Customer</Text>
            <Text style={styles.rowValue}>{customerName}</Text>
          </View>
          {!!addressLine && (
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Address</Text>
              <Text style={styles.rowValue}>{addressLine}</Text>
            </View>
          )}
          {distanceKm != null && (
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Distance</Text>
              <Text style={styles.rowValueGreen}>{`${distanceKm.toFixed(1)} km from store`}</Text>
            </View>
          )}
        </View>

        <Button
          label={distanceKm != null ? `Start Navigation — ${distanceKm.toFixed(1)} km` : 'Start Navigation'}
          icon="navigation"
          onPress={() => navigation.navigate('CustomerNavigationActive', {orderId})}
        />
        <Button
          label="Cannot Retry — Escalate"
          variant="secondary"
          textColor={colors.danger}
          loading={escalating}
          onPress={handleEscalate}
        />
      </ScrollView>
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
  headerTitle: {...typography.title, fontSize: 17, color: colors.textPrimary},
  headerSubtitle: {...typography.caption, color: colors.textSecondary},
  flex: {flex: 1},
  body: {padding: spacing.lg, gap: spacing.md},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg},
  cardLabel: {...typography.captionSemibold, fontSize: 12, color: colors.textSecondary, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: spacing.sm},
  row: {flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3},
  rowLabel: {...typography.label, fontSize: 13, color: colors.textSecondary},
  rowValue: {...typography.bodySemibold, fontSize: 13, color: colors.textPrimary},
  rowValueGreen: {...typography.bodySemibold, fontSize: 13, color: colors.primary},
});
