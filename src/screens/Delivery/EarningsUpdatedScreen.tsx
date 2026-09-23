import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {DeliveryOrder, useOrders} from '../../context/OrdersContext';

type Props = NativeStackScreenProps<RootStackParamList, 'EarningsUpdated'>;

export function EarningsUpdatedScreen({route, navigation}: Props) {
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

  const earnings = order?.driverEarnings;
  const goHome = () => navigation.reset({index: 0, routes: [{name: 'Home'}]});

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Icon name="credit-card" size={28} color={colors.primary} />
        </View>
        <Text style={styles.headerTitle}>Earnings Updated</Text>
        <Text style={styles.headerSubtitle}>Your account has been credited</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {!!earnings && (
          <View style={styles.deliveryCard}>
            <Text style={styles.cardTitle}>This Delivery</Text>
            <Text style={styles.amount}>{`₹${earnings.total}`}</Text>
            <Row label="Base pay" value={`₹${earnings.base}`} />
            <Row label="Distance bonus" value={`₹${earnings.distance}`} />
            {earnings.onTimeBonus > 0 && <Row label="On-time bonus" value={`₹${earnings.onTimeBonus}`} />}
            <Row label="Incentive bonus" value={`₹${earnings.incentiveBonus}`} last />
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button label="Continue Delivering →" onPress={goHome} />
        <TouchableOpacity onPress={() => navigation.navigate('EarningsDashboard')}>
          <Text style={styles.statementLink}>View Full Statement</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

function Row({label, value, last}: {label: string; value: string; last?: boolean}) {
  return (
    <View style={[styles.row, !last && styles.rowBorder]}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border, alignItems: 'center', gap: spacing.xxs, paddingVertical: spacing.xxl},
  headerIcon: {width: 64, height: 64, borderRadius: 32, backgroundColor: colors.successSurface, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm},
  headerTitle: {...typography.h4, fontSize: 22, color: colors.textPrimary},
  headerSubtitle: {...typography.body, color: colors.textSecondary},
  flex: {flex: 1},
  body: {padding: spacing.lg, gap: spacing.md},
  deliveryCard: {backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.primaryBorder, borderRadius: radius.xxl, padding: spacing.xl},
  cardTitle: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary},
  amount: {...typography.display, fontSize: 36, color: colors.primary, marginTop: spacing.sm, marginBottom: spacing.md},
  row: {flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.xs},
  rowBorder: {borderBottomWidth: 1, borderBottomColor: colors.border},
  rowLabel: {...typography.label, color: colors.textSecondary},
  rowValue: {...typography.labelSemibold, fontWeight: '500', color: colors.textPrimary},
  footer: {padding: spacing.lg, gap: spacing.md, alignItems: 'center', backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border},
  statementLink: {...typography.body, color: colors.textSecondary},
});
