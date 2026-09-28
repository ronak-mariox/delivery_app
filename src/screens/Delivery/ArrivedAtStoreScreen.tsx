import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {DeliveryOrder, useOrders} from '../../context/OrdersContext';

type Props = NativeStackScreenProps<RootStackParamList, 'ArrivedAtStore'>;

export function ArrivedAtStoreScreen({route, navigation}: Props) {
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

  const itemCount = order?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
  const storeName = order?.pickup.name ?? 'Store';

  return (
    <Screen backgroundColor={colors.primary} statusBarStyle="light-content" edges={['top', 'bottom']}>
      <View style={styles.header}>
        <View style={styles.checkOuter}>
          <View style={styles.checkRing} />
          <Icon name="check" size={32} color={colors.white} />
        </View>
        <Text style={styles.headerTitle}>{"You've Arrived!"}</Text>
        <Text style={styles.headerSubtitle}>{storeName}</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>STORE INFO</Text>
          <Text style={styles.storeName}>{storeName}</Text>
          {!!order?.pickup.address && (
            <View style={styles.addressRow}>
              <Icon name="map-pin" size={14} color={colors.textSecondary} />
              <Text style={styles.addressText}>{order.pickup.address}</Text>
            </View>
          )}
          <View style={styles.mapPreview}>
            <View style={styles.mapDot} />
          </View>
        </View>

        <View style={styles.orderCard}>
          <View style={styles.orderCardLeft}>
            <Icon name="package" size={16} color={colors.textSecondary} />
            <Text style={styles.orderCardText}>Order #{order?.orderNumber ?? orderId}</Text>
          </View>
          <Text style={styles.orderCardText}>
            {itemCount} item{itemCount === 1 ? '' : 's'} · ₹{order?.pricing.grandTotal ?? '—'}
          </Text>
        </View>

        <View style={styles.actionsCard}>
          <Text style={styles.actionTitle}>The store has my order ready</Text>
          <Button
            label="Collect Order"
            style={styles.collectButton}
            onPress={() => navigation.navigate('OrderReady', {orderId})}
          />
          <View style={styles.divider} />
          <Text style={styles.actionTitle}>Order is not ready yet</Text>
          <Button
            label="Notify Store / Wait"
            variant="secondary"
            style={styles.waitButton}
            onPress={() => navigation.navigate('OrderNotReady', {orderId})}
          />
        </View>

        <TouchableOpacity
          style={styles.reportLink}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('SelectIssueReason', {orderId})}
        >
          <Text style={styles.reportLinkText}>Report an issue</Text>
        </TouchableOpacity>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: {flex: 1},
  header: {backgroundColor: colors.primary, alignItems: 'center', paddingHorizontal: spacing.xl, paddingTop: spacing.xl, paddingBottom: spacing.xxl},
  checkOuter: {width: 64, height: 64, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md},
  checkRing: {position: 'absolute', width: 64, height: 64, borderRadius: 32, borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)'},
  headerTitle: {...typography.h3, fontSize: 24, color: colors.white},
  headerSubtitle: {...typography.body, color: 'rgba(255,255,255,0.8)', marginTop: spacing.xxs},
  body: {backgroundColor: colors.background, padding: spacing.lg, gap: spacing.md},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.xxl, padding: spacing.lg},
  cardLabel: {...typography.overline, color: colors.textSecondary, letterSpacing: 0.8, marginBottom: spacing.sm},
  storeName: {...typography.title, fontSize: 15, color: colors.textPrimary},
  addressRow: {flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: spacing.xs},
  addressText: {...typography.label, color: colors.textSecondary},
  mapPreview: {height: 90, backgroundColor: colors.border, borderRadius: radius.md, marginTop: spacing.md, alignItems: 'center', justifyContent: 'center'},
  mapDot: {width: 14, height: 14, borderRadius: 7, backgroundColor: colors.primary, borderWidth: 3, borderColor: colors.white},
  orderCard: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.xxl, padding: spacing.lg},
  orderCardLeft: {flexDirection: 'row', alignItems: 'center', gap: spacing.xs},
  orderCardText: {...typography.label, color: colors.textSecondary},
  actionsCard: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.xxl, padding: spacing.lg, gap: spacing.sm},
  actionTitle: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary},
  collectButton: {height: 48},
  divider: {height: 1, backgroundColor: colors.border, marginVertical: spacing.xs},
  waitButton: {height: 48},
  reportLink: {alignSelf: 'center', paddingVertical: spacing.sm},
  reportLinkText: {...typography.label, color: colors.textSecondary, textDecorationLine: 'underline'},
});
