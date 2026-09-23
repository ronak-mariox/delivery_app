import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Svg, {Circle, Line} from 'react-native-svg';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {DeliveryOrder, useOrders} from '../../context/OrdersContext';

type Props = NativeStackScreenProps<RootStackParamList, 'CustomerStartNavigation'>;

const APPS = ['Google Maps', 'Waze', 'Ola Maps'];

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function CustomerStartNavigationScreen({route, navigation}: Props) {
  const {orderId} = route.params;
  const {getOrder} = useOrders();
  const [order, setOrder] = useState<DeliveryOrder | null>(null);
  const [selectedApp, setSelectedApp] = useState(APPS[0]);

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
  const addressLine = order ? [order.address.line1, order.address.city].filter(Boolean).join(', ') : '';

  const distanceKm =
    order?.pickup.latitude != null &&
    order?.pickup.longitude != null &&
    order?.address.latitude != null &&
    order?.address.longitude != null
      ? haversineKm(order.pickup.latitude, order.pickup.longitude, order.address.latitude, order.address.longitude)
      : null;

  return (
    <Screen backgroundColor={colors.dark900} statusBarStyle="light-content" edges={['top']}>
      <View style={styles.mapArea}>
        <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
          <Line x1="42%" y1="8%" x2="42%" y2="68%" stroke={colors.primary} strokeWidth={3} strokeDasharray="8,6" />
          <Circle cx="42%" cy="68%" r={10} fill={colors.white} stroke={colors.primary} strokeWidth={3} />
        </Svg>
        <View style={styles.homePin}>
          <Icon name="alert-circle" size={18} color={colors.white} />
        </View>
        {distanceKm != null && (
          <View style={styles.distancePill}>
            <Text style={styles.distancePillText}>{distanceKm.toFixed(1)} km</Text>
          </View>
        )}
      </View>

      <View style={styles.sheet}>
        <View style={styles.grabber} />
        <Text style={styles.title}>Navigate to Customer</Text>
        {!!addressLine && <Text style={styles.subtitle}>{customerName} · {addressLine}</Text>}

        <Text style={styles.sectionLabel}>OPEN IN</Text>
        <View style={styles.appRow}>
          {APPS.map(app => (
            <TouchableOpacity key={app} style={styles.appOption} activeOpacity={0.8} onPress={() => setSelectedApp(app)}>
              <Text style={[styles.appLabel, app === selectedApp && styles.appLabelSelected]}>{app}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Button
          label="Start Navigation"
          style={styles.startButton}
          onPress={() => navigation.navigate('CustomerNavigationActive', {orderId})}
        />
        <TouchableOpacity
          style={styles.markArrivedLink}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('NearCustomer', {orderId})}>
          <Text style={styles.markArrivedText}>Already know the way? Mark arrived</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  mapArea: {flex: 1, backgroundColor: colors.dark900},
  homePin: {
    position: 'absolute',
    left: '58%',
    top: '10%',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.danger,
    borderWidth: 2,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  distancePill: {position: 'absolute', left: spacing.lg, top: spacing.lg, backgroundColor: 'rgba(31,41,55,0.85)', borderRadius: radius.sm, paddingHorizontal: spacing.md, paddingVertical: 6},
  distancePillText: {...typography.bodySemibold, fontSize: 13, color: colors.white},
  sheet: {backgroundColor: colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: spacing.xl, paddingBottom: spacing.huge, gap: spacing.sm},
  grabber: {width: 40, height: 4, borderRadius: 2, backgroundColor: colors.border, alignSelf: 'center', marginBottom: spacing.xs},
  title: {...typography.titleSm, color: colors.textPrimary},
  subtitle: {...typography.label, color: colors.textSecondary, marginTop: -spacing.xxs, marginBottom: spacing.xs},
  sectionLabel: {...typography.overline, color: colors.textSecondary, letterSpacing: 0.5, marginTop: spacing.sm},
  appRow: {flexDirection: 'row', gap: spacing.sm},
  appOption: {flex: 1, height: 43, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center'},
  appLabel: {...typography.captionMedium, color: colors.textPrimary},
  appLabelSelected: {color: colors.primary, fontWeight: '700'},
  startButton: {marginTop: spacing.md},
  markArrivedLink: {alignItems: 'center', paddingVertical: spacing.sm},
  markArrivedText: {...typography.label, color: colors.textSecondary},
});
