import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {DeliveryOrder, useOrders} from '../../context/OrdersContext';

type Props = NativeStackScreenProps<RootStackParamList, 'OrderNotReady'>;

export function OrderNotReadyScreen({route, navigation}: Props) {
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

  const storeName = order?.pickup.name ?? 'The store';

  return (
    <Screen edges={['top', 'bottom']} contentContainerStyle={styles.container}>
      <View style={styles.iconWrap}>
        <Icon name="alert-triangle" size={32} color={colors.warning} />
      </View>
      <Text style={styles.title}>Order Not Ready</Text>
      <Text style={styles.subtitle}>{storeName} needs more time to prepare your order.</Text>

      <View style={styles.tilesRow}>
        <TouchableOpacity
          style={styles.tile}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('WaitingForOrder', {orderId})}>
          <Icon name="user" size={24} color={colors.textPrimary} />
          <Text style={styles.tileTitle}>Wait Here</Text>
          <Text style={styles.tileSubtitle}>Stay and collect when ready</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tile}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('WaitingForOrder', {orderId})}>
          <Icon name="bell" size={24} color={colors.textPrimary} />
          <Text style={styles.tileTitle}>Notify Store</Text>
          <Text style={styles.tileSubtitle}>Send reminder to speed up</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tipBanner}>
        <Icon name="info" size={16} color={colors.info} />
        <Text style={styles.tipText}>
          <Text style={styles.tipStrong}>Tip:</Text> Use this time to check your navigation route to the customer.
        </Text>
      </View>

      <TouchableOpacity
        style={styles.reportRow}
        activeOpacity={0.7}
        onPress={() => navigation.navigate('ReportStoreIssue', {orderId})}>
        <Text style={styles.reportPrefix}>Order taking too long? </Text>
        <Text style={styles.reportLink}>Report Issue</Text>
      </TouchableOpacity>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, alignItems: 'center', paddingHorizontal: spacing.xl, paddingTop: spacing.xxxl, gap: spacing.md},
  iconWrap: {width: 72, height: 72, borderRadius: 36, backgroundColor: colors.warningSurface, borderWidth: 2, borderColor: colors.warningBorder, alignItems: 'center', justifyContent: 'center'},
  title: {...typography.h4, fontSize: 22, color: colors.textPrimary},
  subtitle: {...typography.body, color: colors.textSecondary, textAlign: 'center', marginTop: -spacing.xs},
  tilesRow: {flexDirection: 'row', gap: spacing.sm, width: '100%'},
  tile: {flex: 1, alignItems: 'center', gap: spacing.xs, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.xl, padding: spacing.md},
  tileTitle: {...typography.bodySemibold, fontSize: 13, color: colors.textPrimary},
  tileSubtitle: {...typography.caption, fontSize: 11, color: colors.textSecondary, textAlign: 'center'},
  tipBanner: {flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, width: '100%', backgroundColor: colors.infoSurface, borderWidth: 1, borderColor: '#BFDBFE', borderRadius: radius.xl, padding: spacing.md},
  tipText: {...typography.label, color: '#1D4ED8', flex: 1},
  tipStrong: {fontWeight: '700'},
  reportRow: {flexDirection: 'row', paddingTop: spacing.sm},
  reportPrefix: {...typography.label, color: colors.textSecondary},
  reportLink: {...typography.labelSemibold, color: colors.danger},
});
