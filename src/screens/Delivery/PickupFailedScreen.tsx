import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {DeliveryOrder, useOrders} from '../../context/OrdersContext';

type Props = NativeStackScreenProps<RootStackParamList, 'PickupFailed'>;

export function PickupFailedScreen({route, navigation}: Props) {
  const {orderId} = route.params;
  const {getOrder} = useOrders();
  const [order, setOrder] = useState<DeliveryOrder | null>(null);
  const [failedAt] = useState(() => new Date());

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

  const storeName = order?.pickup.name ?? 'the store';

  return (
    <Screen backgroundColor="#D92D20" statusBarStyle="light-content" edges={['top', 'bottom']}>
      <View style={styles.header}>
        <View style={styles.iconRing}>
          <Icon name="x" size={28} color={colors.white} />
        </View>
        <Text style={styles.headerTitle}>Pickup Failed</Text>
        <Text style={styles.headerSubtitle}>Unable to collect order from {storeName}.</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>FAILURE DETAILS</Text>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Time of failure</Text>
            <Text style={styles.rowValue}>{failedAt.toLocaleTimeString([], {hour: 'numeric', minute: '2-digit'})}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Order</Text>
            <Text style={styles.rowValue}>#{order?.orderNumber ?? orderId}</Text>
          </View>
        </View>

        <View style={styles.warningBanner}>
          <Icon name="alert-triangle" size={18} color={colors.warning} />
          <View style={styles.warningText}>
            <Text style={styles.warningTitle}>This pickup failure will be reviewed</Text>
            <Text style={styles.warningSubtitle}>Will not affect your acceptance rate if store is at fault</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.optionRow}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('PickupRetry', {orderId})}>
          <View style={styles.optionIconGreen}>
            <Icon name="refresh" size={20} color={colors.primary} />
          </View>
          <View style={styles.optionText}>
            <Text style={styles.optionTitle}>Try Again</Text>
            <Text style={styles.optionSubtitle}>Retry pickup from store</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionRow}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('PickupSupport', {orderId})}>
          <View style={styles.optionIconBlue}>
            <Icon name="message-circle" size={20} color={colors.info} />
          </View>
          <View style={styles.optionText}>
            <Text style={styles.optionTitle}>Report to Support</Text>
            <Text style={styles.optionSubtitle}>Escalate this issue</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.optionRow, styles.optionRowDanger]}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('SelectIssueReason', {orderId})}>
          <View style={styles.optionIconRed}>
            <Icon name="x" size={20} color={colors.danger} />
          </View>
          <View style={styles.optionText}>
            <Text style={styles.optionTitleDanger}>Cannot Fulfill Order</Text>
            <Text style={styles.optionSubtitle}>Report an issue to release this order</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: {flex: 1},
  header: {backgroundColor: '#D92D20', alignItems: 'center', paddingHorizontal: spacing.xxl, paddingTop: spacing.xl, paddingBottom: spacing.xxl},
  iconRing: {width: 60, height: 60, borderRadius: 30, borderWidth: 2.5, borderColor: 'rgba(255,255,255,0.7)', alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md},
  headerTitle: {...typography.h4, fontSize: 22, color: colors.white},
  headerSubtitle: {...typography.body, color: 'rgba(255,255,255,0.85)', textAlign: 'center', marginTop: spacing.xxs},
  body: {backgroundColor: colors.background, padding: spacing.lg, gap: spacing.md},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg},
  cardLabel: {...typography.overline, color: colors.textSecondary, letterSpacing: 0.4, marginBottom: spacing.sm},
  row: {flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.xs},
  rowLabel: {...typography.label, color: colors.textSecondary},
  rowValue: {...typography.labelSemibold, color: colors.textPrimary},
  rowValueDanger: {...typography.labelSemibold, color: colors.danger},
  warningBanner: {flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, backgroundColor: '#FFFBEB', borderWidth: 1, borderColor: '#FDE68A', borderRadius: radius.lg, padding: spacing.md},
  warningText: {flex: 1},
  warningTitle: {...typography.bodySemibold, fontSize: 14, color: colors.warningText},
  warningSubtitle: {...typography.label, color: '#B45309', marginTop: 2},
  optionRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg},
  optionRowDanger: {borderWidth: 1.5, borderColor: colors.dangerBorder},
  optionIconGreen: {width: 40, height: 40, borderRadius: 20, backgroundColor: colors.successSurface, alignItems: 'center', justifyContent: 'center'},
  optionIconBlue: {width: 40, height: 40, borderRadius: 20, backgroundColor: colors.infoSurface, alignItems: 'center', justifyContent: 'center'},
  optionIconRed: {width: 40, height: 40, borderRadius: 20, backgroundColor: colors.dangerSurface, alignItems: 'center', justifyContent: 'center'},
  optionText: {flex: 1},
  optionTitle: {...typography.bodyLgMedium, color: colors.textPrimary},
  optionTitleDanger: {...typography.bodyLgMedium, color: colors.danger},
  optionSubtitle: {...typography.label, color: colors.textSecondary, marginTop: 1},
  footnote: {...typography.label, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.xs},
});
