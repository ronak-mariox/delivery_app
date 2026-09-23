import React, {useEffect, useState} from 'react';
import {Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon, IconBackButton, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {DeliveryOrder, useOrders} from '../../context/OrdersContext';
import {getApiErrorMessage} from '../../services/api';

type Props = NativeStackScreenProps<RootStackParamList, 'IssueSupportContact'>;

const STATUS_LABEL: Record<string, string> = {
  placed: 'Placed',
  accepted: 'Accepted',
  preparing: 'Preparing',
  ready_for_pickup: 'Ready for pickup',
  out_for_delivery: 'Out for delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export function IssueSupportContactScreen({route, navigation}: Props) {
  const {orderId, order: passedOrder} = route.params;
  const {getOrder, reportIssue} = useOrders();
  const [order, setOrder] = useState<DeliveryOrder | null>(passedOrder ?? null);
  const [escalating, setEscalating] = useState(false);

  useEffect(() => {
    if (passedOrder) return;
    let cancelled = false;
    getOrder(orderId)
      .then((o) => {
        if (!cancelled) setOrder(o);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [orderId, getOrder, passedOrder]);

  const isTerminal = order?.status === 'cancelled' || order?.status === 'delivered';

  const handleEscalate = async () => {
    setEscalating(true);
    try {
      const result = await reportIssue(orderId, {type: 'delivery_failed', description: 'Escalated to support'});
      navigation.navigate('DeliveryFailed', {orderId, order: result.order});
    } catch (err) {
      Alert.alert('Could Not Escalate', getApiErrorMessage(err, 'Please try again.'));
    } finally {
      setEscalating(false);
    }
  };

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.header}>
        <IconBackButton onPress={() => navigation.goBack()} />
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Contact Support</Text>
          <Text style={styles.headerSubtitle}>{`Order #${order?.orderNumber ?? orderId}`}</Text>
        </View>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>ORDER STATUS</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryRowLabel}>Customer</Text>
            <Text style={styles.summaryRowValue}>{order?.address.contactName ?? 'Customer'}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryRowLabel}>Status</Text>
            <Text style={styles.summaryRowValueGreen}>{STATUS_LABEL[order?.status ?? ''] ?? '—'}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.optionRow}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('IssueResolution', {orderId, order: order ?? undefined})}>
          <View style={styles.optionIconNeutral}>
            <Icon name="info" size={22} color={colors.textPrimary} />
          </View>
          <View style={styles.optionText}>
            <Text style={styles.optionTitle}>Check Issue Status</Text>
            <Text style={styles.optionSubtitle}>View the outcome of a reported issue</Text>
          </View>
        </TouchableOpacity>

        {!isTerminal && (
          <>
            <Text style={styles.quickLabel}>Quick actions</Text>
            <TouchableOpacity
              style={styles.quickChip}
              activeOpacity={0.8}
              disabled={escalating}
              onPress={handleEscalate}>
              <Text style={styles.quickChipText}>{escalating ? 'Escalating…' : 'Escalate — Cancel Delivery'}</Text>
            </TouchableOpacity>
          </>
        )}
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
  headerText: {flex: 1},
  headerTitle: {...typography.title, fontSize: 17, color: colors.textPrimary},
  headerSubtitle: {...typography.caption, color: colors.textSecondary},
  flex: {flex: 1},
  body: {padding: spacing.lg, gap: spacing.md},
  summaryCard: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md},
  summaryLabel: {...typography.captionSemibold, fontSize: 12, color: colors.textSecondary, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: spacing.sm},
  summaryRow: {flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3},
  summaryRowLabel: {...typography.label, fontSize: 13, color: colors.textSecondary},
  summaryRowValue: {...typography.bodyMedium, fontSize: 13, color: colors.textPrimary},
  summaryRowValueGreen: {...typography.bodyMedium, fontSize: 13, color: colors.primary},
  optionRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg},
  optionIconNeutral: {width: 44, height: 44, borderRadius: radius.md, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center'},
  optionText: {flex: 1},
  optionTitle: {...typography.bodyMedium, fontSize: 15, color: colors.textPrimary},
  optionSubtitle: {...typography.label, fontSize: 13, color: colors.textSecondary, marginTop: 1},
  quickLabel: {...typography.label, color: colors.textSecondary},
  quickChip: {alignSelf: 'flex-start', backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.dangerBorder, borderRadius: radius.pill, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm},
  quickChipText: {...typography.label, fontSize: 13, color: colors.danger},
});
