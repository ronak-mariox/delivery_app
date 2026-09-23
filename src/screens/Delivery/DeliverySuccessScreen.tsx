import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Card, Icon, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {DeliveryOrder, useOrders} from '../../context/OrdersContext';

type Props = NativeStackScreenProps<RootStackParamList, 'DeliverySuccess'>;

const CONFETTI = [
  {color: '#FCD34D', left: '10%', top: 24},
  {color: '#F87171', left: '30%', top: 16},
  {color: '#60A5FA', left: '55%', top: 30},
  {color: '#A78BFA', left: '75%', top: 20},
  {color: '#1CA672', left: '18%', top: 50},
  {color: '#FB923C', left: '45%', top: 40},
  {color: '#F472B6', left: '85%', top: 60},
  {color: '#FCD34D', left: '68%', top: 70},
] as const;

function formatTime(iso?: string): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleTimeString([], {hour: 'numeric', minute: '2-digit'});
}

function formatDuration(startIso?: string, endIso?: string): string | null {
  if (!startIso || !endIso) return null;
  const start = new Date(startIso).getTime();
  const end = new Date(endIso).getTime();
  if (Number.isNaN(start) || Number.isNaN(end) || end < start) return null;
  const minutes = Math.max(1, Math.round((end - start) / 60000));
  return `${minutes} minute${minutes === 1 ? '' : 's'}`;
}

export function DeliverySuccessScreen({route, navigation}: Props) {
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

  const goHome = () => navigation.reset({index: 0, routes: [{name: 'Home'}]});

  const customerName = order?.address.contactName ?? 'Customer';
  const addressLine = order ? [order.address.line1, order.address.city].filter(Boolean).join(', ') : null;
  const deliveryTime = formatTime(order?.deliveredAt);
  const timeTaken = formatDuration(order?.pickupConfirmedAt, order?.deliveredAt);
  const earnings = order?.driverEarnings;

  return (
    <Screen backgroundColor={colors.surface} statusBarStyle="light-content" edges={['top', 'bottom']} scroll>
      <View style={styles.header}>
        {CONFETTI.map((c, i) => (
          <View key={i} style={[styles.confetti, {backgroundColor: c.color, left: c.left, top: c.top}]} />
        ))}
        <View style={styles.checkCircle}>
          <Icon name="check" size={40} color={colors.white} />
        </View>
        <Text style={styles.title}>Delivered!</Text>
        <Text style={styles.subtitle}>Order #{order?.orderNumber ?? orderId}</Text>
      </View>

      <View style={styles.body}>
        <Card style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Delivery Summary</Text>
          <SummaryRow label="Delivered to" value={customerName} />
          {!!addressLine && <SummaryRow label="Address" value={addressLine} />}
          {!!deliveryTime && <SummaryRow label="Delivery time" value={deliveryTime} />}
          <SummaryRow label="Time taken" value={timeTaken ?? '—'} last />
        </Card>

        {!!earnings && (
          <Card style={styles.earningsCard}>
            <Text style={styles.earningsTitle}>Earnings</Text>
            <Text style={styles.earningsValue}>₹{earnings.total} earned</Text>
            <SummaryRow label="Base pay" value={`₹${earnings.base}`} light />
            <SummaryRow label="Distance bonus" value={`₹${earnings.distance}`} light />
            {earnings.onTimeBonus > 0 && <SummaryRow label="On-time bonus" value={`₹${earnings.onTimeBonus}`} light />}
            {earnings.incentiveBonus > 0 && <SummaryRow label="Incentive bonus" value={`₹${earnings.incentiveBonus}`} light />}
          </Card>
        )}

        {!!earnings && earnings.onTimeBonus > 0 && (
          <View style={styles.onTimeBanner}>
            <Icon name="star" size={20} color={colors.warning} filled />
            <Text style={styles.onTimeText}>{'On-time Delivery ✓'}</Text>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <Button label="Back to Home" onPress={goHome} />
        <TouchableOpacity onPress={() => navigation.navigate('EarningsUpdated', {orderId})}>
          <Text style={styles.detailsLink}>View Delivery Details</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

function SummaryRow({label, value, light, last}: {label: string; value: string; light?: boolean; last?: boolean}) {
  return (
    <View style={[styles.summaryRow, !last && styles.summaryRowBorder]}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={[styles.summaryValue, light && styles.summaryValueLight]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {backgroundColor: colors.primary, height: 200, alignItems: 'center', justifyContent: 'center', overflow: 'hidden'},
  confetti: {position: 'absolute', width: 8, height: 8, borderRadius: 4},
  checkCircle: {width: 72, height: 72, borderRadius: 36, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm},
  title: {...typography.h3, fontSize: 32, color: colors.white},
  subtitle: {...typography.body, color: 'rgba(255,255,255,0.7)'},
  body: {padding: spacing.lg, gap: spacing.md},
  summaryCard: {backgroundColor: colors.background, borderWidth: 0, gap: 0},
  summaryTitle: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary, marginBottom: spacing.sm},
  earningsCard: {backgroundColor: colors.primarySurfaceAlt, borderColor: colors.primaryBorder, gap: 0},
  earningsTitle: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary},
  earningsValue: {...typography.h3, fontSize: 32, color: colors.primary, marginTop: spacing.sm, marginBottom: spacing.sm},
  earningsDivider: {height: 1, backgroundColor: colors.primaryBorder, marginVertical: spacing.sm},
  earningsTotalLabel: {...typography.labelSemibold, color: colors.primary},
  earningsTotalValue: {...typography.bodyBold, color: colors.primary},
  summaryRow: {flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 7},
  summaryRowBorder: {borderBottomWidth: 1, borderBottomColor: colors.border},
  summaryLabel: {...typography.label, color: colors.textSecondary},
  summaryValue: {...typography.labelSemibold, color: colors.textPrimary},
  summaryValueLight: {...typography.labelSemibold, fontWeight: '500', color: colors.textPrimary},
  onTimeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.warningSurface,
    borderWidth: 1.5,
    borderColor: colors.warningBorder,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  onTimeText: {...typography.bodySemibold, color: colors.warningText},
  footer: {padding: spacing.lg, gap: spacing.md, alignItems: 'center', borderTopWidth: 1, borderTopColor: colors.border},
  detailsLink: {...typography.body, color: colors.textSecondary},
});
