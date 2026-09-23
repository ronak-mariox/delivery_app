import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {DeliveryOrder, useOrders} from '../../context/OrdersContext';

type Props = NativeStackScreenProps<RootStackParamList, 'ArrivedAtCustomer'>;

export function ArrivedAtCustomerScreen({route, navigation}: Props) {
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
  const subtitleLine = order ? [customerName, order.address.city].filter(Boolean).join(' · ') : customerName;

  return (
    <Screen backgroundColor={colors.primary} statusBarStyle="light-content" edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Icon name="map-pin" size={40} color={colors.white} filled />
        <Text style={styles.headerTitle}>{"You've Arrived!"}</Text>
        <Text style={styles.headerSubtitle}>{subtitleLine}</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.addressCard}>
          <Text style={styles.cardLabel}>DELIVERY ADDRESS</Text>
          {!!order?.address.line1 && <Text style={styles.addressLine}>{order.address.line1}</Text>}
          {!!order && (
            <Text style={styles.addressLine}>
              {[order.address.line2, order.address.city].filter(Boolean).join(', ')}
            </Text>
          )}
          {!!order?.address.landmark && (
            <View style={styles.nearRow}>
              <Icon name="info" size={14} color={colors.textSecondary} />
              <Text style={styles.nearText}>Near {order.address.landmark}</Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[styles.optionRow, styles.optionRowPrimary]}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('DeliveryVerification', {orderId})}>
          <View style={styles.optionText}>
            <Text style={styles.optionTitle}>Customer is here</Text>
            <Text style={styles.optionSubtitle}>Proceed to handover</Text>
          </View>
          <View style={styles.primaryChip}>
            <Text style={styles.primaryChipText}>Proceed</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionRow}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('CustomerUnavailable', {orderId})}>
          <View style={styles.optionText}>
            <Text style={styles.optionTitle}>Call customer</Text>
            <Text style={styles.optionSubtitle}>If no one at door</Text>
          </View>
          <View style={styles.outlineChip}>
            <Text style={styles.outlineChipText}>Call</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionRow}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('DeliverySuccess', {orderId})}>
          <View style={styles.optionText}>
            <Text style={styles.optionTitle}>Leave at door</Text>
            <Text style={styles.optionSubtitle}>If instructions say so</Text>
          </View>
          <View style={styles.neutralChip}>
            <Text style={styles.neutralChipText}>Leave</Text>
          </View>
        </TouchableOpacity>

        {!!order?.specialInstructions && (
          <View style={styles.warningBanner}>
            <Icon name="lock" size={16} color={colors.warning} />
            <Text style={styles.warningText}>{order.specialInstructions}</Text>
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: {flex: 1},
  header: {backgroundColor: colors.primary, alignItems: 'center', paddingVertical: spacing.xxl, gap: spacing.xs},
  headerTitle: {...typography.h4, fontSize: 22, color: colors.white, marginTop: spacing.xs},
  headerSubtitle: {...typography.label, color: 'rgba(255,255,255,0.8)'},
  body: {backgroundColor: colors.surface, padding: spacing.lg, gap: spacing.md},
  addressCard: {backgroundColor: colors.background, borderRadius: radius.xl, padding: spacing.lg},
  cardLabel: {...typography.overline, color: colors.textSecondary, letterSpacing: 0.5, marginBottom: spacing.sm},
  addressLine: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary},
  nearRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: spacing.sm},
  nearText: {...typography.label, color: colors.textSecondary},
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.xl,
    padding: spacing.lg,
  },
  optionRowPrimary: {borderColor: colors.primary},
  optionText: {flex: 1},
  optionTitle: {...typography.bodyLgMedium, color: colors.textPrimary},
  optionSubtitle: {...typography.caption, color: colors.textSecondary, marginTop: 1},
  primaryChip: {backgroundColor: colors.primary, borderRadius: radius.sm, paddingHorizontal: spacing.lg, paddingVertical: spacing.md},
  primaryChipText: {...typography.labelSemibold, color: colors.white},
  outlineChip: {borderWidth: 1.5, borderColor: colors.primary, borderRadius: radius.sm, paddingHorizontal: spacing.lg, paddingVertical: spacing.md},
  outlineChipText: {...typography.labelSemibold, color: colors.primary},
  neutralChip: {backgroundColor: colors.background, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.sm, paddingHorizontal: spacing.lg, paddingVertical: spacing.md},
  neutralChipText: {...typography.labelSemibold, color: colors.textSecondary},
  warningBanner: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.warningSurface, borderWidth: 1, borderColor: colors.warningBorder, borderRadius: radius.md, padding: spacing.md},
  warningText: {...typography.label, color: colors.warningText, flex: 1},
});
