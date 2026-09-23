import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Svg, {Circle, Polyline} from 'react-native-svg';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {DeliveryOrder, useOrders} from '../../context/OrdersContext';

type Props = NativeStackScreenProps<RootStackParamList, 'CustomerNavigationActive'>;

export function CustomerNavigationActiveScreen({route, navigation}: Props) {
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

  useEffect(() => {
    const timer = setTimeout(() => navigation.replace('NearCustomer', {orderId}), 4000);
    return () => clearTimeout(timer);
  }, [navigation, orderId]);

  const customerName = order?.address.contactName ?? 'Customer';

  return (
    <View style={styles.container}>
      <View style={styles.mapArea}>
        <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
          <Polyline points="60%,20% 45%,50% 48%,80%" fill="none" stroke={colors.primary} strokeWidth={4} strokeLinecap="round" />
          <Circle cx="48%" cy="80%" r={10} fill={colors.info} stroke={colors.white} strokeWidth={3} />
        </Svg>
        <View style={styles.homePin}>
          <Icon name="alert-circle" size={18} color={colors.white} />
        </View>
      </View>

      <View style={styles.instructionCard}>
        <View style={styles.instructionRow}>
          <View style={styles.instructionIcon}>
            <Icon name="navigation" size={20} color={colors.white} strokeWidth={2.5} />
          </View>
          <Text style={styles.instructionTitle}>Navigating to customer</Text>
        </View>
      </View>

      <View style={styles.bottomBar}>
        <View style={styles.orderChip}>
          <Text style={styles.orderChipText}>#{order?.orderNumber ?? orderId} · {customerName}</Text>
        </View>
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionButton} activeOpacity={0.8}>
            <Text style={styles.actionButtonText}>Mute</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} activeOpacity={0.8}>
            <Text style={styles.actionButtonText}>Overview</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.exitButton} activeOpacity={0.8} onPress={() => navigation.goBack()}>
            <Text style={styles.exitButtonText}>Exit Nav</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.dark900},
  mapArea: {flex: 1},
  homePin: {
    position: 'absolute',
    left: '58%',
    top: '10%',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.danger,
    borderWidth: 3,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  instructionCard: {
    position: 'absolute',
    top: 52,
    left: spacing.md,
    right: spacing.md,
    backgroundColor: colors.dark900,
    borderRadius: radius.xl,
    padding: spacing.lg,
  },
  instructionRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.md},
  instructionIcon: {width: 36, height: 36, borderRadius: radius.sm, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center'},
  instructionTitle: {...typography.title, fontSize: 17, color: colors.white},
  bottomBar: {backgroundColor: colors.surface, borderTopLeftRadius: radius.xxl, borderTopRightRadius: radius.xxl, paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.xxl, gap: spacing.sm},
  orderChip: {alignSelf: 'flex-start', backgroundColor: colors.background, borderRadius: radius.sm, paddingHorizontal: spacing.md, paddingVertical: spacing.sm},
  orderChipText: {...typography.labelSemibold, color: colors.textPrimary},
  actionsRow: {flexDirection: 'row', gap: spacing.sm},
  actionButton: {flex: 1, height: 40, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center'},
  actionButtonText: {...typography.captionMedium, color: colors.textPrimary},
  exitButton: {flex: 1, height: 40, borderWidth: 1.5, borderColor: colors.danger, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center'},
  exitButtonText: {...typography.captionMedium, color: colors.danger},
});
