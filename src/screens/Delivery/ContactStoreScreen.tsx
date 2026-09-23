import React, {useEffect, useState} from 'react';
import {Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Avatar, EmptyState, Icon, IconBackButton, Loader, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {DeliveryOrder, useOrders} from '../../context/OrdersContext';

type Props = NativeStackScreenProps<RootStackParamList, 'ContactStore'>;

function initialsFor(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  return parts
    .slice(0, 2)
    .map(p => p[0]?.toUpperCase())
    .join('');
}

export function ContactStoreScreen({route, navigation}: Props) {
  const {orderId} = route.params;
  const {getOrder} = useOrders();
  const [order, setOrder] = useState<DeliveryOrder | null>(null);
  const [loading, setLoading] = useState(true);

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

  const storeName = order.pickup.name;
  const storeAddress = order.pickup.address;
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
        <Text style={styles.headerTitle}>Contact Store</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.storeCard}>
          <Avatar initials={initialsFor(storeName)} size={48} />
          <View style={styles.storeInfo}>
            <Text style={styles.storeName} numberOfLines={1}>{storeName}</Text>
            {!!storeAddress && <Text style={styles.storeAddress}>{storeAddress}</Text>}
          </View>
        </View>

        <View style={styles.optionsList}>
          <View style={styles.optionRow}>
            <View style={styles.optionIcon}>
              <Icon name="phone" size={24} color={colors.primary} />
            </View>
            <View style={styles.optionText}>
              <Text style={styles.optionTitle}>Call Store</Text>
              <Text style={styles.optionSubtitle}>{storePhone ? 'Direct line to the store' : 'No phone number on file'}</Text>
            </View>
            <TouchableOpacity
              style={[styles.primaryChip, !storePhone && styles.chipDisabled]}
              activeOpacity={0.85}
              disabled={!storePhone}
              onPress={callStore}>
              <Text style={styles.primaryChipText}>Call</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.optionRow}>
            <View style={styles.optionIcon}>
              <Icon name="headphones" size={24} color={colors.primary} />
            </View>
            <View style={styles.optionText}>
              <Text style={styles.optionTitle}>Contact Support</Text>
              <Text style={styles.optionSubtitle}>Escalate to Verdant support team</Text>
            </View>
            <TouchableOpacity style={styles.outlineChip} activeOpacity={0.85} onPress={() => navigation.navigate('SupportHub')}>
              <Text style={styles.outlineChipText}>Escalate</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footerCard}>
          <Text style={styles.footerLabel}>ORDER ID</Text>
          <Text style={styles.footerValue}>#{order.orderNumber}</Text>
        </View>
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
  headerTitle: {...typography.subtitle, color: colors.textPrimary},
  flex: {flex: 1},
  body: {padding: spacing.lg, gap: spacing.md},
  storeCard: {flexDirection: 'row', gap: spacing.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg, alignItems: 'center'},
  storeInfo: {flex: 1, gap: 2},
  storeName: {...typography.bodySemibold, fontSize: 16, color: colors.textPrimary},
  storeAddress: {...typography.label, color: colors.textSecondary},
  optionsList: {gap: spacing.md},
  optionRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg},
  optionIcon: {width: 44, height: 44, borderRadius: 22, backgroundColor: '#ECFDF5', alignItems: 'center', justifyContent: 'center'},
  optionText: {flex: 1},
  optionTitle: {...typography.bodyLgMedium, color: colors.textPrimary},
  optionSubtitle: {...typography.label, color: colors.textSecondary, marginTop: 1},
  primaryChip: {backgroundColor: colors.primary, borderRadius: radius.sm, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm},
  chipDisabled: {opacity: 0.4},
  primaryChipText: {...typography.labelSemibold, color: colors.white},
  outlineChip: {borderWidth: 1.5, borderColor: colors.primary, borderRadius: radius.sm, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm},
  outlineChipText: {...typography.labelSemibold, color: colors.primary},
  footerCard: {flexDirection: 'row', justifyContent: 'space-between', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.md},
  footerLabel: {...typography.caption, color: colors.textSecondary},
  footerValue: {...typography.bodyBold, color: colors.textPrimary},
});
