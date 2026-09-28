import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon, IconBackButton, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {DeliveryOrder, useOrders} from '../../context/OrdersContext';

type Props = NativeStackScreenProps<RootStackParamList, 'VerifyPickup'>;

interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
}

export function VerifyPickupScreen({route, navigation}: Props) {
  const {orderId} = route.params;
  const {getOrder} = useOrders();
  const [order, setOrder] = useState<DeliveryOrder | null>(null);
  const [items, setItems] = useState<ChecklistItem[]>([
    {id: 'order-id', label: `Order ID matches (#${orderId})`, checked: true},
    {id: 'store-name', label: 'Store name confirmed', checked: true},
    {id: 'item-count', label: 'Item count matches', checked: true},
    {id: 'customer-name', label: 'Customer name on package', checked: false},
    {id: 'sealed', label: 'Package sealed / undamaged', checked: false},
  ]);

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

  const itemCount = order?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  const toggle = (id: string) => setItems(prev => prev.map(item => (item.id === id ? {...item, checked: !item.checked} : item)));

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.header}>
        <IconBackButton onPress={() => navigation.goBack()} />
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Verify Pickup</Text>
          <Text style={styles.headerSubtitle}>Order #{order?.orderNumber ?? orderId}</Text>
        </View>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.infoBanner}>
          <Icon name="info" size={18} color={colors.primary} />
          <Text style={styles.infoText}>Before collecting, verify these details match the store's order slip.</Text>
        </View>

        <View style={styles.checklistCard}>
          {items.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.checklistRow, index > 0 && styles.checklistRowBorder]}
              activeOpacity={0.8}
              onPress={() => toggle(item.id)}>
              <View style={[styles.checkbox, item.checked && styles.checkboxChecked]}>
                {item.checked && <Icon name="check" size={16} color={colors.white} />}
              </View>
              <Text style={[styles.checklistLabel, !item.checked && styles.checklistLabelMuted]}>
                {item.id === 'item-count' ? `Item count: ${itemCount} items` : item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.skipButton}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('OrderIdVerification', {orderId})}>
          <Text style={styles.skipText}>Skip Verification</Text>
        </TouchableOpacity>
        <Button
          label="Confirm & Collect"
          icon="arrow-right"
          iconPosition="right"
          style={styles.confirmButton}
          onPress={() => navigation.navigate('OrderIdVerification', {orderId})}
        />
      </View>
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
  headerTitle: {...typography.subtitle, color: colors.textPrimary},
  headerSubtitle: {...typography.caption, color: colors.textSecondary},
  flex: {flex: 1},
  body: {padding: spacing.lg, gap: spacing.lg},
  infoBanner: {flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, backgroundColor: colors.successSurface, borderWidth: 1, borderColor: '#A7F3D0', borderRadius: radius.md, padding: spacing.md},
  infoText: {...typography.label, color: colors.primaryDark, flex: 1},
  checklistCard: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, overflow: 'hidden'},
  checklistRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.md},
  checklistRowBorder: {borderTopWidth: 1, borderTopColor: colors.border},
  checkbox: {width: 26, height: 26, borderRadius: 13, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center'},
  checkboxChecked: {backgroundColor: colors.primary, borderColor: colors.primary},
  checklistLabel: {...typography.bodyMedium, color: colors.textPrimary, flex: 1},
  checklistLabelMuted: {...typography.body, color: colors.textSecondary},
  footer: {flexDirection: 'row', gap: spacing.sm, padding: spacing.lg, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border},
  skipButton: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  skipText: {...typography.bodyMedium, color: colors.textSecondary},
  confirmButton: {flex: 2},
});
