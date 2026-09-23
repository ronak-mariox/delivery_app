import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {DeliveryOrder, useOrders} from '../../context/OrdersContext';

type Props = NativeStackScreenProps<RootStackParamList, 'NearCustomer'>;

export function NearCustomerScreen({route, navigation}: Props) {
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
    ? [order.address.line1, order.address.line2].filter(Boolean).join(', ')
    : '';

  return (
    <Screen edges={['top', 'bottom']} contentContainerStyle={styles.container}>
      <View style={styles.headerBar} />

      <View style={styles.body}>
        <View style={styles.iconOuter}>
          <View style={[styles.ring, styles.ringOuter]} />
          <View style={[styles.ring, styles.ringMid]} />
          <View style={styles.iconInner}>
            <Icon name="map-pin" size={28} color={colors.primary} />
          </View>
        </View>

        <Text style={styles.title}>Arriving at customer</Text>

        <View style={styles.card}>
          <Text style={styles.customerName}>{customerName}</Text>
          {!!order?.address.city && <Text style={styles.customerArea}>{order.address.city}</Text>}
          {!!addressLine && <Text style={styles.customerAddress}>{addressLine}</Text>}
        </View>

        <View style={styles.infoBanner}>
          <Icon name="check" size={18} color={colors.primary} />
          <Text style={styles.infoText}>Customer has been notified of your arrival.</Text>
        </View>

        {!!order?.specialInstructions && (
          <View style={styles.warningBanner}>
            <Icon name="alert-triangle" size={16} color={colors.warning} />
            <Text style={styles.warningText}>{order.specialInstructions}</Text>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <Button
          label="Call Customer"
          variant="outline"
          onPress={() => navigation.navigate('CallCustomer', {orderId})}
        />
        <Button label="I've Arrived" onPress={() => navigation.navigate('ArrivedAtCustomer', {orderId})} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  headerBar: {height: 80, backgroundColor: colors.primary},
  body: {flex: 1, alignItems: 'center', paddingHorizontal: spacing.xl, paddingTop: spacing.huge, gap: spacing.md},
  iconOuter: {width: 180, height: 180, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md},
  ring: {position: 'absolute', borderRadius: 100, backgroundColor: 'rgba(28,166,114,0.08)'},
  ringOuter: {width: 180, height: 180},
  ringMid: {width: 130, height: 130, backgroundColor: 'rgba(28,166,114,0.14)'},
  iconInner: {width: 60, height: 60, borderRadius: 30, backgroundColor: colors.surface, borderWidth: 2, borderColor: colors.primary, alignItems: 'center', justifyContent: 'center'},
  title: {...typography.h1, fontSize: 26, color: colors.primary, marginBottom: spacing.sm, textAlign: 'center'},
  card: {width: '100%', alignItems: 'center', backgroundColor: colors.background, borderRadius: radius.xxl, padding: spacing.xl, gap: spacing.xs},
  customerName: {...typography.title, fontSize: 18, color: colors.textPrimary},
  customerArea: {...typography.label, color: colors.textSecondary},
  customerAddress: {...typography.label, color: colors.textSecondary, marginBottom: spacing.xs},
  infoBanner: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm, width: '100%', backgroundColor: colors.primarySurfaceAlt, borderWidth: 1, borderColor: colors.primaryBorder, borderRadius: radius.lg, padding: spacing.md},
  infoText: {...typography.label, color: colors.primary, flex: 1},
  warningBanner: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm, width: '100%', backgroundColor: colors.warningSurface, borderWidth: 1, borderColor: colors.warningBorder, borderRadius: radius.lg, padding: spacing.md},
  warningText: {...typography.label, color: colors.warningText, flex: 1},
  footer: {padding: spacing.xl, gap: spacing.sm},
});
