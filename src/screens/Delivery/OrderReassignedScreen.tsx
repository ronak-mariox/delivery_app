import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, EmptyState, Icon, Loader, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {DeliveryOrder, useOrders} from '../../context/OrdersContext';

type Props = NativeStackScreenProps<RootStackParamList, 'OrderReassigned'>;

function formatTime(iso?: string): string {
  if (!iso) {
    return '';
  }
  return new Date(iso).toLocaleTimeString([], {hour: 'numeric', minute: '2-digit'});
}

export function OrderReassignedScreen({route, navigation}: Props) {
  const {orderId} = route.params;
  const {getOrder} = useOrders();
  const [order, setOrder] = useState<DeliveryOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const goHome = () => navigation.reset({index: 0, routes: [{name: 'Home'}]});

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getOrder(orderId)
      .then(o => { if (!cancelled) setOrder(o); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
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

  const lastEvent = order.statusHistory[order.statusHistory.length - 1];
  const stillAssignedToYou = order.driverId != null;

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Icon name="refresh" size={44} color={colors.white} />
        <Text style={styles.headerTitle}>Order Unassigned</Text>
        <Text style={styles.headerSubtitle}>
          {stillAssignedToYou ? 'This order is still with you.' : 'This order is now open for other delivery partners.'}
        </Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>ORDER</Text>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Order</Text>
            <Text style={styles.rowValue}>{`#${order.orderNumber}`}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Status</Text>
            <Text style={styles.rowValueGreen}>{stillAssignedToYou ? 'Assigned to you' : 'Available for pickup'}</Text>
          </View>
          {!!lastEvent && (
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Updated</Text>
              <Text style={styles.rowValue}>{formatTime(lastEvent.at)}</Text>
            </View>
          )}
        </View>

        {!!lastEvent?.note && (
          <View style={styles.reasonCard}>
            <Text style={styles.reasonLabel}>Why this happened</Text>
            <Text style={styles.rowValue}>{lastEvent.note}</Text>
          </View>
        )}

        <Text style={styles.notifyText}>Your earnings for any confirmed steps already completed on this order are unaffected.</Text>

        <Button label="Back to Dashboard" onPress={goHome} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {backgroundColor: '#0284C7', alignItems: 'center', gap: spacing.sm, paddingTop: spacing.xxl, paddingBottom: spacing.xl, paddingHorizontal: spacing.xl},
  headerTitle: {...typography.h3, fontSize: 24, color: colors.white},
  headerSubtitle: {...typography.body, color: '#BAE6FD', textAlign: 'center'},
  flex: {flex: 1},
  body: {padding: spacing.lg, gap: spacing.md},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg},
  cardLabel: {...typography.captionSemibold, fontSize: 12, color: colors.textSecondary, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: spacing.sm},
  row: {flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3},
  rowLabel: {...typography.label, fontSize: 13, color: colors.textSecondary},
  rowValue: {...typography.bodyMedium, fontSize: 13, color: colors.textPrimary},
  rowValueGreen: {...typography.bodySemibold, fontSize: 13, color: colors.primary},
  reasonCard: {backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md},
  reasonLabel: {...typography.labelSemibold, fontSize: 13, color: colors.textSecondary, marginBottom: spacing.xs},
  notifyText: {...typography.label, fontSize: 13, color: colors.textSecondary, textAlign: 'center'},
});
