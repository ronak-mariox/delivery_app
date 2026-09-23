import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {DeliveryOrder, useOrders} from '../../context/OrdersContext';

type Props = NativeStackScreenProps<RootStackParamList, 'HandOverOrder'>;

const CHECKLIST = [
  {id: 'identity', label: 'Confirm customer identity', done: true},
  {id: 'otp', label: 'OTP verified', done: true},
  {id: 'handed', label: 'Hand package to customer', done: false},
  {id: 'confirm', label: 'Confirm delivery complete', done: false},
];

export function HandOverOrderScreen({route, navigation}: Props) {
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
  const addressLine = order ? [order.address.line1, order.address.line2].filter(Boolean).join(', ') : null;
  const itemCount = order?.items.reduce((sum, it) => sum + it.quantity, 0) ?? 0;
  const itemNames = order?.items.map(it => it.name).join(', ') ?? '';

  return (
    <Screen backgroundColor={colors.primary} statusBarStyle="light-content" edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Icon name="package" size={36} color={colors.white} />
        <Text style={styles.headerTitle}>Hand Over to Customer</Text>
        <Text style={styles.headerSubtitle}>{[customerName, addressLine].filter(Boolean).join(' · ')}</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Handover Checklist</Text>
          {CHECKLIST.map(item => (
            <View key={item.id} style={styles.checklistRow}>
              <View style={[styles.checkDot, item.done && styles.checkDotDone]}>
                {item.done && <Icon name="check" size={12} color={colors.white} />}
              </View>
              <Text style={[styles.checklistLabel, item.done && styles.checklistLabelDone]}>{item.label}</Text>
            </View>
          ))}
        </View>

        {!!order && (
          <View style={styles.card}>
            <View style={styles.itemsHeaderRow}>
              <Text style={styles.itemsTitle}>{`1 package · ${itemCount} item${itemCount === 1 ? '' : 's'}`}</Text>
            </View>
            {!!itemNames && <Text style={styles.itemsList}>{itemNames}</Text>}
          </View>
        )}

        <TouchableOpacity style={styles.photoRow} activeOpacity={0.85}>
          <View style={styles.photoIcon}>
            <Icon name="camera" size={20} color={colors.textSecondary} />
          </View>
          <View>
            <Text style={styles.photoTitle}>Take a photo at handover</Text>
            <Text style={styles.photoSubtitle}>Optional · Tap to add</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label="I've Handed Over the Order"
          onPress={() => navigation.navigate('ConfirmingDelivery', {orderId})}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: {flex: 1},
  header: {backgroundColor: colors.primary, alignItems: 'center', gap: spacing.xxs, paddingVertical: spacing.xl},
  headerTitle: {...typography.title, fontSize: 18, color: colors.white, marginTop: spacing.xs},
  headerSubtitle: {...typography.label, color: 'rgba(255,255,255,0.8)'},
  body: {backgroundColor: colors.background, padding: spacing.lg, gap: spacing.md},
  card: {backgroundColor: colors.surface, borderRadius: radius.xl, padding: spacing.lg},
  cardTitle: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary, marginBottom: spacing.sm},
  checklistRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.sm, borderTopWidth: 1, borderTopColor: colors.border},
  checkDot: {width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center'},
  checkDotDone: {backgroundColor: colors.primary, borderColor: colors.primary},
  checklistLabel: {...typography.body, color: colors.textPrimary},
  checklistLabelDone: {color: colors.textSecondary, textDecorationLine: 'line-through'},
  itemsHeaderRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  itemsTitle: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary},
  itemsList: {...typography.label, color: colors.textSecondary, marginTop: spacing.sm},
  photoRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.surface, borderRadius: radius.xl, padding: spacing.lg},
  photoIcon: {width: 44, height: 44, borderRadius: radius.md, backgroundColor: colors.background, borderWidth: 1.5, borderColor: colors.border, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center'},
  photoTitle: {...typography.label, color: colors.textSecondary},
  photoSubtitle: {...typography.caption, fontSize: 11, color: colors.primary, marginTop: 1},
  footer: {padding: spacing.lg, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border},
});
