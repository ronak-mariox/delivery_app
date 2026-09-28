import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {DeliveryOrder, useOrders} from '../../context/OrdersContext';

type Props = NativeStackScreenProps<RootStackParamList, 'ArrivingAtStore'>;

export function ArrivingAtStoreScreen({route, navigation}: Props) {
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
    <Screen edges={['top', 'bottom']} contentContainerStyle={styles.container}>
      <View style={styles.iconOuter}>
        <View style={[styles.ring, styles.ringOuter]} />
        <View style={[styles.ring, styles.ringMid]} />
        <View style={styles.iconInner}>
          <Icon name="store" size={22} color={colors.primary} />
        </View>
      </View>

      <Text style={styles.title}>Heading to Store</Text>
      <Text style={styles.subtitle}>You are almost there</Text>

      <View style={styles.card}>
        <View style={styles.cardTopRow}>
          <Text style={styles.storeName}>{storeName}</Text>
        </View>
        {!!order?.pickup.address && (
          <View style={styles.addressRow}>
            <Icon name="map-pin" size={14} color={colors.textSecondary} />
            <Text style={styles.addressText}>{order.pickup.address}</Text>
          </View>
        )}
      </View>

      <View style={styles.spacer} />

      <View style={styles.actionsRow}>
        <Button
          label="Call Store"
          variant="outline"
          icon="phone"
          style={styles.callButton}
          fullWidth={false}
          disabled={!order?.pickup.phone}
          onPress={() => navigation.navigate('ContactStore', {orderId})}
        />
        <Button
          label="Arrived"
          icon="map-pin"
          style={styles.arrivedButton}
          fullWidth={false}
          onPress={() => navigation.navigate('ConfirmingArrival', {orderId})}
        />
      </View>
      <TouchableOpacity
        style={styles.troubleLink}
        activeOpacity={0.7}
        onPress={() => navigation.navigate('SelectIssueReason', {orderId})}
      >
        <Text style={styles.troubleLinkText}>Having trouble finding the store?</Text>
      </TouchableOpacity>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, alignItems: 'center', paddingHorizontal: spacing.xl, paddingTop: spacing.huge},
  iconOuter: {width: 180, height: 180, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg},
  ring: {position: 'absolute', borderRadius: 100, backgroundColor: 'rgba(28,166,114,0.08)'},
  ringOuter: {width: 180, height: 180},
  ringMid: {width: 132, height: 132, backgroundColor: 'rgba(28,166,114,0.14)'},
  iconInner: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {...typography.h1, fontSize: 28, color: colors.primary},
  subtitle: {...typography.body, color: colors.textSecondary, marginTop: spacing.xxs, marginBottom: spacing.lg},
  card: {width: '100%', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.xxl, padding: spacing.lg, marginBottom: spacing.md},
  cardTopRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm},
  storeName: {...typography.title, fontSize: 16, color: colors.textPrimary},
  addressRow: {flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: spacing.sm},
  addressText: {...typography.label, color: colors.textSecondary},
  spacer: {flex: 1},
  actionsRow: {flexDirection: 'row', gap: spacing.sm, width: '100%'},
  callButton: {flex: 1, height: 52},
  arrivedButton: {flex: 2, height: 52},
  troubleLink: {paddingVertical: spacing.md},
  troubleLinkText: {...typography.label, color: colors.textSecondary, textDecorationLine: 'underline'},
});
