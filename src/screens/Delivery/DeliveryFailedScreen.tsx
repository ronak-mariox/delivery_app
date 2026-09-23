import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {DeliveryOrder, useOrders} from '../../context/OrdersContext';

type Props = NativeStackScreenProps<RootStackParamList, 'DeliveryFailed'>;

function formatTime(iso?: string): string | null {
  if (!iso) return null;
  return new Date(iso).toLocaleTimeString([], {hour: 'numeric', minute: '2-digit'});
}

export function DeliveryFailedScreen({route, navigation}: Props) {
  const {orderId, order: passedOrder} = route.params;
  const {getOrder} = useOrders();
  const [order, setOrder] = useState<DeliveryOrder | null>(passedOrder ?? null);

  useEffect(() => {
    if (passedOrder) return;
    let cancelled = false;
    getOrder(orderId)
      .then((o) => {
        if (!cancelled) setOrder(o);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [orderId, passedOrder, getOrder]);

  const customerName = order?.address.contactName ?? 'Customer';
  const updatedAt = formatTime(order?.updatedAt);

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.header}>
        <View style={styles.headerIconWrap}>
          <Icon name="package" size={36} color={colors.white} />
          <View style={styles.headerBadge}>
            <Icon name="x" size={12} color={colors.white} />
          </View>
        </View>
        <Text style={styles.headerTitle}>Delivery Failed</Text>
        <Text style={styles.headerSubtitle}>Order #{order?.orderNumber ?? orderId}</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>FAILURE SUMMARY</Text>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Customer</Text>
            <Text style={styles.rowValue}>{`${customerName} — unreachable`}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Status</Text>
            <Text style={styles.rowValueGreen}>Order cancelled</Text>
          </View>
          {!!updatedAt && (
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Time</Text>
              <Text style={styles.rowValue}>{updatedAt}</Text>
            </View>
          )}
        </View>

        <Button label="Return Order" onPress={() => navigation.navigate('ReturnOrder', {orderId})} />
        <TouchableOpacity onPress={() => navigation.navigate('IssueSupportContact', {orderId})}>
          <Text style={styles.supportLink}>Support</Text>
        </TouchableOpacity>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {backgroundColor: '#7F1D1D', alignItems: 'center', gap: spacing.sm, paddingTop: spacing.xxl, paddingBottom: spacing.xl, paddingHorizontal: spacing.xl},
  headerIconWrap: {width: 60, height: 60, alignItems: 'center', justifyContent: 'center'},
  headerBadge: {position: 'absolute', top: -6, right: -4, width: 24, height: 24, borderRadius: 12, backgroundColor: '#991B1B', borderWidth: 2, borderColor: colors.white, alignItems: 'center', justifyContent: 'center'},
  headerTitle: {...typography.h2, fontSize: 26, color: colors.white},
  headerSubtitle: {...typography.bodySemibold, fontSize: 16, color: '#FCA5A5'},
  flex: {flex: 1},
  body: {padding: spacing.lg, gap: spacing.md},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg},
  cardLabel: {...typography.captionSemibold, fontSize: 12, color: colors.textSecondary, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: spacing.sm},
  row: {flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3},
  rowLabel: {...typography.label, fontSize: 13, color: colors.textSecondary},
  rowValue: {...typography.bodyMedium, fontSize: 13, color: colors.textPrimary},
  rowValueGreen: {...typography.bodySemibold, fontSize: 13, color: colors.primary},
  supportLink: {...typography.bodyMedium, fontSize: 15, color: colors.textSecondary, textAlign: 'center'},
});
