import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {DeliveryOrder, useOrders} from '../../context/OrdersContext';

type Props = NativeStackScreenProps<RootStackParamList, 'CustomerConfirmed'>;

function formatTime(iso?: string): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleTimeString([], {hour: 'numeric', minute: '2-digit'});
}

export function CustomerConfirmedScreen({route, navigation}: Props) {
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
  const verifiedAt = formatTime(order?.deliveredAt);

  return (
    <Screen edges={['top', 'bottom']} contentContainerStyle={styles.container}>
      <View style={styles.iconOuter}>
        <View style={[styles.ring, styles.ringOuter]} />
        <View style={styles.iconInner}>
          <Icon name="check" size={48} color={colors.white} />
        </View>
      </View>

      <Text style={styles.title}>Customer Verified!</Text>
      <Text style={styles.subtitle}>{`OTP matched · ${customerName} confirmed`}</Text>

      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Order</Text>
          <Text style={styles.rowValue}>#{order?.orderNumber ?? orderId}</Text>
        </View>
        {!!verifiedAt && (
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Verified at</Text>
            <Text style={styles.rowValue}>{verifiedAt}</Text>
          </View>
        )}
        <View style={[styles.row, styles.rowLast]}>
          <Text style={styles.rowLabel}>Method</Text>
          <Text style={styles.rowValue}>Customer OTP</Text>
        </View>
      </View>

      <Text style={styles.hint}>Proceed to hand over the package to the customer.</Text>

      <Button
        label="Hand Over Order →"
        style={styles.handOverButton}
        onPress={() => navigation.navigate('HandOverOrder', {orderId})}
      />
      <Text style={styles.footnote}>Takes you to final handover step</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xxl},
  iconOuter: {width: 140, height: 140, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg},
  ring: {position: 'absolute', borderRadius: 100, backgroundColor: 'rgba(28,166,114,0.1)'},
  ringOuter: {width: 140, height: 140},
  iconInner: {width: 96, height: 96, borderRadius: 48, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center'},
  title: {...typography.h2, fontSize: 26, color: colors.textPrimary},
  subtitle: {...typography.body, color: colors.textSecondary, marginTop: spacing.xxs, marginBottom: spacing.xl},
  card: {width: '100%', backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border, borderRadius: radius.xxl, padding: spacing.xl, marginBottom: spacing.lg},
  row: {flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border},
  rowLast: {borderBottomWidth: 0},
  rowLabel: {...typography.label, color: colors.textSecondary},
  rowValue: {...typography.labelSemibold, color: colors.textPrimary},
  hint: {...typography.label, color: colors.textSecondary, textAlign: 'center', marginBottom: spacing.md},
  handOverButton: {marginBottom: spacing.sm},
  footnote: {...typography.caption, color: colors.textSecondary, textAlign: 'center'},
});
