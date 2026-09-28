import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Svg, {Circle, Polyline} from 'react-native-svg';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {DeliveryOrder, useOrders} from '../../context/OrdersContext';

type Props = NativeStackScreenProps<RootStackParamList, 'NavigationActive'>;

export function NavigationActiveScreen({route, navigation}: Props) {
  const {orderId} = route.params;
  const {getOrder} = useOrders();
  const [order, setOrder] = useState<DeliveryOrder | null>(null);

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

  const storeName = order?.pickup.name ?? 'the store';

  return (
    <View style={styles.container}>
      <View style={styles.mapArea}>
        <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
          <Polyline points="50%,20% 30%,45% 50%,80%" fill="none" stroke={colors.primary} strokeWidth={4} strokeDasharray="10,7" strokeLinecap="round" />
          <Circle cx="50%" cy="20%" r={9} fill={colors.white} stroke={colors.primary} strokeWidth={3} />
        </Svg>
      </View>

      <View style={styles.instructionCard}>
        <View style={styles.instructionIcon}>
          <Icon name="navigation" size={28} color={colors.white} />
        </View>
        <View style={styles.instructionText}>
          <Text style={styles.instructionTitle}>Navigating to store</Text>
          <Text style={styles.instructionSubtitle}>{storeName}</Text>
        </View>
      </View>

      <View style={styles.sheet}>
        <View style={styles.grabber} />
        <View style={styles.orderRow}>
          <View style={styles.orderInfo}>
            <Text style={styles.orderId}>#{order?.orderNumber ?? orderId}</Text>
            <Text style={styles.storeName}>{storeName}</Text>
          </View>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionButton} activeOpacity={0.8} onPress={() => navigation.replace('ArrivingAtStore', {orderId})}>
            <Icon name="map-pin" size={20} color={colors.primary} />
            <Text style={styles.actionLabel}>I've arrived</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} activeOpacity={0.8} onPress={() => navigation.goBack()}>
            <Icon name="x" size={20} color={colors.textSecondary} />
            <Text style={styles.actionLabel}>Exit</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.callButton, !order?.pickup.phone && styles.callButtonDisabled]}
          activeOpacity={0.85}
          disabled={!order?.pickup.phone}
          onPress={() => navigation.navigate('ContactStore', {orderId})}>
          <Icon name="phone" size={16} color={colors.primary} />
          <Text style={styles.callButtonText}>Call Store</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.dark900},
  mapArea: {flex: 1},
  instructionCard: {
    position: 'absolute',
    top: 44,
    left: spacing.lg,
    right: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: 'rgba(17,24,39,0.92)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: radius.xxl,
    padding: spacing.lg,
  },
  instructionIcon: {width: 52, height: 52, borderRadius: radius.lg, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center'},
  instructionText: {flex: 1},
  instructionTitle: {...typography.h4, fontSize: 18, color: colors.white},
  instructionSubtitle: {...typography.label, color: 'rgba(255,255,255,0.65)', marginTop: 2},
  sheet: {backgroundColor: colors.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: spacing.lg, paddingBottom: spacing.huge, gap: spacing.md},
  grabber: {width: 36, height: 4, borderRadius: 2, backgroundColor: colors.border, alignSelf: 'center'},
  orderRow: {flexDirection: 'row', justifyContent: 'space-between'},
  orderInfo: {flex: 1},
  orderId: {...typography.caption, color: colors.textSecondary},
  storeName: {...typography.title, fontSize: 15, color: colors.textPrimary, marginTop: 1},
  actionsRow: {flexDirection: 'row', gap: spacing.sm},
  actionButton: {
    flex: 1,
    height: 52,
    backgroundColor: colors.background,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  actionLabel: {...typography.micro, fontSize: 10, color: colors.textSecondary},
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    height: 40,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.lg,
  },
  callButtonDisabled: {opacity: 0.5},
  callButtonText: {...typography.bodySemibold, fontSize: 14, color: colors.primary},
});
