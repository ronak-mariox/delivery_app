import React, {useEffect, useState} from 'react';
import {Alert, Image, Linking, Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Svg, {Circle, Line} from 'react-native-svg';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import StorePinIcon from '../../assets/brand/store-pin.svg';
import {DeliveryOrder, useOrders} from '../../context/OrdersContext';

type Props = NativeStackScreenProps<RootStackParamList, 'NavigateToStore'>;

type MapApp = 'google' | 'waze' | 'apple';

const APPS: {id: MapApp; label: string; source: number}[] = [
  {id: 'google', label: 'Google Maps', source: require('../../assets/images/google-maps-icon.png')},
  {id: 'waze', label: 'Waze', source: require('../../assets/images/waze-icon.png')},
  {id: 'apple', label: Platform.OS === 'ios' ? 'Apple Maps' : 'Default Maps', source: require('../../assets/images/ola-maps-icon.png')},
];

function mapsUrlFor(app: MapApp, lat?: number, lng?: number, address?: string): string | null {
  const hasCoords = lat != null && lng != null;
  const query = hasCoords ? `${lat},${lng}` : address ? encodeURIComponent(address) : null;
  if (!query) {
    return null;
  }
  switch (app) {
    case 'waze':
      return hasCoords ? `https://waze.com/ul?ll=${query}&navigate=yes` : `https://waze.com/ul?q=${query}&navigate=yes`;
    case 'apple':
      if (Platform.OS === 'ios') {
        return hasCoords ? `http://maps.apple.com/?daddr=${query}` : `http://maps.apple.com/?q=${query}`;
      }
      return hasCoords ? `geo:${query}?q=${query}` : `geo:0,0?q=${query}`;
    default:
      return `https://www.google.com/maps/dir/?api=1&destination=${query}`;
  }
}

export function NavigateToStoreScreen({route, navigation}: Props) {
  const {orderId} = route.params;
  const {getOrder} = useOrders();
  const [order, setOrder] = useState<DeliveryOrder | null>(null);
  const [selectedApp, setSelectedApp] = useState<MapApp>(APPS[0].id);

  const openInMaps = async () => {
    const url = mapsUrlFor(selectedApp, order?.pickup.latitude, order?.pickup.longitude, order?.pickup.address);
    if (!url) {
      Alert.alert('No location', 'This store has no address on file yet.');
      return;
    }
    try {
      await Linking.openURL(url);
      navigation.navigate('NavigationActive', {orderId});
    } catch {
      Alert.alert('Could not open maps', 'Install the selected maps app or pick another one.');
    }
  };

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

  const storeName = order?.pickup.name ?? 'Store';

  return (
    <Screen backgroundColor={colors.dark900} statusBarStyle="light-content" edges={['top']}>
      <View style={styles.mapArea}>
        <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
          <Line x1="20%" y1="12%" x2="20%" y2="52%" stroke={colors.primary} strokeWidth={3} strokeDasharray="8,6" />
          <Circle cx="20%" cy="52%" r={10} fill={colors.white} stroke={colors.primary} strokeWidth={3} />
        </Svg>
        <View style={styles.storePinWrap}>
          <StorePinIcon width={28} height={36} />
        </View>
      </View>

      <View style={styles.sheet}>
        <View style={styles.grabber} />
        <Text style={styles.title}>Navigate to Store</Text>
        <Text style={styles.subtitle}>{order?.pickup.address ?? storeName}</Text>

        <Text style={styles.openWithLabel}>OPEN WITH</Text>
        <View style={styles.appRow}>
          {APPS.map(app => {
            const selected = app.id === selectedApp;
            return (
              <TouchableOpacity
                key={app.id}
                style={[styles.appOption, selected && styles.appOptionSelected]}
                activeOpacity={0.8}
                onPress={() => setSelectedApp(app.id)}>
                <Image source={app.source} style={styles.appIcon} resizeMode="contain" />
                <Text style={[styles.appLabel, selected && styles.appLabelSelected]}>{app.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Button
          label="Start Navigation"
          icon="navigation"
          style={styles.startButton}
          onPress={openInMaps}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  mapArea: {flex: 1, backgroundColor: colors.dark900},
  storePinWrap: {position: 'absolute', left: '38%', top: '10%'},
  sheet: {backgroundColor: colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: spacing.xl, paddingBottom: spacing.huge, gap: spacing.md},
  grabber: {width: 40, height: 4, borderRadius: 2, backgroundColor: colors.border, alignSelf: 'center'},
  title: {...typography.titleSm, color: colors.textPrimary},
  subtitle: {...typography.label, color: colors.textSecondary, marginTop: -spacing.sm},
  openWithLabel: {...typography.labelSemibold, color: colors.textSecondary, fontSize: 12},
  appRow: {flexDirection: 'row', gap: spacing.sm},
  appOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    height: 36,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
  },
  appOptionSelected: {borderColor: colors.primary, backgroundColor: colors.primarySurfaceAlt},
  appIcon: {width: 17, height: 16},
  appLabel: {...typography.captionSemibold, color: colors.textSecondary},
  appLabelSelected: {color: colors.primary},
  startButton: {marginTop: spacing.sm},
});
