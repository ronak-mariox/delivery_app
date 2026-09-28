import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Avatar, Button, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {DeliveryOrder, useOrders} from '../../context/OrdersContext';

type Props = NativeStackScreenProps<RootStackParamList, 'PickupRetry'>;

type RetryOption = 'reattempt' | 'ask-store';

function initialsFor(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {return '?';}
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');
}

export function PickupRetryScreen({route, navigation}: Props) {
  const {orderId} = route.params;
  const {getOrder} = useOrders();
  const [order, setOrder] = useState<DeliveryOrder | null>(null);
  const [selected, setSelected] = useState<RetryOption>('reattempt');

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
    <Screen edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Retry Pickup</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.storeCard}>
          <Avatar initials={initialsFor(storeName)} size={44} />
          <View style={styles.storeInfo}>
            <Text style={styles.storeName}>{storeName}</Text>
            {!!order?.pickup.address && <Text style={styles.storeMeta}>{order.pickup.address}</Text>}
          </View>
          <TouchableOpacity
            style={[styles.callChip, !order?.pickup.phone && styles.callChipDisabled]}
            activeOpacity={0.85}
            disabled={!order?.pickup.phone}
            onPress={() => navigation.navigate('ContactStore', {orderId})}>
            <Text style={styles.callChipText}>Call Now</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.optionCard, selected === 'reattempt' && styles.optionCardSelected]}
          activeOpacity={0.85}
          onPress={() => setSelected('reattempt')}>
          <Text style={styles.optionTitle}>Re-attempt pickup now</Text>
          <Text style={styles.optionSubtitle}>Go back to store entrance</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.optionCard, selected === 'ask-store' && styles.optionCardSelected]}
          activeOpacity={0.85}
          onPress={() => setSelected('ask-store')}>
          <Text style={styles.optionTitle}>Ask store to recheck order</Text>
          <Text style={styles.optionSubtitle}>Call / message the store</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label="Escalate to Support"
          variant="secondary"
          style={styles.escalateButton}
          fullWidth={false}
          onPress={() => navigation.navigate('PickupSupport', {orderId})}
        />
        <Button
          label="Proceed to Retry"
          style={styles.retryButton}
          fullWidth={false}
          onPress={() =>
            selected === 'reattempt'
              ? navigation.replace('PickupConfirmation', {orderId})
              : navigation.navigate('ContactStore', {orderId})
          }
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {backgroundColor: colors.warning, paddingHorizontal: spacing.xxl, paddingTop: spacing.xxl, paddingBottom: spacing.xl},
  headerTitle: {...typography.h3, fontSize: 24, color: colors.white},
  flex: {flex: 1},
  body: {padding: spacing.lg, gap: spacing.md},
  storeCard: {flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg},
  storeInfo: {flex: 1},
  storeName: {...typography.bodyLgMedium, color: colors.textPrimary},
  storeMeta: {...typography.label, color: colors.textSecondary, marginTop: 1},
  callChip: {backgroundColor: colors.primary, borderRadius: radius.sm, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm},
  callChipDisabled: {opacity: 0.5},
  callChipText: {...typography.labelSemibold, color: colors.white},
  optionCard: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg},
  optionCardSelected: {borderWidth: 2, borderColor: colors.primary},
  optionTitle: {...typography.bodyLgMedium, color: colors.textPrimary},
  optionSubtitle: {...typography.label, color: colors.textSecondary, marginTop: 1},
  footer: {flexDirection: 'row', gap: spacing.sm, padding: spacing.lg, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border},
  escalateButton: {flex: 1},
  retryButton: {flex: 1},
});
